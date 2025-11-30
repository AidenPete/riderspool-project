import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { jobsAPI } from '../api';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './BrowseJobs.css';

function BrowseJobs() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    region: '',
    employmentType: '',
    search: '',
  });

  const isProvider = user?.userType === 'provider';
  const isEmployer = user?.userType === 'employer';

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'motorbike-rider', label: 'Motorbike Rider' },
    { value: 'car-driver', label: 'Car Driver' },
    { value: 'truck-driver', label: 'Truck Driver' },
  ];

  const regions = [
    'All Regions',
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
    'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega'
  ];

  const employmentTypes = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
  ];

  useEffect(() => {
    fetchJobs();
  }, [filters.category, filters.search]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const response = await jobsAPI.getJobs(params);
      const jobsList = response.results || response || [];
      const activeJobs = Array.isArray(jobsList) ? jobsList.filter(job => job.status === 'active') : [];
      setJobs(activeJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.region && filters.region !== 'All Regions') {
      if (job.region !== filters.region) return false;
    }
    if (filters.employmentType && job.employmentType !== filters.employmentType) {
      return false;
    }
    return true;
  });

  const formatSalary = (job) => {
    if (!job.salaryMin && !job.salaryMax) return 'Negotiable';

    const currency = job.salaryCurrency || 'KES';
    const period = job.salaryPeriod || 'monthly';

    if (job.salaryMin && job.salaryMax) {
      return `${currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} / ${period}`;
    } else if (job.salaryMin) {
      return `${currency} ${job.salaryMin.toLocaleString()}+ / ${period}`;
    } else {
      return `Up to ${currency} ${job.salaryMax.toLocaleString()} / ${period}`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <PageLayout maxWidth="1400px">
      <PageHeader
        title="Browse Jobs"
        subtitle="Find your next opportunity"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Browse Jobs' }
        ]}
      />

      <div className="browse-jobs-container">
        <div className="browse-jobs-layout">
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
                  placeholder="Search jobs..."
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
                <label>Employment Type</label>
                <select
                  name="employmentType"
                  value={filters.employmentType}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  {employmentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <button
                className="clear-filters-btn"
                onClick={() => setFilters({
                  category: '',
                  region: '',
                  employmentType: '',
                  search: '',
                })}
              >
                Clear All Filters
              </button>
            </Card>
          </aside>

          {/* Jobs List */}
          <main className="jobs-results">
            <div className="results-header">
              <h2>
                {loading ? 'Loading...' : `${filteredJobs.length} Job${filteredJobs.length !== 1 ? 's' : ''} Available`}
              </h2>
            </div>

            {loading ? (
              <Card>
                <div className="loading-state">
                  <p>Loading jobs...</p>
                </div>
              </Card>
            ) : filteredJobs.length > 0 ? (
              <div className="jobs-grid">
                {filteredJobs.map(job => (
                  <Card key={job.id} className="job-listing-card">
                    <div className="job-listing-header">
                      <div className="company-icon">🏢</div>
                      <div className="company-info">
                        <h3>{job.title}</h3>
                        <p className="company-name">
                          {job.employer?.companyName || job.employer?.fullName || 'Company'}
                        </p>
                      </div>
                    </div>

                    <div className="job-listing-meta">
                      <span className="job-category">{job.category}</span>
                      <span className="job-location">📍 {job.city}, {job.region}</span>
                      {job.isRemote && <span className="remote-badge">Remote</span>}
                    </div>

                    <div className="job-listing-details">
                      <div className="detail-row">
                        <span className="detail-label">💰 Salary:</span>
                        <span className="detail-value">{formatSalary(job)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">💼 Type:</span>
                        <span className="detail-value">{job.employmentType}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">📊 Experience:</span>
                        <span className="detail-value">{job.experienceRequired} years</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">👥 Positions:</span>
                        <span className="detail-value">{job.numberOfPositions}</span>
                      </div>
                    </div>

                    <p className="job-listing-description">
                      {job.description.substring(0, 150)}...
                    </p>

                    <div className="job-listing-footer">
                      <span className="posted-date">Posted {formatDate(job.createdAt)}</span>
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        {isProvider ? 'View Details & Apply' : 'View Details'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No jobs found</h3>
                  <p>Try adjusting your filters to see more results</p>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </PageLayout>
  );
}

export default BrowseJobs;
