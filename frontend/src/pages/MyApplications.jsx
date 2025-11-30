import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { applicationsAPI } from '../api';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './MyApplications.css';

function MyApplications() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getMyApplications();
      setApplications(response.results || response);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
    { id: 'reviewing', label: 'Under Review', count: applications.filter(a => a.status === 'reviewing').length },
    { id: 'shortlisted', label: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length },
    { id: 'accepted', label: 'Accepted', count: applications.filter(a => a.status === 'accepted').length },
    { id: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
  ];

  const filteredApplications = applications.filter(app => app.status === activeTab);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'pending' },
      reviewing: { label: 'Under Review', className: 'reviewing' },
      shortlisted: { label: 'Shortlisted', className: 'shortlisted' },
      accepted: { label: 'Accepted', className: 'accepted' },
      rejected: { label: 'Rejected', className: 'rejected' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user || user.userType !== 'provider') {
    return (
      <PageLayout maxWidth="500px">
        <div className="unauthorized">
          <h2>Unauthorized</h2>
          <p>Only providers can access this page.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="1200px">
      <PageHeader
        title="My Job Applications"
        subtitle="Track your job applications and responses"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'My Applications' }
        ]}
      />

      <div className="my-applications-container">
        {/* Tabs */}
        <div className="applications-tabs">
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

        {/* Applications List */}
        {loading ? (
          <Card>
            <div className="loading-state">
              <p>Loading applications...</p>
            </div>
          </Card>
        ) : filteredApplications.length > 0 ? (
          <div className="applications-list">
            {filteredApplications.map(application => (
              <Card key={application.id} className="application-card">
                <div className="application-header">
                  <div className="job-info">
                    <div className="company-icon">🏢</div>
                    <div>
                      <h3>{application.job?.title || 'Job Title'}</h3>
                      <p className="company-name">
                        {application.job?.employer?.companyName || application.job?.employer?.fullName || 'Company'}
                      </p>
                      <p className="job-location">
                        📍 {application.job?.city}, {application.job?.region}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                <div className="application-details">
                  <div className="detail-section">
                    <strong>Applied On:</strong>
                    <p>{formatDate(application.appliedAt || application.createdAt)}</p>
                  </div>

                  {application.coverLetter && (
                    <div className="detail-section full-width">
                      <strong>Your Cover Letter:</strong>
                      <p className="cover-letter-preview">
                        {application.coverLetter.substring(0, 200)}
                        {application.coverLetter.length > 200 && '...'}
                      </p>
                    </div>
                  )}

                  {application.yearsOfExperience && (
                    <div className="detail-section">
                      <strong>Experience:</strong>
                      <p>{application.yearsOfExperience} years</p>
                    </div>
                  )}

                  {application.relevantSkills && (
                    <div className="detail-section">
                      <strong>Skills:</strong>
                      <p>{application.relevantSkills}</p>
                    </div>
                  )}
                </div>

                {application.employerNotes && (
                  <div className="employer-notes">
                    <strong>Employer Notes:</strong>
                    <p>{application.employerNotes}</p>
                  </div>
                )}

                {application.status === 'shortlisted' && (
                  <div className="status-message success">
                    <strong>Great news!</strong> You've been shortlisted for this position.
                    The employer may contact you for an interview soon.
                  </div>
                )}

                {application.status === 'accepted' && (
                  <div className="status-message success">
                    <strong>Congratulations!</strong> Your application has been accepted.
                    The employer will contact you with next steps.
                  </div>
                )}

                {application.status === 'rejected' && application.rejectionReason && (
                  <div className="status-message error">
                    <strong>Rejection Reason:</strong>
                    <p>{application.rejectionReason}</p>
                  </div>
                )}

                <div className="application-actions">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigate(`/jobs/${application.job?.id}`)}
                  >
                    View Job Details
                  </Button>
                  {application.status === 'pending' && (
                    <span className="action-hint">Waiting for employer to review</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No {activeTab} applications</h3>
              <p>
                {activeTab === 'pending' && "You haven't submitted any applications yet."}
                {activeTab === 'reviewing' && "No applications are currently under review."}
                {activeTab === 'shortlisted' && "You haven't been shortlisted for any positions yet."}
                {activeTab === 'accepted' && "No applications have been accepted yet."}
                {activeTab === 'rejected' && "No applications have been rejected."}
              </p>
              {activeTab === 'pending' && (
                <Button variant="primary" onClick={() => navigate('/jobs')}>
                  Browse Jobs
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}

export default MyApplications;
