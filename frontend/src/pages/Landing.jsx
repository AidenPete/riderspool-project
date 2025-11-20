import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice';
import Navbar from '../components/layout/Navbar';
import './Landing.css';

function Landing() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  return (
    <div className="landing">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            {!isAuthenticated ? (
              <>
                <h1 className="hero-title">
                  Connect with Skilled Riders, Drivers & Operators
                </h1>
                <p className="hero-subtitle">
                  Riderspool is your trusted workforce marketplace. Find verified professionals
                  for motorbike delivery, driving, machinery operation, and more. Schedule interviews
                  at our professional offices.
                </p>
                <div className="hero-buttons">
                  <Link to="/register?type=employer" className="btn-primary btn-large">
                    I'm Hiring
                  </Link>
                  <Link to="/register?type=provider" className="btn-secondary btn-large">
                    I'm a Service Provider
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="hero-title">
                  Welcome back, {user?.fullName || user?.companyName}!
                </h1>
                <p className="hero-subtitle">
                  {user?.userType === 'provider'
                    ? 'Ready to take your career to the next level? Complete your profile and get more interview requests.'
                    : 'Find the perfect service provider for your business needs.'}
                </p>
                <div className="hero-buttons">
                  {user?.userType === 'provider' ? (
                    <>
                      <Link to="/provider/profile" className="btn-primary btn-large">
                        Complete Profile
                      </Link>
                      <Link to="/interviews" className="btn-secondary btn-large">
                        My Interviews
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/search" className="btn-primary btn-large">
                        Find Providers
                      </Link>
                      <Link to="/bookings" className="btn-secondary btn-large">
                        My Bookings
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Riderspool?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Verified Profiles</h3>
              <p>All workers are verified with document checks. IDs, licenses, and certifications reviewed by our team.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Professional Interviews</h3>
              <p>Meet candidates at our secure office locations. Safe, neutral environment for both parties.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Advanced Search</h3>
              <p>Filter by category, location, skills, experience, and certifications to find the perfect match.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Reviews & Ratings</h3>
              <p>Make informed decisions with ratings and reviews from previous employers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up as an employer or service provider. Complete your profile with relevant information.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Search & Connect</h3>
              <p>Employers browse profiles and request interviews. Service providers receive notifications.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Schedule Interview</h3>
              <p>Riderspool coordinates the meeting at our office. Both parties receive confirmation.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Meet & Hire</h3>
              <p>Conduct interview at our professional office location. Make your hiring decision.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Service Provider Categories</h2>
          <div className="category-grid">
            <div className="category-card">
              <h3>🏍️ Motorbike Riders</h3>
              <p>Delivery, courier, personal riders with verified licenses and experience.</p>
            </div>
            <div className="category-card">
              <h3>🚗 Drivers</h3>
              <p>Professional drivers for sedan, SUV, truck, bus, and specialized vehicles.</p>
            </div>
            <div className="category-card">
              <h3>🚜 Machinery Operators</h3>
              <p>Certified operators for forklifts, cranes, excavators, and heavy machinery.</p>
            </div>
            <div className="category-card">
              <h3>📸 Additional Skills</h3>
              <p>Many providers offer extra skills like photography, first aid, languages, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips for Providers (Logged In Only) */}
      {isAuthenticated && user?.userType === 'provider' && (
        <section className="tips-section">
          <div className="container">
            <h2 className="section-title">Increase Your Interview Chances</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">📝</div>
                <h3>Complete Your Profile</h3>
                <p>Profiles with photos and all documents uploaded get 5x more interview requests.</p>
                <Link to="/provider/profile" className="tip-link">Complete Now →</Link>
              </div>
              <div className="tip-card">
                <div className="tip-icon">⭐</div>
                <h3>Add Skills & Certifications</h3>
                <p>List all your skills, certifications, and additional abilities to stand out from the crowd.</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">💼</div>
                <h3>Professional Bio</h3>
                <p>Write a compelling bio highlighting your experience and reliability. First impressions matter!</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">✅</div>
                <h3>Get Verified</h3>
                <p>Upload your ID and license documents to get the verified badge. Employers trust verified providers.</p>
              </div>
            </div>

            {/* Success Stories */}
            <div className="success-stories">
              <h3 className="section-subtitle">Success Stories</h3>
              <div className="stories-grid">
                <div className="story-card">
                  <p className="story-quote">"Within 2 weeks of completing my profile, I got 3 interview requests. Now I have a stable job!"</p>
                  <p className="story-author">- John K., Motorbike Rider</p>
                </div>
                <div className="story-card">
                  <p className="story-quote">"The verified badge made all the difference. Employers contacted me more frequently."</p>
                  <p className="story-author">- Mary W., Professional Driver</p>
                </div>
                <div className="story-card">
                  <p className="story-quote">"I added my First Aid certification and language skills. Got hired in 3 days!"</p>
                  <p className="story-author">- Peter O., Truck Driver</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Get Started?</h2>
              <p>Join hundreds of employers and service providers connecting on Riderspool</p>
              <Link to="/register" className="btn-primary btn-large">
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Riderspool</h3>
              <p>Your trusted workforce marketplace for mobility professionals.</p>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#offices">Office Locations</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Riderspool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
