from rest_framework import serializers
from .models import Interview, InterviewFeedback, OfficeLocation
from users.serializers import UserSerializer


class OfficeLocationSerializer(serializers.ModelSerializer):
    """Serializer for OfficeLocation model"""

    class Meta:
        model = OfficeLocation
        fields = ['id', 'name', 'address', 'city', 'isActive', 'createdAt']
        read_only_fields = ['id', 'createdAt']


class InterviewSerializer(serializers.ModelSerializer):
    """Serializer for Interview model"""
    employer = UserSerializer(read_only=True)
    provider = UserSerializer(read_only=True)
    officeLocation = OfficeLocationSerializer(read_only=True)
    employer_id = serializers.IntegerField(write_only=True, required=False)
    provider_id = serializers.IntegerField(write_only=True)
    officeLocation_id = serializers.IntegerField(write_only=True)

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

    class Meta:
        model = Interview
        fields = ['provider_id', 'date', 'time', 'officeLocation_id', 'notes']

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
    """Simplified serializer for interview list"""
    employer_name = serializers.SerializerMethodField()
    provider_name = serializers.SerializerMethodField()
    office_name = serializers.SerializerMethodField()

    class Meta:
        model = Interview
        fields = [
            'id', 'employer_name', 'provider_name', 'date', 'time',
            'office_name', 'status', 'createdAt'
        ]

    def get_employer_name(self, obj):
        return obj.employer.companyName or obj.employer.fullName

    def get_provider_name(self, obj):
        return obj.provider.fullName

    def get_office_name(self, obj):
        return obj.officeLocation.name if obj.officeLocation else None


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
