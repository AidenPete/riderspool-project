from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, LoginView, LogoutView, CurrentUserView,
    ChangePasswordView, UserViewSet, ProviderProfileViewSet,
    EmployerProfileViewSet, SavedProviderViewSet,
    ForgotPasswordView, ResetPasswordView, UserSettingsView
)
from .admin_views import admin_dashboard_stats, admin_interview_analytics

# Create router for viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'providers', ProviderProfileViewSet, basename='provider')
router.register(r'employers', EmployerProfileViewSet, basename='employer')
router.register(r'saved-providers', SavedProviderViewSet, basename='saved-provider')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='reset-password'),

    # Settings endpoint
    path('settings/', UserSettingsView.as_view(), name='user-settings'),

    # Admin endpoints
    path('admin/dashboard/stats/', admin_dashboard_stats, name='admin-dashboard-stats'),
    path('admin/analytics/interviews/', admin_interview_analytics, name='admin-interview-analytics'),

    # Router URLs
    path('', include(router.urls)),
]
