import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './MyBookings.css';

function MyBookings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock bookings data
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
      date: '2024-11-22',
      time: '10:00 AM',
      duration: '30 minutes',
      office: {
        name: 'Nairobi - Westlands Office',
        address: 'Westlands Square, Nairobi',
      },
      status: 'confirmed',
      notes: 'Looking for a reliable delivery rider for daily operations.',
      bookedAt: '2024-11-18',
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
      date: '2024-11-23',
      time: '2:00 PM',
      duration: '45 minutes',
      office: {
        name: 'Nairobi - CBD Office',
        address: 'Kimathi Street, Nairobi',
      },
      status: 'pending',
      notes: 'Need experienced SUV driver for corporate use.',
      bookedAt: '2024-11-19',
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
      date: '2024-11-10',
      time: '11:00 AM',
      duration: '1 hour',
      office: {
        name: 'Mombasa Office',
        address: 'Moi Avenue, Mombasa',
      },
      status: 'completed',
      notes: 'Long-haul truck driver for cargo transportation.',
      bookedAt: '2024-11-05',
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
      date: '2024-11-08',
      time: '9:00 AM',
      duration: '30 minutes',
      office: {
        name: 'Nairobi - Westlands Office',
        address: 'Westlands Square, Nairobi',
      },
      status: 'cancelled',
      notes: 'Delivery rider for express services.',
      bookedAt: '2024-11-02',
      cancelReason: 'Provider no longer available',
    },
  ];

  const [bookings] = useState(mockBookings);

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

  const handleCancelBooking = (bookingId) => {
    if (confirm('Are you sure you want to cancel this interview?')) {
      // TODO: API call to cancel booking
      alert('Booking cancelled successfully!');
    }
  };

  const handleReschedule = (bookingId) => {
    alert('Reschedule feature coming soon!');
    // TODO: Navigate to reschedule page
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
              <Card key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-provider-info">
                    <div className="provider-avatar-small">
                      {booking.provider.profilePhoto ? (
                        <img src={booking.provider.profilePhoto} alt={booking.provider.name} />
                      ) : (
                        <div className="avatar-placeholder-small">
                          {booking.provider.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <Link to={`/provider/${booking.provider.id}`} className="provider-name-link">
                        <h3>{booking.provider.name}</h3>
                      </Link>
                      <p className="provider-category">{booking.provider.category}</p>
                      <div className="provider-rating-small">
                        {renderStars(Math.round(booking.provider.rating))}
                        <span>{booking.provider.rating}</span>
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
                    <span className="detail-icon">⏱️</span>
                    <div>
                      <strong>Duration:</strong>
                      <p>{booking.duration}</p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">🏢</span>
                    <div>
                      <strong>Location:</strong>
                      <p>{booking.office.name}</p>
                      <p className="office-address">{booking.office.address}</p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="detail-row">
                      <span className="detail-icon">📝</span>
                      <div>
                        <strong>Notes:</strong>
                        <p>{booking.notes}</p>
                      </div>
                    </div>
                  )}

                  {booking.status === 'cancelled' && booking.cancelReason && (
                    <div className="detail-row cancel-reason">
                      <span className="detail-icon">❌</span>
                      <div>
                        <strong>Cancellation Reason:</strong>
                        <p>{booking.cancelReason}</p>
                      </div>
                    </div>
                  )}

                  {booking.status === 'completed' && booking.review && (
                    <div className="booking-review">
                      <strong>Your Review:</strong>
                      <div className="review-stars">
                        {renderStars(booking.review.rating)}
                      </div>
                      <p>"{booking.review.comment}"</p>
                    </div>
                  )}
                </div>

                <div className="booking-actions">
                  {booking.status === 'confirmed' && (
                    <>
                      <Button variant="outline" size="small" onClick={() => handleReschedule(booking.id)}>
                        Reschedule
                      </Button>
                      <Button variant="danger" size="small" onClick={() => handleCancelBooking(booking.id)}>
                        Cancel
                      </Button>
                    </>
                  )}

                  {booking.status === 'pending' && (
                    <>
                      <Button variant="outline" size="small" onClick={() => handleCancelBooking(booking.id)}>
                        Cancel Request
                      </Button>
                      <span className="pending-text">Waiting for provider confirmation</span>
                    </>
                  )}

                  {booking.status === 'completed' && !booking.review && (
                    <Button variant="primary" size="small">
                      Leave Review
                    </Button>
                  )}

                  {booking.status === 'completed' && booking.review && (
                    <span className="review-submitted">✓ Review Submitted</span>
                  )}
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
    </div>
  );
}

export default MyBookings;
