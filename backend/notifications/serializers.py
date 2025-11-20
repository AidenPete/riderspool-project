from rest_framework import serializers
from .models import Notification, NotificationTemplate


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""

    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'category', 'status', 'subject',
            'message', 'toEmail', 'toPhone', 'errorMessage',
            'retryCount', 'createdAt', 'sentAt', 'updatedAt'
        ]
        read_only_fields = [
            'id', 'status', 'errorMessage', 'retryCount',
            'createdAt', 'sentAt', 'updatedAt'
        ]


class NotificationListSerializer(serializers.ModelSerializer):
    """Simplified serializer for notification list"""

    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'category', 'status', 'subject',
            'createdAt', 'sentAt'
        ]


class NotificationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating notifications"""

    class Meta:
        model = Notification
        fields = [
            'type', 'category', 'subject', 'message',
            'toEmail', 'toPhone'
        ]

    def validate(self, attrs):
        """Validate notification data"""
        notification_type = attrs.get('type')

        # Validate email notifications
        if notification_type == 'email':
            if not attrs.get('toEmail'):
                raise serializers.ValidationError(
                    {"toEmail": "Email address is required for email notifications"}
                )
            if not attrs.get('subject'):
                raise serializers.ValidationError(
                    {"subject": "Subject is required for email notifications"}
                )

        # Validate SMS notifications
        if notification_type == 'sms':
            if not attrs.get('toPhone'):
                raise serializers.ValidationError(
                    {"toPhone": "Phone number is required for SMS notifications"}
                )

        return attrs


class NotificationTemplateSerializer(serializers.ModelSerializer):
    """Serializer for NotificationTemplate model"""

    class Meta:
        model = NotificationTemplate
        fields = [
            'id', 'name', 'category', 'type', 'subject',
            'body', 'isActive', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class SendNotificationSerializer(serializers.Serializer):
    """Serializer for sending notifications using templates"""
    user_id = serializers.IntegerField(required=True)
    template_name = serializers.CharField(required=True)
    context = serializers.JSONField(required=False, default=dict)

    def validate_template_name(self, value):
        """Validate template exists"""
        if not NotificationTemplate.objects.filter(name=value, isActive=True).exists():
            raise serializers.ValidationError(f"Template '{value}' not found or inactive")
        return value
