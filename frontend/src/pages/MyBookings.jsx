import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { interviewsAPI } from '../api';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import InterviewDetailModal from '../components/interview/InterviewDetailModal';
import './MyBookings.css';

function MyBookings() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch interviews from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await interviewsAPI.getInterviews();
      setBookings(response.results || response);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Mock bookings data (fallback)
  const mockBookings = [
    {
      id: 1,
      provider: {
        id: 1,
        name: 'John Kamau',
        category: 'Motorbike Rider',
        profilePhoto: null,
        rating: 4.8,
      },
      date: '2025-01-28',
      time: '10:00 AM',
      duration: '30 minutes',
      office: {
        name: 'Nairobi - Westlands Office',
        address: 'Westlands Square, Nairobi',
      },
      status: 'confirmed',
      notes: 'Looking for a reliable delivery rider for daily operations.',
      bookedAt: '2025-01-20',
    },
    {
      id: 2,
      provider: {
        id: 2,
        name: 'Mary Wanjiku',
        category: 'Car Driver',
        profilePhoto: null,
        rating: 4.9,
      },
      date: '2025-02-05',
      time: '2:00 PM',
      duration: '45 minutes',
      office: {
        name: 'Nairobi - CBD Office',
        address: 'Kimathi Street, Nairobi',
      },
      status: 'pending',
      notes: 'Need experienced SUV driver for corporate use.',
      bookedAt: '2025-01-22',
    },
    {
      id: 3,
      provider: {
        id: 3,
        name: 'Peter Omondi',
        category: 'Truck Driver',
        profilePhoto: null,
        rating: 4.7,
      },
      date: '2025-01-10',
      time: '11:00 AM',
      duration: '1 hour',
      office: {
        name: 'Mombasa Office',
        address: 'Moi Avenue, Mombasa',
      },
      status: 'completed',
      notes: 'Long-haul truck driver for cargo transportation.',
      bookedAt: '2025-01-03',
      review: {
        rating: 5,
        comment: 'Excellent driver, very professional!',
      },
    },
    {
      id: 4,
      provider: {
        id: 4,
        name: 'Grace Achieng',
        category: 'Motorbike Rider',
        profilePhoto: null,
        rating: 4.6,
      },
      date: '2025-01-08',
      time: '9:00 AM',
      duration: '30 minutes',
      office: {
        name: 'Nairobi - Westlands Office',
        address: 'Westlands Square, Nairobi',
      },
      status: 'cancelled',
      notes: 'Delivery rider for express services.',
      bookedAt: '2024-12-30',
      cancelReason: 'Provider no longer available',
    },
  ];

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length },
    { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
  ];

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return ['confirmed', 'pending'].includes(booking.status);
    }
    return booking.status === activeTab;
  });

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  const handleUpdateBooking = () => {
    fetchBookings();
    setSelectedBooking(null);
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

  return (
    <div className="bookings-page">
      <Navbar />

      <div className="bookings-container">
        {/* Back Button */}
        <div className="bookings-back-button">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>

        <div className="bookings-header">
          <div>
            <h1>My Bookings</h1>
            <p>Manage your interview bookings</p>
          </div>
          <Link to="/search">
            <Button variant="primary">Find More Providers</Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="bookings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
              <Card
                key={booking.id}
                className="booking-card clickable-card"
                onClick={() => handleViewDetails(booking)}
              >
                <div className="booking-header">
                  <div className="booking-provider-info">
                    <div className="provider-avatar-small">
                      {booking.provider?.profilePhoto ? (
                        <img src={booking.provider.profilePhoto} alt={booking.provider?.name || 'Provider'} />
                      ) : (
                        <div className="avatar-placeholder-small">
                          {(booking.provider?.name || 'P').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3>{booking.provider?.name || 'Unknown Provider'}</h3>
                      <p className="provider-category">{booking.provider?.category || 'Service Provider'}</p>
                      <div className="provider-rating-small">
                        {renderStars(Math.round(booking.provider?.rating || 0))}
                        <span>{booking.provider?.rating || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <div>
                      <strong>Date & Time:</strong>
                      <p>{formatDate(booking.date)} at {booking.time}</p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">🏢</span>
                    <div>
                      <strong>Location:</strong>
                      <p>{booking.officeLocation?.name || booking.office?.name || 'Office location'}</p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="detail-row">
                      <span className="detail-icon">📝</span>
                      <div>
                        <strong>Notes:</strong>
                        <p className="truncate-text">{booking.notes}</p>
                      </div>
                    </div>
                  )}

                  {booking.status === 'cancelled' && booking.cancellationReason && (
                    <div className="detail-row cancel-alert">
                      <span className="detail-icon">❌</span>
                      <div>
                        <strong>Cancellation Reason:</strong>
                        <p>{booking.cancellationReason}</p>
                      </div>
                    </div>
                  )}

                  {booking.rescheduleReason && (
                    <div className="detail-row reschedule-alert">
                      <span className="detail-icon">🔄</span>
                      <div>
                        <strong>Reschedule Reason:</strong>
                        <p>{booking.rescheduleReason}</p>
                      </div>
                    </div>
                  )}

                  <div className="click-hint">
                    <span>Click to view details and take actions</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>No {activeTab} bookings</h3>
                <p>
                  {activeTab === 'upcoming' && 'You have no upcoming interview bookings.'}
                  {activeTab === 'completed' && 'You have not completed any interviews yet.'}
                  {activeTab === 'cancelled' && 'You have no cancelled bookings.'}
                </p>
                {activeTab === 'upcoming' && (
                  <Link to="/search">
                    <Button variant="primary">Find Service Providers</Button>
                  </Link>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Interview Detail Modal */}
      {selectedBooking && (
        <InterviewDetailModal
          interview={selectedBooking}
          onClose={handleCloseModal}
          onUpdate={handleUpdateBooking}
        />
      )}
    </div>
  );
}

export default MyBookings;
