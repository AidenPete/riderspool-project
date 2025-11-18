import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import EmployerDashboard from './EmployerDashboard';
import ProviderDashboard from './ProviderDashboard';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.userType === 'employer') {
    return <EmployerDashboard />;
  }

  if (user?.userType === 'provider') {
    return <ProviderDashboard />;
  }

  return <Navigate to="/" replace />;
}

export default Dashboard;
