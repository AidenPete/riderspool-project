import { useState } from 'react';
import { interviewsAPI } from '../../api';
import Button from '../common/Button';
import './FeedbackModal.css';

function FeedbackModal({ interview, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState({
    comments: '',
    strengths: '',
    improvements: '',
    wouldHireAgain: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!feedback.comments.trim()) {
      alert('Please provide your feedback comments');
      return;
    }

    if (feedback.wouldHireAgain === null) {
      alert('Please indicate if you would hire this provider again');
      return;
    }

    setSubmitting(true);

    try {
      await interviewsAPI.submitFeedback(interview.id, {
        rating: rating,
        comments: feedback.comments.trim(),
        strengths: feedback.strengths.trim() || null,
        improvements: feedback.improvements.trim() || null,
        wouldHireAgain: feedback.wouldHireAgain,
      });

      alert('Thank you for your feedback! This helps build trust in our community.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error.response?.data?.error || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredRating || rating);
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-button ${isFilled ? 'filled' : ''}`}
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  const getRatingLabel = (r) => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return labels[r] || 'Rate the provider';
  };

  const providerName = interview.provider?.name || interview.provider?.fullName || 'the provider';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Rate & Review</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="feedback-intro">
            <p>How was your experience with <strong>{providerName}</strong>?</p>
            <p className="feedback-note">Your feedback helps other employers and improves our community</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="rating-section">
              <label className="section-label">Overall Rating <span className="required">*</span></label>
              <div className="stars-container">
                {renderStars()}
              </div>
              <p className="rating-label">{getRatingLabel(hoveredRating || rating)}</p>
            </div>

            {/* Comments */}
            <div className="form-group">
              <label htmlFor="comments">
                Your Feedback <span className="required">*</span>
              </label>
              <textarea
                id="comments"
                value={feedback.comments}
                onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                rows="4"
                placeholder="Share your experience working with this provider..."
                required
              />
            </div>

            {/* Strengths */}
            <div className="form-group">
              <label htmlFor="strengths">
                What did they do well? (Optional)
              </label>
              <textarea
                id="strengths"
                value={feedback.strengths}
                onChange={(e) => setFeedback({ ...feedback, strengths: e.target.value })}
                rows="3"
                placeholder="e.g., Punctual, professional, skilled..."
              />
            </div>

            {/* Areas for Improvement */}
            <div className="form-group">
              <label htmlFor="improvements">
                Areas for improvement? (Optional)
              </label>
              <textarea
                id="improvements"
                value={feedback.improvements}
                onChange={(e) => setFeedback({ ...feedback, improvements: e.target.value })}
                rows="3"
                placeholder="Constructive feedback to help them improve..."
              />
            </div>

            {/* Would Hire Again */}
            <div className="form-group">
              <label className="section-label">
                Would you hire this provider again? <span className="required">*</span>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="wouldHireAgain"
                    checked={feedback.wouldHireAgain === true}
                    onChange={() => setFeedback({ ...feedback, wouldHireAgain: true })}
                    required
                  />
                  <span>Yes, definitely</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="wouldHireAgain"
                    checked={feedback.wouldHireAgain === false}
                    onChange={() => setFeedback({ ...feedback, wouldHireAgain: false })}
                    required
                  />
                  <span>No, probably not</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="modal-actions">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FeedbackModal;
