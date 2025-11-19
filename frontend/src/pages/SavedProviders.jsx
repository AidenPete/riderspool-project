import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import ProviderCard from '../components/search/ProviderCard';
import './SavedProviders.css';

function SavedProviders() {
  const user = useSelector(selectUser);

  // Mock saved providers
  const mockSavedProviders = [
    {
      id: 1,
      fullName: 'John Kamau',
      category: 'Motorbike Rider',
      profilePhoto: null,
      rating: 4.8,
      totalInterviews: 15,
      location: 'Nairobi',
      experience: '5 years',
      vehicleType: 'Honda',
      bio: 'Experienced delivery rider with excellent knowledge of Nairobi routes.',
      skills: ['First Aid', 'Navigation Expert', 'Customer Service'],
      verified: true,
      isSaved: true,
      savedAt: '2024-11-15',
    },
    {
      id: 2,
      fullName: 'Mary Wanjiku',
      category: 'Car Driver',
      profilePhoto: null,
      rating: 4.9,
      totalInterviews: 23,
      location: 'Nairobi',
      experience: '8 years',
      vehicleType: 'SUV',
      bio: 'Professional driver with clean driving record.',
      skills: ['First Aid', 'Multiple Languages', 'Vehicle Maintenance'],
      verified: true,
      isSaved: true,
      savedAt: '2024-11-18',
    },
    {
      id: 6,
      fullName: 'Susan Njeri',
      category: 'Car Driver',
      profilePhoto: null,
      rating: 5.0,
      totalInterviews: 42,
      location: 'Nairobi',
      experience: '10 years',
      vehicleType: 'Sedan',
      bio: 'Executive driver with impeccable record. Specializing in corporate transport.',
      skills: ['Multiple Languages', 'First Aid', 'Professional Etiquette', 'Tour Guide'],
      verified: true,
      isSaved: true,
      savedAt: '2024-11-12',
    },
  ];

  const [savedProviders, setSavedProviders] = useState(mockSavedProviders);
  const [sortBy, setSortBy] = useState('recent');

  const handleRemove = (providerId) => {
    if (confirm('Remove this provider from your saved list?')) {
      setSavedProviders(prev => prev.filter(p => p.id !== providerId));
      // TODO: API call to remove from saved
    }
  };

  const sortedProviders = [...savedProviders].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.savedAt) - new Date(a.savedAt);
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.fullName.localeCompare(b.fullName);
      default:
        return 0;
    }
  });

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
