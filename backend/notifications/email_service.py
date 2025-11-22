"""
Email notification service for Riderspool
Handles all email sending operations with templates
"""

from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils import timezone
from .models import Notification


class EmailService:
    """Service class for sending emails"""

    @staticmethod
    def send_email(user, subject, template_name, context, category='general'):
        """
        Send an email using a template

        Args:
            user: User object to send email to
            subject: Email subject
            template_name: Name of the template file (without extension)
            context: Dictionary of context variables for the template
            category: Notification category for tracking

        Returns:
            Notification object
        """
        # Add common context
        context.update({
            'user': user,
            'frontend_url': settings.FRONTEND_URL,
            'current_year': timezone.now().year,
        })

        # Create notification record
        notification = Notification.objects.create(
            user=user,
            type='email',
            category=category,
            subject=subject,
            message='',  # Will be updated after rendering
            toEmail=user.email,
            status='pending'
        )

        try:
            # Render HTML template
            html_content = render_to_string(f'emails/{template_name}.html', context)
            text_content = strip_tags(html_content)

            # Update notification with rendered message
            notification.message = text_content
            notification.save()

            # Create email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email]
            )
            email.attach_alternative(html_content, "text/html")

            # Send email
            email.send(fail_silently=False)

            # Update notification status
            notification.status = 'sent'
            notification.sentAt = timezone.now()
            notification.save()

            return notification

        except Exception as e:
            # Update notification with error
            notification.status = 'failed'
            notification.errorMessage = str(e)
            notification.retryCount += 1
            notification.save()

            # Log error
            print(f"Email sending failed: {str(e)}")
            return notification

    @staticmethod
    def send_welcome_email(user):
        """Send welcome email after registration"""
        context = {
            'name': user.fullName or user.companyName or 'User',
            'user_type': user.userType,
        }

        return EmailService.send_email(
            user=user,
            subject='Welcome to Riderspool!',
            template_name='welcome',
            context=context,
            category='general'
        )

    @staticmethod
    def send_interview_request_email(interview):
        """Send email to provider when interview is requested"""
        provider = interview.provider
        employer = interview.employer

        context = {
            'name': provider.fullName or 'Provider',
            'employer_name': employer.companyName or employer.fullName,
            'interview_date': interview.date.strftime('%B %d, %Y'),
            'interview_time': interview.time.strftime('%I:%M %p') if hasattr(interview.time, 'strftime') else interview.time,
            'office_location': interview.officeLocation.name if interview.officeLocation else 'TBD',
            'office_address': f"{interview.officeLocation.address}, {interview.officeLocation.city}" if interview.officeLocation else '',
            'notes': interview.notes or '',
            'interview_id': interview.id,
        }

        return EmailService.send_email(
            user=provider,
            subject=f'New Interview Request from {context["employer_name"]}',
            template_name='interview_request',
            context=context,
            category='interview_request'
        )

    @staticmethod
    def send_interview_confirmation_email(interview):
        """Send email to employer when provider confirms interview"""
        employer = interview.employer
        provider = interview.provider

        context = {
            'name': employer.companyName or employer.fullName or 'Employer',
            'provider_name': provider.fullName or 'Provider',
            'interview_date': interview.date.strftime('%B %d, %Y'),
            'interview_time': interview.time.strftime('%I:%M %p') if hasattr(interview.time, 'strftime') else interview.time,
            'office_location': interview.officeLocation.name if interview.officeLocation else 'TBD',
            'office_address': f"{interview.officeLocation.address}, {interview.officeLocation.city}" if interview.officeLocation else '',
            'interview_id': interview.id,
        }

        return EmailService.send_email(
            user=employer,
            subject=f'Interview Confirmed by {context["provider_name"]}',
            template_name='interview_confirmation',
            context=context,
            category='interview_confirmation'
        )

    @staticmethod
    def send_interview_cancellation_email(interview, cancelled_by):
        """Send email when interview is cancelled"""
        # Determine who to notify (the other party)
        if cancelled_by == interview.employer:
            notify_user = interview.provider
            cancelled_by_name = interview.employer.companyName or interview.employer.fullName
        else:
            notify_user = interview.employer
            cancelled_by_name = interview.provider.fullName

        context = {
            'name': notify_user.fullName or notify_user.companyName or 'User',
            'cancelled_by': cancelled_by_name,
            'interview_date': interview.date.strftime('%B %d, %Y'),
            'interview_time': interview.time.strftime('%I:%M %p') if hasattr(interview.time, 'strftime') else interview.time,
            'cancellation_reason': interview.cancellationReason or 'No reason provided',
            'interview_id': interview.id,
        }

        return EmailService.send_email(
            user=notify_user,
            subject='Interview Cancelled',
            template_name='interview_cancellation',
            context=context,
            category='interview_cancellation'
        )

    @staticmethod
    def send_interview_reschedule_email(interview, rescheduled_by):
        """Send email when interview is rescheduled"""
        # Determine who to notify (the other party)
        if rescheduled_by == interview.employer:
            notify_user = interview.provider
            rescheduled_by_name = interview.employer.companyName or interview.employer.fullName
        else:
            notify_user = interview.employer
            rescheduled_by_name = interview.provider.fullName

        context = {
            'name': notify_user.fullName or notify_user.companyName or 'User',
            'rescheduled_by': rescheduled_by_name,
            'new_date': interview.date.strftime('%B %d, %Y'),
            'new_time': interview.time.strftime('%I:%M %p') if hasattr(interview.time, 'strftime') else interview.time,
            'office_location': interview.officeLocation.name if interview.officeLocation else 'TBD',
            'reschedule_reason': interview.rescheduleReason or 'No reason provided',
            'interview_id': interview.id,
        }

        return EmailService.send_email(
            user=notify_user,
            subject='Interview Rescheduled',
            template_name='interview_reschedule',
            context=context,
            category='interview_reschedule'
        )

    @staticmethod
    def send_hired_notification_email(interview):
        """Send email to provider when they are marked as hired"""
        provider = interview.provider
        employer = interview.employer

        context = {
            'name': provider.fullName or 'Provider',
            'employer_name': employer.companyName or employer.fullName,
            'interview_date': interview.date.strftime('%B %d, %Y'),
        }

        return EmailService.send_email(
            user=provider,
            subject=f'Congratulations! You have been hired by {context["employer_name"]}',
            template_name='hired_notification',
            context=context,
            category='general'
        )

    @staticmethod
    def send_verification_approved_email(user):
        """Send email when user's documents are verified"""
        context = {
            'name': user.fullName or user.companyName or 'User',
        }

        return EmailService.send_email(
            user=user,
            subject='Your Documents Have Been Verified!',
            template_name='verification_approved',
            context=context,
            category='verification_approved'
        )

    @staticmethod
    def send_verification_rejected_email(user, rejection_reason):
        """Send email when user's documents are rejected"""
        context = {
            'name': user.fullName or user.companyName or 'User',
            'rejection_reason': rejection_reason,
        }

        return EmailService.send_email(
            user=user,
            subject='Document Verification Update',
            template_name='verification_rejected',
            context=context,
            category='verification_rejected'
        )

    @staticmethod
    def send_password_reset_email(user, reset_token):
        """Send password reset email"""
        context = {
            'name': user.fullName or user.companyName or 'User',
            'reset_link': f"{settings.FRONTEND_URL}/reset-password?token={reset_token}",
        }

        return EmailService.send_email(
            user=user,
            subject='Reset Your Password - Riderspool',
            template_name='password_reset',
            context=context,
            category='general'
        )
