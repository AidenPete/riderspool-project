import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './Dashboard.css';

function ProviderDashboard() {
  const { user } = useAuth();

  // Mock data - will be replaced with API calls
  const profileCompletion = 45; // percentage
  const stats = {
    upcomingInterviews: 2,
    totalInterviews: 15,
    profileViews: 48,
  };

  const pendingTasks = [
    { id: 1, task: 'Upload ID Document', icon: '🆔' },
    { id: 2, task: 'Upload Driver\'s License', icon: '📄' },
    { id: 3, task: 'Add Profile Photo', icon: '📸' },
    { id: 4, task: 'Complete Work Experience', icon: '💼' },
  ];

  const upcomingInterviews = [
    {
      id: 1,
      companyName: 'ABC Construction Ltd',
      industry: 'Construction',
      date: '2024-11-20',
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
          <Link to="/provider/profile">
            <Button variant="primary">Complete Profile</Button>
          </Link>
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
          {/* Pending Tasks */}
          <Card title="Complete Your Profile">
            <div className="task-list">
              {pendingTasks.map(item => (
                <div key={item.id} className="task-item">
                  <span className="task-icon">{item.icon}</span>
                  <span className="task-name">{item.task}</span>
                  <Link to="/provider/profile">
                    <Button variant="outline" size="small">Add</Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Interviews */}
          <Card title="Upcoming Interviews">
            {upcomingInterviews.length > 0 ? (
              <div className="interview-list">
                {upcomingInterviews.map(interview => (
                  <div key={interview.id} className="interview-item-provider">
                    <h4>{interview.companyName}</h4>
                    <p className="interview-category">{interview.industry}</p>
                    <div className="interview-details">
                      <span>📅 {interview.date} at {interview.time}</span>
                      <span>🏢 {interview.office}</span>
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
    </div>
  );
}

export default ProviderDashboard;
