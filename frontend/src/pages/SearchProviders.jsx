import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
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

  const categories = [
    'All Categories',
    'Motorbike Rider',
    'Car Driver',
    'Truck Driver',
    'Bus Driver',
    'Machinery Operator',
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

  // Mock data - replace with API call
  const mockProviders = [
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
      bio: 'Experienced delivery rider with excellent knowledge of Nairobi routes. Always punctual and professional.',
      skills: ['First Aid', 'Navigation Expert', 'Customer Service'],
      verified: true,
      isSaved: false,
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
      bio: 'Professional driver with clean driving record. Experienced in both personal and corporate driving.',
      skills: ['First Aid', 'Multiple Languages', 'Vehicle Maintenance'],
      verified: true,
      isSaved: true,
    },
    {
      id: 3,
      fullName: 'Peter Omondi',
      category: 'Truck Driver',
      profilePhoto: null,
      rating: 4.7,
      totalInterviews: 18,
      location: 'Mombasa',
      experience: '12 years',
      vehicleType: 'Heavy Truck',
      bio: 'Long-haul truck driver specializing in cargo transportation. Expert in Kenya-Tanzania routes.',
      skills: ['Navigation Expert', 'Vehicle Maintenance', 'Logistics'],
      verified: true,
      isSaved: false,
    },
    {
      id: 4,
      fullName: 'Grace Achieng',
      category: 'Motorbike Rider',
      profilePhoto: null,
      rating: 4.6,
      totalInterviews: 9,
      location: 'Kisumu',
      experience: '3 years',
      vehicleType: 'Yamaha',
      bio: 'Reliable and fast delivery rider. Familiar with Kisumu and surrounding areas.',
      skills: ['Customer Service', 'First Aid'],
      verified: false,
      isSaved: false,
    },
    {
      id: 5,
      fullName: 'David Kipchoge',
      category: 'Machinery Operator',
      profilePhoto: null,
      rating: 4.9,
      totalInterviews: 31,
      location: 'Nakuru',
      experience: '15 years',
      vehicleType: 'Excavator',
      bio: 'Certified heavy machinery operator with extensive construction experience. Safety-focused.',
      skills: ['Safety Training', 'Vehicle Maintenance', 'Construction'],
      verified: true,
      isSaved: false,
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
      bio: 'Executive driver with impeccable record. Specializing in corporate and VIP transport.',
      skills: ['Multiple Languages', 'First Aid', 'Professional Etiquette', 'Tour Guide'],
      verified: true,
      isSaved: false,
    },
  ];

  const [providers] = useState(mockProviders);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Filter providers based on search criteria
  const filteredProviders = providers.filter(provider => {
    if (filters.category && filters.category !== 'All Categories' && provider.category !== filters.category) {
      return false;
    }
    if (filters.region && filters.region !== 'All Regions' && provider.location !== filters.region) {
      return false;
    }
    if (filters.verified && !provider.verified) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        provider.fullName.toLowerCase().includes(searchLower) ||
        provider.category.toLowerCase().includes(searchLower) ||
        provider.bio?.toLowerCase().includes(searchLower) ||
        provider.skills?.some(skill => skill.toLowerCase().includes(searchLower))
      );
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
                    <option key={cat} value={cat}>{cat}</option>
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
                {filteredProviders.length} Provider{filteredProviders.length !== 1 ? 's' : ''} Found
              </h2>
            </div>

            {filteredProviders.length > 0 ? (
              <div className="providers-grid">
                {filteredProviders.map(provider => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
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
