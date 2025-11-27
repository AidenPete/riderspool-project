import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { providersAPI } from '../api';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import ProviderCard from '../components/search/ProviderCard';
import './SearchProviders.css';

function SearchProviders() {
  const user = useSelector(selectUser);

  const [filters, setFilters] = useState({
    category: '',
    region: '',
    experience: '',
    search: '',
    verified: false,
  });

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'motorbike-rider', label: 'Motorbike Rider' },
    { value: 'car-driver', label: 'Car Driver' },
    { value: 'truck-driver', label: 'Truck Driver' },
  ];

  const regions = [
    'All Regions',
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
  ];

  const experienceLevels = [
    'All Levels',
    '0-1 years',
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10+ years',
  ];

  // Fetch providers from API
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params based on filters
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;
        if (filters.verified) params.availability = 'available'; // Filter for verified/available providers

        const response = await providersAPI.getProviders(params);
        setProviders(response.results || response); // Handle paginated or non-paginated response
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError('Failed to load providers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [filters.category, filters.search, filters.verified]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Filter providers client-side for remaining filters
  const filteredProviders = providers.filter(provider => {
    // Region filter (check preferredLocations)
    if (filters.region && filters.region !== 'All Regions') {
      const preferredLocations = provider.preferredLocations || '';
      if (!preferredLocations.toLowerCase().includes(filters.region.toLowerCase())) {
        return false;
      }
    }

    // Experience filter
    if (filters.experience && filters.experience !== 'All Levels') {
      const providerExperience = provider.experience || 0;
      const expRange = filters.experience;

      if (expRange === '0-1 years' && providerExperience > 1) return false;
      if (expRange === '1-3 years' && (providerExperience < 1 || providerExperience > 3)) return false;
      if (expRange === '3-5 years' && (providerExperience < 3 || providerExperience > 5)) return false;
      if (expRange === '5-10 years' && (providerExperience < 5 || providerExperience > 10)) return false;
      if (expRange === '10+ years' && providerExperience < 10) return false;
    }

    return true;
  });

  return (
    <div className="search-page">
      <Navbar />

      <div className="search-container">
        <div className="search-header">
          <h1>Find Service Providers</h1>
          <p>Browse and connect with verified professionals</p>
        </div>

        <div className="search-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <Card title="Filters">
              <div className="filter-group">
                <label>Search</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name, skills..."
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Location</label>
                <select
                  name="region"
                  value={filters.region}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Experience</label>
                <select
                  name="experience"
                  value={filters.experience}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="checkbox-filter">
                  <input
                    type="checkbox"
                    name="verified"
                    checked={filters.verified}
                    onChange={handleFilterChange}
                  />
                  <span>Verified Only</span>
                </label>
              </div>

              <button
                className="clear-filters-btn"
                onClick={() => setFilters({
                  category: '',
                  region: '',
                  experience: '',
                  search: '',
                  verified: false,
                })}
              >
                Clear All Filters
              </button>
            </Card>
          </aside>

          {/* Results */}
          <main className="search-results">
            <div className="results-header">
              <h2>
                {loading ? 'Loading...' : `${filteredProviders.length} Provider${filteredProviders.length !== 1 ? 's' : ''} Found`}
              </h2>
            </div>

            {error && (
              <Card>
                <div className="empty-results">
                  <div className="empty-icon">⚠️</div>
                  <h3>Error</h3>
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()} className="retry-btn">
                    Retry
                  </button>
                </div>
              </Card>
            )}

            {loading && !error && (
              <Card>
                <div className="empty-results">
                  <div className="empty-icon">⏳</div>
                  <h3>Loading providers...</h3>
                  <p>Please wait while we fetch the data</p>
                </div>
              </Card>
            )}

            {!loading && !error && filteredProviders.length > 0 && (
              <div className="providers-grid">
                {filteredProviders.map(provider => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}

            {!loading && !error && filteredProviders.length === 0 && (
              <Card>
                <div className="empty-results">
                  <div className="empty-icon">🔍</div>
                  <h3>No providers found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default SearchProviders;
