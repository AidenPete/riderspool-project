from django.contrib import admin
from .models import Verification, VerificationDocument


class VerificationDocumentInline(admin.TabularInline):
    model = VerificationDocument
    extra = 0
    readonly_fields = ['uploadedAt']


@admin.register(Verification)
class VerificationAdmin(admin.ModelAdmin):
    list_display = ['provider', 'status', 'submittedAt', 'reviewedBy', 'reviewedAt']
    list_filter = ['status', 'submittedAt', 'reviewedAt']
    search_fields = ['provider__fullName', 'provider__email']
    readonly_fields = ['submittedAt', 'updatedAt']
    inlines = [VerificationDocumentInline]


@admin.register(VerificationDocument)
class VerificationDocumentAdmin(admin.ModelAdmin):
    list_display = ['verification', 'documentType', 'fileName', 'fileSize', 'uploadedAt']
    list_filter = ['documentType', 'uploadedAt']
    search_fields = ['verification__provider__fullName', 'fileName']
    readonly_fields = ['uploadedAt']
