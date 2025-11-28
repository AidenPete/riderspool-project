import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, activeTab, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('users/');
      const usersData = response.data.results || response.data || [];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by tab
    if (activeTab === 'providers') {
      filtered = filtered.filter(u => u.userType === 'provider');
    } else if (activeTab === 'employers') {
      filtered = filtered.filter(u => u.userType === 'employer');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const getTabCounts = () => ({
    all: users.length,
    providers: users.filter(u => u.userType === 'provider').length,
    employers: users.filter(u => u.userType === 'employer').length,
  });

// eslint-disable-next-line no-unused-vars
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleToggleActive = async (userId, currentStatus) => {
    const action = currentStatus ? 'disable' : 'enable';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      await api.post(`users/${userId}/toggle-active/`);
      alert(`User ${action}d successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert(`Failed to ${action} user. Please try again.`);
    }
  };

  const handleVerifyUser = async (userId) => {
    if (!window.confirm('Are you sure you want to verify this user?')) {
      return;
    }

    try {
      await api.post(`users/${userId}/verify/`);
      alert('User verified successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Failed to verify user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`users/${userId}/`);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const counts = getTabCounts();

  if (loading) {
    return (
      <AdminLayout>
        <div className="user-management">
          <div className="loading-message">Loading users...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="user-management">
        <div className="page-header">
          <div>
            <h1>User Management</h1>
            <p>Manage all platform users</p>
          </div>
          <button className="btn-refresh" onClick={fetchUsers}>
            🔄 Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Users ({counts.all})
          </button>
          <button
            className={`tab ${activeTab === 'providers' ? 'active' : ''}`}
            onClick={() => setActiveTab('providers')}
          >
            Providers ({counts.providers})
          </button>
          <button
            className={`tab ${activeTab === 'employers' ? 'active' : ''}`}
            onClick={() => setActiveTab('employers')}
          >
            Employers ({counts.employers})
          </button>
        </div>

        {/* Search */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Category/Industry</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar">
                          {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span>{user.fullName || user.companyName || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.userType}`}>
                        {user.userType}
                      </span>
                    </td>
                    <td>{user.category || user.industry || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${user.isVerified ? 'verified' : 'pending'}`}>
                        {user.isVerified ? '✓ Verified' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.is_active ? 'status-confirmed' : 'status-cancelled'}`}>
                        {user.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions" style={{ display: 'flex', gap: '5px' }}>
                        <button
                          className="action-btn"
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                          title={user.is_active ? 'Disable User' : 'Enable User'}
                        >
                          {user.is_active ? '🚫' : '✅'}
                        </button>
                        {!user.isVerified && (
                          <button
                            className="action-btn"
                            onClick={() => handleVerifyUser(user.id)}
                            title="Verify User"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          className="action-btn"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                          style={{ color: '#ef4444' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state-row">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="table-footer">
          <p>Showing {filteredUsers.length} of {users.length} users</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default UserManagement;
