from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('userType', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model for Riderspool"""

    USER_TYPE_CHOICES = [
        ('provider', 'Service Provider'),
        ('employer', 'Employer'),
        ('admin', 'Administrator'),
    ]

    CATEGORY_CHOICES = [
        ('motorbike-rider', 'Motorbike Rider'),
        ('car-driver', 'Car Driver'),
        ('truck-driver', 'Truck Driver'),
    ]

    # Basic fields
    email = models.EmailField(unique=True, max_length=255)
    fullName = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    userType = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)

    # Employer specific fields
    companyName = models.CharField(max_length=255, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    contactPerson = models.CharField(max_length=255, blank=True, null=True)

    # Provider specific fields
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, blank=True, null=True)
    experience = models.IntegerField(blank=True, null=True, help_text='Years of experience')

    # Verification status
    isVerified = models.BooleanField(default=False)

    # Django required fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    # Timestamps
    dateJoined = models.DateTimeField(auto_now_add=True)
    lastActive = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['fullName', 'userType']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-dateJoined']

    def __str__(self):
        return f"{self.fullName} ({self.get_userType_display()})"

    @property
    def is_provider(self):
        return self.userType == 'provider'

    @property
    def is_employer(self):
        return self.userType == 'employer'

    @property
    def is_admin(self):
        return self.userType == 'admin'


class ProviderProfile(models.Model):
    """Extended profile for service providers"""

    CATEGORY_CHOICES = User.CATEGORY_CHOICES

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='provider_profile')

    # Basic info
    registeredName = models.CharField(max_length=255, help_text='Official registered name')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    experience = models.IntegerField(help_text='Years of experience')
    bio = models.TextField(blank=True, null=True)

    # Documents
    idNumber = models.CharField(max_length=50)
    licenseNumber = models.CharField(max_length=50)
    profilePhoto = models.ImageField(upload_to='profiles/', blank=True, null=True)
    idDocument = models.FileField(upload_to='documents/ids/', blank=True, null=True)
    licenseDocument = models.FileField(upload_to='documents/licenses/', blank=True, null=True)

    # Additional info
    skills = models.TextField(blank=True, null=True, help_text='Comma-separated skills')
    availability = models.BooleanField(default=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    totalInterviews = models.IntegerField(default=0)

    # Timestamps
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'provider_profiles'
        verbose_name = 'Provider Profile'
        verbose_name_plural = 'Provider Profiles'

    def __str__(self):
        return f"{self.user.fullName} - {self.get_category_display()}"


class EmployerProfile(models.Model):
    """Extended profile for employers/companies"""

    COMPANY_SIZE_CHOICES = [
        ('1-10', '1-10 employees'),
        ('11-50', '11-50 employees'),
        ('51-200', '51-200 employees'),
        ('201-500', '201-500 employees'),
        ('500+', '500+ employees'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')

    # Company details
    companyName = models.CharField(max_length=255, help_text='Official company name')
    industry = models.CharField(max_length=100)
    contactPerson = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    website = models.URLField(blank=True, null=True)
    companySize = models.CharField(max_length=20, choices=COMPANY_SIZE_CHOICES, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    # Business registration
    registrationNumber = models.CharField(max_length=100)
    registrationCertificate = models.FileField(upload_to='documents/certificates/', blank=True, null=True)

    # Office location
    officeAddress = models.TextField()
    region = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    postalCode = models.CharField(max_length=20, blank=True, null=True)

    # Timestamps
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'employer_profiles'
        verbose_name = 'Employer Profile'
        verbose_name_plural = 'Employer Profiles'

    def __str__(self):
        return f"{self.companyName} - {self.industry}"


class SavedProvider(models.Model):
    """Model for employers to save favorite providers"""

    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_providers')
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_by_employers')
    savedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'saved_providers'
        unique_together = ['employer', 'provider']
        verbose_name = 'Saved Provider'
        verbose_name_plural = 'Saved Providers'
        ordering = ['-savedAt']

    def __str__(self):
        return f"{self.employer.fullName} saved {self.provider.fullName}"
