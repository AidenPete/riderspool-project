import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './ProviderProfile.css';

function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isSaved, setIsSaved] = useState(false);

  // Mock data - replace with API call
  const provider = {
    id: 1,
    fullName: 'John Kamau',
    category: 'Motorbike Rider',
    profilePhoto: null,
    rating: 4.8,
    totalInterviews: 15,
    totalReviews: 12,
    location: 'Nairobi, Kenya',
    region: 'Nairobi',
    city: 'Westlands',
    experience: '5 years',
    yearsExperience: '5-10',
    vehicleType: 'Honda CB150',
    dateOfBirth: '1995-03-15',
    gender: 'Male',
    willingToRelocate: true,
    bio: 'Experienced delivery rider with excellent knowledge of Nairobi routes. Always punctual and professional. I take pride in ensuring packages are delivered safely and on time. I have worked with various logistics companies and have a proven track record of customer satisfaction.',
    skills: ['First Aid Certified', 'Navigation Expert', 'Customer Service Excellence', 'Vehicle Maintenance', 'Time Management'],
    verified: true,
    documentsVerified: {
      id: true,
      license: true,
      profilePhoto: true,
    },
    workExperience: [
      {
        id: 1,
        company: 'Swift Delivery Ltd',
        position: 'Delivery Rider',
        duration: '2020 - Present',
        description: 'Handling express deliveries across Nairobi with 99% on-time delivery rate.',
      },
      {
        id: 2,
        company: 'QuickRide Services',
        position: 'Courier',
        duration: '2018 - 2020',
        description: 'Daily package deliveries and customer service. Maintained 5-star rating throughout employment.',
      },
    ],
    certifications: [
      {
        id: 1,
        name: 'First Aid & CPR',
        issuer: 'Red Cross Kenya',
        issueDate: '2022',
      },
      {
        id: 2,
        name: 'Defensive Driving',
        issuer: 'AA Kenya',
        issueDate: '2021',
      },
    ],
    reviews: [
      {
        id: 1,
        employerName: 'ABC Construction Ltd',
        rating: 5,
        comment: 'Excellent rider! Very professional and punctual. Highly recommend.',
        date: '2024-10-15',
      },
      {
        id: 2,
        employerName: 'Fresh Foods Co.',
        rating: 4,
        comment: 'Good service. Reliable and knows the routes well.',
        date: '2024-09-22',
      },
      {
        id: 3,
        employerName: 'Tech Solutions Inc',
        rating: 5,
        comment: 'Best delivery rider we\'ve worked with. Always on time and very careful with packages.',
        date: '2024-08-10',
      },
    ],
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: API call to save/unsave
  };

  const handleRequestInterview = () => {
    navigate(`/request-interview/${id}`);
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
    <div className="provider-profile-page">
      <Navbar />

      <div className="provider-profile-container">
        {/* Header Section */}
        <div className="profile-header-section">
          <div className="profile-header-content">
            <div className="profile-avatar-large">
              {provider.profilePhoto ? (
                <img src={provider.profilePhoto} alt={provider.fullName} />
              ) : (
                <div className="avatar-placeholder-large">
                  {provider.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              {provider.verified && (
                <div className="verified-badge-overlay">
                  <span className="verified-icon">✓</span>
                </div>
              )}
            </div>

            <div className="profile-header-info">
              <div className="profile-name-section">
                <h1>{provider.fullName}</h1>
                {provider.verified && (
                  <span className="verified-label">Verified</span>
                )}
              </div>

              <p className="profile-category">{provider.category}</p>

              <div className="profile-rating-section">
                <div className="rating-stars">
                  {renderStars(Math.round(provider.rating))}
                  <span className="rating-number">{provider.rating}</span>
                </div>
                <span className="rating-reviews">
                  ({provider.totalReviews} reviews, {provider.totalInterviews} interviews)
                </span>
              </div>

              <div className="profile-quick-stats">
                <div className="quick-stat">
                  <span className="stat-icon">📍</span>
                  <span>{provider.location}</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-icon">💼</span>
                  <span>{provider.experience} experience</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-icon">🚗</span>
                  <span>{provider.vehicleType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <Button
              variant={isSaved ? 'secondary' : 'outline'}
              onClick={handleSave}
            >
              {isSaved ? '❤️ Saved' : '🤍 Save'}
            </Button>
            <Button variant="primary" onClick={handleRequestInterview}>
              Request Interview
            </Button>
          </div>
        </div>

        <div className="profile-content-grid">
          {/* Left Column */}
          <div className="profile-main-content">
            {/* About Section */}
            <Card title="About">
              <p className="profile-bio">{provider.bio}</p>
            </Card>

            {/* Skills */}
            <Card title="Skills & Certifications">
              <div className="skills-grid">
                {provider.skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <span className="skill-icon">✓</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Work Experience */}
            {provider.workExperience && provider.workExperience.length > 0 && (
              <Card title="Work Experience">
                <div className="experience-list">
                  {provider.workExperience.map(exp => (
                    <div key={exp.id} className="experience-item">
                      <div className="experience-header">
                        <h4>{exp.position}</h4>
                        <span className="experience-duration">{exp.duration}</span>
                      </div>
                      <p className="experience-company">{exp.company}</p>
                      <p className="experience-description">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Certifications */}
            {provider.certifications && provider.certifications.length > 0 && (
              <Card title="Certifications">
                <div className="certifications-list">
                  {provider.certifications.map(cert => (
                    <div key={cert.id} className="certification-item">
                      <div className="cert-icon">📜</div>
                      <div className="cert-details">
                        <h4>{cert.name}</h4>
                        <p>{cert.issuer} • {cert.issueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews */}
            <Card title={`Reviews (${provider.reviews.length})`}>
              <div className="reviews-list">
                {provider.reviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div>
                        <h4>{review.employerName}</h4>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <aside className="profile-sidebar">
            {/* Verification Status */}
            <Card title="Verification Status">
              <div className="verification-list">
                <div className="verification-item">
                  <span className={provider.documentsVerified.id ? 'verified' : 'pending'}>
                    {provider.documentsVerified.id ? '✓' : '○'}
                  </span>
                  <span>National ID</span>
                </div>
                <div className="verification-item">
                  <span className={provider.documentsVerified.license ? 'verified' : 'pending'}>
                    {provider.documentsVerified.license ? '✓' : '○'}
                  </span>
                  <span>Driver's License</span>
                </div>
                <div className="verification-item">
                  <span className={provider.documentsVerified.profilePhoto ? 'verified' : 'pending'}>
                    {provider.documentsVerified.profilePhoto ? '✓' : '○'}
                  </span>
                  <span>Profile Photo</span>
                </div>
              </div>
            </Card>

            {/* Additional Info */}
            <Card title="Additional Information">
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{provider.city}, {provider.region}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Experience Level:</span>
                  <span className="info-value">{provider.yearsExperience} years</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Willing to Relocate:</span>
                  <span className="info-value">{provider.willingToRelocate ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </Card>

            {/* CTA Card */}
            <Card className="cta-card">
              <h3>Ready to hire?</h3>
              <p>Schedule an interview at our Riderspool office</p>
              <Button variant="primary" fullWidth onClick={handleRequestInterview}>
                Request Interview
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ProviderProfile;
