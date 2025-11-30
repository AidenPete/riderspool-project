import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { jobsAPI, jobApplicationsAPI } from '../api';
import { toast } from '../utils/toast';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './JobApplications.css';

function JobApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchJobAndApplications();
  }, [jobId]);

  const fetchJobAndApplications = async () => {
    try {
      setLoading(true);
      const jobData = await jobsAPI.getJob(jobId);
      setJob(jobData);

      const applicationsData = await jobsAPI.getJobApplications(jobId);
      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Applications', count: applications.length },
    { id: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
    { id: 'reviewing', label: 'Reviewing', count: applications.filter(a => a.status === 'reviewing').length },
    { id: 'shortlisted', label: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length },
    { id: 'accepted', label: 'Accepted', count: applications.filter(a => a.status === 'accepted').length },
    { id: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
  ];

  const filteredApplications = activeTab === 'all'
    ? applications
    : applications.filter(app => app.status === activeTab);

  const handleStatusUpdate = async (applicationId, newStatus, notes = '') => {
    try {
      setUpdatingStatus(true);
      await jobApplicationsAPI.updateApplicationStatus(applicationId, {
        status: newStatus,
        employerNotes: notes,
      });

      toast.success('Application status updated');
      fetchJobAndApplications();
      setShowModal(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'pending' },
      reviewing: { label: 'Under Review', className: 'reviewing' },
      shortlisted: { label: 'Shortlisted', className: 'shortlisted' },
      accepted: { label: 'Accepted', className: 'accepted' },
      rejected: { label: 'Rejected', className: 'rejected' },
      withdrawn: { label: 'Withdrawn', className: 'withdrawn' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <Card>
          <div className="loading-state">
            <p>Loading applications...</p>
          </div>
        </Card>
      </PageLayout>
    );
  }

  if (!job) {
    return (
      <PageLayout>
        <Card>
          <div className="empty-state">
            <h3>Job not found</h3>
            <Button onClick={() => navigate('/employer/jobs')}>Back to Jobs</Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="1200px">
      <PageHeader
        title={`Applications for ${job.title}`}
        subtitle={`${applications.length} total application${applications.length !== 1 ? 's' : ''}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'My Jobs', path: '/employer/jobs' },
          { label: 'Applications' },
        ]}
      />

      <div className="job-applications-container">
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
        {filteredApplications.length > 0 ? (
          <div className="applications-list">
            {filteredApplications.map(application => (
              <Card key={application.id} className="application-card">
                <div className="application-header">
                  <div className="applicant-info">
                    <h3>{application.providerName}</h3>
                    <div className="applicant-meta">
                      <span className="category">{application.providerCategory}</span>
                      {application.providerRating && (
                        <span className="rating">
                          ⭐ {application.providerRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                <div className="application-details">
                  <div className="cover-letter-section">
                    <h4>Cover Letter</h4>
                    <p className="cover-letter">{application.coverLetter}</p>
                  </div>

                  {application.expectedSalary && (
                    <div className="detail-item">
                      <strong>Expected Salary:</strong> KES {parseInt(application.expectedSalary).toLocaleString()}
                    </div>
                  )}

                  {application.availableFrom && (
                    <div className="detail-item">
                      <strong>Available From:</strong> {formatDate(application.availableFrom)}
                    </div>
                  )}

                  <div className="detail-item">
                    <strong>Applied:</strong> {formatDate(application.appliedAt)}
                  </div>

                  {application.employerNotes && (
                    <div className="employer-notes">
                      <strong>Your Notes:</strong>
                      <p>{application.employerNotes}</p>
                    </div>
                  )}
                </div>

                <div className="application-actions">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigate(`/provider/${application.provider.id}`)}
                  >
                    View Profile
                  </Button>

                  {application.status === 'pending' && (
                    <>
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleStatusUpdate(application.id, 'reviewing')}
                      >
                        Review
                      </Button>
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => handleStatusUpdate(application.id, 'shortlisted')}
                      >
                        Shortlist
                      </Button>
                    </>
                  )}

                  {application.status === 'reviewing' && (
                    <>
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => handleStatusUpdate(application.id, 'shortlisted')}
                      >
                        Shortlist
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {application.status === 'shortlisted' && (
                    <>
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => handleStatusUpdate(application.id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                      >
                        Reject
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
              <h3>No applications yet</h3>
              <p>
                {activeTab === 'all'
                  ? 'No one has applied for this position yet.'
                  : `No ${activeTab} applications.`}
              </p>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}

export default JobApplications;
