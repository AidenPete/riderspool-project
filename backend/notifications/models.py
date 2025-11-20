from django.db import models
from django.conf import settings


class Notification(models.Model):
    """Notification model for email and SMS tracking"""

    TYPE_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]

    CATEGORY_CHOICES = [
        ('interview_request', 'Interview Request'),
        ('interview_confirmation', 'Interview Confirmation'),
        ('interview_reschedule', 'Interview Reschedule'),
        ('interview_cancellation', 'Interview Cancellation'),
        ('verification_approved', 'Verification Approved'),
        ('verification_rejected', 'Verification Rejected'),
        ('general', 'General'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Email specific fields
    subject = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField()
    toEmail = models.EmailField(blank=True, null=True)

    # SMS specific fields
    toPhone = models.CharField(max_length=20, blank=True, null=True)

    # Error tracking
    errorMessage = models.TextField(blank=True, null=True)
    retryCount = models.IntegerField(default=0)

    # Timestamps
    createdAt = models.DateTimeField(auto_now_add=True)
    sentAt = models.DateTimeField(blank=True, null=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-createdAt']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['type', 'status']),
            models.Index(fields=['category', 'createdAt']),
        ]

    def __str__(self):
        return f"{self.get_type_display()} to {self.user.fullName} - {self.get_status_display()}"


class NotificationTemplate(models.Model):
    """Email and SMS notification templates"""

    TYPE_CHOICES = Notification.TYPE_CHOICES
    CATEGORY_CHOICES = Notification.CATEGORY_CHOICES

    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    # Template fields
    subject = models.CharField(max_length=255, blank=True, null=True, help_text='For email notifications')
    body = models.TextField(help_text='Use {{variable}} for dynamic content')

    isActive = models.BooleanField(default=True)

    # Timestamps
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notification_templates'
        verbose_name = 'Notification Template'
        verbose_name_plural = 'Notification Templates'
        unique_together = ['category', 'type']

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"
