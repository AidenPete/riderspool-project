from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils import timezone

from .models import Interview, InterviewFeedback, OfficeLocation
from .serializers import (
    InterviewSerializer, InterviewCreateSerializer, InterviewListSerializer,
    InterviewUpdateSerializer, InterviewFeedbackSerializer,
    InterviewFeedbackCreateSerializer, OfficeLocationSerializer
)
from notifications.email_service import EmailService


class OfficeLocationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for OfficeLocation model (read-only)"""
    queryset = OfficeLocation.objects.filter(isActive=True)
    serializer_class = OfficeLocationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'city', 'address']
    ordering = ['city', 'name']


class InterviewViewSet(viewsets.ModelViewSet):
    """ViewSet for Interview model"""
    queryset = Interview.objects.select_related('employer', 'provider', 'officeLocation').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'date']
    ordering = ['-createdAt']

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return InterviewCreateSerializer
        if self.action == 'list':
            return InterviewListSerializer
        if self.action in ['update', 'partial_update', 'confirm', 'cancel', 'reschedule']:
            return InterviewUpdateSerializer
        return InterviewSerializer

    def get_queryset(self):
        """Filter interviews based on user type"""
        user = self.request.user
        queryset = super().get_queryset()

        if user.is_employer:
            return queryset.filter(employer=user)
        elif user.is_provider:
            return queryset.filter(provider=user)
        elif user.is_admin or user.is_staff:
            return queryset
        return queryset.none()

    def perform_create(self, serializer):
        """Create interview with employer as current user"""
        interview = serializer.save()

        # Send email notification to provider
        try:
            EmailService.send_interview_request_email(interview)
        except Exception as e:
            print(f"Failed to send interview request email: {e}")

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm interview (provider only)"""
        interview = self.get_object()

        # Check if user is the provider
        if request.user != interview.provider:
            return Response(
                {'error': 'Only the provider can confirm this interview'},
                status=status.HTTP_403_FORBIDDEN
            )

        if interview.status != 'pending':
            return Response(
                {'error': 'Only pending interviews can be confirmed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        interview.status = 'confirmed'
        interview.confirmedAt = timezone.now()
        interview.save()

        # Send email notification to employer
        try:
            EmailService.send_interview_confirmation_email(interview)
        except Exception as e:
            print(f"Failed to send interview confirmation email: {e}")

        return Response(
            InterviewSerializer(interview).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel interview"""
        interview = self.get_object()

        # Check if user is employer or provider
        if request.user not in [interview.employer, interview.provider]:
            return Response(
                {'error': 'You do not have permission to cancel this interview'},
                status=status.HTTP_403_FORBIDDEN
            )

        if interview.status in ['cancelled', 'completed']:
            return Response(
                {'error': f'Cannot cancel {interview.status} interview'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cancellation_reason = request.data.get('cancellationReason')
        if not cancellation_reason:
            return Response(
                {'error': 'Cancellation reason is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        interview.status = 'cancelled'
        interview.cancellationReason = cancellation_reason
        interview.save()

        # Send email notification to other party
        try:
            EmailService.send_interview_cancellation_email(interview, request.user)
        except Exception as e:
            print(f"Failed to send interview cancellation email: {e}")

        return Response(
            InterviewSerializer(interview).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        """Reschedule interview"""
        interview = self.get_object()

        # Check if user is employer or provider
        if request.user not in [interview.employer, interview.provider]:
            return Response(
                {'error': 'You do not have permission to reschedule this interview'},
                status=status.HTTP_403_FORBIDDEN
            )

        if interview.status in ['cancelled', 'completed']:
            return Response(
                {'error': f'Cannot reschedule {interview.status} interview'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = InterviewUpdateSerializer(interview, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Update fields
        interview.date = serializer.validated_data.get('date', interview.date)
        interview.time = serializer.validated_data.get('time', interview.time)
        interview.rescheduleReason = serializer.validated_data.get('rescheduleReason')
        interview.status = 'pending'  # Reset to pending after reschedule
        interview.confirmedAt = None
        interview.save()

        # Send email notification to other party
        try:
            EmailService.send_interview_reschedule_email(interview, request.user)
        except Exception as e:
            print(f"Failed to send interview reschedule email: {e}")

        return Response(
            InterviewSerializer(interview).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark interview as completed (employer only)"""
        interview = self.get_object()

        # Check if user is the employer
        if request.user != interview.employer:
            return Response(
                {'error': 'Only the employer can mark this interview as completed'},
                status=status.HTTP_403_FORBIDDEN
            )

        if interview.status != 'confirmed':
            return Response(
                {'error': 'Only confirmed interviews can be marked as completed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        interview.status = 'completed'
        interview.completedAt = timezone.now()
        interview.save()

        # Update provider stats
        provider_profile = interview.provider.provider_profile
        provider_profile.totalInterviews += 1
        provider_profile.save()

        return Response(
            InterviewSerializer(interview).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def mark_hired(self, request, pk=None):
        """Mark provider as hired (employer only)"""
        interview = self.get_object()

        # Check if user is the employer
        if request.user != interview.employer:
            return Response(
                {'error': 'Only the employer can mark provider as hired'},
                status=status.HTTP_403_FORBIDDEN
            )

        if interview.status != 'completed':
            return Response(
                {'error': 'Only completed interviews can mark provider as hired'},
                status=status.HTTP_400_BAD_REQUEST
            )

        interview.isHired = True
        interview.save()

        # Send hired notification email to provider
        try:
            EmailService.send_hired_notification_email(interview)
        except Exception as e:
            print(f"Failed to send hired notification email: {e}")

        return Response(
            InterviewSerializer(interview).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def feedback(self, request, pk=None):
        """Submit feedback for interview (employer only)"""
        interview = self.get_object()

        # Check if user is the employer
        if request.user != interview.employer:
            return Response(
                {'error': 'Only the employer can submit feedback'},
                status=status.HTTP_403_FORBIDDEN
            )

        if interview.status != 'completed':
            return Response(
                {'error': 'Only completed interviews can have feedback'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if feedback already exists
        if hasattr(interview, 'feedback'):
            return Response(
                {'error': 'Feedback already submitted for this interview'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = InterviewFeedbackCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        feedback = InterviewFeedback.objects.create(
            interview=interview,
            **serializer.validated_data
        )

        # Update provider rating
        provider_profile = interview.provider.provider_profile
        all_feedbacks = InterviewFeedback.objects.filter(
            interview__provider=interview.provider
        )
        avg_rating = sum([f.rating for f in all_feedbacks]) / all_feedbacks.count()
        provider_profile.rating = round(avg_rating, 2)
        provider_profile.save()

        return Response(
            InterviewFeedbackSerializer(feedback).data,
            status=status.HTTP_201_CREATED
        )


class InterviewFeedbackViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for InterviewFeedback model (read-only)"""
    queryset = InterviewFeedback.objects.select_related('interview').all()
    serializer_class = InterviewFeedbackSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['rating', 'wouldHireAgain']
    ordering = ['-createdAt']

    def get_queryset(self):
        """Filter feedback based on user"""
        user = self.request.user
        queryset = super().get_queryset()

        if user.is_employer:
            return queryset.filter(interview__employer=user)
        elif user.is_provider:
            return queryset.filter(interview__provider=user)
        elif user.is_admin or user.is_staff:
            return queryset
        return queryset.none()
