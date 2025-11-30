import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import './VerificationManagement.css';

function VerificationManagement() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('verifications/');
      const verificationsData = response.data.results || response.data || [];
      setVerifications(verificationsData);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTabCounts = () => ({
    all: verifications.length,
    pending: verifications.filter(v => v.status === 'pending').length,
    approved: verifications.filter(v => v.status === 'approved').length,
    rejected: verifications.filter(v => v.status === 'rejected').length,
  });

  const counts = getTabCounts();

  const tabs = [
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'approved', label: 'Approved', count: counts.approved },
    { id: 'rejected', label: 'Rejected', count: counts.rejected },
    { id: 'all', label: 'All', count: counts.all },
  ];

  const filteredVerifications = activeTab === 'all'
    ? verifications
    : verifications.filter(v => v.status === activeTab);

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this provider?')) {
      return;
    }

    try {
      await api.post(`verifications/${id}/approve/`);
      alert('Provider verified successfully! Email and SMS notifications sent.');
      fetchVerifications(); // Refresh the list
    } catch (error) {
      console.error('Error approving verification:', error);
      alert('Failed to approve verification. Please try again.');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await api.post(`verifications/${id}/reject/`, { reason });
      alert('Verification rejected. Provider will be notified with the reason.');
      fetchVerifications(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting verification:', error);
      alert('Failed to reject verification. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pending Review', class: 'status-pending' },
      approved: { label: 'Approved', class: 'status-approved' },
      rejected: { label: 'Rejected', class: 'status-rejected' },
    };
    const config = statusMap[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="verification-management">
          <div className="loading-message">Loading verifications...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="verification-management">
        <div className="admin-page-header">
          <div>
            <h1>Verification Management</h1>
            <p>Review and approve provider documents</p>
          </div>
          <button className="btn btn-outline" onClick={fetchVerifications}>
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

        <div className="verification-cards">
          {filteredVerifications.length > 0 ? (
            filteredVerifications.map(verification => {
              const provider = verification.provider || {};
              const providerName = provider.fullName || 'N/A';
              const providerEmail = provider.email || 'N/A';
              const providerCategory = provider.category || 'N/A';

              return (
                <Card key={verification.id} className="verification-card">
                  <div className="verification-header">
                    <div className="provider-info">
                      <div className="provider-avatar">
                        {providerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{providerName}</h3>
                        <p>{providerCategory}</p>
                        <p className="provider-email">{providerEmail}</p>
                      </div>
                    </div>
                    <div className="verification-meta">
                      {getStatusBadge(verification.status)}
                      <div className="submission-date">
                        Submitted: {formatDate(verification.submittedAt)}
                      </div>
                    </div>
                  </div>

                  <div className="documents-section">
                    <h4>Submitted Documents:</h4>
                    {verification.documents && verification.documents.length > 0 ? (
                      <div className="documents-grid">
                        {verification.documents.map(doc => (
                          <div key={doc.id} className="document-item">
                            <div className="document-label">
                              <span className="doc-icon">
                                {doc.documentType === 'id' ? '🆔' :
                                 doc.documentType === 'license' ? '🪪' :
                                 doc.documentType === 'profile_photo' ? '📸' : '📄'}
                              </span>
                              {doc.documentType === 'id' ? 'National ID' :
                               doc.documentType === 'license' ? "Driver's License" :
                               doc.documentType === 'profile_photo' ? 'Profile Photo' :
                               doc.documentType === 'certificate' ? 'Certificate' :
                               doc.documentType}
                            </div>
                            <div className="document-meta">
                              <small>{doc.fileName}</small>
                            </div>
                            <a
                              href={doc.document}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline"
                            >
                              View Document
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="doc-pending">No documents submitted</p>
                    )}

                    {verification.notes && (
                      <div className="verification-notes">
                        <strong>Provider Notes:</strong>
                        <p>{verification.notes}</p>
                      </div>
                    )}

                    {verification.adminNotes && (
                      <div className="admin-notes">
                        <strong>Admin Notes:</strong>
                        <p>{verification.adminNotes}</p>
                      </div>
                    )}
                  </div>

                  {verification.status === 'pending' && (
                    <div className="verification-actions">
                      <Button variant="outline" onClick={() => handleReject(verification.id)}>
                        ❌ Reject
                      </Button>
                      <Button variant="primary" onClick={() => handleApprove(verification.id)}>
                        ✅ Approve
                      </Button>
                    </div>
                  )}

                  {verification.status === 'rejected' && verification.rejectionReason && (
                    <div className="rejection-reason">
                      <strong>Rejection Reason:</strong>
                      <p>{verification.rejectionReason}</p>
                    </div>
                  )}

                  {verification.status === 'approved' && verification.verifiedAt && (
                    <div className="approved-info">
                      <span>✅ Verified on {formatDate(verification.verifiedAt)}</span>
                    </div>
                  )}
                </Card>
              );
            })
          ) : (
            <Card>
              <div className="empty-state">
                <div className="empty-icon">✅</div>
                <h3>No {activeTab !== 'all' ? activeTab : ''} verifications</h3>
                <p>
                  {activeTab === 'pending'
                    ? 'All pending verifications have been reviewed'
                    : `No ${activeTab} verifications found`}
                </p>
              </div>
            </Card>
          )}
        </div>

        <div className="table-footer">
          <p>Showing {filteredVerifications.length} of {verifications.length} verifications</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default VerificationManagement;
