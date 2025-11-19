import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsAuthenticated, logout } from '../../features/auth/authSlice';
import './Navbar.css';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/'); // Redirect to landing page
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Get user initials for avatar
  const getInitials = () => {
    // For employers, prioritize company name
    if (user?.userType === 'employer' && user?.companyName) {
      return user.companyName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    // For providers, use full name
    if (user?.fullName) {
      return user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    // Fallback to contact person
    if (user?.contactPerson) {
      return user.contactPerson.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    // Fallback to email
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Get display name
  const getDisplayName = () => {
    // For employers, prioritize company name
    if (user?.userType === 'employer' && user?.companyName) {
      return user.companyName;
    }
    // For providers, use full name
    if (user?.fullName) return user.fullName;
    // Fallbacks
    if (user?.contactPerson) return user.contactPerson;
    if (user?.companyName) return user.companyName;
    return 'User';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="nav-logo">
            Riderspool
          </Link>

          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                {user?.userType === 'employer' ? (
                  <Link to="/search" className="nav-link">Find Providers</Link>
                ) : (
                  <Link to="/interviews" className="nav-link">My Interviews</Link>
                )}

                {/* Profile Dropdown */}
                <div className="profile-dropdown" ref={dropdownRef}>
                  <button
                    className="profile-button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-label="Profile menu"
                  >
                    <div className="avatar">
                      {getInitials()}
                    </div>
                    <span className="profile-name">{getDisplayName()}</span>
                    <svg
                      className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <div className="dropdown-user-info">
                          <div className="avatar-large">
                            {getInitials()}
                          </div>
                          <div>
                            <div className="dropdown-name">{getDisplayName()}</div>
                            <div className="dropdown-email">{user?.email}</div>
                          </div>
                        </div>
                      </div>

                      <div className="dropdown-divider"></div>

                      <Link
                        to={user?.userType === 'employer' ? '/employer/profile' : '/provider/profile'}
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor"/>
                        </svg>
                        My Profile
                      </Link>

                      {user?.userType === 'provider' && (
                        <Link
                          to="/settings"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.5 8C13.5 8.17 13.49 8.34 13.47 8.51L15.07 9.74C15.21 9.85 15.25 10.05 15.16 10.21L13.66 12.79C13.57 12.95 13.38 13.01 13.21 12.95L11.31 12.18C10.97 12.43 10.6 12.64 10.19 12.81L9.89 14.89C9.87 15.07 9.71 15.2 9.52 15.2H6.52C6.33 15.2 6.17 15.07 6.15 14.89L5.85 12.81C5.44 12.64 5.07 12.43 4.73 12.18L2.83 12.95C2.66 13.01 2.47 12.95 2.38 12.79L0.88 10.21C0.79 10.05 0.83 9.85 0.97 9.74L2.57 8.51C2.55 8.34 2.54 8.17 2.54 8C2.54 7.83 2.55 7.66 2.57 7.49L0.97 6.26C0.83 6.15 0.79 5.95 0.88 5.79L2.38 3.21C2.47 3.05 2.66 2.99 2.83 3.05L4.73 3.82C5.07 3.57 5.44 3.36 5.85 3.19L6.15 1.11C6.17 0.93 6.33 0.8 6.52 0.8H9.52C9.71 0.8 9.87 0.93 9.89 1.11L10.19 3.19C10.6 3.36 10.97 3.57 11.31 3.82L13.21 3.05C13.38 2.99 13.57 3.05 13.66 3.21L15.16 5.79C15.25 5.95 15.21 6.15 15.07 6.26L13.47 7.49C13.49 7.66 13.5 7.83 13.5 8ZM8 5.5C6.62 5.5 5.5 6.62 5.5 8C5.5 9.38 6.62 10.5 8 10.5C9.38 10.5 10.5 9.38 10.5 8C10.5 6.62 9.38 5.5 8 5.5Z" fill="currentColor"/>
                          </svg>
                          Settings
                        </Link>
                      )}

                      {user?.userType === 'employer' && (
                        <Link
                          to="/bookings"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M12 2H11V0.5C11 0.22 10.78 0 10.5 0C10.22 0 10 0.22 10 0.5V2H6V0.5C6 0.22 5.78 0 5.5 0C5.22 0 5 0.22 5 0.5V2H4C2.89 2 2 2.89 2 4V14C2 15.11 2.89 16 4 16H12C13.11 16 14 15.11 14 14V4C14 2.89 13.11 2 12 2ZM12.5 14C12.5 14.28 12.28 14.5 12 14.5H4C3.72 14.5 3.5 14.28 3.5 14V6.5H12.5V14Z" fill="currentColor"/>
                          </svg>
                          My Bookings
                        </Link>
                      )}

                      <div className="dropdown-divider"></div>

                      <button
                        className="dropdown-item logout-item"
                        onClick={handleLogout}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M5 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H5M11 11L14 8M14 8L11 5M14 8H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-btn">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
