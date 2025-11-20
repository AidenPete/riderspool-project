from rest_framework import serializers
from .models import Verification, VerificationDocument
from users.serializers import UserSerializer


class VerificationDocumentSerializer(serializers.ModelSerializer):
    """Serializer for VerificationDocument model"""

    class Meta:
        model = VerificationDocument
        fields = [
            'id', 'documentType', 'document', 'fileName',
            'fileSize', 'uploadedAt'
        ]
        read_only_fields = ['id', 'uploadedAt']


class VerificationSerializer(serializers.ModelSerializer):
    """Serializer for Verification model"""
    provider = UserSerializer(read_only=True)
    reviewedBy = UserSerializer(read_only=True)
    documents = VerificationDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Verification
        fields = [
            'id', 'provider', 'status', 'reviewedBy',
            'rejectionReason', 'adminNotes', 'documents',
            'submittedAt', 'reviewedAt', 'updatedAt'
        ]
        read_only_fields = [
            'id', 'provider', 'status', 'reviewedBy',
            'submittedAt', 'reviewedAt', 'updatedAt'
        ]


class VerificationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating verification requests"""

    class Meta:
        model = Verification
        fields = []  # All fields set automatically

    def create(self, validated_data):
        """Create verification request"""
        provider = self.context['request'].user
        verification = Verification.objects.create(
            provider=provider,
            status='pending'
        )
        return verification


class VerificationListSerializer(serializers.ModelSerializer):
    """Simplified serializer for verification list"""
    provider_name = serializers.SerializerMethodField()
    provider_category = serializers.SerializerMethodField()
    document_count = serializers.SerializerMethodField()

    class Meta:
        model = Verification
        fields = [
            'id', 'provider_name', 'provider_category',
            'status', 'document_count', 'submittedAt'
        ]

    def get_provider_name(self, obj):
        return obj.provider.fullName

    def get_provider_category(self, obj):
        return obj.provider.get_category_display() if obj.provider.category else None

    def get_document_count(self, obj):
        return obj.documents.count()


class VerificationApproveSerializer(serializers.Serializer):
    """Serializer for approving verification"""
    adminNotes = serializers.CharField(required=False, allow_blank=True)


class VerificationRejectSerializer(serializers.Serializer):
    """Serializer for rejecting verification"""
    rejectionReason = serializers.CharField(required=True)
    adminNotes = serializers.CharField(required=False, allow_blank=True)

    def validate_rejectionReason(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Rejection reason is required")
        return value


class VerificationDocumentUploadSerializer(serializers.ModelSerializer):
    """Serializer for uploading verification documents"""

    class Meta:
        model = VerificationDocument
        fields = ['documentType', 'document', 'fileName', 'fileSize']

    def create(self, validated_data):
        """Create verification document"""
        verification = self.context['verification']
        document = VerificationDocument.objects.create(
            verification=verification,
            **validated_data
        )
        return document

    def validate(self, attrs):
        """Validate document upload"""
        document = attrs.get('document')

        # Validate file size (max 5MB)
        if document and document.size > 5 * 1024 * 1024:
            raise serializers.ValidationError(
                {"document": "File size must be less than 5MB"}
            )

        # Validate file type
        allowed_types = [
            'image/jpeg', 'image/png', 'image/jpg',
            'application/pdf'
        ]
        if document and document.content_type not in allowed_types:
            raise serializers.ValidationError(
                {"document": "Only JPEG, PNG, and PDF files are allowed"}
            )

        return attrs
