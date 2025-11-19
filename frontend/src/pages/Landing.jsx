import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <h1 className="logo">Riderspool</h1>
            <div className="nav-links">
              <Link to="/login" className="btn-text">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
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

      {/* CTA Section */}
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
