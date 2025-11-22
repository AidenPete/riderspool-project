import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { providersAPI } from '../api';
import { getMediaUrl } from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './ProviderProfile.css';

function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isSaved, setIsSaved] = useState(false);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasHired, setHasHired] = useState(false);
  const [checkingHireStatus, setCheckingHireStatus] = useState(false);

  // Fetch provider data
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await providersAPI.getProvider(id);
        setProvider(data);
      } catch (err) {
        console.error('Error fetching provider:', err);
        setError('Failed to load provider profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  // Check if employer has hired this provider
  useEffect(() => {
    const checkHireStatus = async () => {
      // Only check if user is an employer
      if (user && user.userType === 'employer' && id) {
        try {
          setCheckingHireStatus(true);
          const response = await providersAPI.checkHasHired(id);
          setHasHired(response.hasHired);
        } catch (err) {
          console.error('Error checking hire status:', err);
          setHasHired(false);
        } finally {
          setCheckingHireStatus(false);
        }
      }
    };

    if (!loading && provider) {
      checkHireStatus();
    }
  }, [user, id, loading, provider]);

  if (loading) {
    return (
      <div className="provider-profile-page">
        <Navbar />
        <div className="provider-profile-container">
          <div className="loading-message">Loading provider profile...</div>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="provider-profile-page">
        <Navbar />
        <div className="provider-profile-container">
          <div className="error-message">{error || 'Provider not found'}</div>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  // Prepare skills array from comma-separated string
  const skillsArray = provider.skills ? provider.skills.split(',').map(s => s.trim()) : [];

  // Map category to display name
  const categoryDisplayName = {
    'motorbike-rider': 'Motorbike Rider',
    'car-driver': 'Car Driver',
    'truck-driver': 'Truck Driver',
  }[provider.category] || provider.category;

  const handleSave = async () => {
    try {
      if (isSaved) {
        await providersAPI.unsaveProvider(id);
        setIsSaved(false);
      } else {
        await providersAPI.saveProvider(id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving provider:', error);
      alert('Failed to save provider. Please try again.');
    }
  };

  const handleRequestInterview = () => {
    navigate(`/request-interview/${id}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="provider-profile-page">
      <Navbar />

      <div className="provider-profile-container">
        {/* Back Button */}
        <div className="profile-back-button">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>

        {/* Header Section */}
        <div className="profile-header-section">
          <div className="profile-header-content">
            <div className="profile-avatar-large">
              {provider.profilePhoto ? (
                <img src={getMediaUrl(provider.profilePhoto)} alt={provider.user?.fullName || provider.registeredName} />
              ) : (
                <div className="avatar-placeholder-large">
                  {(provider.user?.fullName || provider.registeredName || 'P').charAt(0).toUpperCase()}
                </div>
              )}
              {provider.user?.isVerified && (
                <div className="verified-badge-overlay">
                  <span className="verified-icon">✓</span>
                </div>
              )}
            </div>

            <div className="profile-header-info">
              <div className="profile-name-section">
                <h1>{provider.user?.fullName || provider.registeredName}</h1>
                {provider.user?.isVerified && (
                  <span className="verified-label">Verified</span>
                )}
              </div>

              <p className="profile-category">{categoryDisplayName}</p>

              <div className="profile-rating-section">
                <div className="rating-stars">
                  {renderStars(Math.round(provider.rating || 0))}
                  <span className="rating-number">{provider.rating || 0}</span>
                </div>
                <span className="rating-reviews">
                  ({provider.totalInterviews || 0} interviews)
                </span>
              </div>

              <div className="profile-quick-stats">
                <div className="quick-stat">
                  <span className="stat-icon">💼</span>
                  <span>{provider.experience} years experience</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-icon">
                    {provider.category === 'motorbike-rider' ? '🏍️' :
                     provider.category === 'car-driver' ? '🚗' : '🚚'}
                  </span>
                  <span>{categoryDisplayName}</span>
                </div>
                {provider.availability && (
                  <div className="quick-stat">
                    <span className="stat-icon">✅</span>
                    <span>Available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <Button
              variant={isSaved ? 'secondary' : 'outline'}
              onClick={handleSave}
            >
              {isSaved ? '❤️ Saved' : '🤍 Save'}
            </Button>
            <Button variant="primary" onClick={handleRequestInterview}>
              Request Interview
            </Button>
          </div>
        </div>

        <div className="profile-content-grid">
          {/* Left Column */}
          <div className="profile-main-content">
            {/* About Section */}
            <Card title="About">
              <p className="profile-bio">{provider.bio}</p>
            </Card>

            {/* Skills */}
            {skillsArray.length > 0 && (
              <Card title="Skills">
                <div className="skills-grid">
                  {skillsArray.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <span className="skill-icon">✓</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="profile-sidebar">
            {/* Verification Status */}
            <Card title="Verification Status">
              <div className="verification-list">
                <div className="verification-item">
                  <span className={provider.idDocument ? 'verified' : 'pending'}>
                    {provider.idDocument ? '✓' : '○'}
                  </span>
                  <span>National ID</span>
                </div>
                <div className="verification-item">
                  <span className={provider.licenseDocument ? 'verified' : 'pending'}>
                    {provider.licenseDocument ? '✓' : '○'}
                  </span>
                  <span>Driver's License</span>
                </div>
                <div className="verification-item">
                  <span className={provider.profilePhoto ? 'verified' : 'pending'}>
                    {provider.profilePhoto ? '✓' : '○'}
                  </span>
                  <span>Profile Photo</span>
                </div>
              </div>
            </Card>

            {/* Additional Info */}
            <Card title="Additional Information">
              <div className={`info-list ${user?.userType === 'employer' && !hasHired ? 'blurred-content' : ''}`}>
                <div className="info-item">
                  <span className="info-label">Registered Name:</span>
                  <span className="info-value">{provider.registeredName || provider.user?.fullName || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">ID Number:</span>
                  <span className="info-value">{provider.idNumber || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">License Number:</span>
                  <span className="info-value">{provider.licenseNumber || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Availability:</span>
                  <span className="info-value">
                    <span className={`availability-indicator ${provider.availability ? 'available' : 'unavailable'}`}>
                      {provider.availability ? '✓ Available' : '✗ Unavailable'}
                    </span>
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Willing to Relocate:</span>
                  <span className="info-value">{provider.willingToRelocate ? 'Yes' : 'No'}</span>
                </div>
                {provider.preferredLocations && (
                  <div className="info-item">
                    <span className="info-label">Preferred Locations:</span>
                    <span className="info-value">{provider.preferredLocations}</span>
                  </div>
                )}
              </div>
              {user?.userType === 'employer' && !hasHired && (
                <div className="privacy-notice">
                  <p>🔒 Sensitive information is hidden. You can view this after hiring the provider.</p>
                </div>
              )}
            </Card>

            {/* CTA Card */}
            <Card className="cta-card">
              <h3>Ready to hire?</h3>
              <p>Schedule an interview at our Riderspool office</p>
              <Button variant="primary" fullWidth onClick={handleRequestInterview}>
                Request Interview
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ProviderProfile;
