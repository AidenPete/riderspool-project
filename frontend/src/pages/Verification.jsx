import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { verificationsAPI } from '../api';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './Verification.css';

function Verification() {
// eslint-disable-next-line no-unused-vars
  const user = useSelector(selectUser);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const [documents, setDocuments] = useState({
    nationalId: null,
    drivingLicense: null,
  });

  const [uploadProgress, setUploadProgress] = useState({
    nationalId: false,
    drivingLicense: false,
  });

  useEffect(() => {
    fetchVerification();
  }, []);

  const fetchVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await verificationsAPI.getMyVerification();
      setVerification(data);
    } catch (err) {
      // If no verification exists yet, that's okay
      if (err.response?.status === 404) {
        setVerification(null);
      } else {
        console.error('Error fetching verification:', err);
        setError('Failed to load verification status');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (documentType, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, PNG, and PDF files are allowed');
        return;
      }

      setDocuments(prev => ({
        ...prev,
        [documentType]: file,
      }));
    }
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();

    if (!documents.nationalId || !documents.drivingLicense) {
      alert('Please upload National ID and Driving License (required)');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create verification if it doesn't exist
      let verificationId = verification?.id;
      if (!verificationId) {
        const newVerification = await verificationsAPI.createVerification();
        verificationId = newVerification.id;
        setVerification(newVerification);
      }

      // Upload each document
      const documentTypes = [
        { key: 'nationalId', type: 'id' },
        { key: 'drivingLicense', type: 'license' },
      ];

      for (const docType of documentTypes) {
        setUploadProgress(prev => ({ ...prev, [docType.key]: true }));

        await verificationsAPI.uploadDocument(verificationId, {
          documentType: docType.type,
          document: documents[docType.key],
          fileName: documents[docType.key].name,
          fileSize: documents[docType.key].size,
        });

        setUploadProgress(prev => ({ ...prev, [docType.key]: false }));
      }

      alert('Documents uploaded successfully! Your verification will be reviewed within 24 hours.');

      // Refresh verification status
      await fetchVerification();

      // Clear form
      setDocuments({
        nationalId: null,
        drivingLicense: null,
      });

      // Reset file inputs
      document.querySelectorAll('input[type="file"]').forEach(input => {
        input.value = '';
      });

    } catch (err) {
      console.error('Error submitting verification:', err);
      setError(err.response?.data?.error || 'Failed to upload documents. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({
        nationalId: false,
        drivingLicense: false,
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending Review', className: 'pending', icon: '⏳' },
      approved: { label: 'Verified', className: 'approved', icon: '✓' },
      rejected: { label: 'Rejected', className: 'rejected', icon: '✗' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.className}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="verification-container">
          <h1>Loading...</h1>
        </div>
      </PageLayout>
    );
  }

  const canUpload = !verification || verification.status === 'rejected';

  return (
    <PageLayout maxWidth="1000px">
      <PageHeader
        title="Document Verification"
        subtitle="Get verified to gain employer trust and unlock more opportunities"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Verification' }
        ]}
      />

      <div className="verification-container">

        {/* Current Status */}
        {verification && (
          <Card title="Verification Status">
            <div className="verification-status">
              <div className="status-info">
                {getStatusBadge(verification.status)}
                <p className="status-date">
                  Submitted on {new Date(verification.submittedAt).toLocaleDateString()}
                </p>
              </div>

              {verification.status === 'approved' && verification.verifiedAt && (
                <div className="status-message success">
                  <strong>Congratulations!</strong> Your documents have been verified on{' '}
                  {new Date(verification.verifiedAt).toLocaleDateString()}.
                  {verification.adminNotes && <p className="admin-note">Note: {verification.adminNotes}</p>}
                </div>
              )}

              {verification.status === 'rejected' && (
                <div className="status-message error">
                  <strong>Verification Rejected</strong>
                  <p>Your documents were rejected. Please review the reason below and resubmit with correct documents.</p>
                  {verification.rejectionReason && (
                    <p className="rejection-reason"><strong>Reason:</strong> {verification.rejectionReason}</p>
                  )}
                  {verification.adminNotes && (
                    <p className="admin-note"><strong>Admin Notes:</strong> {verification.adminNotes}</p>
                  )}
                </div>
              )}

              {verification.status === 'pending' && (
                <div className="status-message info">
                  <strong>Under Review</strong>
                  <p>Your documents are being reviewed by our team. This usually takes 1-2 business days.</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Upload Form */}
        {canUpload && (
          <Card title="Upload Verification Documents">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitVerification} className="verification-form">
              <div className="form-instructions">
                <p className="instructions-text">
                  Upload clear photos of your National ID and Driving License to get verified
                </p>
                <p className="file-requirements">
                  <strong>Requirements:</strong> JPG, PNG, or PDF · Max 5MB per file
                </p>
              </div>

              <div className="documents-upload">
                <div className="form-group">
                  <label htmlFor="nationalId" className="upload-label">
                    <div className="upload-icon">📄</div>
                    <span className="upload-text">National ID</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="file"
                    id="nationalId"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange('nationalId', e)}
                    disabled={uploading}
                    required
                  />
                  {documents.nationalId && (
                    <p className="file-selected">✓ {documents.nationalId.name}</p>
                  )}
                  {uploadProgress.nationalId && (
                    <p className="uploading">Uploading...</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="drivingLicense" className="upload-label">
                    <div className="upload-icon">🚗</div>
                    <span className="upload-text">Driving License</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="file"
                    id="drivingLicense"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange('drivingLicense', e)}
                    disabled={uploading}
                    required
                  />
                  {documents.drivingLicense && (
                    <p className="file-selected">✓ {documents.drivingLicense.name}</p>
                  )}
                  {uploadProgress.drivingLicense && (
                    <p className="uploading">Uploading...</p>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <Button type="submit" variant="primary" disabled={uploading} fullWidth size="large">
                  {uploading ? 'Uploading...' : 'Submit for Verification'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Benefits */}
        {!verification && (
          <Card title="Why Get Verified?">
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">🛡️</div>
                <h4>Build Trust</h4>
                <p>Verified providers get 3x more interview requests from employers</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">⭐</div>
                <h4>Stand Out</h4>
                <p>Verification badge displayed prominently on your profile</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🚀</div>
                <h4>Priority Listing</h4>
                <p>Verified providers appear higher in search results</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">💼</div>
                <h4>Access Premium Jobs</h4>
                <p>Some employers only hire verified providers</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}

export default Verification;
