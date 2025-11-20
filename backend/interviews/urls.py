from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    InterviewViewSet, InterviewFeedbackViewSet, OfficeLocationViewSet
)

# Create router for viewsets
router = DefaultRouter()
router.register(r'interviews', InterviewViewSet, basename='interview')
router.register(r'feedback', InterviewFeedbackViewSet, basename='interview-feedback')
router.register(r'office-locations', OfficeLocationViewSet, basename='office-location')

urlpatterns = [
    path('', include(router.urls)),
]
