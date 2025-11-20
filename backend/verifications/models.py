from django.db import models
from django.conf import settings


class Verification(models.Model):
    """Provider verification requests model"""

    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='verification_requests',
        limit_choices_to={'userType': 'provider'}
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Review details
    reviewedBy = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_verifications',
        limit_choices_to={'userType': 'admin'}
    )
    rejectionReason = models.TextField(blank=True, null=True)
    adminNotes = models.TextField(blank=True, null=True, help_text='Internal notes for admin use')

    # Timestamps
    submittedAt = models.DateTimeField(auto_now_add=True)
    reviewedAt = models.DateTimeField(blank=True, null=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'verifications'
        verbose_name = 'Verification Request'
        verbose_name_plural = 'Verification Requests'
        ordering = ['-submittedAt']
        indexes = [
            models.Index(fields=['provider', 'status']),
            models.Index(fields=['status', 'submittedAt']),
        ]

    def __str__(self):
        return f"Verification for {self.provider.fullName} - {self.get_status_display()}"


class VerificationDocument(models.Model):
    """Model to store verification documents"""

    DOCUMENT_TYPE_CHOICES = [
        ('id', 'National ID'),
        ('license', 'Driver\'s License'),
        ('profile_photo', 'Profile Photo'),
        ('certificate', 'Certificate'),
        ('other', 'Other'),
    ]

    verification = models.ForeignKey(Verification, on_delete=models.CASCADE, related_name='documents')
    documentType = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES)
    document = models.FileField(upload_to='verifications/')
    fileName = models.CharField(max_length=255)
    fileSize = models.IntegerField(help_text='File size in bytes')
    uploadedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'verification_documents'
        verbose_name = 'Verification Document'
        verbose_name_plural = 'Verification Documents'
        ordering = ['-uploadedAt']

    def __str__(self):
        return f"{self.get_documentType_display()} for {self.verification.provider.fullName}"
