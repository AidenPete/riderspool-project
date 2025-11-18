import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import './ProviderCard.css';

function ProviderCard({ provider }) {
  const [isSaved, setIsSaved] = useState(provider.isSaved || false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: API call to save/unsave provider
  };

  const handleRequestInterview = () => {
    // TODO: Navigate to interview request page
    alert('Interview request feature coming soon!');
  };

  return (
    <div className="provider-card">
      <div className="provider-header">
        <div className="provider-avatar">
          {provider.profilePhoto ? (
            <img src={provider.profilePhoto} alt={provider.fullName} />
          ) : (
            <div className="avatar-placeholder">
              {provider.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="provider-info">
          <h3>{provider.fullName}</h3>
          <p className="provider-category">{provider.category}</p>
          <div className="provider-rating">
            <span className="stars">⭐ {provider.rating || 'New'}</span>
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
            <span className="stat-icon">📍</span>
            <span className="stat-text">{provider.location}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💼</span>
            <span className="stat-text">{provider.experience} experience</span>
          </div>
          {provider.vehicleType && (
            <div className="stat-item">
              <span className="stat-icon">🚗</span>
              <span className="stat-text">{provider.vehicleType}</span>
            </div>
          )}
        </div>

        {provider.skills && provider.skills.length > 0 && (
          <div className="provider-skills">
            {provider.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="skill-badge">{skill}</span>
            ))}
            {provider.skills.length > 4 && (
              <span className="skill-badge more">+{provider.skills.length - 4} more</span>
            )}
          </div>
        )}

        {provider.verified && (
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
    </div>
  );
}

export default ProviderCard;
