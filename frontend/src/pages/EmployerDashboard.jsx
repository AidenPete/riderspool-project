import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './Dashboard.css';

function EmployerDashboard() {
  const user = useSelector(selectUser);

  // Mock data - will be replaced with API calls
  const stats = {
    activeBookings: 3,
    completedInterviews: 12,
    savedProviders: 8,
  };

  const upcomingInterviews = [
    {
      id: 1,
      providerName: 'John Kamau',
      category: 'Motorbike Rider',
      date: '2025-01-27',
      time: '10:00 AM',
      office: 'Nairobi Office',
      status: 'Confirmed',
    },
    {
      id: 2,
      providerName: 'Mary Wanjiku',
      category: 'Car Driver',
      date: '2025-01-30',
      time: '2:00 PM',
      office: 'Nairobi Office',
      status: 'Pending',
    },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.contactPerson || user?.companyName}!</h1>
            <p className="dashboard-subtitle">{user?.companyName} - {user?.industry}</p>
          </div>
          <Link to="/search">
            <Button variant="primary">Find Service Providers</Button>
          </Link>
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
                <div key={interview.id} className="interview-item">
                  <div className="interview-info">
                    <h4>{interview.providerName}</h4>
                    <p className="interview-category">{interview.category}</p>
                    <div className="interview-details">
                      <span>📅 {interview.date} at {interview.time}</span>
                      <span>🏢 {interview.office}</span>
                    </div>
                  </div>
                  <div className="interview-actions">
                    <span className={`status-badge status-${interview.status.toLowerCase()}`}>
                      {interview.status}
                    </span>
                    <Button variant="outline" size="small">View Details</Button>
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
            <h3>🏢 Company Profile</h3>
            <p>Update company details and registration</p>
            <Link to="/employer/profile">
              <Button variant="secondary" fullWidth>Edit Profile</Button>
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
    </div>
  );
}

export default EmployerDashboard;
