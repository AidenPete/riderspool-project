import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import './Auth.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Validate token exists
    if (!token) {
      setTokenValid(false);
    } else {
      // TODO: Verify token with backend
      // GET /api/auth/verify-reset-token?token=xyz
      setTokenValid(true);
    }
  }, [token]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: Replace with actual API call
      // POST /api/auth/reset-password
      // Body: { token, password }
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Password reset successfully with token:', token);
      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
// eslint-disable-next-line no-unused-vars
    } catch (err) {
      setErrors({ general: 'Failed to reset password. The link may have expired.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Invalid or missing token
  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <Link to="/" className="auth-logo">Riderspool</Link>
            <h2>Invalid Reset Link</h2>
            <p>This password reset link is invalid or has expired</p>
          </div>

          <div className="error-state">
            <div className="error-icon">✕</div>
            <h3>Link Not Valid</h3>
            <p>
              This password reset link is invalid, has expired, or has already been used.
              Please request a new password reset link.
            </p>
          </div>

          <div className="auth-footer">
            <p>
              <Link to="/forgot-password">Request New Reset Link</Link>
            </p>
            <p>
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <Link to="/" className="auth-logo">Riderspool</Link>
            <h2>Password Reset Successful</h2>
            <p>Your password has been updated</p>
          </div>

          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>All Set!</h3>
            <p>
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <p className="redirect-note">
              Redirecting to login page in 3 seconds...
            </p>
          </div>

          <div className="auth-footer">
            <p>
              <Link to="/login">Go to Login Now</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <Link to="/" className="auth-logo">Riderspool</Link>
          <h2>Reset Password</h2>
          <p>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-banner">{errors.general}</div>
          )}

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter new password"
              autoFocus
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <small className="field-hint">Must be at least 8 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Remembered your password?{' '}
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
