from rest_framework import serializers
from .models import Job, JobApplication
from users.serializers import UserSerializer


class JobSerializer(serializers.ModelSerializer):
    """Serializer for Job model"""
    employer = UserSerializer(read_only=True)
    employerName = serializers.SerializerMethodField()
    employerType = serializers.SerializerMethodField()
    employerDescription = serializers.SerializerMethodField()
    applications_count = serializers.ReadOnlyField()
    new_applications_count = serializers.ReadOnlyField()

    class Meta:
        model = Job
        fields = [
            'id', 'employer', 'employerName', 'employerType', 'employerDescription',
            'title', 'category', 'description', 'requirements', 'responsibilities',
            'employmentType', 'experienceRequired',
            'salaryMin', 'salaryMax', 'salaryCurrency', 'salaryPeriod', 'benefits',
            'region', 'city', 'specificLocation', 'isRemote',
            'numberOfPositions', 'status', 'applicationDeadline',
            'applications_count', 'new_applications_count',
            'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'employer', 'createdAt', 'updatedAt']

    def get_employerName(self, obj):
        """Get employer display name"""
        if obj.employer.employerType == 'individual':
            return obj.employer.fullName
        return obj.employer.companyName or obj.employer.fullName

    def get_employerType(self, obj):
        """Get employer type"""
        return obj.employer.employerType

    def get_employerDescription(self, obj):
        """Get employer description from profile if available"""
        if hasattr(obj.employer, 'employer_profile'):
            return obj.employer.employer_profile.description
        return None


class JobListSerializer(serializers.ModelSerializer):
    """Simplified serializer for job list"""
    employer = serializers.SerializerMethodField()
    employerName = serializers.SerializerMethodField()
    employerType = serializers.SerializerMethodField()
    applicationCount = serializers.IntegerField(source='applications_count', read_only=True)
    viewCount = serializers.IntegerField(default=0, read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'employer', 'employerName', 'employerType', 'title', 'category',
            'description', 'employmentType', 'experienceRequired', 'salaryMin', 'salaryMax',
            'salaryCurrency', 'salaryPeriod', 'region', 'city', 'isRemote',
            'status', 'applicationDeadline', 'applicationCount', 'viewCount',
            'numberOfPositions', 'createdAt'
        ]

    def get_employer(self, obj):
        """Get basic employer info"""
        return {
            'id': obj.employer.id,
            'companyName': obj.employer.companyName,
            'fullName': obj.employer.fullName,
            'industry': obj.employer.industry if hasattr(obj.employer, 'industry') else None,
        }

    def get_employerName(self, obj):
        """Get employer display name"""
        if obj.employer.employerType == 'individual':
            return obj.employer.fullName
        return obj.employer.companyName or obj.employer.fullName

    def get_employerType(self, obj):
        """Get employer type"""
        return obj.employer.employerType


class JobCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating jobs"""

    class Meta:
        model = Job
        fields = [
            'title', 'category', 'description', 'requirements', 'responsibilities',
            'employmentType', 'experienceRequired',
            'salaryMin', 'salaryMax', 'salaryCurrency', 'salaryPeriod', 'benefits',
            'region', 'city', 'specificLocation', 'isRemote',
            'numberOfPositions', 'applicationDeadline'
        ]

    def create(self, validated_data):
        """Create job with employer from request"""
        employer = self.context['request'].user
        job = Job.objects.create(employer=employer, **validated_data)
        return job


class JobApplicationSerializer(serializers.ModelSerializer):
    """Serializer for JobApplication model"""
    job = JobSerializer(read_only=True)
    provider = UserSerializer(read_only=True)
    providerName = serializers.SerializerMethodField()
    providerCategory = serializers.SerializerMethodField()
    providerRating = serializers.SerializerMethodField()
    jobTitle = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'jobTitle', 'provider', 'providerName',
            'providerCategory', 'providerRating',
            'coverLetter', 'expectedSalary', 'availableFrom',
            'status', 'employerNotes',
            'appliedAt', 'reviewedAt', 'updatedAt'
        ]
        read_only_fields = [
            'id', 'job', 'provider', 'appliedAt', 'reviewedAt', 'updatedAt'
        ]

    def get_providerName(self, obj):
        """Get provider name"""
        return obj.provider.fullName

    def get_providerCategory(self, obj):
        """Get provider category"""
        if hasattr(obj.provider, 'provider_profile'):
            return obj.provider.provider_profile.category
        return obj.provider.category

    def get_providerRating(self, obj):
        """Get provider rating"""
        if hasattr(obj.provider, 'provider_profile'):
            return float(obj.provider.provider_profile.rating)
        return None

    def get_jobTitle(self, obj):
        """Get job title"""
        return obj.job.title


class JobApplicationListSerializer(serializers.ModelSerializer):
    """Simplified serializer for application list"""
    providerName = serializers.SerializerMethodField()
    providerCategory = serializers.SerializerMethodField()
    providerRating = serializers.SerializerMethodField()
    jobTitle = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = [
            'id', 'jobTitle', 'providerName', 'providerCategory',
            'providerRating', 'status', 'appliedAt'
        ]

    def get_providerName(self, obj):
        """Get provider name"""
        return obj.provider.fullName

    def get_providerCategory(self, obj):
        """Get provider category"""
        if hasattr(obj.provider, 'provider_profile'):
            return obj.provider.provider_profile.category
        return obj.provider.category

    def get_providerRating(self, obj):
        """Get provider rating"""
        if hasattr(obj.provider, 'provider_profile'):
            return float(obj.provider.provider_profile.rating)
        return None

    def get_jobTitle(self, obj):
        """Get job title"""
        return obj.job.title


class JobApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating job applications"""

    class Meta:
        model = JobApplication
        fields = ['coverLetter', 'expectedSalary', 'availableFrom']

    def create(self, validated_data):
        """Create job application"""
        provider = self.context['request'].user
        job = self.context['job']

        # Check if provider already applied
        if JobApplication.objects.filter(job=job, provider=provider).exists():
            raise serializers.ValidationError("You have already applied for this job")

        application = JobApplication.objects.create(
            job=job,
            provider=provider,
            **validated_data
        )
        return application


class JobApplicationUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating job application status"""

    class Meta:
        model = JobApplication
        fields = ['status', 'employerNotes']
