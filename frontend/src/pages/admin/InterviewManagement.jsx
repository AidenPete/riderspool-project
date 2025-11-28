import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/common/Card';
import api from '../../api/axios';
import './InterviewManagement.css';

function InterviewManagement() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('interviews/');
      const interviewsData = response.data.results || response.data || [];
      setInterviews(interviewsData);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTabCounts = () => ({
    all: interviews.length,
    pending: interviews.filter(i => i.status === 'pending').length,
    confirmed: interviews.filter(i => i.status === 'confirmed').length,
    completed: interviews.filter(i => i.status === 'completed').length,
    cancelled: interviews.filter(i => i.status === 'cancelled').length,
  });

  const counts = getTabCounts();

  const tabs = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'confirmed', label: 'Confirmed', count: counts.confirmed },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ];

  const filteredInterviews = activeTab === 'all'
    ? interviews
    : interviews.filter(i => i.status === activeTab);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pending', class: 'status-pending' },
      confirmed: { label: 'Confirmed', class: 'status-confirmed' },
      completed: { label: 'Completed', class: 'status-completed' },
      cancelled: { label: 'Cancelled', class: 'status-cancelled' },
    };
    const config = statusMap[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return { date, time: timeString || 'N/A' };
  };

  const handleCancelInterview = async (interviewId) => {
    const reason = window.prompt('Please provide a reason for cancelling this interview:');
    if (!reason) return;

    try {
      await api.post(`interviews/${interviewId}/cancel/`, { cancellationReason: reason });
      alert('Interview cancelled successfully');
      fetchInterviews();
    } catch (error) {
      console.error('Error cancelling interview:', error);
      alert('Failed to cancel interview. Please try again.');
    }
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`interviews/${interviewId}/`);
      alert('Interview deleted successfully');
      fetchInterviews();
    } catch (error) {
      console.error('Error deleting interview:', error);
      alert('Failed to delete interview. Please try again.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="interview-management">
          <div className="loading-message">Loading interviews...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="interview-management">
        <div className="admin-page-header">
          <div>
            <h1>Interview Management</h1>
            <p>Monitor and manage all interviews</p>
          </div>
          <button className="btn btn-outline" onClick={fetchInterviews}>
            🔄 Refresh
          </button>
        </div>

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

        <Card>
          <table className="users-table">
            <thead>
              <tr>
                <th>Interview ID</th>
                <th>Employer</th>
                <th>Provider</th>
                <th>Date & Time</th>
                <th>Office</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterviews.length > 0 ? (
                filteredInterviews.map(interview => {
                  const { date, time } = formatDateTime(interview.date, interview.time);
                  const employerName = interview.employer?.companyName || interview.employer?.fullName || 'N/A';
                  const providerName = interview.provider?.fullName || interview.provider?.registeredName || 'N/A';
                  const providerCategory = interview.provider?.category || 'N/A';
                  const officeName = interview.officeLocation?.name || 'N/A';

                  return (
                    <tr key={interview.id}>
                      <td>#{interview.id}</td>
                      <td>{employerName}</td>
                      <td>
                        <div>
                          <div className="user-name">{providerName}</div>
                          <div className="user-category">{providerCategory}</div>
                        </div>
                      </td>
                      <td>
                        {date}<br />
                        <small>{time}</small>
                      </td>
                      <td>{officeName}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {getStatusBadge(interview.status)}
                          {interview.status === 'completed' && interview.isHired && (
                            <span className="badge badge-success" style={{ fontSize: '11px' }}>
                              ✓ Hired
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="table-actions" style={{ display: 'flex', gap: '5px' }}>
                          {interview.status === 'pending' && (
                            <button
                              className="action-btn"
                              onClick={() => handleCancelInterview(interview.id)}
                              title="Cancel Interview"
                            >
                              ❌
                            </button>
                          )}
                          {interview.status === 'confirmed' && (
                            <button
                              className="action-btn"
                              onClick={() => handleCancelInterview(interview.id)}
                              title="Cancel Interview"
                            >
                              ❌
                            </button>
                          )}
                          <button
                            className="action-btn"
                            onClick={() => handleDeleteInterview(interview.id)}
                            title="Delete Interview"
                            style={{ color: '#ef4444' }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state-row">
                    No interviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        <div className="table-footer">
          <p>Showing {filteredInterviews.length} of {interviews.length} interviews</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default InterviewManagement;
