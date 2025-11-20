# Riderspool Backend API

Django REST API backend for the Riderspool platform - connecting employers with verified service providers (Motorbike Riders, Car Drivers, Truck Drivers).

---

## 🚀 Setup Complete

### ✅ What's Been Implemented

1. **Django Project Structure**
   - Django 5.2.8 with Python 3.13.3
   - Django REST Framework 3.16.1
   - JWT Authentication (djangorestframework-simplejwt 5.5.1)
   - CORS configured for React frontend
   - SQLite database (can be switched to PostgreSQL)

2. **Django Apps Created**
   - `users` - User authentication and management
   - `interviews` - Interview booking and management
   - `verifications` - Provider verification workflow
   - `notifications` - Email and SMS notification system

3. **Database Models**
   - **User Model** - Custom user model with email authentication
     - Supports 3 user types: Provider, Employer, Admin
     - Employer fields: companyName, industry, contactPerson
     - Provider fields: category, experience, isVerified

   - **ProviderProfile** - Extended provider information
     - Documents: ID, license, profile photo
     - Professional info: registered name, skills, bio
     - Stats: rating, total interviews, availability

   - **Interview** - Interview booking system
     - Status tracking: pending, confirmed, completed, cancelled
     - Office location integration
     - Timestamps for all state changes

   - **InterviewFeedback** - Employer feedback after interviews

   - **Verification** - Provider verification requests
     - Admin review workflow
     - Document management
     - Approval/rejection with reasons

   - **VerificationDocument** - Supporting documents for verification

   - **Notification** - Email/SMS tracking
     - Categories: interview requests, confirmations, verifications
     - Status tracking and error handling

   - **NotificationTemplate** - Reusable notification templates

   - **OfficeLocation** - Interview office locations

   - **SavedProvider** - Employer favorites

4. **Admin Interface**
   - All models registered in Django admin
   - Custom admin classes with search, filters, and readonly fields
   - Access at: `http://127.0.0.1:8000/admin/`
   - Credentials: `admin@riderspool.com` / `admin123`

5. **Configuration**
   - CORS enabled for `http://localhost:5174` (Vite frontend)
   - JWT tokens configured (1 day access, 7 day refresh)
   - Media files setup for document uploads
   - Timezone: Africa/Nairobi (Kenya)
   - Custom user model: AUTH_USER_MODEL = 'users.User'

---

## 📋 Environment Setup

### Prerequisites
- Python 3.13.3
- pip 25.3
- Virtual environment (venv)

### Installation

1. **Activate Virtual Environment**
   ```bash
   cd /Users/aidenpete/Desktop/riderspool-project/backend
   source venv/bin/activate
   ```

2. **Install Dependencies** (Already Done)
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-dotenv Pillow django-filter
   ```

3. **Run Migrations** (Already Done)
   ```bash
   python manage.py migrate
   ```

4. **Create Admin User** (Already Done)
   ```bash
   python manage.py createadmin
   ```
   - Email: `admin@riderspool.com`
   - Password: `admin123`

5. **Start Development Server**
   ```bash
   python manage.py runserver
   ```
   Server runs at: `http://127.0.0.1:8000`

---

## 🔐 Authentication

### JWT Authentication
- Access Token Lifetime: 1 day
- Refresh Token Lifetime: 7 days
- Token rotation enabled
- Blacklist after rotation: Yes

### User Types
- **Provider** - Service providers (riders/drivers)
- **Employer** - Companies hiring providers
- **Admin** - Platform administrators

---

## 📁 Project Structure

```
backend/
├── riderspool_backend/          # Project configuration
│   ├── settings.py              # Django settings
│   ├── urls.py                  # Main URL configuration
│   └── wsgi.py                  # WSGI configuration
│
├── users/                       # User management app
│   ├── models.py                # User, ProviderProfile, SavedProvider
│   ├── admin.py                 # Admin interface configuration
│   └── management/commands/
│       └── createadmin.py       # Create admin user command
│
├── interviews/                  # Interview management app
│   ├── models.py                # Interview, InterviewFeedback, OfficeLocation
│   └── admin.py
│
├── verifications/               # Verification workflow app
│   ├── models.py                # Verification, VerificationDocument
│   └── admin.py
│
├── notifications/               # Notification system app
│   ├── models.py                # Notification, NotificationTemplate
│   └── admin.py
│
├── media/                       # Uploaded files (created on first upload)
│   ├── profiles/                # Profile photos
│   ├── documents/               # ID and license documents
│   └── verifications/           # Verification documents
│
├── manage.py                    # Django management script
├── db.sqlite3                   # SQLite database
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

---

## 🗄️ Database Schema

### Users App
- **users** - Main user table
- **provider_profiles** - Extended provider information
- **saved_providers** - Employer favorites

### Interviews App
- **office_locations** - Interview locations
- **interviews** - Interview bookings
- **interview_feedback** - Post-interview ratings

### Verifications App
- **verifications** - Verification requests
- **verification_documents** - Supporting documents

### Notifications App
- **notifications** - Notification log
- **notification_templates** - Email/SMS templates

---

## 🌐 API Endpoints (All Implemented)

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - Login (get JWT tokens)
- `POST /api/auth/logout/` - Logout (blacklist token)
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user info

### Users
- `GET /api/users/` - List users (admin only)
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user (admin only)

### Providers
- `GET /api/providers/` - Search providers
- `GET /api/providers/{id}/` - Get provider profile
- `POST /api/providers/profile/` - Create/update provider profile
- `POST /api/providers/{id}/save/` - Save provider as favorite
- `DELETE /api/providers/{id}/unsave/` - Remove from favorites
- `GET /api/providers/saved/` - Get saved providers

### Interviews
- `GET /api/interviews/` - List interviews
- `POST /api/interviews/` - Create interview request
- `GET /api/interviews/{id}/` - Get interview details
- `PATCH /api/interviews/{id}/confirm/` - Confirm interview
- `PATCH /api/interviews/{id}/cancel/` - Cancel interview
- `PATCH /api/interviews/{id}/reschedule/` - Reschedule interview
- `POST /api/interviews/{id}/feedback/` - Submit feedback

### Verifications
- `GET /api/verifications/` - List verification requests (admin)
- `POST /api/verifications/` - Submit verification request
- `GET /api/verifications/{id}/` - Get verification details
- `PATCH /api/verifications/{id}/approve/` - Approve verification (admin)
- `PATCH /api/verifications/{id}/reject/` - Reject verification (admin)

### Notifications
- `GET /api/notifications/` - Get user notifications
- `POST /api/notifications/send/` - Send notification (internal)

### Office Locations
- `GET /api/office-locations/` - List active office locations

---

## 🔧 Django Admin Interface

Access at: `http://127.0.0.1:8000/admin/`

**Admin Credentials:**
- Email: `admin@riderspool.com`
- Password: `admin123`

**Available Management:**
- Users (all types)
- Provider Profiles
- Interviews & Feedback
- Verifications & Documents
- Notifications & Templates
- Office Locations
- Saved Providers

---

## 🛠️ Completed Features

✅ **All Serializers Created**
   - UserSerializer, ProviderSerializer
   - InterviewSerializer, VerificationSerializer
   - NotificationSerializer, and more

✅ **All ViewSets Implemented**
   - User ViewSet with registration/login
   - Provider ViewSet with search/filter
   - Interview ViewSet with full booking logic
   - Verification ViewSet with approval workflow
   - Notification ViewSet with template support

✅ **URL Routing Configured**
   - Django REST Framework routers set up
   - All API endpoints configured and working

✅ **Authentication Fully Implemented**
   - Register with JWT token generation
   - Login (JWT token generation)
   - Logout (token blacklist)
   - Token refresh
   - Password change
   - Profile management

✅ **Notification System Built**
   - Notification models and templates
   - API endpoints for sending and managing notifications
   - Template rendering support

✅ **Permissions Implemented**
   - IsAuthenticated, IsAdminUser permissions
   - Custom permission logic in ViewSets
   - Object-level permission checks

✅ **Search & Filters Implemented**
   - Provider search by category, availability, skills
   - Interview filtering by status, date
   - Verification filtering by status
   - DjangoFilterBackend integrated

## 🚀 Potential Future Enhancements

1. **Testing Suite**
   - Unit tests for models
   - API endpoint tests
   - Authentication tests
   - Integration tests

2. **Email Integration**
   - Configure SMTP backend
   - Implement actual email sending

3. **SMS Integration**
   - Africa's Talking or Twilio integration
   - SMS notification sending

4. **Advanced Features**
   - Email verification on registration
   - Password reset via email
   - Two-factor authentication
   - Real-time notifications (WebSockets)
   - File compression for uploads
   - Image optimization

5. **API Documentation**
   - Swagger/OpenAPI docs (drf-yasg or drf-spectacular)
   - Interactive API explorer

6. **Production Readiness**
   - PostgreSQL database migration
   - Redis for caching
   - Celery for background tasks
   - AWS S3 for media files
   - Monitoring and logging
   - Rate limiting

---

## 📦 Installed Packages

```txt
Django==5.2.8
djangorestframework==3.16.1
djangorestframework-simplejwt==5.5.1
django-cors-headers==4.9.0
django-filter==25.2
python-dotenv==1.2.1
Pillow==12.0.0
```

---

## 🔒 Security Notes

- SECRET_KEY should be moved to environment variables in production
- DEBUG should be False in production
- ALLOWED_HOSTS should be configured for production domain
- Database should be switched to PostgreSQL for production
- Media files should be served via CDN (e.g., AWS S3, Cloudinary)
- SSL/HTTPS should be enforced in production
- Rate limiting should be implemented
- CORS origins should be restricted to production frontend URL

---

## 🌍 Environment Variables (.env)

Create a `.env` file in the backend directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL)
# DB_ENGINE=django.db.backends.postgresql
# DB_NAME=riderspool_db
# DB_USER=postgres
# DB_PASSWORD=your-password
# DB_HOST=localhost
# DB_PORT=5432

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# SMS Configuration
SMS_API_KEY=your-sms-api-key
SMS_USERNAME=your-sms-username

# Frontend URL
FRONTEND_URL=http://localhost:5174
```

---

## 📝 Management Commands

### Custom Commands

**Create Admin User:**
```bash
python manage.py createadmin
```
Creates admin user with credentials from the command

### Standard Django Commands

**Make Migrations:**
```bash
python manage.py makemigrations
```

**Apply Migrations:**
```bash
python manage.py migrate
```

**Run Server:**
```bash
python manage.py runserver [port]
```

**Create Superuser:**
```bash
python manage.py createsuperuser
```

**Django Shell:**
```bash
python manage.py shell
```

---

## 🎯 Integration with Frontend

The backend is configured to work with the React frontend at `http://localhost:5174`

**CORS Configuration:**
- Allowed origins include localhost:5174 and localhost:3000
- Credentials enabled
- All standard HTTP methods allowed

**Frontend should:**
1. Store JWT tokens in localStorage or httpOnly cookies
2. Include `Authorization: Bearer <token>` header in requests
3. Handle token refresh when access token expires
4. Redirect to login on 401 Unauthorized

---

## 📊 Current Status

✅ Django project initialized
✅ Database models created
✅ Migrations applied
✅ Admin interface configured
✅ Admin user created
✅ Development server running
✅ All serializers implemented
✅ All API endpoints implemented
✅ JWT authentication implemented
✅ Notifications API implemented
✅ Admin dashboard statistics implemented
✅ Frontend integration complete
✅ Test data seeding available

---

## 🎉 Latest Updates

### Notifications System (Completed)
- ✅ Notification and NotificationTemplate models
- ✅ Notification ViewSet with mark as read functionality
- ✅ Template-based notification sending
- ✅ Admin-only template management

### Admin Dashboard (Completed)
- ✅ `GET /api/admin/dashboard/stats/` - Comprehensive dashboard statistics
  - User statistics (total, by type, new users last 30 days)
  - Interview statistics (total, by status, upcoming)
  - Verification statistics
  - Top-rated providers
  - Recent user activity
  - Category distribution
- ✅ `GET /api/admin/analytics/interviews/` - Interview analytics
  - Interview trends over time
  - Completion rates
  - Average ratings
  - Interviews by category

### All API Endpoints (Completed)
- ✅ Authentication (register, login, logout, refresh, me, change password)
- ✅ Users ViewSet (admin management)
- ✅ Providers ViewSet (search, filter, profile management)
- ✅ SavedProviders (employer favorites)
- ✅ Interviews ViewSet (full CRUD, confirm, cancel, reschedule, complete, feedback)
- ✅ Verifications ViewSet (submit, approve, reject)
- ✅ Notifications ViewSet (list, unread, mark as read)
- ✅ Office Locations (list active locations)

### Test Data (Available)
Run `python manage.py seed_data` to create:
- 3 test employers
- 6 test providers (motorbike riders, car drivers, truck drivers)
- 4 office locations (Nairobi, Mombasa, Kisumu)

All test accounts use password: `testpass123`

---

**Built for Riderspool** | **Django 5.2.8** | **Python 3.13.3** | **2025**
