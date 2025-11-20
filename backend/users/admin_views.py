from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Count, Q, Avg
from django.utils import timezone
from datetime import timedelta

from .models import User, ProviderProfile
from interviews.models import Interview
from verifications.models import Verification
from notifications.models import Notification


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    """
    Get admin dashboard statistics

    Returns:
    - User statistics
    - Interview statistics
    - Verification statistics
    - Recent activity
    - Top providers
    """

    # User statistics
    total_users = User.objects.count()
    total_employers = User.objects.filter(userType='employer').count()
    total_providers = User.objects.filter(userType='provider').count()
    total_admins = User.objects.filter(Q(is_staff=True) | Q(is_superuser=True)).count()
    verified_users = User.objects.filter(isVerified=True).count()

    # New users in last 30 days
    thirty_days_ago = timezone.now() - timedelta(days=30)
    new_users_30d = User.objects.filter(dateJoined__gte=thirty_days_ago).count()
    new_employers_30d = User.objects.filter(
        userType='employer',
        dateJoined__gte=thirty_days_ago
    ).count()
    new_providers_30d = User.objects.filter(
        userType='provider',
        dateJoined__gte=thirty_days_ago
    ).count()

    # Interview statistics
    total_interviews = Interview.objects.count()
    pending_interviews = Interview.objects.filter(status='pending').count()
    confirmed_interviews = Interview.objects.filter(status='confirmed').count()
    completed_interviews = Interview.objects.filter(status='completed').count()
    cancelled_interviews = Interview.objects.filter(status='cancelled').count()

    # Interviews in last 30 days
    recent_interviews = Interview.objects.filter(createdAt__gte=thirty_days_ago).count()

    # Upcoming interviews (next 7 days)
    seven_days_from_now = timezone.now().date() + timedelta(days=7)
    upcoming_interviews = Interview.objects.filter(
        date__gte=timezone.now().date(),
        date__lte=seven_days_from_now,
        status__in=['pending', 'confirmed']
    ).count()

    # Verification statistics
    total_verifications = Verification.objects.count()
    pending_verifications = Verification.objects.filter(status='pending').count()
    approved_verifications = Verification.objects.filter(status='approved').count()
    rejected_verifications = Verification.objects.filter(status='rejected').count()

    # Notification statistics
    total_notifications = Notification.objects.count()
    pending_notifications = Notification.objects.filter(status='pending').count()
    sent_notifications = Notification.objects.filter(status='sent').count()
    failed_notifications = Notification.objects.filter(status='failed').count()

    # Top 5 providers by rating
    top_providers = ProviderProfile.objects.select_related('user').filter(
        rating__gt=0
    ).order_by('-rating', '-totalInterviews')[:5]

    top_providers_data = [{
        'id': profile.user.id,
        'name': profile.user.fullName,
        'category': profile.category,
        'rating': profile.rating,
        'totalInterviews': profile.totalInterviews,
        'experience': profile.experience,
    } for profile in top_providers]

    # Recent activity (last 10 users)
    recent_users = User.objects.order_by('-dateJoined')[:10]
    recent_users_data = [{
        'id': user.id,
        'email': user.email,
        'fullName': user.fullName,
        'userType': user.userType,
        'dateJoined': user.dateJoined,
    } for user in recent_users]

    # Provider category distribution
    category_distribution = ProviderProfile.objects.values('category').annotate(
        count=Count('id')
    ).order_by('-count')

    return Response({
        'users': {
            'total': total_users,
            'employers': total_employers,
            'providers': total_providers,
            'admins': total_admins,
            'verified': verified_users,
            'new_last_30_days': new_users_30d,
            'new_employers_last_30_days': new_employers_30d,
            'new_providers_last_30_days': new_providers_30d,
        },
        'interviews': {
            'total': total_interviews,
            'pending': pending_interviews,
            'confirmed': confirmed_interviews,
            'completed': completed_interviews,
            'cancelled': cancelled_interviews,
            'recent_30_days': recent_interviews,
            'upcoming_7_days': upcoming_interviews,
        },
        'verifications': {
            'total': total_verifications,
            'pending': pending_verifications,
            'approved': approved_verifications,
            'rejected': rejected_verifications,
        },
        'notifications': {
            'total': total_notifications,
            'pending': pending_notifications,
            'sent': sent_notifications,
            'failed': failed_notifications,
        },
        'topProviders': top_providers_data,
        'recentUsers': recent_users_data,
        'categoryDistribution': list(category_distribution),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_interview_analytics(request):
    """
    Get interview analytics for admin dashboard

    Returns:
    - Interview trends over time
    - Interview completion rates
    - Average ratings
    """

    # Get date range from query params (default: last 30 days)
    days = int(request.query_params.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)

    # Interviews by status over time
    interviews_by_status = Interview.objects.filter(
        createdAt__gte=start_date
    ).values('status').annotate(count=Count('id'))

    # Interview completion rate
    total_interviews = Interview.objects.filter(createdAt__gte=start_date).count()
    completed_interviews = Interview.objects.filter(
        createdAt__gte=start_date,
        status='completed'
    ).count()

    completion_rate = (completed_interviews / total_interviews * 100) if total_interviews > 0 else 0

    # Average provider rating
    avg_rating = ProviderProfile.objects.filter(
        rating__gt=0
    ).aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0

    # Interviews by category
    interviews_by_category = Interview.objects.filter(
        createdAt__gte=start_date
    ).values('provider__provider_profile__category').annotate(
        count=Count('id')
    ).order_by('-count')

    return Response({
        'interviewsByStatus': list(interviews_by_status),
        'completionRate': round(completion_rate, 2),
        'averageRating': round(avg_rating, 2),
        'interviewsByCategory': list(interviews_by_category),
        'dateRange': {
            'start': start_date,
            'end': timezone.now(),
            'days': days,
        },
    }, status=status.HTTP_200_OK)
