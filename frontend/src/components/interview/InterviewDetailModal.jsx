import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { interviewsAPI } from '../../api';
import { getMediaUrl } from '../../api/axios';
import Button from '../common/Button';
import './InterviewDetailModal.css';

function InterviewDetailModal({ interview, onClose, onUpdate }) {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    rescheduleReason: '',
  });

  const isProvider = user?.userType === 'provider';
  const isEmployer = user?.userType === 'employer';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleConfirm = async () => {
    if (!window.confirm('Are you sure you want to confirm this interview?')) {
      return;
    }

    setLoading(true);
    try {
      await interviewsAPI.confirmInterview(interview.id);
      alert('Interview confirmed successfully!');
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error('Error confirming interview:', error);
      alert(error.response?.data?.error || 'Failed to confirm interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    setLoading(true);
    try {
      await interviewsAPI.cancelInterview(interview.id, cancelReason);
      alert('Interview cancelled successfully');
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error('Error cancelling interview:', error);
      alert(error.response?.data?.error || 'Failed to cancel interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();

    if (!rescheduleData.date || !rescheduleData.time || !rescheduleData.rescheduleReason.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await interviewsAPI.rescheduleInterview(interview.id, rescheduleData);
      alert('Interview rescheduled successfully! The other party will be notified.');
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error('Error rescheduling interview:', error);
      alert(error.response?.data?.error || 'Failed to reschedule interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsHired = async () => {
    if (!window.confirm('Mark this provider as hired? This will grant you access to their sensitive information.')) {
      return;
    }

    setLoading(true);
    try {
      await interviewsAPI.markAsHired(interview.id);
      alert('Provider marked as hired successfully!');
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error('Error marking as hired:', error);
      alert(error.response?.data?.error || 'Failed to mark provider as hired. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { label: 'Confirmed', className: 'confirmed' },
      pending: { label: 'Pending', className: 'pending' },
      completed: { label: 'Completed', className: 'completed' },
      cancelled: { label: 'Cancelled', className: 'cancelled' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  // Get the other party's info
  const otherParty = isProvider ? interview.employer : interview.provider;
  const displayName = isProvider
    ? (interview.employer?.companyName || interview.employer?.fullName || 'Employer')
    : (interview.provider?.name || 'Provider');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content interview-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Interview Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Status */}
          <div className="detail-section">
            {getStatusBadge(interview.status)}
          </div>

          {/* Other Party Info */}
          <div className="detail-section">
            <h3>{isProvider ? 'Employer' : 'Service Provider'}</h3>
            <div className="party-info">
              <div className="provider-avatar-small">
                {otherParty?.profilePhoto ? (
                  <img src={getMediaUrl(otherParty.profilePhoto)} alt={displayName} />
                ) : (
                  <div className="avatar-placeholder-small">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h4>{displayName}</h4>
                {isEmployer && interview.provider && (
                  <>
                    <p className="text-muted">{interview.provider.category}</p>
                    <div className="provider-rating-small">
                      {renderStars(Math.round(interview.provider.rating || 0))}
                      <span>{interview.provider.rating || 'N/A'}</span>
                    </div>
                  </>
                )}
                {isProvider && interview.employer && (
                  <p className="text-muted">{interview.employer.industry || 'Company'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-icon">📅</span>
              <div>
                <strong>Date & Time:</strong>
                <p>{formatDate(interview.date)} at {interview.time}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-icon">🏢</span>
              <div>
                <strong>Location:</strong>
                <p>{interview.officeLocation?.name || 'Office location'}</p>
                <p className="office-address">
                  {interview.officeLocation?.address || ''} {interview.officeLocation?.city || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {interview.notes && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-icon">📝</span>
                <div>
                  <strong>Notes:</strong>
                  <p>{interview.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Reason */}
          {interview.status === 'cancelled' && interview.cancellationReason && (
            <div className="detail-section alert-section">
              <div className="detail-row">
                <span className="detail-icon">❌</span>
                <div>
                  <strong>Cancellation Reason:</strong>
                  <p>{interview.cancellationReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reschedule Reason */}
          {interview.rescheduleReason && (
            <div className="detail-section alert-section">
              <div className="detail-row">
                <span className="detail-icon">🔄</span>
                <div>
                  <strong>Reschedule Reason:</strong>
                  <p>{interview.rescheduleReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Form */}
          {showCancelForm && (
            <div className="detail-section form-section">
              <h3>Cancel Interview</h3>
              <div className="form-group">
                <label htmlFor="cancelReason">
                  Cancellation Reason <span className="required">*</span>
                </label>
                <textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows="4"
                  placeholder="Please provide a reason for cancelling..."
                />
              </div>
              <div className="form-actions">
                <Button variant="outline" onClick={() => setShowCancelForm(false)}>
                  Back
                </Button>
                <Button variant="danger" onClick={handleCancel} disabled={loading}>
                  {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                </Button>
              </div>
            </div>
          )}

          {/* Reschedule Form */}
          {showRescheduleForm && (
            <div className="detail-section form-section">
              <h3>Reschedule Interview</h3>
              <form onSubmit={handleReschedule}>
                <div className="form-group">
                  <label htmlFor="newDate">
                    New Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="newDate"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                    min={getMinDate()}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newTime">
                    New Time <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    id="newTime"
                    value={rescheduleData.time}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rescheduleReason">
                    Reason for Rescheduling <span className="required">*</span>
                  </label>
                  <textarea
                    id="rescheduleReason"
                    value={rescheduleData.rescheduleReason}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, rescheduleReason: e.target.value })}
                    rows="4"
                    placeholder="Please explain why you need to reschedule..."
                    required
                  />
                </div>
                <div className="form-actions">
                  <Button type="button" variant="outline" onClick={() => setShowRescheduleForm(false)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Action Buttons */}
          {!showCancelForm && !showRescheduleForm && (
            <div className="modal-actions">
              {/* Provider can confirm pending interviews */}
              {isProvider && interview.status === 'pending' && (
                <Button variant="primary" onClick={handleConfirm} disabled={loading}>
                  Confirm Interview
                </Button>
              )}

              {/* Employer can mark provider as hired for completed interviews */}
              {isEmployer && interview.status === 'completed' && !interview.isHired && (
                <Button variant="primary" onClick={handleMarkAsHired} disabled={loading}>
                  Mark as Hired
                </Button>
              )}

              {/* Show hired status if already hired */}
              {interview.status === 'completed' && interview.isHired && (
                <div className="hired-badge">
                  ✓ Provider Hired
                </div>
              )}

              {/* Both can reschedule confirmed/pending interviews */}
              {['pending', 'confirmed'].includes(interview.status) && (
                <Button variant="outline" onClick={() => setShowRescheduleForm(true)}>
                  Reschedule
                </Button>
              )}

              {/* Both can cancel pending/confirmed interviews */}
              {['pending', 'confirmed'].includes(interview.status) && (
                <Button variant="danger" onClick={() => setShowCancelForm(true)}>
                  Cancel
                </Button>
              )}

              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewDetailModal;
