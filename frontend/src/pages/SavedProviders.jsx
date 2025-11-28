import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { savedProvidersAPI } from '../api';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import ProviderCard from '../components/search/ProviderCard';
import './SavedProviders.css';

function SavedProviders() {
// eslint-disable-next-line no-unused-vars
  const user = useSelector(selectUser);
  const [savedProviders, setSavedProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');

  // Fetch saved providers on mount
  useEffect(() => {
    const fetchSavedProviders = async () => {
      try {
        const response = await savedProvidersAPI.getSavedProviders();
        // Map response to extract provider data
        const providers = (response.results || response).map(item => ({
          ...item.provider,
          savedId: item.id,
          savedAt: item.savedAt,
          isSaved: true,
        }));
        setSavedProviders(providers);
      } catch (error) {
        console.error('Error fetching saved providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProviders();
  }, []);

// eslint-disable-next-line no-unused-vars
  const handleRemove = async (providerId) => {
    if (confirm('Remove this provider from your saved list?')) {
      const provider = savedProviders.find(p => p.id === providerId);
      if (provider && provider.savedId) {
        try {
          await savedProvidersAPI.removeSavedProvider(provider.savedId);
          setSavedProviders(prev => prev.filter(p => p.id !== providerId));
        } catch (error) {
          console.error('Error removing saved provider:', error);
          alert('Failed to remove provider. Please try again.');
        }
      }
    }
  };

  const sortedProviders = [...savedProviders].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.savedAt) - new Date(a.savedAt);
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return (a.registeredName || a.user?.fullName || '').localeCompare(b.registeredName || b.user?.fullName || '');
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="saved-providers-page">
        <Navbar />
        <div className="saved-providers-container">
          <div className="loading-message">Loading saved providers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-providers-page">
      <Navbar />

      <div className="saved-providers-container">
        <div className="saved-providers-header">
          <div>
            <h1>Saved Providers</h1>
            <p>Your favorite service providers ({savedProviders.length})</p>
          </div>
          <Link to="/search">
            <button className="btn-primary">Find More Providers</button>
          </Link>
        </div>

        {savedProviders.length > 0 ? (
          <>
            {/* Sort Controls */}
            <div className="sort-controls">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recent">Recently Saved</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {/* Providers Grid */}
            <div className="saved-providers-grid">
              {sortedProviders.map(provider => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </>
        ) : (
          <Card>
            <div className="empty-state">
              <div className="empty-icon">❤️</div>
              <h3>No saved providers yet</h3>
              <p>
                Start saving providers you're interested in by clicking the heart icon on their profile cards.
                This will help you quickly access them later!
              </p>
              <Link to="/search">
                <button className="btn-primary">Browse Providers</button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default SavedProviders;
