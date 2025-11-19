import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userType, setUserType] = useState('provider');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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

    // TODO: Replace with actual API call
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists in localStorage from previous registration
      let userData = null;
      const storedUser = localStorage.getItem('riderspool_user');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // If stored user matches email and userType, use their data
        if (parsedUser.email === formData.email && parsedUser.userType === userType) {
          userData = parsedUser;
        }
      }

      // If no stored user found, use mock data for testing
      if (!userData) {
        userData = userType === 'employer'
          ? {
              email: formData.email,
              userType: 'employer',
              companyName: 'ABC Construction Ltd',
              contactPerson: 'John Doe',
              industry: 'Construction',
            }
          : {
              email: formData.email,
              userType: 'provider',
              fullName: 'John Kamau',
              category: 'Motorbike Rider',
            };
      }

      dispatch(login(userData));
      navigate('/dashboard');

    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <Link to="/" className="auth-logo">Riderspool</Link>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        {/* User Type Selector */}
        <div className="user-type-selector">
          <button
            type="button"
            className={`type-btn ${userType === 'employer' ? 'active' : ''}`}
            onClick={() => setUserType('employer')}
          >
            I'm an Employer
          </button>
          <button
            type="button"
            className={`type-btn ${userType === 'provider' ? 'active' : ''}`}
            onClick={() => setUserType('provider')}
          >
            I'm a Service Provider
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="you@example.com"
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
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
          </div>

          {errors.submit && <div className="error-message">{errors.submit}</div>}

          <button
            type="submit"
            className="btn-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
