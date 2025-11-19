import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EmployerRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.userType !== 'employer') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default EmployerRoute;
