from rest_framework import status, generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import ProviderProfile, SavedProvider
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    ProviderProfileSerializer, ProviderProfileCreateSerializer,
    ProviderListSerializer, SavedProviderSerializer,
    ChangePasswordSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    """User login endpoint"""
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)


class LogoutView(generics.GenericAPIView):
    """User logout endpoint"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """Get or update current user"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    """Change user password"""
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        # Check old password
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'old_password': 'Wrong password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model (admin only)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['userType', 'isVerified', 'is_active']
    search_fields = ['email', 'fullName', 'companyName']
    ordering_fields = ['dateJoined', 'lastActive']
    ordering = ['-dateJoined']

    def get_queryset(self):
        """Filter users based on permissions"""
        user = self.request.user
        if user.is_admin or user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=user.id)


class ProviderProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for ProviderProfile model"""
    queryset = ProviderProfile.objects.select_related('user').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'availability']
    search_fields = ['user__fullName', 'registeredName', 'skills']
    ordering_fields = ['rating', 'totalInterviews', 'experience']
    ordering = ['-rating']

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return ProviderListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return ProviderProfileCreateSerializer
        return ProviderProfileSerializer

    def get_queryset(self):
        """Filter available providers"""
        queryset = super().get_queryset()

        # Filter by user type for employers
        if self.request.user.is_employer:
            queryset = queryset.filter(availability=True, user__isVerified=True)

        # Providers can only see their own profile
        if self.request.user.is_provider:
            queryset = queryset.filter(user=self.request.user)

        return queryset

    def perform_create(self, serializer):
        """Create profile for current user"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='my-profile')
    def my_profile(self, request):
        """Get or update provider's own profile"""
        try:
            profile = ProviderProfile.objects.get(user=request.user)

            if request.method == 'GET':
                serializer = ProviderProfileSerializer(profile)
                return Response(serializer.data)

            elif request.method in ['PUT', 'PATCH']:
                serializer = ProviderProfileCreateSerializer(
                    profile,
                    data=request.data,
                    partial=True  # Always allow partial updates
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(ProviderProfileSerializer(profile).data)

        except ProviderProfile.DoesNotExist:
            # If profile doesn't exist and it's a PUT/PATCH, create it with defaults from User
            if request.method in ['PUT', 'PATCH']:
                # Create a mutable dict for profile data
                profile_data = {}

                # Copy over existing data from request (handles both dict and FormData)
                for key in request.data:
                    profile_data[key] = request.data[key]

                # Set defaults from user if not provided
                if 'registeredName' not in profile_data or not profile_data.get('registeredName'):
                    profile_data['registeredName'] = request.user.fullName
                if 'category' not in profile_data or not profile_data.get('category'):
                    profile_data['category'] = request.user.category or 'motorbike-rider'
                if 'experience' not in profile_data or not profile_data.get('experience'):
                    profile_data['experience'] = request.user.experience or 0
                if 'idNumber' not in profile_data or not profile_data.get('idNumber'):
                    profile_data['idNumber'] = 'PENDING'
                if 'licenseNumber' not in profile_data or not profile_data.get('licenseNumber'):
                    profile_data['licenseNumber'] = 'PENDING'

                serializer = ProviderProfileCreateSerializer(data=profile_data)
                serializer.is_valid(raise_exception=True)
                profile = serializer.save(user=request.user)
                return Response(
                    ProviderProfileSerializer(profile).data,
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {'error': 'Provider profile not found. Please create your profile first.'},
                    status=status.HTTP_404_NOT_FOUND
                )


class SavedProviderViewSet(viewsets.ModelViewSet):
    """ViewSet for SavedProvider model"""
    queryset = SavedProvider.objects.select_related('employer', 'provider').all()
    serializer_class = SavedProviderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return saved providers for current employer"""
        if self.request.user.is_employer:
            return SavedProvider.objects.filter(employer=self.request.user)
        return SavedProvider.objects.none()

    def create(self, request, *args, **kwargs):
        """Save a provider"""
        provider_id = request.data.get('provider_id')

        if not provider_id:
            return Response(
                {'error': 'provider_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            provider = User.objects.get(id=provider_id, userType='provider')
        except User.DoesNotExist:
            return Response(
                {'error': 'Provider not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if already saved
        if SavedProvider.objects.filter(employer=request.user, provider=provider).exists():
            return Response(
                {'error': 'Provider already saved'},
                status=status.HTTP_400_BAD_REQUEST
            )

        saved = SavedProvider.objects.create(
            employer=request.user,
            provider=provider
        )

        return Response(
            SavedProviderSerializer(saved).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['delete'], url_path='unsave/(?P<provider_id>[^/.]+)')
    def unsave(self, request, provider_id=None):
        """Remove provider from saved list"""
        try:
            saved = SavedProvider.objects.get(
                employer=request.user,
                provider_id=provider_id
            )
            saved.delete()
            return Response(
                {'message': 'Provider removed from saved list'},
                status=status.HTTP_200_OK
            )
        except SavedProvider.DoesNotExist:
            return Response(
                {'error': 'Saved provider not found'},
                status=status.HTTP_404_NOT_FOUND
            )
