# Riderspool API Endpoints Documentation

Base URL: `http://127.0.0.1:8000/api/`

---

## Authentication Endpoints

### Register
**POST** `/api/auth/register/`

Register a new user (Employer or Provider).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "password2": "password123",
  "fullName": "John Doe",
  "phone": "+254712345678",
  "userType": "employer",  // or "provider"

  // For Employers:
  "companyName": "ABC Company",
  "industry": "Construction",
  "contactPerson": "John Doe",

  // For Providers:
  "category": "motorbike-rider",  // or "car-driver", "truck-driver"
  "experience": 5
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "userType": "employer",
    ...
  },
  "tokens": {
    "refresh": "refresh_token_here",
    "access": "access_token_here"
  },
  "message": "User registered successfully"
}
```

---

### Login
**POST** `/api/auth/login/`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {...},
  "tokens": {
    "refresh": "refresh_token_here",
    "access": "access_token_here"
  },
  "message": "Login successful"
}
```

---

### Logout
**POST** `/api/auth/logout/`

Logout (blacklist refresh token).

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

---

### Refresh Token
**POST** `/api/auth/refresh/`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refresh": "refresh_token_here"
}
```

---

### Current User
**GET** `/api/auth/me/`

Get current authenticated user details.

**Headers:** `Authorization: Bearer <access_token>`

**PUT** `/api/auth/me/`

Update current user details.

---

### Change Password
**POST** `/api/auth/change-password/`

Change user password.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "old_password": "oldpass123",
  "new_password": "newpass123",
  "new_password2": "newpass123"
}
```

---

## User Management (Admin Only)

### List Users
**GET** `/api/users/`

List all users with filters.

**Query Parameters:**
- `userType` - Filter by user type (provider, employer, admin)
- `isVerified` - Filter by verification status (true, false)
- `is_active` - Filter by active status (true, false)
- `search` - Search by email, fullName, companyName
- `ordering` - Sort by field (dateJoined, lastActive)

---

### Get User
**GET** `/api/users/{id}/`

Get specific user details.

---

## Provider Endpoints

### List Providers
**GET** `/api/providers/`

Search and list available providers.

**Query Parameters:**
- `category` - Filter by category (motorbike-rider, car-driver, truck-driver)
- `availability` - Filter by availability (true, false)
- `search` - Search by fullName, registeredName, skills
- `ordering` - Sort by field (rating, totalInterviews, experience)

**Response:**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": {...},
      "registeredName": "John Doe",
      "category": "motorbike-rider",
      "experience": 5,
      "rating": 4.5,
      "totalInterviews": 10,
      "availability": true,
      "profilePhoto": "/media/profiles/photo.jpg"
    }
  ]
}
```

---

### Get Provider Profile
**GET** `/api/providers/{id}/`

Get detailed provider profile.

---

### My Provider Profile
**GET** `/api/providers/my-profile/`

Get current provider's own profile.

**PUT/PATCH** `/api/providers/my-profile/`

Update provider's own profile.

**Request Body:**
```json
{
  "registeredName": "John Doe",
  "category": "motorbike-rider",
  "experience": 5,
  "bio": "Experienced rider...",
  "idNumber": "12345678",
  "licenseNumber": "DL123456",
  "skills": "Defensive driving, GPS navigation",
  "availability": true
}
```

---

## Saved Providers (Employers)

### List Saved Providers
**GET** `/api/saved-providers/`

Get employer's saved providers.

---

### Save Provider
**POST** `/api/saved-providers/`

Save a provider to favorites.

**Request Body:**
```json
{
  "provider_id": 1
}
```

---

### Unsave Provider
**DELETE** `/api/saved-providers/unsave/{provider_id}/`

Remove provider from saved list.

---

## Interview Endpoints

### List Interviews
**GET** `/api/interviews/`

List user's interviews (employer sees their requests, provider sees their invitations).

**Query Parameters:**
- `status` - Filter by status (pending, confirmed, completed, cancelled)
- `date` - Filter by date
- `ordering` - Sort by field

---

### Create Interview Request
**POST** `/api/interviews/`

Create new interview request (employer only).

**Request Body:**
```json
{
  "provider_id": 1,
  "date": "2025-01-20",
  "time": "10:00:00",
  "officeLocation_id": 1,
  "notes": "Please bring your documents"
}
```

---

### Get Interview
**GET** `/api/interviews/{id}/`

Get interview details.

---

### Confirm Interview
**POST** `/api/interviews/{id}/confirm/`

Confirm interview (provider only).

---

### Cancel Interview
**POST** `/api/interviews/{id}/cancel/`

Cancel interview (employer or provider).

**Request Body:**
```json
{
  "cancellationReason": "Unable to attend due to emergency"
}
```

---

### Reschedule Interview
**POST** `/api/interviews/{id}/reschedule/`

Reschedule interview (employer or provider).

**Request Body:**
```json
{
  "date": "2025-01-22",
  "time": "14:00:00",
  "rescheduleReason": "Original time not convenient"
}
```

---

### Complete Interview
**POST** `/api/interviews/{id}/complete/`

Mark interview as completed (employer only).

---

### Submit Feedback
**POST** `/api/interviews/{id}/feedback/`

Submit feedback for completed interview (employer only).

**Request Body:**
```json
{
  "rating": 5,
  "comments": "Excellent candidate, very professional",
  "wouldHireAgain": true
}
```

---

## Interview Feedback

### List Feedback
**GET** `/api/feedback/`

List interview feedback (filtered by user).

**Query Parameters:**
- `rating` - Filter by rating
- `wouldHireAgain` - Filter by wouldHireAgain (true, false)

---

## Office Locations

### List Office Locations
**GET** `/api/office-locations/`

List all active office locations.

**Query Parameters:**
- `search` - Search by name, city, address

**Response:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "name": "Nairobi Office",
      "address": "123 Main Street",
      "city": "Nairobi",
      "isActive": true,
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

## Verification Endpoints

### List Verifications (Admin)
**GET** `/api/verifications/`

List all verification requests (admin only).

**Query Parameters:**
- `status` - Filter by status (pending, approved, rejected)

---

### Create Verification Request
**POST** `/api/verifications/`

Submit verification request (provider only).

---

### Get Verification
**GET** `/api/verifications/{id}/`

Get verification details.

---

### My Verification Status
**GET** `/api/verifications/my-verification/`

Get provider's current verification status.

---

### Approve Verification (Admin)
**POST** `/api/verifications/{id}/approve/`

Approve verification request.

**Request Body:**
```json
{
  "adminNotes": "All documents verified"
}
```

---

### Reject Verification (Admin)
**POST** `/api/verifications/{id}/reject/`

Reject verification request.

**Request Body:**
```json
{
  "rejectionReason": "ID document is not clear, please resubmit",
  "adminNotes": "Internal notes for admin"
}
```

---

### Upload Verification Document
**POST** `/api/verifications/{id}/upload_document/`

Upload document for verification.

**Request Body (multipart/form-data):**
```
documentType: "id"  // or "license", "profile_photo"
document: <file>
fileName: "national_id.pdf"
fileSize: 1024000
```

---

## Verification Documents

### List Documents
**GET** `/api/documents/`

List verification documents.

**Query Parameters:**
- `documentType` - Filter by document type
- `verification` - Filter by verification ID

---

## Authentication Headers

All protected endpoints require JWT authentication:

```
Authorization: Bearer <access_token>
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Error message here",
  "field_name": ["Field-specific error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "error": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "error": "Resource not found."
}
```

---

## Pagination

List endpoints return paginated results:

```json
{
  "count": 100,
  "next": "http://127.0.0.1:8000/api/providers/?page=2",
  "previous": null,
  "results": [...]
}
```

Default page size: 20 items

---

## File Uploads

### Supported File Types
- Images: JPEG, PNG, JPG
- Documents: PDF

### Maximum File Size
- 5MB per file

### Media URL
- Development: `http://127.0.0.1:8000/media/`
- Files are organized in subdirectories:
  - Profiles: `/media/profiles/`
  - Documents: `/media/documents/ids/`, `/media/documents/licenses/`
  - Verifications: `/media/verifications/`

---

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "password2": "test123",
    "fullName": "Test User",
    "userType": "employer",
    "companyName": "Test Company",
    "industry": "Testing"
  }'
```

**Login:**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Get Current User:**
```bash
curl -X GET http://127.0.0.1:8000/api/auth/me/ \
  -H "Authorization: Bearer <your_access_token>"
```

---

## Django Admin

Access the Django admin panel at:
- URL: `http://127.0.0.1:8000/admin/`
- Credentials: `admin@riderspool.com` / `admin123`

Available admin features:
- User management
- Provider profiles
- Interviews and feedback
- Verifications and documents
- Office locations
- Notifications

---

**Built for Riderspool** | **Django REST API** | **2025**
