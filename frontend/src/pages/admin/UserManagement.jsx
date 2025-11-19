import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './UserManagement.css';

function UserManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      name: 'John Kamau',
      email: 'john.kamau@email.com',
      userType: 'provider',
      category: 'Motorbike Rider',
      status: 'active',
      verified: true,
      joinedAt: '2024-12-15',
      lastActive: '2025-01-18',
      totalInterviews: 12,
    },
    {
      id: 2,
      name: 'ABC Construction Ltd',
      email: 'contact@abcconstruction.com',
      userType: 'employer',
      industry: 'Construction',
      contactPerson: 'Jane Smith',
      status: 'active',
      verified: true,
      joinedAt: '2024-11-20',
      lastActive: '2025-01-19',
      totalInterviews: 8,
    },
    {
      id: 3,
      name: 'Mary Wanjiku',
      email: 'mary.w@email.com',
      userType: 'provider',
      category: 'Car Driver',
      status: 'pending_verification',
      verified: false,
      joinedAt: '2025-01-18',
      lastActive: '2025-01-18',
      totalInterviews: 0,
    },
    {
      id: 4,
      name: 'Tech Solutions Inc',
      email: 'hr@techsolutions.com',
      userType: 'employer',
      industry: 'Technology',
      contactPerson: 'Michael Johnson',
      status: 'active',
      verified: true,
      joinedAt: '2024-10-05',
      lastActive: '2025-01-17',
      totalInterviews: 15,
    },
    {
      id: 5,
      name: 'Peter Omondi',
      email: 'peter.o@email.com',
      userType: 'provider',
      category: 'Truck Driver',
      status: 'suspended',
      verified: true,
      joinedAt: '2024-09-12',
      lastActive: '2025-01-10',
      totalInterviews: 5,
    },
  ];

  const [users] = useState(mockUsers);

  const tabs = [
    { id: 'all', label: 'All Users', count: users.length },
    { id: 'provider', label: 'Providers', count: users.filter(u => u.userType === 'provider').length },
    { id: 'employer', label: 'Employers', count: users.filter(u => u.userType === 'employer').length },
  ];

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'all' || user.userType === activeTab;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

    return matchesTab && matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', className: 'status-active' },
      pending_verification: { label: 'Pending Verification', className: 'status-pending' },
      suspended: { label: 'Suspended', className: 'status-suspended' },
    };
    const config = statusConfig[status] || statusConfig.active;
    return <span className={`user-status-badge ${config.className}`}>{config.label}</span>;
  };

  const handleViewUser = (userId) => {
    console.log('View user:', userId);
    // TODO: Navigate to user detail page or open modal
  };

  const handleSuspendUser = (userId) => {
    if (confirm('Are you sure you want to suspend this user?')) {
      console.log('Suspend user:', userId);
      alert('User suspended successfully');
      // TODO: API call to suspend user
    }
  };

  const handleActivateUser = (userId) => {
    if (confirm('Are you sure you want to activate this user?')) {
      console.log('Activate user:', userId);
      alert('User activated successfully');
      // TODO: API call to activate user
    }
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      console.log('Delete user:', userId);
      alert('User deleted successfully');
      // TODO: API call to delete user
    }
  };

  return (
    <AdminLayout>
      <div className="user-management">
        <div className="admin-page-header">
          <div>
            <h1>User Management</h1>
            <p>Manage employers and service providers</p>
          </div>
          <div className="admin-page-actions">
            <button className="btn btn-outline">
              📊 Export Users
            </button>
            <button className="btn btn-primary">
              ➕ Add User
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <Card className="filters-card">
          <div className="filters-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Interviews</th>
                  <th>Joined</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                          <div className="user-name">
                            {user.name}
                            {user.verified && <span className="verified-icon" title="Verified">✓</span>}
                          </div>
                          <div className="user-email">{user.email}</div>
                          {user.userType === 'provider' && (
                            <div className="user-category">{user.category}</div>
                          )}
                          {user.userType === 'employer' && (
                            <div className="user-category">{user.industry}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`user-type-badge ${user.userType}`}>
                        {user.userType === 'provider' ? '🏍️ Provider' : '🏢 Employer'}
                      </span>
                    </td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td className="text-center">{user.totalInterviews}</td>
                    <td>{new Date(user.joinedAt).toLocaleDateString()}</td>
                    <td>{new Date(user.lastActive).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="action-btn view"
                          onClick={() => handleViewUser(user.id)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        {user.status === 'active' ? (
                          <button
                            className="action-btn suspend"
                            onClick={() => handleSuspendUser(user.id)}
                            title="Suspend User"
                          >
                            ⏸️
                          </button>
                        ) : user.status === 'suspended' ? (
                          <button
                            className="action-btn activate"
                            onClick={() => handleActivateUser(user.id)}
                            title="Activate User"
                          >
                            ▶️
                          </button>
                        ) : null}
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>No users found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default UserManagement;
