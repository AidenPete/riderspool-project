from django.core.management.base import BaseCommand
from django.db import transaction
from users.models import User, ProviderProfile
from interviews.models import OfficeLocation


class Command(BaseCommand):
    help = 'Seed the database with sample data for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Seeding database with test data...'))

        with transaction.atomic():
            # Create test employers
            employers = [
                {
                    'email': 'abc.construction@example.com',
                    'password': 'testpass123',
                    'fullName': 'John Smith',
                    'phone': '+254712000001',
                    'userType': 'employer',
                    'companyName': 'ABC Construction Ltd',
                    'contactPerson': 'John Smith',
                    'industry': 'Construction',
                },
                {
                    'email': 'tech.solutions@example.com',
                    'password': 'testpass123',
                    'fullName': 'Jane Doe',
                    'phone': '+254712000002',
                    'userType': 'employer',
                    'companyName': 'Tech Solutions Inc',
                    'contactPerson': 'Jane Doe',
                    'industry': 'Technology',
                },
                {
                    'email': 'fresh.foods@example.com',
                    'password': 'testpass123',
                    'fullName': 'Sarah Williams',
                    'phone': '+254712000003',
                    'userType': 'employer',
                    'companyName': 'Fresh Foods Co.',
                    'contactPerson': 'Sarah Williams',
                    'industry': 'Retail',
                },
            ]

            for emp_data in employers:
                if not User.objects.filter(email=emp_data['email']).exists():
                    user = User(**{k: v for k, v in emp_data.items() if k != 'password'})
                    user.set_password(emp_data['password'])
                    user.save()
                    self.stdout.write(self.style.SUCCESS(f'Created employer: {emp_data["email"]}'))

            # Create test providers
            providers = [
                {
                    'user': {
                        'email': 'john.kamau@example.com',
                        'password': 'testpass123',
                        'fullName': 'John Kamau',
                        'phone': '+254712100001',
                        'userType': 'provider',
                        'category': 'motorbike-rider',
                        'experience': 5,
                    },
                    'profile': {
                        'registeredName': 'John Kamau Deliveries',
                        'category': 'motorbike-rider',
                        'experience': 5,
                        'bio': 'Experienced delivery rider with excellent knowledge of Nairobi routes. Always punctual and professional.',
                        'idNumber': 'ID12345678',
                        'licenseNumber': 'LIC987654',
                        'skills': 'First Aid, Navigation Expert, Customer Service',
                        'availability': True,
                    }
                },
                {
                    'user': {
                        'email': 'mary.wanjiku@example.com',
                        'password': 'testpass123',
                        'fullName': 'Mary Wanjiku',
                        'phone': '+254712100002',
                        'userType': 'provider',
                        'category': 'car-driver',
                        'experience': 8,
                    },
                    'profile': {
                        'registeredName': 'Mary Wanjiku Transport',
                        'category': 'car-driver',
                        'experience': 8,
                        'bio': 'Professional driver with clean driving record. Experienced in both personal and corporate driving.',
                        'idNumber': 'ID23456789',
                        'licenseNumber': 'LIC876543',
                        'skills': 'First Aid, Multiple Languages, Vehicle Maintenance',
                        'availability': True,
                    }
                },
                {
                    'user': {
                        'email': 'peter.omondi@example.com',
                        'password': 'testpass123',
                        'fullName': 'Peter Omondi',
                        'phone': '+254712100003',
                        'userType': 'provider',
                        'category': 'truck-driver',
                        'experience': 12,
                    },
                    'profile': {
                        'registeredName': 'Peter Omondi Logistics',
                        'category': 'truck-driver',
                        'experience': 12,
                        'bio': 'Long-haul truck driver specializing in cargo transportation. Expert in Kenya-Tanzania routes.',
                        'idNumber': 'ID34567890',
                        'licenseNumber': 'LIC765432',
                        'skills': 'Navigation Expert, Vehicle Maintenance, Logistics',
                        'availability': True,
                    }
                },
                {
                    'user': {
                        'email': 'grace.achieng@example.com',
                        'password': 'testpass123',
                        'fullName': 'Grace Achieng',
                        'phone': '+254712100004',
                        'userType': 'provider',
                        'category': 'motorbike-rider',
                        'experience': 3,
                    },
                    'profile': {
                        'registeredName': 'Grace Achieng Express',
                        'category': 'motorbike-rider',
                        'experience': 3,
                        'bio': 'Reliable and fast delivery rider. Familiar with Kisumu and surrounding areas.',
                        'idNumber': 'ID45678901',
                        'licenseNumber': 'LIC654321',
                        'skills': 'Customer Service, First Aid',
                        'availability': True,
                    }
                },
                {
                    'user': {
                        'email': 'susan.njeri@example.com',
                        'password': 'testpass123',
                        'fullName': 'Susan Njeri',
                        'phone': '+254712100005',
                        'userType': 'provider',
                        'category': 'car-driver',
                        'experience': 10,
                    },
                    'profile': {
                        'registeredName': 'Susan Njeri Executive Transport',
                        'category': 'car-driver',
                        'experience': 10,
                        'bio': 'Executive driver with impeccable record. Specializing in corporate and VIP transport.',
                        'idNumber': 'ID56789012',
                        'licenseNumber': 'LIC543210',
                        'skills': 'Multiple Languages, First Aid, Professional Etiquette, Tour Guide',
                        'availability': True,
                    }
                },
                {
                    'user': {
                        'email': 'david.kipchoge@example.com',
                        'password': 'testpass123',
                        'fullName': 'David Kipchoge',
                        'phone': '+254712100006',
                        'userType': 'provider',
                        'category': 'truck-driver',
                        'experience': 7,
                    },
                    'profile': {
                        'registeredName': 'David Kipchoge Heavy Transport',
                        'category': 'truck-driver',
                        'experience': 7,
                        'bio': 'Experienced truck driver with focus on safety and timely deliveries.',
                        'idNumber': 'ID67890123',
                        'licenseNumber': 'LIC432109',
                        'skills': 'Safety Training, Vehicle Maintenance',
                        'availability': True,
                    }
                },
            ]

            for prov_data in providers:
                if not User.objects.filter(email=prov_data['user']['email']).exists():
                    # Create user
                    user_data = prov_data['user']
                    user = User(**{k: v for k, v in user_data.items() if k != 'password'})
                    user.set_password(user_data['password'])
                    user.save()
                    
                    # Create provider profile
                    profile_data = prov_data['profile']
                    ProviderProfile.objects.create(user=user, **profile_data)
                    
                    self.stdout.write(self.style.SUCCESS(f'Created provider: {user_data["email"]}'))

            # Create office locations
            offices = [
                {
                    'name': 'Nairobi Westlands Office',
                    'address': 'Westlands Square, Ring Road Parklands',
                    'city': 'Nairobi',
                    'isActive': True,
                },
                {
                    'name': 'Nairobi CBD Office',
                    'address': 'Kimathi Street, Opposite Hilton Hotel',
                    'city': 'Nairobi',
                    'isActive': True,
                },
                {
                    'name': 'Mombasa Office',
                    'address': 'Moi Avenue, Near Kenya Ferry',
                    'city': 'Mombasa',
                    'isActive': True,
                },
                {
                    'name': 'Kisumu Office',
                    'address': 'Oginga Odinga Street, Downtown',
                    'city': 'Kisumu',
                    'isActive': True,
                },
            ]

            for office_data in offices:
                if not OfficeLocation.objects.filter(name=office_data['name']).exists():
                    OfficeLocation.objects.create(**office_data)
                    self.stdout.write(self.style.SUCCESS(f'Created office: {office_data["name"]}'))

        self.stdout.write(self.style.SUCCESS('\n✅ Database seeding completed successfully!'))
        self.stdout.write(self.style.SUCCESS('\nTest Accounts Created:'))
        self.stdout.write(self.style.SUCCESS('\nEmployers:'))
        self.stdout.write('  - abc.construction@example.com / testpass123')
        self.stdout.write('  - tech.solutions@example.com / testpass123')
        self.stdout.write('  - fresh.foods@example.com / testpass123')
        self.stdout.write(self.style.SUCCESS('\nProviders:'))
        self.stdout.write('  - john.kamau@example.com / testpass123 (Motorbike Rider)')
        self.stdout.write('  - mary.wanjiku@example.com / testpass123 (Car Driver)')
        self.stdout.write('  - peter.omondi@example.com / testpass123 (Truck Driver)')
        self.stdout.write('  - grace.achieng@example.com / testpass123 (Motorbike Rider)')
        self.stdout.write('  - susan.njeri@example.com / testpass123 (Car Driver)')
        self.stdout.write('  - david.kipchoge@example.com / testpass123 (Truck Driver)')
        self.stdout.write(self.style.SUCCESS('\nAdmin:'))
        self.stdout.write('  - admin@riderspool.com / admin123')
