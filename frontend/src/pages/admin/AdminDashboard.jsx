import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalEmployers: 0,
    pendingVerifications: 0,
    activeInterviews: 0,
    completedInterviews: 0,
  });

  const [recentInterviews, setRecentInterviews] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [usersRes, interviewsRes, verificationsRes] = await Promise.all([
        api.get('users/'),
        api.get('interviews/'),
        api.get('verifications/'),
      ]);

      // Process users data
      const users = usersRes.data.results || usersRes.data || [];
      const providers = users.filter(u => u.userType === 'provider');
      const employers = users.filter(u => u.userType === 'employer');

      // Process interviews data
      const interviews = interviewsRes.data.results || interviewsRes.data || [];
      const activeInterviews = interviews.filter(i =>
        ['pending', 'confirmed'].includes(i.status)
      );
      const completedInterviews = interviews.filter(i => i.status === 'completed');

      // Process verifications data
      const verifications = verificationsRes.data.results || verificationsRes.data || [];
      const pendingVers = verifications.filter(v => v.status === 'pending');

      // Update stats
      setStats({
        totalUsers: users.length,
        totalProviders: providers.length,
        totalEmployers: employers.length,
        pendingVerifications: pendingVers.length,
        activeInterviews: activeInterviews.length,
        completedInterviews: completedInterviews.length,
      });

      // Get recent interviews (last 5)
      const sortedInterviews = [...interviews]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentInterviews(sortedInterviews);

      // Get pending verifications (first 3)
      setPendingVerifications(pendingVers.slice(0, 3));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} min${diffInMins > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getActivityText = (interview) => {
    const employer = interview.employer?.companyName || interview.employer?.fullName || 'Employer';
    const provider = interview.provider?.name || 'Provider';

    switch (interview.status) {
      case 'pending':
        return `${employer} requested interview with ${provider}`;
      case 'confirmed':
        return `${provider} confirmed interview with ${employer}`;
      case 'completed':
        return `${employer} completed interview with ${provider}`;
      case 'cancelled':
        return `Interview between ${employer} and ${provider} was cancelled`;
      default:
        return `Interview update: ${employer} - ${provider}`;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-dashboard-compact">
          <div className="loading-message">Loading dashboard data...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard-compact">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Administrator</p>
          </div>
          <button className="btn-export" onClick={fetchDashboardData}>
            <span>🔄</span> Refresh Data
          </button>
        </div>

        {/* Stats Grid - Compact */}
        <div className="stats-compact">
          <div className="stat-card stat-primary">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers.toLocaleString()}</h3>
              <p>Total Users</p>
              <span className="stat-sub">All registered</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">🏍️</div>
            <div className="stat-info">
              <h3>{stats.totalProviders.toLocaleString()}</h3>
              <p>Providers</p>
              <span className="stat-sub">Service providers</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon">🏢</div>
            <div className="stat-info">
              <h3>{stats.totalEmployers.toLocaleString()}</h3>
              <p>Employers</p>
              <span className="stat-sub">Companies</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">✓</div>
            <div className="stat-info">
              <h3>{stats.pendingVerifications}</h3>
              <p>Pending</p>
              <span className="stat-sub">Verifications</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dash-grid">
          {/* Left Column */}
          <div className="dash-col-left">
            {/* Stats Row */}
            <div className="stats-row">
              <div className="mini-stat">
                <div className="mini-stat-label">Active Interviews</div>
                <div className="mini-stat-value">{stats.activeInterviews}</div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat-label">Completed</div>
                <div className="mini-stat-value">{stats.completedInterviews}</div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat-label">Total Interviews</div>
                <div className="mini-stat-value">{stats.activeInterviews + stats.completedInterviews}</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dash-card">
              <div className="card-header-compact">
                <h3>Recent Interview Activity</h3>
                <Link to="/admin/interviews">View All</Link>
              </div>
              <div className="activity-compact">
                {recentInterviews.length > 0 ? (
                  recentInterviews.map(interview => (
                    <div key={interview.id} className="activity-row">
                      <div className="activity-dot"></div>
                      <div className="activity-content">
                        {getActivityText(interview)}
                        <span className="activity-time">{getTimeAgo(interview.createdAt)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-small">
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="dash-col-right">
            {/* Pending Verifications */}
            <div className="dash-card">
              <div className="card-header-compact">
                <h3>Pending Verifications</h3>
                <span className="badge-count">{stats.pendingVerifications}</span>
              </div>
              <div className="verification-compact">
                {pendingVerifications.length > 0 ? (
                  pendingVerifications.map(item => (
                    <div key={item.id} className="verification-row">
                      <div className="ver-avatar">
                        {(item.provider?.fullName || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div className="ver-info">
                        <div className="ver-name">{item.provider?.fullName || 'Provider'}</div>
                        <div className="ver-category">{item.provider?.category || 'N/A'}</div>
                      </div>
                      <Link to="/admin/verifications">
                        <button className="btn-review">Review</button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-small">
                    <p>No pending verifications</p>
                  </div>
                )}
              </div>
              <Link to="/admin/verifications" className="card-footer-link">
                View All Verifications →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="dash-card">
              <div className="card-header-compact">
                <h3>Quick Actions</h3>
              </div>
              <div className="quick-actions-compact">
                <Link to="/admin/users" className="action-btn">
                  <span>👥</span> Manage Users
                </Link>
                <Link to="/admin/interviews" className="action-btn">
                  <span>📅</span> Interviews
                </Link>
                <Link to="/admin/verifications" className="action-btn">
                  <span>✓</span> Verifications
                </Link>
                <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" className="action-btn">
                  <span>⚙️</span> Django Admin
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
