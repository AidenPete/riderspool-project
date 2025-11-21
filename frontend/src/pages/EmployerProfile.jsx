import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { employersAPI, authAPI } from '../api';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FileUpload from '../components/common/FileUpload';
import './ProfileCompletion.css';

function EmployerProfile() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Company Details
    companyName: '',
    industry: '',
    contactPerson: '',
    phone: '',
    website: '',
    companySize: '',
    description: '',

    // Registration
    registrationNumber: '',
    registrationCertificate: null,

    // Physical Location
    officeAddress: '',
    region: '',
    city: '',
    postalCode: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const industries = [
    'Construction',
    'NGO / Non-Profit',
    'Government',
    'Logistics & Transportation',
    'Agriculture',
    'Mining',
    'Manufacturing',
    'Hospitality & Tourism',
    'Real Estate',
    'Healthcare',
    'Education',
    'Technology',
    'Other',
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees',
  ];

  const regions = [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
    'Malindi',
    'Kitale',
    'Garissa',
    'Kakamega',
  ];

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await employersAPI.getMyProfile();
        setProfileData(data);

        // Pre-fill form with existing data
        setFormData({
          companyName: data.companyName || '',
          industry: data.industry || '',
          contactPerson: data.contactPerson || '',
          phone: data.phone || '',
          website: data.website || '',
          companySize: data.companySize || '',
          description: data.description || '',
          registrationNumber: data.registrationNumber || '',
          registrationCertificate: null,
          officeAddress: data.officeAddress || '',
          region: data.region || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
        });

        // Check if profile is complete - if yes, show view mode
        const isComplete = isProfileComplete(data);
        setIsEditMode(!isComplete);
      } catch (error) {
        console.log('No profile found, creating new profile');
        // New profile, start in edit mode with defaults from user
        setFormData(prev => ({
          ...prev,
          companyName: user?.companyName || '',
          industry: user?.industry || '',
          contactPerson: user?.contactPerson || user?.fullName || '',
          phone: user?.phone || '',
        }));
        setIsEditMode(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Check if profile is complete
  const isProfileComplete = (data) => {
    return !!(
      data?.companyName &&
      data?.industry &&
      data?.contactPerson &&
      data?.phone &&
      data?.registrationNumber &&
      data?.officeAddress &&
      data?.region &&
      data?.city
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (name, file) => {
    setFormData(prev => ({ ...prev, [name]: file }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setPasswordChanging(true);

    try {
      await authAPI.changePassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password2: passwordData.confirmPassword,
      });

      alert('Password changed successfully!');

      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordSection(false);
    } catch (error) {
      console.error('Password change error:', error);
      const errorMessage = error.response?.data?.old_password ||
                          error.response?.data?.new_password ||
                          error.response?.data?.message ||
                          'Failed to change password. Please try again.';
      alert(errorMessage);
    } finally {
      setPasswordChanging(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
    if (!formData.officeAddress) newErrors.officeAddress = 'Office address is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.city) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Create FormData for file uploads
      const dataToSend = new FormData();

      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'registrationCertificate' && formData[key]) {
          dataToSend.append(key, formData[key]);
        }
      });

      // Add file if provided
      if (formData.registrationCertificate) {
        dataToSend.append('registrationCertificate', formData.registrationCertificate);
      }

      const result = await employersAPI.updateMyProfile(dataToSend);

      // Update profile data with server response
      setProfileData(result);

      // Clear file selection
      setFormData(prev => ({
        ...prev,
        registrationCertificate: null,
      }));

      alert('Profile updated successfully!');

      // Check if profile is now complete, if so switch to view mode
      if (isProfileComplete(result)) {
        setIsEditMode(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update profile. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-page">
          <div className="profile-container">
            <div className="loading-message">Loading profile...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>{isEditMode ? 'Company Profile' : 'My Company Profile'}</h1>
            <p>{isEditMode ? 'Complete your company information to start hiring service providers' : 'View and manage your company information'}</p>

            {!isEditMode && (
              <div className="profile-actions-header">
                <Button variant="primary" onClick={() => setIsEditMode(true)}>
                  Edit Profile
                </Button>
              </div>
            )}
          </div>

          {isEditMode ? (
            <form onSubmit={handleSubmit} className="profile-form">
              {/* Company Details Section */}
              <Card title="Company Details">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="companyName">
                      Company Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={errors.companyName ? 'error' : ''}
                      placeholder="ABC Construction Ltd"
                    />
                    {errors.companyName && <span className="error-message">{errors.companyName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="industry">
                      Industry <span className="required">*</span>
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className={errors.industry ? 'error' : ''}
                    >
                      <option value="">Select industry</option>
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                    {errors.industry && <span className="error-message">{errors.industry}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactPerson">
                      Contact Person <span className="required">*</span>
                    </label>
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
                    <label htmlFor="companySize">Company Size</label>
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                    >
                      <option value="">Select company size</option>
                      {companySizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="+254 700 000000"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="website">Company Website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.company.com"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="description">Company Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Brief description of your company and what you do..."
                    />
                  </div>
                </div>
              </Card>

              {/* Business Registration Section */}
              <Card title="Business Registration">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="registrationNumber">
                      Business Registration Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className={errors.registrationNumber ? 'error' : ''}
                      placeholder="PVT-XXXXXXXXX"
                    />
                    {errors.registrationNumber && <span className="error-message">{errors.registrationNumber}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Business Registration Certificate</label>
                    <FileUpload
                      label="Upload Certificate"
                      accept="image/*,application/pdf"
                      onChange={(file) => handleFileChange('registrationCertificate', file)}
                    />
                    {profileData?.registrationCertificate && (
                      <div className="upload-status success">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Certificate uploaded</span>
                      </div>
                    )}
                    <small className="field-hint">
                      Upload a clear copy of your business registration certificate (PDF or Image)
                    </small>
                  </div>
                </div>
              </Card>

              {/* Physical Location Section */}
              <Card title="Office Location">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="officeAddress">
                      Office Address <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="officeAddress"
                      name="officeAddress"
                      value={formData.officeAddress}
                      onChange={handleChange}
                      className={errors.officeAddress ? 'error' : ''}
                      placeholder="Building name, street, floor, etc."
                    />
                    {errors.officeAddress && <span className="error-message">{errors.officeAddress}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="region">
                      Region <span className="required">*</span>
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={errors.region ? 'error' : ''}
                    >
                      <option value="">Select region</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                    {errors.region && <span className="error-message">{errors.region}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">
                      City <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="Enter city"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="00100"
                    />
                  </div>
                </div>
              </Card>

              {/* Form Actions */}
              <div className="form-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          ) : (
            /* View Mode - Display Profile */
            <div className="profile-view-mode">
              {/* Account Information Card */}
              <Card title="Account Information">
                <div className="profile-info-grid">
                  <div className="info-item">
                    <label>Email Address</label>
                    <div className="info-value">{user?.email || 'Not available'}</div>
                    <small className="field-hint">This email cannot be changed</small>
                  </div>
                </div>
              </Card>

              {/* Company Details Card */}
              <Card title="Company Details">
                <div className="profile-info-grid">
                  <div className="info-item">
                    <label>Company Name</label>
                    <div className="info-value">{profileData?.companyName || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label>Industry</label>
                    <div className="info-value">{profileData?.industry || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label>Contact Person</label>
                    <div className="info-value">{profileData?.contactPerson || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label>Company Size</label>
                    <div className="info-value">{profileData?.companySize || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label>Phone Number</label>
                    <div className="info-value">{profileData?.phone || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label>Website</label>
                    <div className="info-value">
                      {profileData?.website ? (
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="link">
                          {profileData.website}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  </div>
                </div>
                {profileData?.description && (
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                      Company Description
                    </label>
                    <div className="bio-text">{profileData.description}</div>
                  </div>
                )}
                <div className="card-actions">
                  <Button variant="outline" size="small" onClick={() => setIsEditMode(true)}>
                    Edit Company Details
                  </Button>
                </div>
              </Card>

              {/* Business Registration Card */}
              <Card title="Business Registration">
                <div className="profile-info-grid">
                  <div className="info-item">
                    <label>Registration Number</label>
                    <div className="info-value">{profileData?.registrationNumber || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label>Registration Certificate</label>
                    <div className="doc-status">
                      {profileData?.registrationCertificate ? (
                        <span className="status-badge verified">✓ Uploaded</span>
                      ) : (
                        <span className="status-badge pending">Not uploaded</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-actions">
                  <Button variant="outline" size="small" onClick={() => setIsEditMode(true)}>
                    Edit Registration
                  </Button>
                </div>
              </Card>

              {/* Office Location Card */}
              <Card title="Office Location">
                <div className="profile-info-grid">
                  <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                    <label>Office Address</label>
                    <div className="info-value">{profileData?.officeAddress || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label>Region</label>
                    <div className="info-value">{profileData?.region || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label>City</label>
                    <div className="info-value">{profileData?.city || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label>Postal Code</label>
                    <div className="info-value">{profileData?.postalCode || 'Not provided'}</div>
                  </div>
                </div>
                <div className="card-actions">
                  <Button variant="outline" size="small" onClick={() => setIsEditMode(true)}>
                    Edit Location
                  </Button>
                </div>
              </Card>

              {/* Change Password Card */}
              <Card title="Security">
                {!showPasswordSection ? (
                  <div>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                      Keep your account secure by regularly updating your password.
                    </p>
                    <Button variant="outline" size="small" onClick={() => setShowPasswordSection(true)}>
                      Change Password
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label htmlFor="currentPassword">
                          Current Password <span className="required">*</span>
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={passwordErrors.currentPassword ? 'error' : ''}
                          placeholder="Enter your current password"
                        />
                        {passwordErrors.currentPassword && (
                          <span className="error-message">{passwordErrors.currentPassword}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="newPassword">
                          New Password <span className="required">*</span>
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={passwordErrors.newPassword ? 'error' : ''}
                          placeholder="Enter new password"
                        />
                        {passwordErrors.newPassword && (
                          <span className="error-message">{passwordErrors.newPassword}</span>
                        )}
                        <small className="field-hint">Must be at least 8 characters</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmPassword">
                          Confirm New Password <span className="required">*</span>
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={passwordErrors.confirmPassword ? 'error' : ''}
                          placeholder="Confirm new password"
                        />
                        {passwordErrors.confirmPassword && (
                          <span className="error-message">{passwordErrors.confirmPassword}</span>
                        )}
                      </div>
                    </div>

                    <div className="card-actions">
                      <Button
                        type="button"
                        variant="outline"
                        size="small"
                        onClick={() => {
                          setShowPasswordSection(false);
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                          });
                          setPasswordErrors({});
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="small"
                        disabled={passwordChanging}
                      >
                        {passwordChanging ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </form>
                )}
              </Card>

              {/* Action Buttons */}
              <div className="profile-view-actions">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
                <Button variant="primary" onClick={() => setIsEditMode(true)}>
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EmployerProfile;
