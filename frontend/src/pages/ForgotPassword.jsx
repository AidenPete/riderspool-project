import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './Auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      // POST /api/auth/forgot-password
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Password reset requested for:', email);
      setIsSubmitted(true);
// eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <Link to="/" className="auth-logo">Riderspool</Link>
            <h2>Check Your Email</h2>
            <p>Password reset instructions sent</p>
          </div>

          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Reset Link Sent!</h3>
            <p>
              We've sent password reset instructions to <strong>{email}</strong>.
              Please check your email and click the link to reset your password.
            </p>
            <p className="email-note">
              The link will expire in 1 hour. If you don't see the email, check your spam folder.
            </p>
          </div>

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

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <Link to="/" className="auth-logo">Riderspool</Link>
          <h2>Forgot Password?</h2>
          <p>Enter your email to reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className={error ? 'error' : ''}
              placeholder="you@example.com"
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <p className="reset-info">
            We'll send you a link to reset your password. The link will expire in 1 hour.
          </p>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
