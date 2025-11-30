from django.db import models
from django.conf import settings


class Job(models.Model):
    """Job posting model for employers"""

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('filled', 'Filled'),
    ]

    CATEGORY_CHOICES = [
        ('motorbike-rider', 'Motorbike Rider'),
        ('car-driver', 'Car Driver'),
        ('truck-driver', 'Truck Driver'),
    ]

    EMPLOYMENT_TYPE_CHOICES = [
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('contract', 'Contract'),
        ('temporary', 'Temporary'),
    ]

    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='job_postings',
        limit_choices_to={'userType': 'employer'}
    )

    # Job details
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    requirements = models.TextField(help_text='Job requirements and qualifications')
    responsibilities = models.TextField(blank=True, null=True, help_text='Key responsibilities')

    # Employment details
    employmentType = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='full-time')
    experienceRequired = models.IntegerField(help_text='Minimum years of experience required')

    # Compensation
    salaryMin = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    salaryMax = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    salaryCurrency = models.CharField(max_length=10, default='KES')
    salaryPeriod = models.CharField(max_length=20, default='monthly', help_text='e.g., monthly, weekly, hourly')

    # Location
    region = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    specificLocation = models.TextField(blank=True, null=True, help_text='Specific work location details')
    isRemote = models.BooleanField(default=False)

    # Additional details
    benefits = models.TextField(blank=True, null=True, help_text='Additional benefits offered')
    numberOfPositions = models.IntegerField(default=1, help_text='Number of positions available')

    # Status and deadlines
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    applicationDeadline = models.DateField(blank=True, null=True)

    # Timestamps
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'jobs'
        verbose_name = 'Job Posting'
        verbose_name_plural = 'Job Postings'
        ordering = ['-createdAt']
        indexes = [
            models.Index(fields=['employer', 'status']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['status', 'createdAt']),
        ]

    def __str__(self):
        return f"{self.title} - {self.employer.companyName or self.employer.fullName}"

    @property
    def applications_count(self):
        """Get total number of applications"""
        return self.applications.count()

    @property
    def new_applications_count(self):
        """Get number of new/pending applications"""
        return self.applications.filter(status='pending').count()


class JobApplication(models.Model):
    """Job application model for providers"""

    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('interview_requested', 'Interview Requested'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='job_applications',
        limit_choices_to={'userType': 'provider'}
    )

    # Application details
    coverLetter = models.TextField(blank=True, null=True, help_text='Cover letter or message')
    expectedSalary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    availableFrom = models.DateField(blank=True, null=True, help_text='When can you start?')

    # Status
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    employerNotes = models.TextField(blank=True, null=True, help_text='Internal notes by employer')

    # Timestamps
    appliedAt = models.DateTimeField(auto_now_add=True)
    reviewedAt = models.DateTimeField(blank=True, null=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'job_applications'
        verbose_name = 'Job Application'
        verbose_name_plural = 'Job Applications'
        ordering = ['-appliedAt']
        unique_together = ['job', 'provider']  # Prevent duplicate applications
        indexes = [
            models.Index(fields=['job', 'status']),
            models.Index(fields=['provider', 'status']),
            models.Index(fields=['status', 'appliedAt']),
        ]

    def __str__(self):
        return f"{self.provider.fullName} - {self.job.title}"
