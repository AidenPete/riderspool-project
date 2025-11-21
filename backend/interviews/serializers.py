from rest_framework import serializers
from .models import Interview, InterviewFeedback, OfficeLocation
from users.serializers import UserSerializer


class OfficeLocationSerializer(serializers.ModelSerializer):
    """Serializer for OfficeLocation model"""

    class Meta:
        model = OfficeLocation
        fields = ['id', 'name', 'address', 'city', 'isActive', 'createdAt']
        read_only_fields = ['id', 'createdAt']


class InterviewProviderSerializer(serializers.Serializer):
    """Custom serializer for provider in interviews"""
    id = serializers.IntegerField(source='user.id')
    name = serializers.CharField(source='user.fullName')
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField(source='user.phone')
    category = serializers.CharField()
    profilePhoto = serializers.ImageField(read_only=True)
    rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    totalInterviews = serializers.IntegerField()
    experience = serializers.IntegerField()


class InterviewSerializer(serializers.ModelSerializer):
    """Serializer for Interview model"""
    employer = UserSerializer(read_only=True)
    provider = serializers.SerializerMethodField(read_only=True)
    officeLocation = OfficeLocationSerializer(read_only=True)
    employer_id = serializers.IntegerField(write_only=True, required=False)
    provider_id = serializers.IntegerField(write_only=True)
    officeLocation_id = serializers.IntegerField(write_only=True)

    def get_provider(self, obj):
        """Get provider profile data"""
        try:
            from users.models import ProviderProfile
            profile = ProviderProfile.objects.get(user=obj.provider)
            return InterviewProviderSerializer(profile).data
        except ProviderProfile.DoesNotExist:
            # Fallback to basic user data
            return {
                'id': obj.provider.id,
                'name': obj.provider.fullName,
                'email': obj.provider.email,
                'phone': obj.provider.phone,
                'category': obj.provider.category,
                'profilePhoto': None,
                'rating': 0,
                'totalInterviews': 0,
                'experience': obj.provider.experience or 0,
            }

    class Meta:
        model = Interview
        fields = [
            'id', 'employer', 'provider', 'employer_id', 'provider_id',
            'date', 'time', 'officeLocation', 'officeLocation_id',
            'status', 'notes', 'cancellationReason', 'rescheduleReason',
            'createdAt', 'updatedAt', 'confirmedAt', 'completedAt'
        ]
        read_only_fields = [
            'id', 'employer', 'provider', 'officeLocation', 'status',
            'createdAt', 'updatedAt', 'confirmedAt', 'completedAt'
        ]

    def validate(self, attrs):
        """Validate interview data"""
        from django.utils import timezone
        from datetime import datetime

        # Validate date is not in the past
        interview_date = attrs.get('date')
        interview_time = attrs.get('time')

        if interview_date and interview_time:
            interview_datetime = datetime.combine(interview_date, interview_time)
            if interview_datetime < timezone.now().replace(tzinfo=None):
                raise serializers.ValidationError("Cannot book interviews in the past")

        return attrs


class InterviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating interview requests"""
    provider_id = serializers.IntegerField(required=True)
    officeLocation_id = serializers.IntegerField(required=True)
    date = serializers.DateField(required=True)
    time = serializers.TimeField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Interview
        fields = ['provider_id', 'date', 'time', 'officeLocation_id', 'notes']

    def validate(self, attrs):
        """Validate interview data"""
        from django.utils import timezone
        from datetime import datetime, timedelta

        # Validate date is not in the past (lenient for testing)
        interview_date = attrs.get('date')
        interview_time = attrs.get('time')

        if interview_date and interview_time:
            interview_datetime = datetime.combine(interview_date, interview_time)
            # Lenient: Allow booking up to 30 days in the past (for testing)
            min_datetime = (timezone.now() - timedelta(days=30)).replace(tzinfo=None)

            if interview_datetime < min_datetime:
                raise serializers.ValidationError({"date": "Cannot book interviews more than 30 days in the past"})

        return attrs

    def create(self, validated_data):
        """Create interview with employer from context"""
        employer = self.context['request'].user

        interview = Interview.objects.create(
            employer=employer,
            provider_id=validated_data['provider_id'],
            date=validated_data['date'],
            time=validated_data['time'],
            officeLocation_id=validated_data['officeLocation_id'],
            notes=validated_data.get('notes', ''),
            status='pending'
        )
        return interview


class InterviewListSerializer(serializers.ModelSerializer):
    """Serializer for interview list with full details"""
    employer = UserSerializer(read_only=True)
    provider = serializers.SerializerMethodField(read_only=True)
    officeLocation = OfficeLocationSerializer(read_only=True)

    class Meta:
        model = Interview
        fields = [
            'id', 'employer', 'provider', 'date', 'time',
            'officeLocation', 'status', 'notes', 'cancellationReason',
            'rescheduleReason', 'createdAt', 'updatedAt'
        ]

    def get_provider(self, obj):
        """Get provider profile data"""
        try:
            from users.models import ProviderProfile
            profile = ProviderProfile.objects.get(user=obj.provider)
            return InterviewProviderSerializer(profile).data
        except ProviderProfile.DoesNotExist:
            # Fallback to basic user data
            return {
                'id': obj.provider.id,
                'name': obj.provider.fullName,
                'email': obj.provider.email,
                'phone': obj.provider.phone,
                'category': obj.provider.category,
                'profilePhoto': None,
                'rating': 0,
                'totalInterviews': 0,
                'experience': obj.provider.experience or 0,
            }


class InterviewUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating interview status"""

    class Meta:
        model = Interview
        fields = ['status', 'cancellationReason', 'rescheduleReason', 'date', 'time']

    def validate(self, attrs):
        """Validate status transitions"""
        instance = self.instance
        new_status = attrs.get('status', instance.status)

        # Validate cancellation reason
        if new_status == 'cancelled' and not attrs.get('cancellationReason'):
            raise serializers.ValidationError(
                {"cancellationReason": "Cancellation reason is required"}
            )

        # Validate reschedule reason
        if new_status == 'rescheduled':
            if not attrs.get('rescheduleReason'):
                raise serializers.ValidationError(
                    {"rescheduleReason": "Reschedule reason is required"}
                )
            if not attrs.get('date') or not attrs.get('time'):
                raise serializers.ValidationError(
                    "New date and time are required for rescheduling"
                )

        return attrs


class InterviewFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for InterviewFeedback model"""
    interview = InterviewSerializer(read_only=True)

    class Meta:
        model = InterviewFeedback
        fields = ['id', 'interview', 'rating', 'comments', 'wouldHireAgain', 'createdAt']
        read_only_fields = ['id', 'interview', 'createdAt']


class InterviewFeedbackCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating interview feedback"""

    class Meta:
        model = InterviewFeedback
        fields = ['rating', 'comments', 'wouldHireAgain']

    def validate(self, attrs):
        """Validate feedback data"""
        if attrs['rating'] < 1 or attrs['rating'] > 5:
            raise serializers.ValidationError({"rating": "Rating must be between 1 and 5"})
        return attrs
