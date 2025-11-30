from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils import timezone
from django.db.models import Q

from .models import Job, JobApplication
from .serializers import (
    JobSerializer, JobListSerializer, JobCreateSerializer,
    JobApplicationSerializer, JobApplicationListSerializer,
    JobApplicationCreateSerializer, JobApplicationUpdateSerializer
)
from notifications.email_service import EmailService


class JobViewSet(viewsets.ModelViewSet):
    """ViewSet for Job model"""
    queryset = Job.objects.select_related('employer').prefetch_related('applications').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'employmentType', 'region', 'city', 'isRemote']
    search_fields = ['title', 'description', 'requirements']
    ordering_fields = ['createdAt', 'applicationDeadline', 'salaryMin']
    ordering = ['-createdAt']

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create' or self.action == 'update' or self.action == 'partial_update':
            return JobCreateSerializer
        if self.action == 'list':
            return JobListSerializer
        return JobSerializer

    def get_queryset(self):
        """Filter jobs based on user type"""
        user = self.request.user
        queryset = super().get_queryset()

        if user.is_employer:
            # Employers can only see their own jobs
            return queryset.filter(employer=user)
        elif user.is_provider:
            # Providers can only see active jobs
            return queryset.filter(status='active')
        elif user.is_admin or user.is_staff:
            # Admins can see all jobs
            return queryset
        return queryset.none()

    def create(self, request, *args, **kwargs):
        """Create job posting (employers only)"""
        if not request.user.is_employer:
            return Response(
                {'error': 'Only employers can create job postings'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        job = serializer.save()

        return Response(
            JobSerializer(job).data,
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        """Update job posting (employer who created it)"""
        job = self.get_object()

        if request.user != job.employer and not (request.user.is_admin or request.user.is_staff):
            return Response(
                {'error': 'You can only update your own job postings'},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete job posting (employer who created it or admin)"""
        job = self.get_object()

        if request.user != job.employer and not (request.user.is_admin or request.user.is_staff):
            return Response(
                {'error': 'You can only delete your own job postings'},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Close job posting (employer who created it)"""
        job = self.get_object()

        if request.user != job.employer and not (request.user.is_admin or request.user.is_staff):
            return Response(
                {'error': 'You can only close your own job postings'},
                status=status.HTTP_403_FORBIDDEN
            )

        job.status = 'closed'
        job.save()

        return Response(
            JobSerializer(job).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def mark_filled(self, request, pk=None):
        """Mark job as filled (employer who created it)"""
        job = self.get_object()

        if request.user != job.employer and not (request.user.is_admin or request.user.is_staff):
            return Response(
                {'error': 'You can only mark your own job postings as filled'},
                status=status.HTTP_403_FORBIDDEN
            )

        job.status = 'filled'
        job.save()

        return Response(
            JobSerializer(job).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'])
    def applications(self, request, pk=None):
        """Get all applications for a job (employer who created it or admin)"""
        job = self.get_object()

        if request.user != job.employer and not (request.user.is_admin or request.user.is_staff):
            return Response(
                {'error': 'You can only view applications for your own job postings'},
                status=status.HTTP_403_FORBIDDEN
            )

        applications = job.applications.all()
        serializer = JobApplicationSerializer(applications, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class JobApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for JobApplication model"""
    queryset = JobApplication.objects.select_related('job', 'provider').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'job']
    ordering = ['-appliedAt']

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return JobApplicationCreateSerializer
        if self.action in ['update', 'partial_update', 'update_status']:
            return JobApplicationUpdateSerializer
        if self.action == 'list':
            return JobApplicationListSerializer
        return JobApplicationSerializer

    def get_queryset(self):
        """Filter applications based on user type"""
        user = self.request.user
        queryset = super().get_queryset()

        if user.is_provider:
            # Providers can only see their own applications
            return queryset.filter(provider=user)
        elif user.is_employer:
            # Employers can only see applications for their jobs
            return queryset.filter(job__employer=user)
        elif user.is_admin or user.is_staff:
            # Admins can see all applications
            return queryset
        return queryset.none()

    def create(self, request, *args, **kwargs):
        """Create job application (providers only)"""
        if not request.user.is_provider:
            return Response(
                {'error': 'Only providers can apply for jobs'},
                status=status.HTTP_403_FORBIDDEN
            )

        job_id = request.data.get('job_id')
        if not job_id:
            return Response(
                {'error': 'Job ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            job = Job.objects.get(id=job_id, status='active')
        except Job.DoesNotExist:
            return Response(
                {'error': 'Job not found or not active'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(data=request.data, context={'job': job, 'request': request})
        serializer.is_valid(raise_exception=True)
        application = serializer.save()

        # Send email notification to employer
        try:
            EmailService.send_job_application_email(job.employer, job, request.user)
        except Exception as e:
            print(f"Failed to send job application email: {e}")

        return Response(
            JobApplicationSerializer(application).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update application status (employer only)"""
        application = self.get_object()

        if request.user != application.job.employer and not (request.user.is_admin or request.user.is_staff):
            return Response(
                {'error': 'Only the employer can update application status'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = JobApplicationUpdateSerializer(
            application,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)

        if serializer.validated_data.get('status'):
            application.reviewedAt = timezone.now()

        serializer.save()

        # Send email notification to provider if status changed
        if 'status' in serializer.validated_data:
            try:
                EmailService.send_application_status_email(
                    application.provider,
                    application.job,
                    serializer.validated_data['status']
                )
            except Exception as e:
                print(f"Failed to send application status email: {e}")

        return Response(
            JobApplicationSerializer(application).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        """Withdraw application (provider only)"""
        application = self.get_object()

        if request.user != application.provider:
            return Response(
                {'error': 'You can only withdraw your own applications'},
                status=status.HTTP_403_FORBIDDEN
            )

        if application.status == 'interview_requested':
            return Response(
                {'error': 'Cannot withdraw application after interview has been requested'},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = 'withdrawn'
        application.save()

        return Response(
            JobApplicationSerializer(application).data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'], url_path='my-applications')
    def my_applications(self, request):
        """Get current user's applications (provider only)"""
        if not request.user.is_provider:
            return Response(
                {'error': 'Only providers can view their applications'},
                status=status.HTTP_403_FORBIDDEN
            )

        applications = JobApplication.objects.filter(
            provider=request.user
        ).select_related('job', 'job__employer').order_by('-appliedAt')

        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
