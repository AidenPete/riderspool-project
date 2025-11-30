from django.contrib import admin
from .models import Job, JobApplication


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    """Admin interface for Job model"""

    list_display = [
        'title', 'employer_name', 'category', 'employmentType',
        'status', 'applications_count', 'createdAt'
    ]
    list_filter = ['status', 'category', 'employmentType', 'createdAt']
    search_fields = [
        'title', 'employer__fullName', 'employer__companyName',
        'description', 'city', 'region'
    ]
    readonly_fields = ['createdAt', 'updatedAt']

    fieldsets = (
        ('Employer Information', {
            'fields': ('employer',)
        }),
        ('Job Details', {
            'fields': (
                'title', 'category', 'description', 'requirements',
                'responsibilities', 'employmentType', 'experienceRequired'
            )
        }),
        ('Compensation', {
            'fields': (
                'salaryMin', 'salaryMax', 'salaryCurrency',
                'salaryPeriod', 'benefits'
            )
        }),
        ('Location', {
            'fields': ('region', 'city', 'specificLocation', 'isRemote')
        }),
        ('Additional Details', {
            'fields': ('numberOfPositions', 'applicationDeadline')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('createdAt', 'updatedAt'),
            'classes': ('collapse',)
        }),
    )

    def employer_name(self, obj):
        """Get employer display name"""
        return obj.employer.companyName or obj.employer.fullName
    employer_name.short_description = 'Employer'
    employer_name.admin_order_field = 'employer__fullName'


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    """Admin interface for JobApplication model"""

    list_display = [
        'provider_name', 'job_title', 'status',
        'appliedAt', 'reviewedAt'
    ]
    list_filter = ['status', 'appliedAt', 'job__category']
    search_fields = [
        'provider__fullName', 'job__title',
        'coverLetter', 'employerNotes'
    ]
    readonly_fields = ['appliedAt', 'updatedAt']

    fieldsets = (
        ('Application Information', {
            'fields': ('job', 'provider', 'status')
        }),
        ('Application Details', {
            'fields': (
                'coverLetter', 'expectedSalary', 'availableFrom'
            )
        }),
        ('Employer Notes', {
            'fields': ('employerNotes', 'reviewedAt'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('appliedAt', 'updatedAt'),
            'classes': ('collapse',)
        }),
    )

    def provider_name(self, obj):
        """Get provider name"""
        return obj.provider.fullName
    provider_name.short_description = 'Provider'
    provider_name.admin_order_field = 'provider__fullName'

    def job_title(self, obj):
        """Get job title"""
        return obj.job.title
    job_title.short_description = 'Job'
    job_title.admin_order_field = 'job__title'
