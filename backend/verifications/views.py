from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils import timezone
from django.db import models

from .models import Verification, VerificationDocument
from .serializers import (
    VerificationSerializer, VerificationCreateSerializer,
    VerificationListSerializer, VerificationApproveSerializer,
    VerificationRejectSerializer, VerificationDocumentSerializer,
    VerificationDocumentUploadSerializer
)
from notifications.email_service import EmailService


class VerificationViewSet(viewsets.ModelViewSet):
    """ViewSet for Verification model"""
    queryset = Verification.objects.select_related('user', 'provider', 'reviewedBy').prefetch_related('documents').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering = ['-submittedAt']

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return VerificationCreateSerializer
        if self.action == 'list':
            # Return full serializer for admin, simplified for providers
            if self.request.user.is_admin or self.request.user.is_staff:
                return VerificationSerializer
            return VerificationListSerializer
        return VerificationSerializer

    def get_queryset(self):
        """Filter verifications based on user type"""
        user = self.request.user
        queryset = super().get_queryset()

        if user.is_provider or user.is_employer:
            # Return verifications where provider matches
            return queryset.filter(provider=user)
        elif user.is_admin or user.is_staff:
            return queryset
        return queryset.none()

    def create(self, request, *args, **kwargs):
        """Create verification request (providers and employers)"""
        if not (request.user.is_provider or request.user.is_employer):
            return Response(
                {'error': 'Only providers and employers can submit verification requests'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if user already has a pending verification
        if Verification.objects.filter(
            provider=request.user,
            status='pending'
        ).exists():
            return Response(
                {'error': 'You already have a pending verification request'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        verification = serializer.save()

        return Response(
            VerificationSerializer(verification).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve verification (admin only)"""
        if not (request.user.is_admin or request.user.is_staff):
            return Response(
                {'error': 'Only administrators can approve verifications'},
                status=status.HTTP_403_FORBIDDEN
            )

        verification = self.get_object()

        if verification.status != 'pending':
            return Response(
                {'error': 'Only pending verifications can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = VerificationApproveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Approve verification
        verification.status = 'approved'
        verification.reviewedBy = request.user
        verification.reviewedAt = timezone.now()
        verification.adminNotes = serializer.validated_data.get('adminNotes', '')
        verification.save()

        # Mark user as verified (use 'user' field if available, otherwise 'provider')
        verified_user = verification.user if verification.user else verification.provider
        verified_user.isVerified = True
        verified_user.save()

        # Send email notification
        try:
            EmailService.send_verification_approved_email(verified_user)
        except Exception as e:
            print(f"Failed to send verification approved email: {e}")

        return Response(
            VerificationSerializer(verification).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject verification (admin only)"""
        if not (request.user.is_admin or request.user.is_staff):
            return Response(
                {'error': 'Only administrators can reject verifications'},
                status=status.HTTP_403_FORBIDDEN
            )

        verification = self.get_object()

        if verification.status != 'pending':
            return Response(
                {'error': 'Only pending verifications can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = VerificationRejectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Reject verification
        verification.status = 'rejected'
        verification.reviewedBy = request.user
        verification.reviewedAt = timezone.now()
        verification.rejectionReason = serializer.validated_data['rejectionReason']
        verification.adminNotes = serializer.validated_data.get('adminNotes', '')
        verification.save()

        # Send email notification (use 'user' field if available, otherwise 'provider')
        verified_user = verification.user if verification.user else verification.provider
        try:
            EmailService.send_verification_rejected_email(
                verified_user,
                verification.rejectionReason
            )
        except Exception as e:
            print(f"Failed to send verification rejected email: {e}")

        return Response(
            VerificationSerializer(verification).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        """Upload document for verification"""
        verification = self.get_object()

        # Check if user owns this verification
        verified_user = verification.user if verification.user else verification.provider
        if request.user != verified_user:
            return Response(
                {'error': 'Only the owner can upload documents'},
                status=status.HTTP_403_FORBIDDEN
            )

        if verification.status != 'pending':
            return Response(
                {'error': 'Documents can only be uploaded for pending verifications'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = VerificationDocumentUploadSerializer(
            data=request.data,
            context={'verification': verification}
        )
        serializer.is_valid(raise_exception=True)
        document = serializer.save()

        return Response(
            VerificationDocumentSerializer(document).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'], url_path='my-verification')
    def my_verification(self, request):
        """Get user's current verification status"""
        if not (request.user.is_provider or request.user.is_employer):
            return Response(
                {'error': 'Only providers and employers can check verification status'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            verification = Verification.objects.filter(
                provider=request.user
            ).order_by('-submittedAt').first()

            if not verification:
                return Response(
                    {'message': 'No verification request found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            return Response(
                VerificationSerializer(verification).data,
                status=status.HTTP_200_OK
            )

        except Verification.DoesNotExist:
            return Response(
                {'message': 'No verification request found'},
                status=status.HTTP_404_NOT_FOUND
            )


class VerificationDocumentViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for VerificationDocument model (read-only)"""
    queryset = VerificationDocument.objects.select_related('verification').all()
    serializer_class = VerificationDocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['documentType', 'verification']

    def get_queryset(self):
        """Filter documents based on user"""
        user = self.request.user
        queryset = super().get_queryset()

        if user.is_provider or user.is_employer:
            return queryset.filter(
                models.Q(verification__user=user) | models.Q(verification__provider=user)
            )
        elif user.is_admin or user.is_staff:
            return queryset
        return queryset.none()
