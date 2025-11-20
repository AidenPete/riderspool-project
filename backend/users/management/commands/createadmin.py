from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = 'Creates an admin user for Riderspool'

    def handle(self, *args, **options):
        email = 'admin@riderspool.com'
        password = 'admin123'
        fullName = 'Administrator'

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'Admin user {email} already exists'))
        else:
            User.objects.create_superuser(
                email=email,
                password=password,
                fullName=fullName
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created admin user: {email}'))
            self.stdout.write(self.style.SUCCESS(f'Password: {password}'))
