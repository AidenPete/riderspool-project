from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.template import Template, Context

from .models import Notification, NotificationTemplate
from .serializers import (
    NotificationSerializer,
    NotificationListSerializer,
    NotificationCreateSerializer,
    NotificationTemplateSerializer,
    SendNotificationSerializer,
)
from users.models import User


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing notifications.

    list: Get all notifications for the current user
    retrieve: Get a specific notification
    create: Create a new notification (admin only)
    update: Update a notification (admin only)
    destroy: Delete a notification (admin only)
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return notifications for the current user, or all if admin"""
        if self.request.user.is_staff:
            return Notification.objects.all()
        return Notification.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return NotificationListSerializer
        elif self.action == 'create':
            return NotificationCreateSerializer
        return NotificationSerializer

    def get_permissions(self):
        """Only admins can create, update, or delete notifications"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications for the current user"""
        notifications = self.get_queryset().filter(status='pending')
        serializer = NotificationListSerializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()

        # Only the notification owner can mark it as read
        if notification.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to mark this notification as read'},
                status=status.HTTP_403_FORBIDDEN
            )

        if notification.status == 'pending':
            notification.status = 'sent'
            notification.sentAt = timezone.now()
            notification.save()

        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read for the current user"""
        updated_count = Notification.objects.filter(
            user=request.user,
            status='pending'
        ).update(status='sent', sentAt=timezone.now())

        return Response({
            'message': f'{updated_count} notifications marked as read'
        })


class NotificationTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing notification templates.
    Admin only.
    """
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['post'])
    def send(self, request):
        """
        Send a notification using a template.

        POST data:
        - user_id: ID of the user to send notification to
        - template_name: Name of the template to use
        - context: Dictionary of variables to replace in template
        """
        serializer = SendNotificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data['user_id']
        template_name = serializer.validated_data['template_name']
        context_data = serializer.validated_data.get('context', {})

        # Get user
        user = get_object_or_404(User, pk=user_id)

        # Get template
        template = get_object_or_404(
            NotificationTemplate,
            name=template_name,
            isActive=True
        )

        # Render template
        subject_template = Template(template.subject or '')
        body_template = Template(template.body)
        context = Context(context_data)

        rendered_subject = subject_template.render(context) if template.subject else None
        rendered_body = body_template.render(context)

        # Create notification
        notification = Notification.objects.create(
            user=user,
            type=template.type,
            category=template.category,
            subject=rendered_subject,
            message=rendered_body,
            toEmail=user.email if template.type == 'email' else None,
            toPhone=user.phone if template.type == 'sms' else None,
        )

        # In a real implementation, you would send the email/SMS here
        # For now, we'll just mark it as sent
        notification.status = 'sent'
        notification.sentAt = timezone.now()
        notification.save()

        response_serializer = NotificationSerializer(notification)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
