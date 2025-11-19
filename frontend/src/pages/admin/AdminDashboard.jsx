import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminDashboard.css';

function AdminDashboard() {
  const stats = {
    totalUsers: 1247,
    totalProviders: 856,
    totalEmployers: 391,
    pendingVerifications: 23,
    activeInterviews: 45,
    completedInterviews: 312,
    revenue: 125430,
    newUsersToday: 12,
  };

  const recentActivity = [
    { id: 1, user: 'Jane Doe', action: 'registered as Motorbike Rider', time: '2 min ago', type: 'user' },
    { id: 2, user: 'ABC Construction', action: 'completed interview', time: '15 min ago', type: 'interview' },
    { id: 3, user: 'Mary Wanjiku', action: 'submitted verification docs', time: '1 hr ago', type: 'verification' },
    { id: 4, user: 'Tech Solutions', action: 'paid KSh 2,500', time: '2 hrs ago', type: 'payment' },
  ];

  const pendingVerifications = [
    { id: 1, name: 'Peter Omondi', category: 'Truck Driver', date: '2025-01-18' },
    { id: 2, name: 'Grace Achieng', category: 'Motorbike Rider', date: '2025-01-18' },
    { id: 3, name: 'David Mwangi', category: 'Car Driver', date: '2025-01-17' },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard-compact">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Administrator</p>
          </div>
          <button className="btn-export">
            <span>📊</span> Export Report
          </button>
        </div>

        {/* Stats Grid - Compact */}
        <div className="stats-compact">
          <div className="stat-card stat-primary">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers.toLocaleString()}</h3>
              <p>Total Users</p>
              <span className="stat-sub">+{stats.newUsersToday} today</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">🏍️</div>
            <div className="stat-info">
              <h3>{stats.totalProviders.toLocaleString()}</h3>
              <p>Providers</p>
              <span className="stat-sub">Active</span>
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
                <div className="mini-stat-label">Revenue</div>
                <div className="mini-stat-value">KSh {(stats.revenue / 1000).toFixed(0)}K</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dash-card">
              <div className="card-header-compact">
                <h3>Recent Activity</h3>
                <Link to="/admin/activity">View All</Link>
              </div>
              <div className="activity-compact">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="activity-row">
                    <div className="activity-dot"></div>
                    <div className="activity-content">
                      <strong>{activity.user}</strong> {activity.action}
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="dash-col-right">
            {/* Pending Verifications */}
            <div className="dash-card">
              <div className="card-header-compact">
                <h3>Pending Verifications</h3>
                <span className="badge-count">{pendingVerifications.length}</span>
              </div>
              <div className="verification-compact">
                {pendingVerifications.map(item => (
                  <div key={item.id} className="verification-row">
                    <div className="ver-avatar">{item.name.charAt(0)}</div>
                    <div className="ver-info">
                      <div className="ver-name">{item.name}</div>
                      <div className="ver-category">{item.category}</div>
                    </div>
                    <button className="btn-review">Review</button>
                  </div>
                ))}
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
                <Link to="/admin/reports" className="action-btn">
                  <span>📈</span> Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
