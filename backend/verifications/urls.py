from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import VerificationViewSet, VerificationDocumentViewSet

# Create router for viewsets
router = DefaultRouter()
router.register(r'verifications', VerificationViewSet, basename='verification')
router.register(r'documents', VerificationDocumentViewSet, basename='verification-document')

urlpatterns = [
    path('', include(router.urls)),
]
