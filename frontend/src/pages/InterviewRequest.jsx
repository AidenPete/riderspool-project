import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './InterviewRequest.css';

function InterviewRequest() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  // Mock provider data
  const provider = {
    id: providerId,
    fullName: 'John Kamau',
    category: 'Motorbike Rider',
    location: 'Nairobi',
    profilePhoto: null,
  };

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    officeLocation: '',
    duration: '30',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const officeLocations = [
    {
      id: 1,
      name: 'Nairobi - Westlands Office',
      address: 'Westlands Square, Nairobi',
      hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
    },
    {
      id: 2,
      name: 'Nairobi - CBD Office',
      address: 'Kimathi Street, Nairobi',
      hours: 'Mon-Fri: 8:00 AM - 6:00 PM',
    },
    {
      id: 3,
      name: 'Mombasa Office',
      address: 'Moi Avenue, Mombasa',
      hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
    },
  ];

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  const durations = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }

    if (!formData.officeLocation) {
      newErrors.officeLocation = 'Please select an office location';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Interview request:', {
        providerId,
        employerId: user.id,
        ...formData,
      });

      alert('Interview request sent successfully!');
      navigate('/bookings');
    } catch (error) {
      setErrors({ submit: 'Failed to send request. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="interview-request-page">
      <Navbar />

      <div className="interview-request-container">
        <div className="request-header">
          <h1>Request Interview</h1>
          <p>Schedule an interview with {provider.fullName}</p>
        </div>

        <div className="request-layout">
          {/* Provider Info Sidebar */}
          <aside className="provider-info-sidebar">
            <Card title="Provider Details">
              <div className="provider-summary">
                <div className="provider-avatar-small">
                  {provider.profilePhoto ? (
                    <img src={provider.profilePhoto} alt={provider.fullName} />
                  ) : (
                    <div className="avatar-placeholder-small">
                      {provider.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="provider-info-text">
                  <h3>{provider.fullName}</h3>
                  <p>{provider.category}</p>
                  <p className="provider-location">📍 {provider.location}</p>
                </div>
              </div>
            </Card>

            <Card title="Interview Guidelines">
              <ul className="guidelines-list">
                <li>Arrive 10 minutes before your scheduled time</li>
                <li>Bring a valid ID for verification</li>
                <li>Prepare questions about experience and skills</li>
                <li>Interviews are conducted at Riderspool offices only</li>
                <li>You can reschedule up to 24 hours before</li>
              </ul>
            </Card>
          </aside>

          {/* Request Form */}
          <main className="request-form-section">
            <Card title="Schedule Details">
              <form onSubmit={handleSubmit} className="request-form">
                <div className="form-group">
                  <label htmlFor="date">Preferred Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    className={errors.date ? 'error' : ''}
                  />
                  {errors.date && <span className="error-message">{errors.date}</span>}
                  <p className="field-hint">Select a date (minimum 1 day in advance)</p>
                </div>

                <div className="form-group">
                  <label htmlFor="time">Preferred Time</label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={errors.time ? 'error' : ''}
                  >
                    <option value="">Select time...</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {errors.time && <span className="error-message">{errors.time}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Interview Duration</label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                  >
                    {durations.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="officeLocation">Office Location</label>
                  <select
                    id="officeLocation"
                    name="officeLocation"
                    value={formData.officeLocation}
                    onChange={handleInputChange}
                    className={errors.officeLocation ? 'error' : ''}
                  >
                    <option value="">Select office...</option>
                    {officeLocations.map(office => (
                      <option key={office.id} value={office.id}>
                        {office.name}
                      </option>
                    ))}
                  </select>
                  {errors.officeLocation && (
                    <span className="error-message">{errors.officeLocation}</span>
                  )}
                  {formData.officeLocation && (
                    <div className="office-details">
                      {officeLocations.find(o => o.id === parseInt(formData.officeLocation)) && (
                        <>
                          <p>📍 {officeLocations.find(o => o.id === parseInt(formData.officeLocation)).address}</p>
                          <p>🕐 {officeLocations.find(o => o.id === parseInt(formData.officeLocation)).hours}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Additional Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Add any specific requirements or questions for the interview..."
                  />
                  <p className="field-hint">This will be shared with the provider</p>
                </div>

                {errors.submit && (
                  <div className="error-message">{errors.submit}</div>
                )}

                <div className="form-actions">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending Request...' : 'Send Interview Request'}
                  </Button>
                </div>
              </form>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}

export default InterviewRequest;
