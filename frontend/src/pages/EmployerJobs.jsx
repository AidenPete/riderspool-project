import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { jobsAPI } from '../api';
import { toast } from '../utils/toast';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './EmployerJobs.css';

function EmployerJobs() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobs();
      // Filter to only show current employer's jobs
      const myJobs = response.results || response || [];
      setJobs(Array.isArray(myJobs) ? myJobs : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'active', label: 'Active', count: Array.isArray(jobs) ? jobs.filter(j => j.status === 'active').length : 0 },
    { id: 'closed', label: 'Closed', count: Array.isArray(jobs) ? jobs.filter(j => j.status === 'closed').length : 0 },
    { id: 'filled', label: 'Filled', count: Array.isArray(jobs) ? jobs.filter(j => j.status === 'filled').length : 0 },
  ];

  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job => job.status === activeTab) : [];

  const handleCloseJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to close this job posting?')) return;

    try {
      await jobsAPI.closeJob(jobId);
      toast.success('Job closed successfully');
      fetchJobs();
    } catch (error) {
      console.error('Error closing job:', error);
      toast.error('Failed to close job');
    }
  };

  const handleMarkFilled = async (jobId) => {
    if (!window.confirm('Mark this position as filled?')) return;

    try {
      await jobsAPI.markJobFilled(jobId);
      toast.success('Job marked as filled');
      fetchJobs();
    } catch (error) {
      console.error('Error marking job as filled:', error);
      toast.error('Failed to mark job as filled');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', className: 'active' },
      closed: { label: 'Closed', className: 'closed' },
      filled: { label: 'Filled', className: 'filled' },
    };
    const config = statusConfig[status] || statusConfig.active;
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

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

  if (!user || user.userType !== 'employer') {
    return (
      <PageLayout maxWidth="500px">
        <div className="unauthorized">
          <h2>Unauthorized</h2>
          <p>Only employers can access this page.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="1200px">
      <div className="employer-jobs-header-wrapper">
        <PageHeader
          title="My Job Postings"
          subtitle="Manage your job listings and view applications"
          breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'My Jobs' }
          ]}
        />
        <Link to="/post-job">
          <Button variant="primary">Post New Job</Button>
        </Link>
      </div>

      <div className="employer-jobs-container">
        {/* Tabs */}
        <div className="jobs-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {loading ? (
          <Card>
            <div className="loading-state">
              <p>Loading jobs...</p>
            </div>
          </Card>
        ) : filteredJobs.length > 0 ? (
          <div className="jobs-list">
            {filteredJobs.map(job => (
              <Card key={job.id} className="job-card">
                <div className="job-header">
                  <div className="job-title-section">
                    <h3>{job.title}</h3>
                    <div className="job-meta">
                      <span className="job-category">{job.category}</span>
                      <span className="job-separator">•</span>
                      <span className="job-location">{job.city}, {job.region}</span>
                      {job.isRemote && (
                        <>
                          <span className="job-separator">•</span>
                          <span className="remote-badge">Remote Available</span>
                        </>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(job.status)}
                </div>

                <div className="job-details">
                  <div className="detail-item">
                    <strong>Salary:</strong> {formatSalary(job)}
                  </div>
                  <div className="detail-item">
                    <strong>Experience:</strong> {job.experienceRequired} years
                  </div>
                  <div className="detail-item">
                    <strong>Employment Type:</strong> {job.employmentType}
                  </div>
                  <div className="detail-item">
                    <strong>Positions:</strong> {job.numberOfPositions}
                  </div>
                </div>

                <div className="job-description">
                  <p>{job.description.substring(0, 200)}...</p>
                </div>

                <div className="job-stats">
                  <div className="stat">
                    <span className="stat-number">{job.applicationCount || 0}</span>
                    <span className="stat-label">Applications</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{job.viewCount || 0}</span>
                    <span className="stat-label">Views</span>
                  </div>
                  <div className="stat">
                    <span className="stat-date">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="job-actions">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigate(`/jobs/${job.id}/applications`)}
                  >
                    View Applications ({job.applicationCount || 0})
                  </Button>
                  {job.status === 'active' && (
                    <>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => navigate(`/jobs/${job.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleMarkFilled(job.id)}
                      >
                        Mark as Filled
                      </Button>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleCloseJob(job.id)}
                      >
                        Close Posting
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No {activeTab} jobs</h3>
              <p>
                {activeTab === 'active' && "You haven't posted any active jobs yet."}
                {activeTab === 'closed' && "You don't have any closed job postings."}
                {activeTab === 'filled' && "You haven't marked any positions as filled yet."}
              </p>
              {activeTab === 'active' && (
                <Link to="/post-job">
                  <Button variant="primary">Post Your First Job</Button>
                </Link>
              )}
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}

export default EmployerJobs;
