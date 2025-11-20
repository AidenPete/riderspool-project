import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectLoading, selectError, clearError } from '../features/auth/authSlice';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'provider';

  const [formData, setFormData] = useState({
    userType: userType,
    // Common fields
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Employer fields
    companyName: '',
    contactPerson: '',
    industry: '',
    // Provider fields
    fullName: '',
    category: '',
    experience: '',
  });
  const [errors, setErrors] = useState({});
  const isLoading = useSelector(selectLoading);
  const apiError = useSelector(selectError);

  const industries = [
    'Construction',
    'NGO / Non-Profit',
    'Government',
    'Healthcare',
    'Logistics & Transportation',
    'Manufacturing',
    'Retail',
    'Agriculture',
    'Hospitality & Tourism',
    'Real Estate',
    'Technology',
    'Education',
    'Other',
  ];

  const providerCategories = [
    { value: 'motorbike-rider', label: 'Motorbike Rider' },
    { value: 'car-driver', label: 'Car Driver' },
    { value: 'truck-driver', label: 'Truck Driver' },
  ];

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

  const handleUserTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      userType: type,
      // Clear type-specific fields
      companyName: '',
      contactPerson: '',
      industry: '',
      fullName: '',
      category: '',
      experience: '',
    }));
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    // Employer-specific validation
    if (formData.userType === 'employer') {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }

      if (!formData.contactPerson.trim()) {
        newErrors.contactPerson = 'Contact person name is required';
      }

      if (!formData.industry) {
        newErrors.industry = 'Please select an industry';
      }
    }

    // Provider-specific validation
    if (formData.userType === 'provider') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData.category) {
        newErrors.category = 'Please select a category';
      }

      if (!formData.experience) {
        newErrors.experience = 'Years of experience is required';
      } else if (isNaN(formData.experience) || formData.experience < 0) {
        newErrors.experience = 'Please enter a valid number';
      }
    }

    // Common validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

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

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous API errors
    dispatch(clearError());

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Prepare the registration data according to the API spec
      const registrationData = {
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        userType: formData.userType,
        phone: formData.phone,
      };

      // Add employer-specific fields
      if (formData.userType === 'employer') {
        registrationData.fullName = formData.contactPerson; // Use contact person as full name
        registrationData.companyName = formData.companyName;
        registrationData.contactPerson = formData.contactPerson;
        registrationData.industry = formData.industry;
      }

      // Add provider-specific fields
      if (formData.userType === 'provider') {
        registrationData.fullName = formData.fullName;
        registrationData.category = formData.category;
        registrationData.experience = parseInt(formData.experience);
      }

      // Dispatch the registerUser async thunk
      await dispatch(registerUser(registrationData)).unwrap();

      // If successful, navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by Redux
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box register-box">
        <div className="auth-header">
          <Link to="/" className="auth-logo">Riderspool</Link>
          <h2>Create Account</h2>
          <p>Join Riderspool today</p>
        </div>

        <div className="user-type-selector">
          <button
            type="button"
            className={`type-btn ${formData.userType === 'provider' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('provider')}
          >
            Service Provider
          </button>
          <button
            type="button"
            className={`type-btn ${formData.userType === 'employer' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('employer')}
          >
            Employer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Employer Form */}
          {formData.userType === 'employer' && (
            <>
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={errors.companyName ? 'error' : ''}
                  placeholder="ABC Company Ltd"
                />
                {errors.companyName && <span className="error-message">{errors.companyName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contactPerson">Contact Person Name</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className={errors.contactPerson ? 'error' : ''}
                  placeholder="John Doe"
                />
                {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="industry">Industry Type</label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={errors.industry ? 'error' : ''}
                >
                  <option value="">Select industry...</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                {errors.industry && <span className="error-message">{errors.industry}</span>}
              </div>
            </>
          )}

          {/* Service Provider Form */}
          {formData.userType === 'provider' && (
            <>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder="John Doe"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Primary Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select category...</option>
                  {providerCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="experience">Years of Experience</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={errors.experience ? 'error' : ''}
                  placeholder="e.g., 3"
                  min="0"
                />
                {errors.experience && <span className="error-message">{errors.experience}</span>}
              </div>
            </>
          )}

          {/* Common Fields */}
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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="+254 712 345 678"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
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
              placeholder="At least 8 characters"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Info message about KYC */}
          <div className="info-message">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z" fill="#2563eb"/>
            </svg>
            <span>
              {formData.userType === 'provider'
                ? 'You can complete your full profile and upload documents (ID, license, photos) after registration.'
                : 'You can add more company details and upload verification documents after registration.'}
            </span>
          </div>

          <div className="terms">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>
                I agree to the <a href="#terms">Terms of Service</a> and{' '}
                <a href="#privacy">Privacy Policy</a>
              </span>
            </label>
          </div>

          {apiError && (
            <div className="error-message">
              {typeof apiError === 'string'
                ? apiError
                : apiError.detail || apiError.message || 'Registration failed. Please try again.'}
            </div>
          )}

          <button
            type="submit"
            className="btn-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
