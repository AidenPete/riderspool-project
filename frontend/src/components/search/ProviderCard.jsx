import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { savedProvidersAPI } from '../../api';
import { getMediaUrl } from '../../api/axios';
import Button from '../common/Button';
import { toast } from '../../utils/toast';
import './ProviderCard.css';

function ProviderCard({ provider }) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(provider.isSaved || false);
  const [savedId, setSavedId] = useState(provider.savedId || null);

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= roundedRating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking save button
    e.stopPropagation();
    try {
      if (isSaved && savedId) {
        // Unsave the provider
        await savedProvidersAPI.removeSavedProvider(savedId);
        setIsSaved(false);
        setSavedId(null);
        toast.info('Provider removed from saved list');
      } else {
        // Save the provider
        const result = await savedProvidersAPI.saveProvider(provider.user?.id || provider.id);
        setIsSaved(true);
        setSavedId(result.id);
        toast.success('Provider saved successfully!');
      }
    } catch (error) {
      console.error('Error saving/unsaving provider:', error);
      toast.error('Failed to update saved status. Please try again.');
    }
  };

  const handleCardClick = () => {
    navigate(`/provider/${provider.id}`);
  };

  // Get display name (use registeredName or user's fullName)
  const displayName = provider.registeredName || provider.user?.fullName || 'Provider';
  const categoryDisplay = provider.category?.replace('-', ' ').split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Service Provider';

  return (
    <div className="provider-card" onClick={handleCardClick}>
      <div className="provider-header">
        <div className="provider-avatar">
          {provider.profilePhoto ? (
            <img src={getMediaUrl(provider.profilePhoto)} alt={displayName} />
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
            <div className="stars-display">
              {renderStars(provider.rating)}
              <span className="rating-number">
                {provider.rating > 0 ? Number(provider.rating).toFixed(1) : 'New'}
              </span>
            </div>
            {provider.totalInterviews > 0 && (
              <span className="interviews-count">({provider.totalInterviews} interviews)</span>
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
            ✓ Verified
          </div>
        )}
      </div>

      <div className="provider-actions">
        <Button
          variant="primary"
          size="small"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/provider/${provider.id}`);
          }}
        >
          View Profile
        </Button>
      </div>

    </div>
  );
}

export default ProviderCard;
