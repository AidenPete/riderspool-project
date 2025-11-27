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
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            {!isAuthenticated ? (
              <>
                <div className="hero-badge">East Africa's #1 Workforce Platform</div>
                <h1 className="hero-title">
                  Hire Verified Riders & Drivers in Minutes
                </h1>
                <p className="hero-subtitle">
                  Connect with pre-screened motorbike riders, drivers, and operators across Kenya, Uganda, Tanzania & Rwanda.
                  All professionals are document-verified and interview-ready.
                </p>
                <div className="hero-buttons">
                  <Link to="/register?type=employer" className="btn-primary btn-large">
                    Start Hiring Today
                  </Link>
                  <Link to="/register?type=provider" className="btn-secondary btn-large">
                    Join as a Provider
                  </Link>
                </div>
                <div className="hero-trust">
                  <span className="trust-item">
                    <svg className="trust-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
                    </svg>
                    Free to Register
                  </span>
                  <span className="trust-item">
                    <svg className="trust-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Document Verified
                  </span>
                  <span className="trust-item">
                    <svg className="trust-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                    Safe & Secure
                  </span>
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

      {/* Stats Section */}
      {!isAuthenticated && (
        <section className="stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">2,500+</div>
                <div className="stat-label">Verified Providers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Companies Hiring</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Successful Placements</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4 Countries</div>
                <div className="stat-label">Across East Africa</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Businesses Choose Riderspool</h2>
            <p className="section-subtitle">We've built the most trusted platform for hiring mobility professionals in East Africa</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3>100% Verified Profiles</h3>
              <p>Every provider undergoes thorough document verification. National IDs, driving licenses, and certifications are validated by our team before approval.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <h3>Professional Interview Offices</h3>
              <p>Meet candidates at our secure, professional office locations in Nairobi, Kampala, Dar es Salaam, and Kigali. Safe environment for both parties.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3>Smart Matching</h3>
              <p>Find the right talent with powerful filters. Search by experience, location, vehicle type, availability, and specific skills like first aid or languages.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <h3>Ratings & Reviews</h3>
              <p>Make informed decisions with transparent ratings from previous employers. Build trust through verified reviews and track records.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3>Quick Turnaround</h3>
              <p>Most employers find and interview candidates within 48 hours. Our streamlined process gets you from search to hire faster than ever.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3>Instant Notifications</h3>
              <p>Stay updated with email and SMS notifications for interview requests, confirmations, and important updates. Never miss an opportunity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How Riderspool Works</h2>
            <p className="section-subtitle">Get started in minutes with our simple 4-step process</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Account</h3>
                <p>Sign up free as an employer or service provider. Takes less than 2 minutes to get started.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Complete Your Profile</h3>
                <p>Employers add company details. Providers upload documents, add skills, and get verified.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Search & Request Interview</h3>
                <p>Browse verified profiles, filter by your needs, and request interviews at our offices.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Meet & Hire</h3>
                <p>Conduct interviews at our professional locations. Make your hiring decision with confidence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Find the Right Professional</h2>
            <p className="section-subtitle">We connect you with verified professionals across multiple categories</p>
          </div>
          <div className="category-grid">
            <div className="category-card">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.44 9.03L15.41 5H11v2h3.59l2 2H5v2h2v6c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h6v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-6h.88l.13-.46 1-3.5-.57-.54zM8 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                </svg>
              </div>
              <h3>Motorbike Riders</h3>
              <p>Delivery riders, couriers, and personal transport. Licensed and experienced for your logistics needs.</p>
              <ul className="category-tags">
                <li>Delivery</li>
                <li>Courier</li>
                <li>Boda Boda</li>
              </ul>
            </div>
            <div className="category-card">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <h3>Car & Taxi Drivers</h3>
              <p>Professional drivers for personal vehicles, corporate fleets, and taxi services. All licenses verified.</p>
              <ul className="category-tags">
                <li>Personal</li>
                <li>Corporate</li>
                <li>Taxi/Uber</li>
              </ul>
            </div>
            <div className="category-card">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
              <h3>Truck & Lorry Drivers</h3>
              <p>Long-haul and short-distance trucking professionals. Heavy vehicle licensed with proven experience.</p>
              <ul className="category-tags">
                <li>Long-haul</li>
                <li>Logistics</li>
                <li>Heavy Goods</li>
              </ul>
            </div>
            <div className="category-card">
              <div className="category-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 4v2.67l-1 1-1-1V4h2m7 5v2h-2.67l-1-1 1-1H20M4 9v2h2.67l1-1-1-1H4m7 6v4h2v-4h-2m-5.47.05l2.12 2.12 1.41-1.41-2.12-2.12-1.41 1.41m12.94 0l-1.41-1.41-2.12 2.12 1.41 1.41 2.12-2.12M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <h3>Machine Operators</h3>
              <p>Certified operators for construction equipment, forklifts, and industrial machinery.</p>
              <ul className="category-tags">
                <li>Forklift</li>
                <li>Construction</li>
                <li>Industrial</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {!isAuthenticated && (
        <section className="testimonials">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Trusted by Leading Companies</h2>
              <p className="section-subtitle">See what our customers say about Riderspool</p>
            </div>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  {'★★★★★'}
                </div>
                <p className="testimonial-text">
                  "Riderspool transformed our hiring process. We found 15 verified riders within a week. The interview process at their office was professional and efficient."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">JM</div>
                  <div className="author-info">
                    <strong>James Mwangi</strong>
                    <span>Operations Manager, QuickMart Deliveries</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  {'★★★★★'}
                </div>
                <p className="testimonial-text">
                  "As a driver, getting verified on Riderspool opened so many doors. I received 5 interview requests in my first week and landed a great job with benefits."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">PO</div>
                  <div className="author-info">
                    <strong>Peter Otieno</strong>
                    <span>Professional Driver, Nairobi</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  {'★★★★★'}
                </div>
                <p className="testimonial-text">
                  "The verification process gives us confidence that we're hiring qualified professionals. Riderspool has become our go-to platform for all driver recruitment."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">AN</div>
                  <div className="author-info">
                    <strong>Agnes Nakamya</strong>
                    <span>HR Director, SafeBoda Uganda</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* For Providers Section */}
      {!isAuthenticated && (
        <section className="for-providers">
          <div className="container">
            <div className="providers-content">
              <div className="providers-text">
                <h2>Are You a Rider or Driver?</h2>
                <p>Join thousands of professionals who've found better opportunities through Riderspool</p>
                <ul className="providers-benefits">
                  <li>
                    <svg className="benefit-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>Free registration and profile creation</span>
                  </li>
                  <li>
                    <svg className="benefit-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>Get discovered by top employers in East Africa</span>
                  </li>
                  <li>
                    <svg className="benefit-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>Verified badge increases your visibility</span>
                  </li>
                  <li>
                    <svg className="benefit-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>Professional interviews at our offices</span>
                  </li>
                  <li>
                    <svg className="benefit-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>Build your reputation with ratings & reviews</span>
                  </li>
                </ul>
                <Link to="/register?type=provider" className="btn-primary btn-large">
                  Register as a Provider
                </Link>
              </div>
              <div className="providers-image">
                <div className="image-placeholder">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
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
              <h2>Ready to Transform Your Hiring?</h2>
              <p>Join hundreds of companies and thousands of professionals on East Africa's most trusted workforce platform</p>
              <div className="cta-buttons">
                <Link to="/register?type=employer" className="btn-primary btn-large">
                  Start Hiring Now
                </Link>
                <Link to="/register?type=provider" className="btn-secondary btn-large">
                  Join as Provider
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <h3>Riderspool</h3>
              <p>East Africa's trusted workforce platform connecting businesses with verified riders, drivers, and operators.</p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook" className="social-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="social-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="social-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="social-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>For Employers</h4>
                <ul>
                  <li><Link to="/register?type=employer">Post a Job</Link></li>
                  <li><Link to="/search">Browse Providers</Link></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#enterprise">Enterprise Solutions</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>For Providers</h4>
                <ul>
                  <li><Link to="/register?type=provider">Create Profile</Link></li>
                  <li><a href="#verification">Get Verified</a></li>
                  <li><a href="#tips">Success Tips</a></li>
                  <li><a href="#faq">FAQ</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#offices">Our Offices</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Legal</h4>
                <ul>
                  <li><Link to="/terms">Terms of Service</Link></li>
                  <li><a href="#privacy">Privacy Policy</a></li>
                  <li><a href="#cookies">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-locations">
              <span>Kenya</span>
              <span>Uganda</span>
              <span>Tanzania</span>
              <span>Rwanda</span>
            </div>
            <p>&copy; 2025 Riderspool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
