from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, ProviderProfile, EmployerProfile, SavedProvider


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""

    class Meta:
        model = User
        fields = [
            'id', 'email', 'fullName', 'phone', 'userType',
            'companyName', 'industry', 'contactPerson',
            'category', 'experience', 'isVerified',
            'dateJoined', 'lastActive'
        ]
        read_only_fields = ['id', 'dateJoined', 'lastActive', 'isVerified']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6, label='Confirm Password')

    class Meta:
        model = User
        fields = [
            'email', 'password', 'password2', 'fullName', 'phone', 'userType',
            'companyName', 'industry', 'contactPerson',
            'category', 'experience'
        ]

    def validate(self, attrs):
        """Validate registration data"""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match"})

        # Validate employer-specific fields
        if attrs['userType'] == 'employer':
            if not attrs.get('companyName'):
                raise serializers.ValidationError({"companyName": "Company name is required for employers"})
            if not attrs.get('industry'):
                raise serializers.ValidationError({"industry": "Industry is required for employers"})

        # Validate provider-specific fields
        if attrs['userType'] == 'provider':
            if not attrs.get('category'):
                raise serializers.ValidationError({"category": "Category is required for providers"})
            if not attrs.get('experience'):
                raise serializers.ValidationError({"experience": "Experience is required for providers"})

        return attrs

    def create(self, validated_data):
        """Create new user"""
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """Validate login credentials"""
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)

            if not user:
                raise serializers.ValidationError('Invalid email or password')

            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include "email" and "password"')


class ProviderProfileSerializer(serializers.ModelSerializer):
    """Serializer for ProviderProfile model"""
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProviderProfile
        fields = [
            'id', 'user', 'registeredName', 'category', 'experience',
            'bio', 'idNumber', 'licenseNumber', 'profilePhoto',
            'idDocument', 'licenseDocument', 'skills', 'availability',
            'rating', 'totalInterviews', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'user', 'rating', 'totalInterviews', 'createdAt', 'updatedAt']


class ProviderProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating provider profile"""

    # Make all fields optional for partial updates
    registeredName = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False, allow_blank=True)
    experience = serializers.IntegerField(required=False, allow_null=True)
    idNumber = serializers.CharField(required=False, allow_blank=True)
    licenseNumber = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = ProviderProfile
        fields = [
            'registeredName', 'category', 'experience', 'bio',
            'idNumber', 'licenseNumber', 'profilePhoto',
            'idDocument', 'licenseDocument', 'skills', 'availability'
        ]


class ProviderListSerializer(serializers.ModelSerializer):
    """Simplified serializer for provider list"""
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProviderProfile
        fields = [
            'id', 'user', 'registeredName', 'category', 'experience',
            'rating', 'totalInterviews', 'availability', 'profilePhoto'
        ]


class EmployerProfileSerializer(serializers.ModelSerializer):
    """Serializer for EmployerProfile model"""
    user = UserSerializer(read_only=True)

    class Meta:
        model = EmployerProfile
        fields = [
            'id', 'user', 'companyName', 'industry', 'contactPerson',
            'phone', 'website', 'companySize', 'description',
            'registrationNumber', 'registrationCertificate',
            'officeAddress', 'region', 'city', 'postalCode',
            'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'user', 'createdAt', 'updatedAt']


class EmployerProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating employer profile"""

    # Make all fields optional for partial updates
    companyName = serializers.CharField(required=False, allow_blank=True)
    industry = serializers.CharField(required=False, allow_blank=True)
    contactPerson = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    registrationNumber = serializers.CharField(required=False, allow_blank=True)
    officeAddress = serializers.CharField(required=False, allow_blank=True)
    region = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = EmployerProfile
        fields = [
            'companyName', 'industry', 'contactPerson', 'phone',
            'website', 'companySize', 'description',
            'registrationNumber', 'registrationCertificate',
            'officeAddress', 'region', 'city', 'postalCode'
        ]


class SavedProviderSerializer(serializers.ModelSerializer):
    """Serializer for SavedProvider model"""
    provider = UserSerializer(read_only=True)
    employer = UserSerializer(read_only=True)

    class Meta:
        model = SavedProvider
        fields = ['id', 'employer', 'provider', 'savedAt']
        read_only_fields = ['id', 'employer', 'savedAt']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=6)
    new_password2 = serializers.CharField(required=True, write_only=True, min_length=6)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Passwords do not match"})
        return attrs
