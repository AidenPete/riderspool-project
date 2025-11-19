import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes - Both User Types */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Employer Routes */}
          <Route path="/employer/profile" element={<EmployerProfile />} />
          <Route path="/search" element={<SearchProviders />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/request-interview/:providerId" element={<InterviewRequest />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/saved" element={<SavedProviders />} />

          {/* Provider Routes */}
          <Route path="/provider/profile" element={<ProfileCompletion />} />
          <Route path="/interviews" element={<MyInterviews />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
