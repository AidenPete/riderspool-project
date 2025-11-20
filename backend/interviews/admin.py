from django.contrib import admin
from .models import Interview, InterviewFeedback, OfficeLocation


@admin.register(OfficeLocation)
class OfficeLocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'isActive', 'createdAt']
    list_filter = ['isActive', 'city', 'createdAt']
    search_fields = ['name', 'city', 'address']
    readonly_fields = ['createdAt']


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'employer', 'provider', 'date', 'time', 'status', 'createdAt']
    list_filter = ['status', 'date', 'createdAt']
    search_fields = ['employer__fullName', 'employer__companyName', 'provider__fullName']
    readonly_fields = ['createdAt', 'updatedAt', 'confirmedAt', 'completedAt']
    date_hierarchy = 'date'


@admin.register(InterviewFeedback)
class InterviewFeedbackAdmin(admin.ModelAdmin):
    list_display = ['interview', 'rating', 'wouldHireAgain', 'createdAt']
    list_filter = ['rating', 'wouldHireAgain', 'createdAt']
    search_fields = ['interview__provider__fullName', 'interview__employer__fullName']
    readonly_fields = ['createdAt']
