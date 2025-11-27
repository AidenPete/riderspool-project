from django.db import models
from django.conf import settings


class OfficeLocation(models.Model):
    """Office locations where interviews can be conducted"""

    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    isActive = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'office_locations'
        verbose_name = 'Office Location'
        verbose_name_plural = 'Office Locations'
        ordering = ['city', 'name']

    def __str__(self):
        return f"{self.name}, {self.city}"


class Interview(models.Model):
    """Interview booking model"""

    STATUS_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
    ]

    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='employer_interviews',
        limit_choices_to={'userType': 'employer'}
    )
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='provider_interviews',
        limit_choices_to={'userType': 'provider'}
    )

    # Interview details
    date = models.DateField()
    time = models.TimeField()
    officeLocation = models.ForeignKey(OfficeLocation, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Additional info
    notes = models.TextField(blank=True, null=True, help_text='Additional notes for the interview')
    cancellationReason = models.TextField(blank=True, null=True)
    rescheduleReason = models.TextField(blank=True, null=True)
    isHired = models.BooleanField(default=False, help_text='Whether employer hired the provider after interview')

    # Timestamps
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    confirmedAt = models.DateTimeField(blank=True, null=True)
    completedAt = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'interviews'
        verbose_name = 'Interview'
        verbose_name_plural = 'Interviews'
        ordering = ['-createdAt']
        indexes = [
            models.Index(fields=['employer', 'status']),
            models.Index(fields=['provider', 'status']),
            models.Index(fields=['date', 'time']),
        ]

    def __str__(self):
        return f"Interview: {self.employer.companyName or self.employer.fullName} → {self.provider.fullName} on {self.date}"

    @property
    def is_past(self):
        from django.utils import timezone
        from datetime import datetime
        interview_datetime = datetime.combine(self.date, self.time)
        return interview_datetime < timezone.now().replace(tzinfo=None)


class InterviewFeedback(models.Model):
    """Feedback from employer after interview"""

    RATING_CHOICES = [
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    ]

    interview = models.OneToOneField(Interview, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comments = models.TextField(blank=True, null=True)
    strengths = models.TextField(blank=True, null=True, help_text='What the provider did well')
    improvements = models.TextField(blank=True, null=True, help_text='Areas for improvement')
    wouldHireAgain = models.BooleanField(default=False)

    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'interview_feedback'
        verbose_name = 'Interview Feedback'
        verbose_name_plural = 'Interview Feedbacks'

    def __str__(self):
        return f"Feedback for {self.interview.provider.fullName} - Rating: {self.rating}"
