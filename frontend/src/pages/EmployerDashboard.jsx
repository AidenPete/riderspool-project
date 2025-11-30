import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { interviewsAPI } from '../api';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import InterviewDetailModal from '../components/interview/InterviewDetailModal';
import './Dashboard.css';

function EmployerDashboard() {
  const user = useSelector(selectUser);
  const [interviews, setInterviews] = useState([]);
// eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Fetch interviews from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const interviewsData = await interviewsAPI.getInterviews();
        setInterviews(interviewsData.results || interviewsData || []);
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
    activeBookings: upcomingInterviews.length,
    completedInterviews: interviews.filter(i => i.status === 'completed').length,
    savedProviders: 0, // Will be updated when saved providers feature is integrated
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.contactPerson || user?.companyName}!</h1>
            <p className="dashboard-subtitle">{user?.companyName} - {user?.industry}</p>
          </div>
          <div className="dashboard-actions">
            <Link to="/post-job">
              <Button variant="primary">Post a Job</Button>
            </Link>
            <Link to="/search">
              <Button variant="outline">Find Providers</Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-number">{stats.activeBookings}</div>
            <div className="stat-label">Active Bookings</div>
          </Card>
          <Card className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-number">{stats.completedInterviews}</div>
            <div className="stat-label">Completed Interviews</div>
          </Card>
          <Card className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">{stats.savedProviders}</div>
            <div className="stat-label">Saved Providers</div>
          </Card>
        </div>

        {/* Upcoming Interviews */}
        <Card title="Upcoming Interviews">
          {upcomingInterviews.length > 0 ? (
            <div className="interview-list">
              {upcomingInterviews.map(interview => (
                <div
                  key={interview.id}
                  className="interview-item clickable"
                  onClick={() => setSelectedInterview(interview)}
                >
                  <div className="interview-info">
                    <h4>{interview.provider?.name || 'Provider'}</h4>
                    <p className="interview-category">{interview.provider?.category || 'Service Provider'}</p>
                    <div className="interview-details">
                      <span>📅 {new Date(interview.date).toLocaleDateString()} at {interview.time}</span>
                      <span>🏢 {interview.officeLocation?.name || 'Office'}</span>
                    </div>
                  </div>
                  <div className="interview-actions">
                    <span className={`status-badge status-${interview.status.toLowerCase()}`}>
                      {interview.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No upcoming interviews scheduled</p>
              <Link to="/search">
                <Button variant="primary" size="small">Find Providers</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="quick-actions-grid">
          <Card className="action-card">
            <h3>💼 My Job Postings</h3>
            <p>Manage your job listings and applications</p>
            <Link to="/employer/jobs">
              <Button variant="primary" fullWidth>View Jobs</Button>
            </Link>
          </Card>
          <Card className="action-card">
            <h3>🔍 Search Providers</h3>
            <p>Find qualified riders, drivers, and operators</p>
            <Link to="/search">
              <Button variant="secondary" fullWidth>Browse</Button>
            </Link>
          </Card>
          <Card className="action-card">
            <h3>📋 My Bookings</h3>
            <p>View and manage your interview bookings</p>
            <Link to="/bookings">
              <Button variant="secondary" fullWidth>View All</Button>
            </Link>
          </Card>
          <Card className="action-card">
            <h3>⭐ Saved Providers</h3>
            <p>Access your saved service providers</p>
            <Link to="/saved">
              <Button variant="secondary" fullWidth>View Saved</Button>
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

export default EmployerDashboard;
