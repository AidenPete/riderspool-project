# User Authentication & Differentiation - Riderspool

## How User Differentiation Works

### Current Implementation (Frontend Only)

When a user logs in, the system differentiates between Employers and Providers using the `userType` field:

```javascript
// In Login.jsx - Current Mock Implementation
const mockUser = {
  email: formData.email,
  userType: 'provider', // or 'employer'
  fullName: 'John Doe',
  category: 'Motorbike Rider',
};
```

### How It Will Work With Backend

#### 1. During Registration
The user selects their type (Employer or Provider) during registration:

```javascript
// Registration Flow
POST /api/auth/register
Body: {
  userType: 'employer' or 'provider',
  email: 'user@example.com',
  password: 'password123',
  // Other fields based on user type
}

// Backend Response
{
  success: true,
  user: {
    id: 1,
    email: 'user@example.com',
    userType: 'employer',
    // Other user data
  },
  token: 'JWT_TOKEN_HERE'
}
```

#### 2. During Login
User provides only email and password. Backend checks credentials and returns user data:

```javascript
// Login Flow
POST /api/auth/login
Body: {
  email: 'user@example.com',
  password: 'password123'
}

// Backend Response
{
  success: true,
  user: {
    id: 1,
    email: 'user@example.com',
    userType: 'employer', // Backend tells us what type they are
    companyName: 'ABC Construction Ltd',
    // Other employer-specific data
  },
  token: 'JWT_TOKEN_HERE'
}
```

**Key Point:** The user type is stored in the database during registration and returned during login. The frontend doesn't need to ask "Are you an employer or provider?" at login - the backend knows based on the email.

#### 3. Dashboard Routing
Based on the `userType` in the response, the app routes to the correct dashboard:

```javascript
// In Dashboard.jsx
if (user?.userType === 'employer') {
  return <EmployerDashboard />;
}

if (user?.userType === 'provider') {
  return <ProviderDashboard />;
}
```

### Database Schema

```sql
-- Users table (common fields)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('employer', 'provider')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Employers table (employer-specific data)
CREATE TABLE employers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  -- Other employer fields
);

-- Providers table (provider-specific data)
CREATE TABLE providers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  full_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  profile_photo_url VARCHAR(500),
  bio TEXT,
  -- Other provider fields
);
```

### Authentication Flow Diagram

```
REGISTRATION
┌──────────────────────────────────────────────────────────┐
│ User visits /register                                     │
│                                                            │
│ 1. Selects user type: [Employer] or [Provider]           │
│ 2. Fills appropriate form                                 │
│ 3. Submits to POST /api/auth/register                    │
│                                                            │
│ Backend:                                                   │
│  - Creates user record with userType                      │
│  - Creates employer or provider record                    │
│  - Returns user data + JWT token                          │
│                                                            │
│ Frontend:                                                  │
│  - Stores user data in AuthContext                        │
│  - Stores token in localStorage                           │
│  - Redirects to /dashboard                                │
└──────────────────────────────────────────────────────────┘

LOGIN
┌──────────────────────────────────────────────────────────┐
│ User visits /login                                        │
│                                                            │
│ 1. Enters email & password                                │
│ 2. Submits to POST /api/auth/login                       │
│                                                            │
│ Backend:                                                   │
│  - Finds user by email                                    │
│  - Verifies password                                      │
│  - Fetches employer or provider data based on userType   │
│  - Returns combined user data + JWT token                 │
│                                                            │
│ Frontend:                                                  │
│  - Receives user data with userType                       │
│  - Stores in AuthContext                                  │
│  - Redirects to /dashboard                                │
│  - Dashboard component checks userType and renders:       │
│    * EmployerDashboard if userType === 'employer'        │
│    * ProviderDashboard if userType === 'provider'        │
└──────────────────────────────────────────────────────────┘

DASHBOARD ROUTING
┌──────────────────────────────────────────────────────────┐
│ /dashboard (Route)                                        │
│     ↓                                                     │
│ Dashboard.jsx checks user.userType                       │
│     ↓                                                     │
│ if 'employer' → EmployerDashboard.jsx                    │
│   - Shows: Bookings, Search, Saved Providers            │
│                                                            │
│ if 'provider' → ProviderDashboard.jsx                    │
│   - Shows: Profile completion, Interviews                │
└──────────────────────────────────────────────────────────┘
```

### Why This Approach?

✅ **Security:** User type cannot be manipulated by the user
✅ **Simplicity:** Login only requires email/password
✅ **Consistency:** User type is set once during registration
✅ **Flexibility:** Easy to add more user types in the future

### Protected Routes Implementation

```javascript
// Example: Protecting employer-only routes
function ProtectedEmployerRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.userType !== 'employer') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

// Usage in App.jsx
<Route
  path="/search"
  element={
    <ProtectedEmployerRoute>
      <SearchProviders />
    </ProtectedEmployerRoute>
  }
/>
```

### API Endpoints for Authentication

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/logout          - Logout user
GET    /api/auth/me              - Get current user (verify token)
POST   /api/auth/forgot-password - Send reset link
POST   /api/auth/reset-password  - Reset password with token
POST   /api/auth/verify-email    - Verify email address
```

---

## Password Reset Flow

### Forgot Password
```
1. User clicks "Forgot Password" on login page
2. Enters email address
3. Backend sends email with reset token/link
4. User clicks link → Goes to /reset-password?token=XYZ
5. User enters new password
6. Password is updated
7. User can login with new password
```

### Implementation

**Frontend:**
- `/forgot-password` - Request reset link
- `/reset-password?token=XYZ` - Set new password

**Backend:**
- Generate secure token (JWT or random string)
- Store token with expiration (e.g., 1 hour)
- Send email with reset link
- Verify token when resetting password
- Invalidate token after use

---

## Summary

**Current System:**
- ✅ User type stored during registration
- ✅ Returned during login
- ✅ Dashboard routes based on user type
- ✅ AuthContext manages user state
- ⚠️ Currently using mock data
- ⚠️ Needs backend API implementation

**With Backend:**
- Backend stores user type in database
- Login API returns user data with type
- Frontend routes user to correct dashboard
- JWT token authenticates requests
- User cannot change their type after registration
