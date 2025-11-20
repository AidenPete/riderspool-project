from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, ProviderProfile, EmployerProfile, SavedProvider


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'fullName', 'userType', 'isVerified', 'is_active', 'dateJoined']
    list_filter = ['userType', 'isVerified', 'is_active', 'dateJoined']
    search_fields = ['email', 'fullName', 'companyName']
    ordering = ['-dateJoined']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('fullName', 'phone', 'userType')}),
        ('Employer Info', {'fields': ('companyName', 'industry', 'contactPerson')}),
        ('Provider Info', {'fields': ('category', 'experience', 'isVerified')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'dateJoined', 'lastActive')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'fullName', 'userType', 'password1', 'password2'),
        }),
    )

    readonly_fields = ['dateJoined', 'lastActive', 'last_login']


@admin.register(ProviderProfile)
class ProviderProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'category', 'experience', 'availability', 'rating', 'totalInterviews']
    list_filter = ['category', 'availability', 'createdAt']
    search_fields = ['user__fullName', 'user__email', 'registeredName', 'idNumber', 'licenseNumber']
    readonly_fields = ['createdAt', 'updatedAt']


@admin.register(EmployerProfile)
class EmployerProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'companyName', 'industry', 'region', 'city', 'createdAt']
    list_filter = ['industry', 'region', 'createdAt']
    search_fields = ['user__fullName', 'user__email', 'companyName', 'registrationNumber']
    readonly_fields = ['createdAt', 'updatedAt']


@admin.register(SavedProvider)
class SavedProviderAdmin(admin.ModelAdmin):
    list_display = ['employer', 'provider', 'savedAt']
    list_filter = ['savedAt']
    search_fields = ['employer__fullName', 'provider__fullName']
    readonly_fields = ['savedAt']
