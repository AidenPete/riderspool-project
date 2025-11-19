import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/common/Card';
import './InterviewManagement.css';

function InterviewManagement() {
  const [activeTab, setActiveTab] = useState('all');

  const mockInterviews = [
    {
      id: 1,
      employer: 'ABC Construction Ltd',
      provider: 'John Kamau',
      providerCategory: 'Motorbike Rider',
      date: '2025-01-28',
      time: '10:00 AM',
      office: 'Nairobi - Westlands Office',
      status: 'confirmed',
    },
    {
      id: 2,
      employer: 'Tech Solutions Inc',
      provider: 'Mary Wanjiku',
      providerCategory: 'Car Driver',
      date: '2025-01-30',
      time: '2:00 PM',
      office: 'Nairobi - CBD Office',
      status: 'pending',
    },
    {
      id: 3,
      employer: 'Global Logistics',
      provider: 'Peter Omondi',
      providerCategory: 'Truck Driver',
      date: '2025-01-15',
      time: '11:00 AM',
      office: 'Mombasa Office',
      status: 'completed',
    },
  ];

  const [interviews] = useState(mockInterviews);

  const tabs = [
    { id: 'all', label: 'All', count: interviews.length },
    { id: 'pending', label: 'Pending', count: interviews.filter(i => i.status === 'pending').length },
    { id: 'confirmed', label: 'Confirmed', count: interviews.filter(i => i.status === 'confirmed').length },
    { id: 'completed', label: 'Completed', count: interviews.filter(i => i.status === 'completed').length },
  ];

  const filteredInterviews = activeTab === 'all' ? interviews : interviews.filter(i => i.status === activeTab);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pending', class: 'status-pending' },
      confirmed: { label: 'Confirmed', class: 'status-confirmed' },
      completed: { label: 'Completed', class: 'status-completed' },
    };
    const config = statusMap[status];
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <AdminLayout>
      <div className="interview-management">
        <div className="admin-page-header">
          <div>
            <h1>Interview Management</h1>
            <p>Monitor and manage all interviews</p>
          </div>
          <button className="btn btn-outline">📊 Export Data</button>
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
              {filteredInterviews.map(interview => (
                <tr key={interview.id}>
                  <td>#{interview.id}</td>
                  <td>{interview.employer}</td>
                  <td>
                    <div>
                      <div className="user-name">{interview.provider}</div>
                      <div className="user-category">{interview.providerCategory}</div>
                    </div>
                  </td>
                  <td>
                    {new Date(interview.date).toLocaleDateString()}<br />
                    <small>{interview.time}</small>
                  </td>
                  <td>{interview.office}</td>
                  <td>{getStatusBadge(interview.status)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn view" title="View Details">👁️</button>
                      <button className="action-btn" title="Cancel">❌</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default InterviewManagement;
