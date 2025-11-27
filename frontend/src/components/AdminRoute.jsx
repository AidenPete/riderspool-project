import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../features/auth/authSlice';

function AdminRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Allow access for admin userType OR superusers/staff
  const isAdmin = user?.userType === 'admin' || user?.is_superuser || user?.is_staff;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
