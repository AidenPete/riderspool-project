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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                <th>Joined</th>
                <th>Last Active</th>
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
                    <td>{formatDate(user.dateJoined)}</td>
                    <td>{formatDate(user.lastActive)}</td>
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
