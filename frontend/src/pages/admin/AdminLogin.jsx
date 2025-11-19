import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import './AdminLogin.css';

function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock admin credentials (in production, validate against backend)
      if (formData.email === 'admin@riderspool.com' && formData.password === 'admin123') {
        const adminData = {
          id: 'admin-1',
          email: formData.email,
          userType: 'admin',
          fullName: 'Riderspool Administrator',
          role: 'super_admin',
        };

        // Save to localStorage
        localStorage.setItem('riderspool_user', JSON.stringify(adminData));

        // Dispatch to Redux
        dispatch(login(adminData));

        // Navigate to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setErrors({ submit: 'Invalid credentials. Please contact system administrator.' });
      }
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <div className="admin-shield-icon">🛡️</div>
            <h1>Riderspool Admin</h1>
            <p>System Administrator Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@riderspool.com"
                className={errors.email ? 'error' : ''}
                autoComplete="email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
                autoComplete="current-password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {errors.submit && (
              <div className="error-banner">{errors.submit}</div>
            )}

            <button
              type="submit"
              className="btn-admin-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="admin-login-demo">
              <p>Demo Credentials:</p>
              <p><strong>Email:</strong> admin@riderspool.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </form>
        </div>

        <div className="admin-login-footer">
          <p>&copy; 2025 Riderspool. Administrator Access Only.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
