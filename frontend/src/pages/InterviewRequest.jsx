import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { providersAPI, interviewsAPI, officeLocationsAPI } from '../api';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './InterviewRequest.css';

function InterviewRequest() {
  const { providerId } = useParams();
  const navigate = useNavigate();
// eslint-disable-next-line no-unused-vars
  const user = useSelector(selectUser);

  const [provider, setProvider] = useState(null);
  const [officeLocations, setOfficeLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    officeLocation: '',
    duration: '30',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch provider and office locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [providerData, officesData] = await Promise.all([
          providersAPI.getProvider(providerId),
          officeLocationsAPI.getOfficeLocations()
        ]);
        setProvider(providerData);
        setOfficeLocations(officesData.results || officesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setErrors({ fetch: 'Failed to load provider information' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providerId]);

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
      // Convert 12-hour time to 24-hour format
      const convert12to24 = (time12) => {
        const [time, modifier] = time12.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
          hours = '00';
        }

        if (modifier === 'PM') {
          hours = parseInt(hours, 10) + 12;
        }

        return `${hours}:${minutes}`;
      };

      // Prepare interview request data for API
      const interviewData = {
        provider_id: provider.user.id, // Use user ID, not provider profile ID
        date: formData.date,
        time: convert12to24(formData.time),
        officeLocation_id: parseInt(formData.officeLocation),
        notes: formData.notes,
      };

      // Create interview request via API
      await interviewsAPI.createInterview(interviewData);

      // Show success message
      alert(`✅ Interview Request Sent Successfully!

The provider has been notified and will receive notifications via email and SMS.

You will be notified when they respond.

You can track this request in your Bookings page.`);

      navigate('/bookings');
// eslint-disable-next-line no-unused-vars
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

  if (loading) {
    return (
      <PageLayout>
        <Card>
          <div className="empty-results">
            <div className="empty-icon">⏳</div>
            <h3>Loading...</h3>
            <p>Please wait while we fetch the provider information</p>
          </div>
        </Card>
      </PageLayout>
    );
  }

  if (errors.fetch || !provider) {
    return (
      <PageLayout>
        <Card>
          <div className="empty-results">
            <div className="empty-icon">⚠️</div>
            <h3>Error</h3>
            <p>{errors.fetch || 'Failed to load provider information'}</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="1200px">
      <PageHeader
        title="Request Interview"
        subtitle={`Schedule an interview with ${provider.user?.fullName || provider.registeredName}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Search Providers', path: '/search' },
          { label: 'Request Interview' }
        ]}
      />

      <div className="interview-request-container">
        <div className="request-layout">
          {/* Provider Info Sidebar */}
          <aside className="provider-info-sidebar">
            <Card title="Provider Details">
              <div className="provider-summary">
                <div className="provider-avatar-small">
                  {provider.profilePhoto ? (
                    <img src={provider.profilePhoto} alt={provider.user?.fullName || provider.registeredName} />
                  ) : (
                    <div className="avatar-placeholder-small">
                      {(provider.user?.fullName || provider.registeredName || 'P').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="provider-info-text">
                  <h3>{provider.user?.fullName || provider.registeredName}</h3>
                  <p>{provider.category}</p>
                  <p className="provider-location">📝 {provider.experience} years experience</p>
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
    </PageLayout>
  );
}

export default InterviewRequest;
