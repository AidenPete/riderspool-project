import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileCompletion from './pages/ProfileCompletion';
import SearchProviders from './pages/SearchProviders';
import ProviderProfile from './pages/ProviderProfile';
import InterviewRequest from './pages/InterviewRequest';
import MyBookings from './pages/MyBookings';
import MyInterviews from './pages/MyInterviews';
import SavedProviders from './pages/SavedProviders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Both User Types */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Employer Routes */}
          <Route path="/search" element={<SearchProviders />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/request-interview/:providerId" element={<InterviewRequest />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/saved" element={<SavedProviders />} />

          {/* Provider Routes */}
          <Route path="/profile" element={<ProfileCompletion />} />
          <Route path="/interviews" element={<MyInterviews />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
