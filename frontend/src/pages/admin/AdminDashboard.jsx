import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/common/Card';
import './AdminDashboard.css';

function AdminDashboard() {
  // Mock statistics data
  const stats = {
    totalUsers: 1247,
    totalProviders: 856,
    totalEmployers: 391,
    pendingVerifications: 23,
    activeInterviews: 45,
    completedInterviews: 312,
    revenue: 125430,
    newUsersThisMonth: 87,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'user_registration',
      user: 'Jane Doe',
      userType: 'provider',
      action: 'registered as Motorbike Rider',
      timestamp: '2 minutes ago',
      icon: '👤',
    },
    {
      id: 2,
      type: 'interview_completed',
      user: 'ABC Construction Ltd',
      action: 'completed interview with John Kamau',
      timestamp: '15 minutes ago',
      icon: '✓',
    },
    {
      id: 3,
      type: 'verification_pending',
      user: 'Mary Wanjiku',
      action: 'submitted documents for verification',
      timestamp: '1 hour ago',
      icon: '📄',
    },
    {
      id: 4,
      type: 'payment_received',
      user: 'Tech Solutions Inc',
      action: 'paid interview fee: KSh 2,500',
      timestamp: '2 hours ago',
      icon: '💰',
    },
    {
      id: 5,
      type: 'user_registration',
      user: 'Global Logistics',
      userType: 'employer',
      action: 'registered as Employer',
      timestamp: '3 hours ago',
      icon: '🏢',
    },
  ];

  const pendingVerifications = [
    {
      id: 1,
      name: 'Peter Omondi',
      category: 'Truck Driver',
      submittedAt: '2025-01-18',
      documents: ['ID', 'License', 'Photo'],
    },
    {
      id: 2,
      name: 'Grace Achieng',
      category: 'Motorbike Rider',
      submittedAt: '2025-01-18',
      documents: ['ID', 'License'],
    },
    {
      id: 3,
      name: 'David Mwangi',
      category: 'Car Driver',
      submittedAt: '2025-01-17',
      documents: ['ID', 'License', 'Photo'],
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Monitor and manage your Riderspool platform</p>
          </div>
          <div className="admin-page-actions">
            <button className="btn btn-outline">
              📊 Generate Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <Card className="admin-stat-card">
            <div className="stat-icon users">👥</div>
            <div className="stat-details">
              <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
              <div className="stat-label">Total Users</div>
              <div className="stat-change positive">+{stats.newUsersThisMonth} this month</div>
            </div>
          </Card>

          <Card className="admin-stat-card">
            <div className="stat-icon providers">🏍️</div>
            <div className="stat-details">
              <div className="stat-value">{stats.totalProviders.toLocaleString()}</div>
              <div className="stat-label">Service Providers</div>
              <div className="stat-change">Across all categories</div>
            </div>
          </Card>

          <Card className="admin-stat-card">
            <div className="stat-icon employers">🏢</div>
            <div className="stat-details">
              <div className="stat-value">{stats.totalEmployers.toLocaleString()}</div>
              <div className="stat-label">Employers</div>
              <div className="stat-change">Active companies</div>
            </div>
          </Card>

          <Card className="admin-stat-card">
            <div className="stat-icon interviews">📅</div>
            <div className="stat-details">
              <div className="stat-value">{stats.activeInterviews}</div>
              <div className="stat-label">Active Interviews</div>
              <div className="stat-change">{stats.completedInterviews} completed</div>
            </div>
          </Card>

          <Card className="admin-stat-card">
            <div className="stat-icon verifications">✓</div>
            <div className="stat-details">
              <div className="stat-value">{stats.pendingVerifications}</div>
              <div className="stat-label">Pending Verifications</div>
              <div className="stat-change warning">Requires attention</div>
            </div>
          </Card>

          <Card className="admin-stat-card">
            <div className="stat-icon revenue">💰</div>
            <div className="stat-details">
              <div className="stat-value">KSh {stats.revenue.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-change positive">+12% from last month</div>
            </div>
          </Card>
        </div>

        <div className="admin-dashboard-grid">
          {/* Recent Activity */}
          <Card title="Recent Activity" className="admin-activity-card">
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-details">
                    <div className="activity-user">{activity.user}</div>
                    <div className="activity-action">{activity.action}</div>
                    <div className="activity-time">{activity.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/activity" className="view-all-link">
              View All Activity →
            </Link>
          </Card>

          {/* Pending Verifications */}
          <Card title="Pending Verifications" className="admin-verification-card">
            <div className="verification-list">
              {pendingVerifications.map(verification => (
                <div key={verification.id} className="verification-item">
                  <div className="verification-info">
                    <h4>{verification.name}</h4>
                    <p>{verification.category}</p>
                    <div className="verification-docs">
                      {verification.documents.map((doc, idx) => (
                        <span key={idx} className="doc-badge">{doc}</span>
                      ))}
                    </div>
                  </div>
                  <div className="verification-actions">
                    <button className="btn btn-sm btn-primary">Review</button>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/verifications" className="view-all-link">
              View All Verifications →
            </Link>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="quick-actions-grid">
            <Link to="/admin/users" className="quick-action-card">
              <div className="quick-action-icon">👥</div>
              <div className="quick-action-label">Manage Users</div>
            </Link>
            <Link to="/admin/interviews" className="quick-action-card">
              <div className="quick-action-icon">📅</div>
              <div className="quick-action-label">View Interviews</div>
            </Link>
            <Link to="/admin/verifications" className="quick-action-card">
              <div className="quick-action-icon">✓</div>
              <div className="quick-action-label">Verify Providers</div>
            </Link>
            <Link to="/admin/reports" className="quick-action-card">
              <div className="quick-action-icon">📈</div>
              <div className="quick-action-label">Generate Reports</div>
            </Link>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
