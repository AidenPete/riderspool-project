from django.contrib import admin
from .models import Notification, NotificationTemplate


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'category', 'status', 'createdAt', 'sentAt']
    list_filter = ['type', 'category', 'status', 'createdAt']
    search_fields = ['user__fullName', 'user__email', 'subject', 'message']
    readonly_fields = ['createdAt', 'sentAt', 'updatedAt']
    date_hierarchy = 'createdAt'


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'type', 'isActive', 'createdAt']
    list_filter = ['category', 'type', 'isActive', 'createdAt']
    search_fields = ['name', 'subject', 'body']
    readonly_fields = ['createdAt', 'updatedAt']
