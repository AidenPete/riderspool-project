import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './VerificationManagement.css';

function VerificationManagement() {
  const mockVerifications = [
    {
      id: 1,
      providerName: 'Peter Omondi',
      category: 'Truck Driver',
      email: 'peter.o@email.com',
      submittedAt: '2025-01-18',
      documents: {
        nationalId: { status: 'submitted', url: '/docs/id-1.pdf' },
        license: { status: 'submitted', url: '/docs/license-1.pdf' },
        photo: { status: 'submitted', url: '/docs/photo-1.jpg' },
      },
    },
    {
      id: 2,
      providerName: 'Grace Achieng',
      category: 'Motorbike Rider',
      email: 'grace.a@email.com',
      submittedAt: '2025-01-18',
      documents: {
        nationalId: { status: 'submitted', url: '/docs/id-2.pdf' },
        license: { status: 'submitted', url: '/docs/license-2.pdf' },
        photo: { status: 'pending', url: null },
      },
    },
  ];

  const [verifications, setVerifications] = useState(mockVerifications);

  const handleApprove = (id) => {
    if (confirm('Are you sure you want to approve this provider?')) {
      console.log('Approve verification:', id);
      alert('✅ Provider verified successfully! Email and SMS notifications sent.');
      // TODO: API call to approve
    }
  };

  const handleReject = (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      console.log('Reject verification:', id, 'Reason:', reason);
      alert('❌ Verification rejected. Provider will be notified with the reason.');
      // TODO: API call to reject
    }
  };

  return (
    <AdminLayout>
      <div className="verification-management">
        <div className="admin-page-header">
          <div>
            <h1>Verification Management</h1>
            <p>Review and approve provider documents</p>
          </div>
        </div>

        <div className="verification-cards">
          {verifications.map(verification => (
            <Card key={verification.id} className="verification-card">
              <div className="verification-header">
                <div className="provider-info">
                  <div className="provider-avatar">
                    {verification.providerName.charAt(0)}
                  </div>
                  <div>
                    <h3>{verification.providerName}</h3>
                    <p>{verification.category}</p>
                    <p className="provider-email">{verification.email}</p>
                  </div>
                </div>
                <div className="submission-date">
                  Submitted: {new Date(verification.submittedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="documents-section">
                <h4>Submitted Documents:</h4>
                <div className="documents-grid">
                  <div className="document-item">
                    <div className="document-label">
                      <span className="doc-icon">🆔</span>
                      National ID
                    </div>
                    {verification.documents.nationalId.status === 'submitted' ? (
                      <button className="btn btn-sm btn-outline">View Document</button>
                    ) : (
                      <span className="doc-pending">Pending</span>
                    )}
                  </div>
                  <div className="document-item">
                    <div className="document-label">
                      <span className="doc-icon">🪪</span>
                      Driver's License
                    </div>
                    {verification.documents.license.status === 'submitted' ? (
                      <button className="btn btn-sm btn-outline">View Document</button>
                    ) : (
                      <span className="doc-pending">Pending</span>
                    )}
                  </div>
                  <div className="document-item">
                    <div className="document-label">
                      <span className="doc-icon">📸</span>
                      Profile Photo
                    </div>
                    {verification.documents.photo.status === 'submitted' ? (
                      <button className="btn btn-sm btn-outline">View Photo</button>
                    ) : (
                      <span className="doc-pending">Pending</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="verification-actions">
                <Button variant="outline" onClick={() => handleReject(verification.id)}>
                  ❌ Reject
                </Button>
                <Button variant="primary" onClick={() => handleApprove(verification.id)}>
                  ✅ Approve
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {verifications.length === 0 && (
          <Card>
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>No pending verifications</h3>
              <p>All providers have been verified</p>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

export default VerificationManagement;
