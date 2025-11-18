# Riderspool - Complete Frontend User Flows

## Pages Completed ✅
1. Landing Page - `/`
2. Login - `/login`
3. Register - `/register` (separate forms for employer & provider)
4. Employer Dashboard - `/dashboard`
5. Provider Dashboard - `/dashboard`
6. Provider Profile Completion - `/profile`
7. Search Providers - `/search`

---

## Pages Needed ⚠️

### For Both User Types
- [ ] **Settings/Preferences** - `/settings`
- [ ] **Notifications** - `/notifications`

### For Employers
- [ ] **Provider Profile View** - `/provider/:id`
- [ ] **Interview Request Form** - `/request-interview/:providerId`
- [ ] **My Bookings** - `/bookings`
- [ ] **Saved Providers** - `/saved`
- [ ] **Employer Company Profile** - `/employer/profile`

### For Service Providers
- [ ] **My Interviews** - `/interviews` (incoming requests)
- [ ] **Interview Details** - `/interview/:id`
- [ ] **Public Profile Preview** - `/my-profile-preview`

---

## User Flows

### 🏢 Employer Flow

#### 1. Registration & Onboarding
```
/register?type=employer
  ↓
Fill: Company name, Contact person, Industry, Email, Phone, Password
  ↓
/dashboard (Employer)
  ↓
See: Stats, Upcoming interviews, Quick actions
```

#### 2. Finding & Hiring a Provider
```
/dashboard
  ↓
Click "Find Service Providers"
  ↓
/search
  ↓
Apply filters (category, location, experience, verified)
  ↓
Browse provider cards
  ↓
Click "View Profile" on a provider
  ↓
/provider/:id (Full profile details)
  ↓
Click "Request Interview"
  ↓
/request-interview/:providerId
  ↓
Select: Date, Time, Office location, Add notes
  ↓
Submit request
  ↓
Confirmation → Redirects to /bookings
```

#### 3. Managing Bookings
```
/dashboard or /bookings
  ↓
View all interview bookings
  ↓
Filter: Upcoming, Completed, Cancelled
  ↓
Click on booking
  ↓
See details: Provider info, Date/time, Office, Status
  ↓
Actions: Reschedule, Cancel, Add notes, Mark as completed
  ↓
After interview: Leave review/rating
```

#### 4. Saved Providers
```
/search
  ↓
Click ❤️ on provider card
  ↓
Provider added to saved list
  ↓
/saved
  ↓
View all saved providers
  ↓
Quick access to request interview or view profile
```

---

### 🏍️ Service Provider Flow

#### 1. Registration & Onboarding
```
/register?type=provider
  ↓
Fill: Full name, Category, Email, Phone, Password
  ↓
/dashboard (Provider)
  ↓
See: Profile completion alert (45% complete), Stats, Tasks
  ↓
Click "Complete Profile"
  ↓
/profile
  ↓
Upload: Profile photo, ID, License
  ↓
Fill: Personal info, Professional details, Skills
  ↓
Save & Complete
  ↓
/dashboard (Now 100% complete, visible to employers)
```

#### 2. Managing Interview Requests
```
/dashboard
  ↓
See "Upcoming Interviews" section
  ↓
Click "My Interviews" or /interviews
  ↓
View all interview requests
  ↓
Filter: Pending, Confirmed, Completed, Declined
  ↓
Click on a request
  ↓
/interview/:id
  ↓
See: Employer details, Company, Industry, Date/time, Office location
  ↓
Actions: Accept, Decline, Request Reschedule
  ↓
After accepting: Interview is confirmed
  ↓
After interview: See employer's review
```

#### 3. Profile Management
```
/dashboard
  ↓
Click "Complete Profile" or "Profile" in nav
  ↓
/profile
  ↓
Edit any section: Documents, Personal, Professional, Skills
  ↓
Add work experience, certifications
  ↓
Preview how employers see your profile
  ↓
/my-profile-preview
  ↓
See public view of profile
  ↓
Make adjustments if needed
```

---

## Priority Order for Building

### High Priority (Core Flow) 🔴
1. **Provider Profile View** - `/provider/:id` ✅ NEXT
2. **Interview Request Form** - `/request-interview/:providerId` ✅ NEXT
3. **My Interviews (Provider)** - `/interviews` ✅ NEXT
4. **My Bookings (Employer)** - `/bookings` ✅ NEXT

### Medium Priority (Essential Features) 🟡
5. **Saved Providers** - `/saved`
6. **Interview Details** - `/interview/:id`
7. **Settings** - `/settings`

### Low Priority (Nice to Have) 🟢
8. **Notifications** - `/notifications`
9. **Public Profile Preview** - `/my-profile-preview`
10. **Employer Company Profile** - `/employer/profile`

---

## Additional Components Needed

### Reusable Components
- [ ] **Modal/Dialog** - For confirmations, interview requests
- [ ] **DatePicker** - For scheduling interviews
- [ ] **Rating Stars** - For reviews
- [ ] **Status Badge** - For booking/interview statuses
- [ ] **Empty State** - For no data scenarios
- [ ] **Loading Spinner** - For async operations
- [ ] **Toast Notifications** - For success/error messages

### Specific Components
- [ ] **Interview Request Form** - Booking form
- [ ] **Booking Card** - Display booking info
- [ ] **Interview Request Card** - For providers
- [ ] **Review Form** - Rate and review after interview
- [ ] **Timeline Component** - Show interview history

---

## Routes Summary

### Public Routes
- `/` - Landing
- `/login` - Login
- `/register` - Register

### Protected Routes (Any authenticated user)
- `/dashboard` - Dashboard (routes to employer or provider dashboard)
- `/settings` - Settings
- `/notifications` - Notifications

### Employer Only Routes
- `/search` - Search providers
- `/provider/:id` - View provider profile
- `/request-interview/:providerId` - Request interview
- `/bookings` - My bookings
- `/saved` - Saved providers
- `/employer/profile` - Edit company profile

### Provider Only Routes
- `/profile` - Complete/edit profile
- `/interviews` - My interviews
- `/interview/:id` - Interview details
- `/my-profile-preview` - Preview public profile

---

## Next Steps

1. Build **Provider Profile View** page
2. Build **Interview Request** form/page
3. Build **My Bookings** page (Employer)
4. Build **My Interviews** page (Provider)
5. Test complete user journeys
6. Add route guards (redirect based on user type)
7. Add 404 page
8. Final polish and UX improvements

Once all these are done, we'll have a complete frontend ready for backend integration!
