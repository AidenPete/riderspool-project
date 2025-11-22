import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { providersAPI, interviewsAPI } from '../api';
import { verificationsAPI } from '../api/verifications';
import { calculateProfileCompletion, getPendingTasks } from '../utils/profileCompletion';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import InterviewDetailModal from '../components/interview/InterviewDetailModal';
import './Dashboard.css';

function ProviderDashboard() {
  const user = useSelector(selectUser);
  const [profileData, setProfileData] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Fetch profile data, interviews, and verification
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, interviewsData] = await Promise.all([
          providersAPI.getMyProfile(),
          interviewsAPI.getInterviews()
        ]);
        setProfileData(profile);
        setInterviews(interviewsData.results || interviewsData || []);

        // Fetch verification data separately (may not exist)
        try {
          const verificationData = await verificationsAPI.getMyVerification();
          setVerification(verificationData);
        } catch (err) {
          // No verification found, that's okay
          console.log('No verification data:', err);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingInterviews = interviews.filter(i =>
    ['pending', 'confirmed'].includes(i.status)
  );

  const stats = {
    upcomingInterviews: upcomingInterviews.length,
    totalInterviews: profileData?.totalInterviews || 0,
    profileViews: 0,
  };

  const profileCompletion = calculateProfileCompletion(profileData);
  const pendingTasks = getPendingTasks(profileData).slice(0, 4); // Show top 4 tasks

  // Helper function to format document types
  const getDocumentTypeLabel = (type) => {
    const types = {
      id: 'National ID',
      license: 'Driver\'s License',
      profile_photo: 'Profile Photo',
      certificate: 'Certificate',
      other: 'Other'
    };
    return types[type] || type;
  };

  // Helper function to get status badge style
  const getVerificationStatusBadge = (status) => {
    const styles = {
      pending: { label: 'Pending Review', className: 'status-pending' },
      approved: { label: 'Verified', className: 'status-confirmed' },
      rejected: { label: 'Rejected', className: 'status-cancelled' }
    };
    return styles[status] || styles.pending;
  };

  // Mock interviews for fallback (remove after testing)
  const mockUpcomingInterviews = [
    {
      id: 1,
      companyName: 'ABC Construction Ltd',
      industry: 'Construction',
      date: '2025-01-27',
      time: '10:00 AM',
      office: 'Nairobi Office',
      status: 'Confirmed',
    },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.fullName}!</h1>
            <p className="dashboard-subtitle">{user?.category}</p>
          </div>
          {profileCompletion < 100 && (
            <Link to="/provider/profile">
              <Button variant="primary">Complete Profile</Button>
            </Link>
          )}
        </div>

        {/* Profile Completion Alert */}
        {profileCompletion < 100 && (
          <Card className="alert-card">
            <div className="alert-content">
              <div className="alert-icon">⚠️</div>
              <div className="alert-text">
                <h3>Complete Your Profile</h3>
                <p>Your profile is {profileCompletion}% complete. Complete your profile to get more interview opportunities.</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${profileCompletion}%` }}></div>
                </div>
              </div>
              <Link to="/provider/profile">
                <Button variant="primary" size="small">Complete Now</Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-number">{stats.upcomingInterviews}</div>
            <div className="stat-label">Upcoming Interviews</div>
          </Card>
          <Card className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-number">{stats.totalInterviews}</div>
            <div className="stat-label">Total Interviews</div>
          </Card>
          <Card className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-number">{stats.profileViews}</div>
            <div className="stat-label">Profile Views</div>
          </Card>
        </div>

        <div className="dashboard-grid">
          {/* Verification Documents */}
          {verification && (
            <Card title="Verification Documents">
              <div className="verification-status-header">
                <span className={`status-badge ${getVerificationStatusBadge(verification.status).className}`}>
                  {getVerificationStatusBadge(verification.status).label}
                </span>
              </div>

              {verification.documents && verification.documents.length > 0 ? (
                <div className="documents-list">
                  {verification.documents.map(doc => (
                    <div key={doc.id} className="document-item">
                      <div className="document-icon">📄</div>
                      <div className="document-info">
                        <h5>{getDocumentTypeLabel(doc.documentType)}</h5>
                        <p className="document-meta">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <a
                        href={doc.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-action"
                      >
                        <Button variant="outline" size="small">View</Button>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-small">
                  <p>No documents uploaded yet</p>
                </div>
              )}

              {verification.status === 'rejected' && verification.rejectionReason && (
                <div className="rejection-notice">
                  <span className="rejection-icon">⚠️</span>
                  <div>
                    <strong>Rejection Reason:</strong>
                    <p>{verification.rejectionReason}</p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Profile Verification Status */}
          <Card title="Profile Verification">
            <div className="verification-list">
              <div className="verification-item-dash">
                <span className={`verification-icon ${profileData?.profilePhoto ? 'verified' : 'pending'}`}>
                  {profileData?.profilePhoto ? '✓' : '○'}
                </span>
                <div className="verification-info">
                  <span className="verification-label">Profile Photo</span>
                  <span className={`verification-status ${profileData?.profilePhoto ? 'complete' : 'incomplete'}`}>
                    {profileData?.profilePhoto ? 'Uploaded' : 'Not uploaded'}
                  </span>
                </div>
              </div>

              <div className="verification-item-dash">
                <span className={`verification-icon ${profileData?.idDocument ? 'verified' : 'pending'}`}>
                  {profileData?.idDocument ? '✓' : '○'}
                </span>
                <div className="verification-info">
                  <span className="verification-label">National ID</span>
                  <span className={`verification-status ${profileData?.idDocument ? 'complete' : 'incomplete'}`}>
                    {profileData?.idDocument ? 'Uploaded' : 'Not uploaded'}
                  </span>
                </div>
              </div>

              <div className="verification-item-dash">
                <span className={`verification-icon ${profileData?.licenseDocument ? 'verified' : 'pending'}`}>
                  {profileData?.licenseDocument ? '✓' : '○'}
                </span>
                <div className="verification-info">
                  <span className="verification-label">Driver's License</span>
                  <span className={`verification-status ${profileData?.licenseDocument ? 'complete' : 'incomplete'}`}>
                    {profileData?.licenseDocument ? 'Uploaded' : 'Not uploaded'}
                  </span>
                </div>
              </div>

              <div className="verification-item-dash">
                <span className={`verification-icon ${profileData?.bio ? 'verified' : 'pending'}`}>
                  {profileData?.bio ? '✓' : '○'}
                </span>
                <div className="verification-info">
                  <span className="verification-label">Professional Bio</span>
                  <span className={`verification-status ${profileData?.bio ? 'complete' : 'incomplete'}`}>
                    {profileData?.bio ? 'Added' : 'Not added'}
                  </span>
                </div>
              </div>

              <div className="verification-item-dash">
                <span className={`verification-icon ${profileData?.skills ? 'verified' : 'pending'}`}>
                  {profileData?.skills ? '✓' : '○'}
                </span>
                <div className="verification-info">
                  <span className="verification-label">Skills</span>
                  <span className={`verification-status ${profileData?.skills ? 'complete' : 'incomplete'}`}>
                    {profileData?.skills ? 'Added' : 'Not added'}
                  </span>
                </div>
              </div>
            </div>

            {pendingTasks.length > 0 && (
              <div className="pending-tasks-footer">
                <Link to="/provider/profile">
                  <Button variant="primary" size="small" fullWidth>
                    Complete Profile ({pendingTasks.length} items remaining)
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Upcoming Interviews */}
          <Card title="Upcoming Interviews">
            {upcomingInterviews.length > 0 ? (
              <div className="interview-list">
                {upcomingInterviews.map(interview => (
                  <div
                    key={interview.id}
                    className="interview-item-provider clickable"
                    onClick={() => setSelectedInterview(interview)}
                  >
                    <h4>{interview.employer?.companyName || interview.employer?.fullName || 'Company'}</h4>
                    <p className="interview-category">{interview.employer?.industry || 'Industry'}</p>
                    <div className="interview-details">
                      <span>📅 {new Date(interview.date).toLocaleDateString()} at {interview.time}</span>
                      <span>🏢 {interview.officeLocation?.name || 'Office'}</span>
                    </div>
                    <span className={`status-badge status-${interview.status.toLowerCase()}`}>
                      {interview.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No upcoming interviews</p>
                <p className="empty-state-hint">Complete your profile to get interview requests from employers</p>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-grid">
          <Card className="action-card">
            <h3>📝 Complete Profile</h3>
            <p>Add documents, photos, and experience</p>
            <Link to="/provider/profile">
              <Button variant="secondary" fullWidth>Go to Profile</Button>
            </Link>
          </Card>
          <Card className="action-card">
            <h3>📋 My Interviews</h3>
            <p>View interview requests and history</p>
            <Link to="/interviews">
              <Button variant="secondary" fullWidth>View All</Button>
            </Link>
          </Card>
          <Card className="action-card">
            <h3>⚙️ Settings</h3>
            <p>Update preferences and availability</p>
            <Link to="/settings">
              <Button variant="secondary" fullWidth>Manage</Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Interview Detail Modal */}
      {selectedInterview && (
        <InterviewDetailModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onUpdate={() => {
            // Refresh interviews data
            const fetchData = async () => {
              try {
                const interviewsData = await interviewsAPI.getInterviews();
                setInterviews(interviewsData.results || interviewsData || []);
              } catch (error) {
                console.error('Error fetching interviews:', error);
              }
            };
            fetchData();
            setSelectedInterview(null);
          }}
        />
      )}
    </div>
  );
}

export default ProviderDashboard;
