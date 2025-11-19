import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logout } from '../../features/auth/authSlice';
import './AdminLayout.css';

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/admin/login');
    }
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: '📊',
      label: 'Dashboard',
    },
    {
      path: '/admin/users',
      icon: '👥',
      label: 'User Management',
    },
    {
      path: '/admin/interviews',
      icon: '📅',
      label: 'Interviews',
    },
    {
      path: '/admin/verifications',
      icon: '✓',
      label: 'Verifications',
    },
    {
      path: '/admin/reports',
      icon: '📈',
      label: 'Reports',
    },
    {
      path: '/admin/settings',
      icon: '⚙️',
      label: 'Settings',
    },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span className="logo-icon">🛡️</span>
            {!sidebarCollapsed && <span className="logo-text">Riderspool Admin</span>}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="admin-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            {!sidebarCollapsed && (
              <div className="admin-user-details">
                <div className="admin-user-name">{user?.fullName || 'Administrator'}</div>
                <div className="admin-user-role">{user?.role || 'Super Admin'}</div>
              </div>
            )}
          </div>
          <button
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="logout-icon">🚪</span>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
