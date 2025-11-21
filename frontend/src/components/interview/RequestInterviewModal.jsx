import { useState, useEffect } from 'react';
import { interviewsAPI, officeLocationsAPI } from '../../api';
import Button from '../common/Button';
import './RequestInterviewModal.css';

function RequestInterviewModal({ provider, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    officeLocation: '',
    notes: '',
  });

  const [officeLocations, setOfficeLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch office locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await officeLocationsAPI.getOfficeLocations();
        setOfficeLocations(response.results || response);
      } catch (error) {
        console.error('Error fetching office locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) newErrors.date = 'Interview date is required';
    if (!formData.time) newErrors.time = 'Interview time is required';
    if (!formData.officeLocation) newErrors.officeLocation = 'Office location is required';

    // Check if date is in the future
    const selectedDate = new Date(formData.date + 'T' + formData.time);
    if (selectedDate <= new Date()) {
      newErrors.date = 'Interview must be scheduled for a future date and time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Validate provider has required data
    if (!provider.user?.id) {
      alert('Provider information is incomplete. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const interviewData = {
        provider_id: provider.user.id,
        date: formData.date,
        time: formData.time,
        officeLocation_id: parseInt(formData.officeLocation),
        notes: formData.notes || '',
      };

      console.log('Sending interview request:', interviewData);

      await interviewsAPI.createInterview(interviewData);

      if (onSuccess) {
        onSuccess();
      }

      alert('Interview request sent successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating interview:', error);
      // Get detailed error message
      let errorMessage = 'Failed to send interview request. Please try again.';

      if (error.response?.data) {
        const data = error.response.data;
        // Check for field-specific errors
        if (data.date) {
          errorMessage = `Date error: ${data.date}`;
        } else if (data.time) {
          errorMessage = `Time error: ${data.time}`;
        } else if (data.officeLocation_id) {
          errorMessage = `Office location error: ${data.officeLocation_id}`;
        } else if (data.provider_id) {
          errorMessage = `Provider error: ${data.provider_id}`;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else {
          // Show all errors if we can't identify the specific field
          errorMessage = JSON.stringify(data);
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const displayName = provider.registeredName || provider.user?.fullName || 'Provider';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request Interview</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="provider-info-summary">
            <div className="provider-avatar-small">
              {provider.profilePhoto ? (
                <img src={provider.profilePhoto} alt={displayName} />
              ) : (
                <div className="avatar-placeholder-small">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3>{displayName}</h3>
              <p className="text-muted">{provider.category?.replace('-', ' ')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="date">
                Interview Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={getMinDate()}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time">
                Interview Time <span className="required">*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={errors.time ? 'error' : ''}
              />
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="officeLocation">
                Office Location <span className="required">*</span>
              </label>
              <select
                id="officeLocation"
                name="officeLocation"
                value={formData.officeLocation}
                onChange={handleChange}
                className={errors.officeLocation ? 'error' : ''}
              >
                <option value="">Select office location</option>
                {officeLocations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}, {location.city}
                  </option>
                ))}
              </select>
              {errors.officeLocation && <span className="error-message">{errors.officeLocation}</span>}
              {officeLocations.length === 0 && (
                <small className="field-hint text-warning">
                  No office locations available. Please add office locations in your settings.
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Add any specific requirements or information for the interview..."
              />
            </div>

            <div className="modal-actions">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RequestInterviewModal;
