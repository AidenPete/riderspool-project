import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './MyInterviews.css';

function MyInterviews() {
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('pending');

  // Mock interviews data
  const mockInterviews = [
    {
      id: 1,
      employer: {
        id: 1,
        companyName: 'ABC Construction Ltd',
        contactPerson: 'Jane Smith',
        industry: 'Construction',
      },
      date: '2025-01-28',
      time: '10:00 AM',
      duration: '30 minutes',
      office: {
        name: 'Nairobi - Westlands Office',
        address: 'Westlands Square, Nairobi',
      },
      status: 'pending',
      notes: 'Looking for a reliable delivery rider for daily construction site deliveries.',
      requestedAt: '2025-01-20',
    },
    {
      id: 2,
      employer: {
        id: 2,
        companyName: 'Tech Solutions Inc',
        contactPerson: 'Michael Johnson',
        industry: 'Technology',
      },
      date: '2025-02-03',
      time: '2:00 PM',
      duration: '45 minutes',
      office: {
        name: 'Nairobi - CBD Office',
        address: 'Kimathi Street, Nairobi',
      },
      status: 'confirmed',
      notes: 'Need a motorbike rider for equipment delivery between offices.',
      requestedAt: '2025-01-21',
      confirmedAt: '2025-01-21',
    },
    {
      id: 3,
      employer: {
        id: 3,
        companyName: 'Fresh Foods Co.',
        contactPerson: 'Sarah Williams',
        industry: 'Retail',
      },
      date: '2025-01-10',
      time: '11:00 AM',
      duration: '30 minutes',
      office: {
        name: 'Nairobi - Westlands Office',
        address: 'Westlands Square, Nairobi',
      },
      status: 'completed',
      notes: 'Food delivery rider for our restaurant chain.',
      requestedAt: '2025-01-03',
      completedAt: '2025-01-10',
      employerReview: {
        rating: 5,
        comment: 'Excellent rider! Very professional and punctual. Highly recommend.',
      },
    },
    {
      id: 4,
      employer: {
        id: 4,
        companyName: 'Global Logistics',
        contactPerson: 'David Brown',
        industry: 'Logistics & Transportation',
      },
      date: '2025-01-15',
      time: '9:00 AM',
      duration: '1 hour',
      office: {
        name: 'Mombasa Office',
        address: 'Moi Avenue, Mombasa',
      },
      status: 'declined',
      notes: 'Seeking experienced courier for long-distance deliveries.',
      requestedAt: '2025-01-08',
      declinedAt: '2025-01-09',
      declineReason: 'Schedule conflict',
    },
  ];

  const [interviews] = useState(mockInterviews);

  const tabs = [
    { id: 'pending', label: 'Pending', count: interviews.filter(i => i.status === 'pending').length },
    { id: 'confirmed', label: 'Confirmed', count: interviews.filter(i => i.status === 'confirmed').length },
    { id: 'completed', label: 'Completed', count: interviews.filter(i => i.status === 'completed').length },
    { id: 'declined', label: 'Declined', count: interviews.filter(i => i.status === 'declined').length },
  ];

  const filteredInterviews = interviews.filter(interview => interview.status === activeTab);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending Response', className: 'pending' },
      confirmed: { label: 'Confirmed', className: 'confirmed' },
      completed: { label: 'Completed', className: 'completed' },
      declined: { label: 'Declined', className: 'declined' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleAccept = async (interviewId) => {
    const interview = interviews.find(i => i.id === interviewId);

    if (confirm('Are you sure you want to accept this interview?')) {
      try {
        // TODO: API call to accept interview
        /*
        API Endpoint: POST /api/interviews/{interviewId}/accept

        Backend Actions:
        1. Update interview status to 'confirmed'
        2. Send Email to Employer:
           - Subject: "{providerName} Accepted Your Interview Request"
           - Body: Confirmation details, date, time, location, next steps

        3. Send SMS to Employer:
           - "{providerName} accepted your interview on {date} at {time}.
            Location: {officeName}. See you there!"

        4. Send Confirmation Email to Provider:
           - Subject: "Interview Confirmed with {employerName}"
           - Body: Interview details, reminders, office location

        5. Send SMS to Provider:
           - "Interview confirmed with {employerName} on {date} at {time}.
            Location: {officeName}. We've sent you a confirmation email."
        */

        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('Interview Accepted:', {
          interviewId,
          providerName: user.fullName,
          employerName: interview.employer.companyName,
        });

        console.log('Email to Employer:', {
          to: interview.employer.email || 'employer@email.com',
          subject: `${user.fullName} Accepted Your Interview Request`,
          body: `
            Good news! ${user.fullName} has accepted your interview request.

            Interview Details:
            Date: ${new Date(interview.date).toDateString()}
            Time: ${interview.time}
            Duration: ${interview.duration}
            Location: ${interview.office.name}
            Address: ${interview.office.address}

            ${user.fullName} will meet you at the office. Please arrive 10 minutes early.

            See you at the interview!
          `,
        });

        console.log('SMS to Employer:', {
          to: interview.employer.phone || 'Employer Phone',
          message: `${user.fullName} accepted your interview on ${new Date(interview.date).toDateString()} at ${interview.time}. Location: ${interview.office.name}. See you there!`,
        });

        alert(`✅ Interview Accepted Successfully!

📧 Notifications Sent:
• Email to ${interview.employer.companyName}
• SMS to ${interview.employer.companyName}
• Confirmation email to you

The employer has been notified that you accepted the interview.

Interview Details:
📅 ${new Date(interview.date).toDateString()}
🕐 ${interview.time}
📍 ${interview.office.name}

We've sent you a confirmation email with all the details.`);

      } catch (error) {
        alert('Failed to accept interview. Please try again.');
      }
    }
  };

  const handleDecline = async (interviewId) => {
    const interview = interviews.find(i => i.id === interviewId);
    const reason = prompt('Please provide a reason for declining (optional):');

    if (reason !== null) {
      try {
        // TODO: API call to decline interview with reason
        /*
        API Endpoint: POST /api/interviews/{interviewId}/decline

        Backend Actions:
        1. Update interview status to 'declined'
        2. Send Email to Employer:
           - Subject: "{providerName} Declined Your Interview Request"
           - Body: Include decline reason, suggest other providers

        3. Send SMS to Employer:
           - "{providerName} declined your interview request.
            {reason}. Search for other providers on Riderspool."

        4. Send Confirmation Email to Provider:
           - Subject: "Interview Request Declined"
           - Body: Confirmation that the request was declined
        */

        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('Interview Declined:', {
          interviewId,
          providerName: user.fullName,
          employerName: interview.employer.companyName,
          reason,
        });

        console.log('Email to Employer:', {
          to: interview.employer.email || 'employer@email.com',
          subject: `${user.fullName} Declined Your Interview Request`,
          body: `
            ${user.fullName} has declined your interview request.

            ${reason ? `Reason: ${reason}` : 'No reason provided'}

            Don't worry! There are many other qualified providers on Riderspool.
            Search for more providers in the ${interview.provider?.category || 'same'} category.

            Visit your dashboard to find more candidates.
          `,
        });

        console.log('SMS to Employer:', {
          to: interview.employer.phone || 'Employer Phone',
          message: `${user.fullName} declined your interview request. ${reason ? reason : 'No reason provided'}. Search for other providers on Riderspool.`,
        });

        alert(`Interview Declined

📧 Notifications Sent:
• Email to ${interview.employer.companyName}
• SMS to ${interview.employer.companyName}

The employer has been notified of your decision.`);

      } catch (error) {
        alert('Failed to decline interview. Please try again.');
      }
    }
  };

  const handleReschedule = async (interviewId) => {
    const interview = interviews.find(i => i.id === interviewId);
    const reason = prompt('Please provide a reason for rescheduling:');

    if (reason) {
      try {
        // TODO: API call to request reschedule with reason
        /*
        API Endpoint: POST /api/interviews/{interviewId}/reschedule

        Backend Actions:
        1. Update interview status to 'reschedule_requested'
        2. Send Email to Employer:
           - Subject: "{providerName} Requested to Reschedule Interview"
           - Body: Current schedule, reschedule reason, link to propose new time

        3. Send SMS to Employer:
           - "{providerName} requested to reschedule interview on {date}.
            Reason: {reason}. Check email for details."

        4. Send Confirmation Email to Provider:
           - Subject: "Reschedule Request Sent"
           - Body: Confirmation, employer will be notified

        5. Send SMS to Provider:
           - "Reschedule request sent to {employerName}.
            You'll be notified when they respond."
        */

        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('Reschedule Request:', {
          interviewId,
          providerName: user.fullName,
          employerName: interview.employer.companyName,
          reason,
          originalDate: interview.date,
          originalTime: interview.time,
        });

        console.log('Email to Employer:', {
          to: interview.employer.email || 'employer@email.com',
          subject: `${user.fullName} Requested to Reschedule Interview`,
          body: `
            ${user.fullName} has requested to reschedule your interview.

            Current Schedule:
            Date: ${new Date(interview.date).toDateString()}
            Time: ${interview.time}
            Location: ${interview.office.name}

            Reason for Rescheduling:
            ${reason}

            Please login to your Riderspool account to propose a new time
            or contact ${user.fullName} directly.

            We understand schedules can change. Thank you for your flexibility.
          `,
        });

        console.log('SMS to Employer:', {
          to: interview.employer.phone || 'Employer Phone',
          message: `${user.fullName} requested to reschedule interview on ${new Date(interview.date).toDateString()}. Reason: ${reason}. Check your email for details.`,
        });

        alert(`📅 Reschedule Request Sent

📧 Notifications Sent:
• Email to ${interview.employer.companyName}
• SMS to ${interview.employer.companyName}

The employer has been notified of your reschedule request.

You will receive an email and SMS notification when ${interview.employer.companyName} responds with a new proposed time.`);

      } catch (error) {
        alert('Failed to send reschedule request. Please try again.');
      }
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

  return (
    <div className="interviews-page">
      <Navbar />

      <div className="interviews-container">
        <div className="interviews-header">
          <div>
            <h1>My Interviews</h1>
            <p>Manage your interview requests</p>
          </div>
          <Link to="/provider/profile">
            <Button variant="primary">Update Profile</Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="interviews-tabs">
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

        {/* Interviews List */}
        <div className="interviews-list">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map(interview => (
              <Card key={interview.id} className="interview-card">
                <div className="interview-header">
                  <div className="employer-info">
                    <div className="employer-icon">🏢</div>
                    <div>
                      <h3>{interview.employer.companyName}</h3>
                      <p className="employer-details">
                        {interview.employer.industry} • Contact: {interview.employer.contactPerson}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(interview.status)}
                </div>

                <div className="interview-details">
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <div>
                      <strong>Interview Date & Time:</strong>
                      <p>{formatDate(interview.date)} at {interview.time}</p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">⏱️</span>
                    <div>
                      <strong>Duration:</strong>
                      <p>{interview.duration}</p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">🏢</span>
                    <div>
                      <strong>Location:</strong>
                      <p>{interview.office.name}</p>
                      <p className="office-address">{interview.office.address}</p>
                    </div>
                  </div>

                  {interview.notes && (
                    <div className="detail-row">
                      <span className="detail-icon">📝</span>
                      <div>
                        <strong>Employer's Notes:</strong>
                        <p>{interview.notes}</p>
                      </div>
                    </div>
                  )}

                  {interview.status === 'declined' && interview.declineReason && (
                    <div className="detail-row decline-reason">
                      <span className="detail-icon">❌</span>
                      <div>
                        <strong>Decline Reason:</strong>
                        <p>{interview.declineReason}</p>
                      </div>
                    </div>
                  )}

                  {interview.status === 'completed' && interview.employerReview && (
                    <div className="employer-review">
                      <strong>Employer's Review:</strong>
                      <div className="review-stars">
                        {renderStars(interview.employerReview.rating)}
                        <span>{interview.employerReview.rating}/5</span>
                      </div>
                      <p>"{interview.employerReview.comment}"</p>
                    </div>
                  )}

                  <div className="request-time">
                    <span>Requested on {new Date(interview.requestedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="interview-actions">
                  {interview.status === 'pending' && (
                    <>
                      <Button variant="outline" size="small" onClick={() => handleDecline(interview.id)}>
                        Decline
                      </Button>
                      <Button variant="primary" size="small" onClick={() => handleAccept(interview.id)}>
                        Accept Interview
                      </Button>
                    </>
                  )}

                  {interview.status === 'confirmed' && (
                    <>
                      <div className="confirmed-message">
                        <span className="confirmed-icon">✓</span>
                        <span>You have confirmed this interview. See you at the office!</span>
                      </div>
                      <Button variant="outline" size="small" onClick={() => handleReschedule(interview.id)}>
                        Request Reschedule
                      </Button>
                    </>
                  )}

                  {interview.status === 'completed' && interview.employerReview && (
                    <div className="review-received">
                      <span className="review-icon">⭐</span>
                      <span>Interview completed • Review received</span>
                    </div>
                  )}

                  {interview.status === 'declined' && (
                    <div className="declined-message">
                      <span>You declined this interview on {new Date(interview.declinedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No {activeTab} interviews</h3>
                <p>
                  {activeTab === 'pending' && 'You have no pending interview requests at the moment.'}
                  {activeTab === 'confirmed' && 'You have no confirmed interviews scheduled.'}
                  {activeTab === 'completed' && 'You have not completed any interviews yet.'}
                  {activeTab === 'declined' && 'You have not declined any interviews.'}
                </p>
                {activeTab === 'pending' && (
                  <Link to="/profile">
                    <Button variant="primary">Complete Your Profile</Button>
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

export default MyInterviews;
