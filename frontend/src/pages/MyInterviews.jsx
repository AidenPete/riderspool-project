import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { interviewsAPI } from '../api';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import InterviewDetailModal from '../components/interview/InterviewDetailModal';
import './MyInterviews.css';

function MyInterviews() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('pending');
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Fetch interviews from API
  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await interviewsAPI.getInterviews();
      setInterviews(response.results || response);
    } catch (err) {
      console.error('Error fetching interviews:', err);
      setError('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // Mock interviews data (fallback)
  const mockInterviews = [
    {
      id: 1,
      employer: {
        id: 1,
        companyName: 'ABC Construction Ltd',
        contactPerson: 'Jane Smith',
        industry: 'Construction',
      },
      date: '2025-01-28',
      time: '10:00 AM',
      duration: '30 minutes',
      office: {
        name: 'Nairobi - Westlands Office',
        address: 'Westlands Square, Nairobi',
      },
      status: 'pending',
      notes: 'Looking for a reliable delivery rider for daily construction site deliveries.',
      requestedAt: '2025-01-20',
    },
    {
      id: 2,
      employer: {
        id: 2,
        companyName: 'Tech Solutions Inc',
        contactPerson: 'Michael Johnson',
        industry: 'Technology',
      },
      date: '2025-02-03',
      time: '2:00 PM',
      duration: '45 minutes',
      office: {
        name: 'Nairobi - CBD Office',
        address: 'Kimathi Street, Nairobi',
      },
      status: 'confirmed',
      notes: 'Need a motorbike rider for equipment delivery between offices.',
      requestedAt: '2025-01-21',
      confirmedAt: '2025-01-21',
    },
    {
      id: 3,
      employer: {
        id: 3,
        companyName: 'Fresh Foods Co.',
        contactPerson: 'Sarah Williams',
        industry: 'Retail',
      },
      date: '2025-01-10',
      time: '11:00 AM',
      duration: '30 minutes',
      office: {
        name: 'Nairobi - Westlands Office',
        address: 'Westlands Square, Nairobi',
      },
      status: 'completed',
      notes: 'Food delivery rider for our restaurant chain.',
      requestedAt: '2025-01-03',
      completedAt: '2025-01-10',
      employerReview: {
        rating: 5,
        comment: 'Excellent rider! Very professional and punctual. Highly recommend.',
      },
    },
    {
      id: 4,
      employer: {
        id: 4,
        companyName: 'Global Logistics',
        contactPerson: 'David Brown',
        industry: 'Logistics & Transportation',
      },
      date: '2025-01-15',
      time: '9:00 AM',
      duration: '1 hour',
      office: {
        name: 'Mombasa Office',
        address: 'Moi Avenue, Mombasa',
      },
      status: 'declined',
      notes: 'Seeking experienced courier for long-distance deliveries.',
      requestedAt: '2025-01-08',
      declinedAt: '2025-01-09',
      declineReason: 'Schedule conflict',
    },
  ];

  const tabs = [
    { id: 'pending', label: 'Pending', count: interviews.filter(i => i.status === 'pending').length },
    { id: 'confirmed', label: 'Confirmed', count: interviews.filter(i => i.status === 'confirmed').length },
    { id: 'completed', label: 'Completed', count: interviews.filter(i => i.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: interviews.filter(i => i.status === 'cancelled').length },
  ];

  const filteredInterviews = interviews.filter(interview => interview.status === activeTab);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending Response', className: 'pending' },
      confirmed: { label: 'Confirmed', className: 'confirmed' },
      completed: { label: 'Completed', className: 'completed' },
      cancelled: { label: 'Cancelled', className: 'cancelled' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);
  };

  const handleCloseModal = () => {
    setSelectedInterview(null);
  };

  const handleUpdateInterview = () => {
    fetchInterviews();
    setSelectedInterview(null);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="interviews-page">
      <Navbar />

      <div className="interviews-container">
        {/* Back Button */}
        <div className="interviews-back-button">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>

        <div className="interviews-header">
          <div>
            <h1>My Interviews</h1>
            <p>Manage your interview requests</p>
          </div>
          <Link to="/provider/profile">
            <Button variant="primary">Update Profile</Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="interviews-tabs">
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

        {/* Interviews List */}
        <div className="interviews-list">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map(interview => (
              <Card
                key={interview.id}
                className="interview-card clickable-card"
                onClick={() => handleViewDetails(interview)}
              >
                <div className="interview-header">
                  <div className="employer-info">
                    <div className="employer-icon">🏢</div>
                    <div>
                      <h3>{interview.employer?.companyName || interview.employer?.fullName || 'Company'}</h3>
                      <p className="employer-details">
                        {interview.employer?.industry || 'Industry'}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(interview.status)}
                </div>

                <div className="interview-details">
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <div>
                      <strong>Interview Date & Time:</strong>
                      <p>{formatDate(interview.date)} at {interview.time}</p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">🏢</span>
                    <div>
                      <strong>Location:</strong>
                      <p>{interview.officeLocation?.name || interview.office?.name || 'Office location'}</p>
                    </div>
                  </div>

                  {interview.notes && (
                    <div className="detail-row">
                      <span className="detail-icon">📝</span>
                      <div>
                        <strong>Employer's Notes:</strong>
                        <p className="truncate-text">{interview.notes}</p>
                      </div>
                    </div>
                  )}

                  {interview.status === 'cancelled' && interview.cancellationReason && (
                    <div className="detail-row cancel-alert">
                      <span className="detail-icon">❌</span>
                      <div>
                        <strong>Cancellation Reason:</strong>
                        <p>{interview.cancellationReason}</p>
                      </div>
                    </div>
                  )}

                  {interview.rescheduleReason && (
                    <div className="detail-row reschedule-alert">
                      <span className="detail-icon">🔄</span>
                      <div>
                        <strong>Reschedule Reason:</strong>
                        <p>{interview.rescheduleReason}</p>
                      </div>
                    </div>
                  )}

                  <div className="request-time">
                    <span>Click to view details and take actions</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No {activeTab} interviews</h3>
                <p>
                  {activeTab === 'pending' && 'You have no pending interview requests at the moment.'}
                  {activeTab === 'confirmed' && 'You have no confirmed interviews scheduled.'}
                  {activeTab === 'completed' && 'You have not completed any interviews yet.'}
                  {activeTab === 'cancelled' && 'You have no cancelled interviews.'}
                </p>
                {activeTab === 'pending' && (
                  <Link to="/profile">
                    <Button variant="primary">Complete Your Profile</Button>
                  </Link>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Interview Detail Modal */}
      {selectedInterview && (
        <InterviewDetailModal
          interview={selectedInterview}
          onClose={handleCloseModal}
          onUpdate={handleUpdateInterview}
        />
      )}
    </div>
  );
}

export default MyInterviews;
