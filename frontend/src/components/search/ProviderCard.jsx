import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import RequestInterviewModal from '../interview/RequestInterviewModal';
import './ProviderCard.css';

function ProviderCard({ provider }) {
  const [isSaved, setIsSaved] = useState(provider.isSaved || false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: API call to save/unsave provider
  };

  const handleRequestInterview = () => {
    setShowInterviewModal(true);
  };

  const handleInterviewSuccess = () => {
    // Refresh or update UI as needed
    console.log('Interview request sent successfully');
  };

  // Get display name (use registeredName or user's fullName)
  const displayName = provider.registeredName || provider.user?.fullName || 'Provider';
  const categoryDisplay = provider.category?.replace('-', ' ').split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Service Provider';

  return (
    <div className="provider-card">
      <div className="provider-header">
        <div className="provider-avatar">
          {provider.profilePhoto ? (
            <img src={provider.profilePhoto} alt={displayName} />
          ) : (
            <div className="avatar-placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="provider-info">
          <h3>{displayName}</h3>
          <p className="provider-category">{categoryDisplay}</p>
          <div className="provider-rating">
            <span className="stars">⭐ {provider.rating > 0 ? provider.rating : 'New'}</span>
            {provider.totalInterviews > 0 && (
              <span className="interviews">({provider.totalInterviews} interviews)</span>
            )}
          </div>
        </div>

        <button
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSave}
          title={isSaved ? 'Unsave' : 'Save'}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="provider-details">
        {provider.bio && (
          <p className="provider-bio">{provider.bio}</p>
        )}

        <div className="provider-stats">
          <div className="stat-item">
            <span className="stat-icon">💼</span>
            <span className="stat-text">{provider.experience} years experience</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✅</span>
            <span className="stat-text">{provider.availability ? 'Available' : 'Unavailable'}</span>
          </div>
        </div>

        {provider.skills && (
          <div className="provider-skills">
            {provider.skills.split(',').slice(0, 4).map((skill, index) => (
              <span key={index} className="skill-badge">{skill.trim()}</span>
            ))}
            {provider.skills.split(',').length > 4 && (
              <span className="skill-badge more">+{provider.skills.split(',').length - 4} more</span>
            )}
          </div>
        )}

        {provider.user?.isVerified && (
          <div className="verified-badge">
            ✓ Documents Verified
          </div>
        )}
      </div>

      <div className="provider-actions">
        <Link to={`/provider/${provider.id}`}>
          <Button variant="outline" size="small" fullWidth>
            View Profile
          </Button>
        </Link>
        <Button variant="primary" size="small" fullWidth onClick={handleRequestInterview}>
          Request Interview
        </Button>
      </div>

      {/* Interview Request Modal */}
      {showInterviewModal && (
        <RequestInterviewModal
          provider={provider}
          onClose={() => setShowInterviewModal(false)}
          onSuccess={handleInterviewSuccess}
        />
      )}
    </div>
  );
}

export default ProviderCard;
