import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import EmployerProfile from './pages/EmployerProfile';
import ProfileCompletion from './pages/ProfileCompletion';
import SearchProviders from './pages/SearchProviders';
import ProviderProfile from './pages/ProviderProfile';
import InterviewRequest from './pages/InterviewRequest';
import MyBookings from './pages/MyBookings';
import MyInterviews from './pages/MyInterviews';
import SavedProviders from './pages/SavedProviders';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import EmployerRoute from './components/EmployerRoute';
import ProviderRoute from './components/ProviderRoute';
import AdminRoute from './components/AdminRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import InterviewManagement from './pages/admin/InterviewManagement';
import VerificationManagement from './pages/admin/VerificationManagement';

function App() {
  return (
    <Router>
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes - Both User Types */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Employer Routes */}
          <Route
            path="/employer/profile"
            element={
              <EmployerRoute>
                <EmployerProfile />
              </EmployerRoute>
            }
          />
          <Route
            path="/search"
            element={
              <EmployerRoute>
                <SearchProviders />
              </EmployerRoute>
            }
          />
          <Route
            path="/provider/:id"
            element={
              <EmployerRoute>
                <ProviderProfile />
              </EmployerRoute>
            }
          />
          <Route
            path="/request-interview/:providerId"
            element={
              <EmployerRoute>
                <InterviewRequest />
              </EmployerRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <EmployerRoute>
                <MyBookings />
              </EmployerRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <EmployerRoute>
                <SavedProviders />
              </EmployerRoute>
            }
          />

          {/* Provider Routes */}
          <Route
            path="/provider/profile"
            element={
              <ProviderRoute>
                <ProfileCompletion />
              </ProviderRoute>
            }
          />
          <Route
            path="/interviews"
            element={
              <ProviderRoute>
                <MyInterviews />
              </ProviderRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProviderRoute>
                <Settings />
              </ProviderRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/interviews"
            element={
              <AdminRoute>
                <InterviewManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/verifications"
            element={
              <AdminRoute>
                <VerificationManagement />
              </AdminRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
  );
}

export default App;
