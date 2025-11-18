# Riderspool Frontend - Project Structure

## Overview
This document outlines the folder structure and architecture of the Riderspool frontend application.

## Folder Structure

```
src/
├── components/           # Reusable React components
│   ├── auth/            # Authentication-related components
│   ├── common/          # Common/shared components
│   │   ├── Button.jsx   # Reusable button component
│   │   └── Card.jsx     # Reusable card component
│   ├── dashboard/       # Dashboard-specific components
│   ├── profile/         # Profile-related components
│   ├── search/          # Search and filter components
│   ├── booking/         # Interview booking components
│   └── layout/          # Layout components
│       └── Navbar.jsx   # Navigation bar component
├── context/             # React Context providers
│   └── AuthContext.jsx  # Authentication context
├── hooks/               # Custom React hooks
├── pages/               # Page-level components
│   ├── Landing.jsx      # Landing page
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Registration page
│   ├── Dashboard.jsx    # Dashboard router (routes to employer/provider)
│   ├── EmployerDashboard.jsx    # Employer dashboard
│   └── ProviderDashboard.jsx    # Service provider dashboard
├── services/            # API service files
├── utils/               # Utility functions
├── App.jsx              # Main app component
├── App.css              # App-level styles
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Key Components

### Pages
- **Landing.jsx** - Home page with hero, features, and CTAs
- **Login.jsx** - Login form for both user types
- **Register.jsx** - Registration with separate forms for employers and providers
- **Dashboard.jsx** - Routes to correct dashboard based on user type
- **EmployerDashboard.jsx** - Employer's main dashboard
- **ProviderDashboard.jsx** - Service provider's main dashboard

### Context
- **AuthContext.jsx** - Manages authentication state, login/logout, user data

### Common Components
- **Button.jsx** - Reusable button with variants (primary, secondary, danger, outline) and sizes
- **Card.jsx** - Reusable card container for content
- **Navbar.jsx** - Navigation bar that adapts based on auth state

## User Types

### Employer
- Company name, contact person, industry
- Can search for service providers
- Can book interviews
- Can view saved providers

### Service Provider
- Full name, category (rider/driver/operator)
- Needs to complete profile with documents
- Receives interview requests
- Can manage availability

## Features Implemented

✅ Landing page with responsive design
✅ Separate registration flows for employers and providers
✅ Login system with authentication context
✅ Dashboard routing based on user type
✅ Employer dashboard with stats and upcoming interviews
✅ Provider dashboard with profile completion tracking
✅ Responsive navigation bar
✅ Reusable component library

## Next Steps

### Profile Management
- [ ] Profile completion pages for providers
  - [ ] Upload ID and license
  - [ ] Upload profile photo
  - [ ] Add work experience
  - [ ] Add additional skills
  - [ ] Add certifications
  - [ ] Set location preferences

### For Employers
- [ ] Search/browse service providers
- [ ] Filter by category, location, skills
- [ ] View provider profiles
- [ ] Save favorite providers
- [ ] Request interviews

### Interview Booking System
- [ ] Interview request flow
- [ ] Office location selection
- [ ] Calendar/time slot selection
- [ ] Confirmation and notifications
- [ ] Interview management (reschedule, cancel)

### Additional Features
- [ ] Reviews and ratings
- [ ] Messaging system
- [ ] Document verification workflow
- [ ] Admin panel

## Technology Stack

- **React 19** - UI framework
- **React Router** - Client-side routing
- **Context API** - State management
- **CSS3** - Styling
- **Vite** - Build tool

## Running the Project

```bash
npm install
npm run dev
```

The app will be available at http://localhost:5174/

## Testing User Flows

### Register as Service Provider
1. Go to /register?type=provider
2. Fill in name, category, email, phone, password
3. Redirects to provider dashboard with profile completion tasks

### Register as Employer
1. Go to /register?type=employer
2. Fill in company name, contact person, industry, email, phone, password
3. Redirects to employer dashboard with stats and quick actions

### Login
1. Go to /login
2. Enter email and password
3. Redirects to appropriate dashboard based on user type
