import { Link } from 'react-router-dom';
import './Legal.css';

function TermsOfService() {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <div className="legal-header">
          <Link to="/" className="legal-logo">Riderspool</Link>
          <h1>Terms of Service</h1>
          <p className="legal-updated">Last Updated: January 2025</p>
        </div>

        <div className="legal-body">
          {/* Introduction */}
          <section className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              Welcome to Riderspool ("Platform", "we", "us", or "our"). By accessing and using our workforce marketplace platform,
              you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Platform.
            </p>
            <p>
              Riderspool is a professional workforce marketplace connecting employers with skilled service providers specializing in
              motorbike riding, driving (cars, trucks, buses), and machinery operation.
            </p>
          </section>

          {/* Definitions */}
          <section className="legal-section">
            <h2>2. Definitions</h2>
            <ul>
              <li><strong>"Employer"</strong> refers to companies or individuals seeking to hire service providers through the Platform.</li>
              <li><strong>"Service Provider"</strong> or <strong>"Provider"</strong> refers to individuals offering their professional services through the Platform, including motorbike riders, drivers, and machinery operators.</li>
              <li><strong>"Interview"</strong> refers to the in-person meeting facilitated by Riderspool at our professional office locations.</li>
              <li><strong>"Services"</strong> refers to the platform functionality, interview coordination, and related services offered by Riderspool.</li>
              <li><strong>"User"</strong> refers to both Employers and Service Providers collectively.</li>
            </ul>
          </section>

          {/* Eligibility */}
          <section className="legal-section">
            <h2>3. Eligibility</h2>
            <h3>3.1 General Requirements</h3>
            <p>To use Riderspool, you must:</p>
            <ul>
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Not be prohibited from using our Services under applicable laws</li>
            </ul>

            <h3>3.2 Service Provider Requirements</h3>
            <p>Service Providers must additionally:</p>
            <ul>
              <li>Possess valid licenses and certifications required for their category of service</li>
              <li>Provide authentic identification documents</li>
              <li>Have the legal right to work in Kenya</li>
              <li>Maintain active membership through payment of applicable fees</li>
            </ul>

            <h3>3.3 Employer Requirements</h3>
            <p>Employers must:</p>
            <ul>
              <li>Represent a legitimate business entity or individual with hiring authority</li>
              <li>Provide valid business registration documents</li>
              <li>Have genuine employment opportunities</li>
            </ul>
          </section>

          {/* Fee Structure */}
          <section className="legal-section highlight-section">
            <h2>4. Fees and Payment Terms</h2>

            <h3>4.1 Employer Fees</h3>
            <div className="fee-box">
              <h4>Interview Fee</h4>
              <p>
                Employers are required to pay an <strong>Interview Fee</strong> for each interview request submitted through the Platform.
                This fee covers:
              </p>
              <ul>
                <li>Coordination and scheduling of the interview</li>
                <li>Use of Riderspool professional office facilities</li>
                <li>Administrative support and documentation</li>
                <li>Verification of Service Provider credentials</li>
              </ul>
              <p className="fee-note">
                The Interview Fee is <strong>non-refundable</strong> once the interview has been scheduled, regardless of whether
                the interview is attended or if hiring occurs.
              </p>
            </div>

            <div className="fee-box">
              <h4>Success Fee (Placement Fee)</h4>
              <p>
                Upon successfully hiring a Service Provider through Riderspool, Employers must pay a <strong>Success Fee</strong>.
                This fee is calculated as:
              </p>
              <ul>
                <li>A percentage of the first month's salary or agreed compensation; OR</li>
                <li>A fixed placement fee as communicated at the time of interview request</li>
              </ul>
              <p className="fee-note">
                The Success Fee is due within <strong>7 days</strong> of the employment start date. Failure to pay the Success Fee
                may result in account suspension and legal action to recover the debt.
              </p>
            </div>

            <h3>4.2 Service Provider Fees</h3>
            <div className="fee-box">
              <h4>Membership Options</h4>
              <p>Service Providers must maintain active membership to access the Platform. Choose from:</p>

              <div className="membership-option">
                <h5>Option 1: One-Time Lifetime Fee</h5>
                <p>
                  Pay a single one-time fee for <strong>lifetime membership</strong>. This grants permanent access to:
                </p>
                <ul>
                  <li>Profile listing on the Platform</li>
                  <li>Unlimited interview requests from Employers</li>
                  <li>Profile updates and modifications</li>
                  <li>Access to all Platform features</li>
                </ul>
              </div>

              <div className="membership-option">
                <h5>Option 2: Subscription Fee</h5>
                <p>
                  Pay a <strong>recurring subscription fee</strong> (monthly, quarterly, or annually) to maintain active membership.
                  Subscription includes:
                </p>
                <ul>
                  <li>All features of the lifetime membership</li>
                  <li>Flexibility to pause or cancel membership</li>
                  <li>Premium profile placement (higher visibility)</li>
                  <li>Priority customer support</li>
                </ul>
                <p className="fee-note">
                  Subscriptions auto-renew unless cancelled at least 7 days before the renewal date. Expired memberships
                  result in profile deactivation until payment is received.
                </p>
              </div>
            </div>

            <h3>4.3 Payment Methods</h3>
            <p>All fees are payable via:</p>
            <ul>
              <li>M-Pesa mobile money</li>
              <li>Bank transfer</li>
              <li>Credit/Debit card</li>
              <li>Other approved payment methods as specified on the Platform</li>
            </ul>

            <h3>4.4 Refund Policy</h3>
            <ul>
              <li><strong>Interview Fees:</strong> Non-refundable once interview is scheduled</li>
              <li><strong>Success Fees:</strong> Non-refundable</li>
              <li><strong>Service Provider Membership:</strong> Refundable within 7 days of initial payment if no interviews have been accepted. Subscription fees are non-refundable for the current billing period.</li>
            </ul>
          </section>

          {/* Platform Services */}
          <section className="legal-section">
            <h2>5. Platform Services</h2>

            <h3>5.1 For Employers</h3>
            <p>Riderspool provides:</p>
            <ul>
              <li>Access to a curated database of verified Service Providers</li>
              <li>Advanced search and filtering tools</li>
              <li>Interview scheduling and coordination</li>
              <li>Professional office facilities for conducting interviews</li>
              <li>Document verification services</li>
              <li>Booking and interview management dashboard</li>
            </ul>

            <h3>5.2 For Service Providers</h3>
            <p>Riderspool provides:</p>
            <ul>
              <li>Professional profile creation and hosting</li>
              <li>Exposure to verified employers seeking to hire</li>
              <li>Interview request notifications</li>
              <li>Interview coordination at secure office locations</li>
              <li>Profile management tools</li>
              <li>Interview history and feedback system</li>
            </ul>

            <h3>5.3 Limitations</h3>
            <p>Riderspool is a <strong>marketplace platform only</strong>. We:</p>
            <ul>
              <li>Do NOT guarantee employment for Service Providers</li>
              <li>Do NOT guarantee quality or suitability of Service Providers for Employers</li>
              <li>Are NOT a party to any employment contracts between Employers and Service Providers</li>
              <li>Do NOT provide legal, tax, or employment advice</li>
            </ul>
          </section>

          {/* User Obligations */}
          <section className="legal-section">
            <h2>6. User Obligations</h2>

            <h3>6.1 Account Security</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your contact information is current and accurate</li>
            </ul>

            <h3>6.2 Truthful Information</h3>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate, complete, and current information</li>
              <li>Update your profile promptly when information changes</li>
              <li>Not misrepresent your identity, qualifications, or intentions</li>
              <li>Upload authentic documents only</li>
            </ul>

            <h3>6.3 Prohibited Conduct</h3>
            <p>You must NOT:</p>
            <ul>
              <li>Use the Platform for any illegal or unauthorized purpose</li>
              <li>Circumvent the Platform to engage directly with other users without paying applicable fees</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Scrape, data mine, or extract data from the Platform</li>
              <li>Create multiple accounts to evade fees or restrictions</li>
              <li>Impersonate another person or entity</li>
              <li>Post discriminatory, offensive, or inappropriate content</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section className="legal-section highlight-section">
            <h2>7. Data Collection and Protection</h2>

            <h3>7.1 Data We Collect</h3>
            <p>We collect the following categories of personal data:</p>

            <div className="data-category">
              <h4>For All Users:</h4>
              <ul>
                <li><strong>Account Information:</strong> Email address, phone number, password (encrypted)</li>
                <li><strong>Profile Data:</strong> Name, location, category/industry</li>
                <li><strong>Usage Data:</strong> Login times, pages viewed, features used, search queries</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Communication Data:</strong> Messages sent through the Platform, customer support interactions</li>
              </ul>
            </div>

            <div className="data-category">
              <h4>For Service Providers:</h4>
              <ul>
                <li><strong>Identification Documents:</strong> National ID, passport copies</li>
                <li><strong>Professional Documents:</strong> Driver's license, machinery operation certificates</li>
                <li><strong>Profile Photo:</strong> Professional headshot</li>
                <li><strong>Work History:</strong> Experience details, skills, vehicle/machinery expertise</li>
                <li><strong>Availability:</strong> Preferred regions, willingness to relocate</li>
              </ul>
            </div>

            <div className="data-category">
              <h4>For Employers:</h4>
              <ul>
                <li><strong>Company Information:</strong> Business name, registration number, industry</li>
                <li><strong>Business Documents:</strong> Business registration certificate</li>
                <li><strong>Office Location:</strong> Physical address, contact details</li>
                <li><strong>Interview Requests:</strong> Dates, times, preferences, hiring decisions</li>
              </ul>
            </div>

            <h3>7.2 How We Use Your Data</h3>
            <p>We use collected data to:</p>
            <ul>
              <li><strong>Provide Services:</strong> Facilitate interviews, manage profiles, process payments</li>
              <li><strong>Verification:</strong> Confirm identity and authenticity of documents</li>
              <li><strong>Matching:</strong> Connect Employers with suitable Service Providers</li>
              <li><strong>Communication:</strong> Send notifications, updates, interview confirmations</li>
              <li><strong>Platform Improvement:</strong> Analyze usage patterns, improve features, fix bugs</li>
              <li><strong>Security:</strong> Detect fraud, prevent abuse, ensure Platform integrity</li>
              <li><strong>Legal Compliance:</strong> Meet regulatory requirements, respond to legal requests</li>
              <li><strong>Marketing:</strong> Send promotional materials (with your consent, opt-out available)</li>
            </ul>

            <h3>7.3 Data Sharing</h3>
            <p>We share your data with:</p>
            <ul>
              <li><strong>Other Platform Users:</strong> Employers can view Service Provider profiles; Service Providers can see Employer company information</li>
              <li><strong>Payment Processors:</strong> To process fees and payments securely</li>
              <li><strong>Service Providers:</strong> Cloud hosting, analytics, customer support tools</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>
            <p><strong>We do NOT sell your personal data to third parties.</strong></p>

            <h3>7.4 Data Security</h3>
            <p>We implement industry-standard security measures:</p>
            <ul>
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encrypted storage of sensitive data</li>
              <li>Regular security audits and vulnerability testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data centers with physical security</li>
            </ul>

            <h3>7.5 Your Data Rights</h3>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to certain data processing activities</li>
              <li><strong>Withdraw Consent:</strong> Opt out of marketing communications</li>
            </ul>
            <p>Contact us at <a href="mailto:privacy@riderspool.com">privacy@riderspool.com</a> to exercise these rights.</p>

            <h3>7.6 Data Retention</h3>
            <ul>
              <li><strong>Active Accounts:</strong> Data retained while account is active</li>
              <li><strong>Inactive Accounts:</strong> Data retained for 2 years after last login, then anonymized</li>
              <li><strong>Transaction Records:</strong> Retained for 7 years for legal/accounting purposes</li>
              <li><strong>Deleted Accounts:</strong> Personal data deleted within 30 days (except where legal retention is required)</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="legal-section">
            <h2>8. Intellectual Property</h2>
            <p>
              The Platform, including all content, features, and functionality, is owned by Riderspool and protected by
              international copyright, trademark, and other intellectual property laws.
            </p>
            <p>You may not:</p>
            <ul>
              <li>Copy, modify, or distribute Platform content without permission</li>
              <li>Use our trademarks, logos, or branding without authorization</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Create derivative works based on the Platform</li>
            </ul>
          </section>

          {/* Liability and Disclaimers */}
          <section className="legal-section">
            <h2>9. Disclaimers and Limitation of Liability</h2>

            <h3>9.1 Platform "As Is"</h3>
            <p>
              The Platform is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, whether express or implied.
              We do not guarantee uninterrupted, secure, or error-free operation.
            </p>

            <h3>9.2 No Employment Guarantees</h3>
            <p>
              Riderspool does NOT guarantee that Service Providers will find employment or that Employers will find suitable candidates.
              The Platform facilitates connections only.
            </p>

            <h3>9.3 User Verification</h3>
            <p>
              While we verify documents and credentials, we cannot guarantee the accuracy, quality, or suitability of any user.
              Employers are responsible for their own due diligence before hiring.
            </p>

            <h3>9.4 Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, Riderspool shall NOT be liable for:
            </p>
            <ul>
              <li>Indirect, incidental, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Damages exceeding the fees paid to Riderspool in the past 12 months</li>
              <li>Actions or conduct of other Platform users</li>
              <li>Employment disputes or workplace incidents</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section className="legal-section">
            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Riderspool, its affiliates, and personnel from any claims, damages,
              losses, or expenses (including legal fees) arising from:
            </p>
            <ul>
              <li>Your use of the Platform</li>
              <li>Violation of these Terms</li>
              <li>Violation of any laws or third-party rights</li>
              <li>Content you post on the Platform</li>
              <li>Employment relationships formed through the Platform</li>
            </ul>
          </section>

          {/* Termination */}
          <section className="legal-section">
            <h2>11. Termination</h2>

            <h3>11.1 By You</h3>
            <p>You may terminate your account at any time by contacting support. Paid fees are non-refundable upon termination.</p>

            <h3>11.2 By Riderspool</h3>
            <p>We may suspend or terminate your account immediately if you:</p>
            <ul>
              <li>Violate these Terms</li>
              <li>Engage in fraudulent activity</li>
              <li>Fail to pay required fees</li>
              <li>Misuse the Platform or harm other users</li>
              <li>Provide false information</li>
            </ul>

            <h3>11.3 Effect of Termination</h3>
            <ul>
              <li>Access to the Platform will be revoked</li>
              <li>Your profile will be deactivated/deleted</li>
              <li>Outstanding fees remain due and payable</li>
              <li>Data retention as per Section 7.6 applies</li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section className="legal-section">
            <h2>12. Dispute Resolution</h2>

            <h3>12.1 Governing Law</h3>
            <p>
              These Terms are governed by the laws of Kenya. Any disputes shall be resolved in the courts of Nairobi, Kenya.
            </p>

            <h3>12.2 Informal Resolution</h3>
            <p>
              Before filing a legal claim, you agree to attempt informal resolution by contacting us at
              <a href="mailto:legal@riderspool.com"> legal@riderspool.com</a> with a detailed description of the dispute.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="legal-section">
            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective upon posting to the Platform.
              Continued use of the Platform after changes constitutes acceptance of the updated Terms.
            </p>
            <p>
              Material changes (especially fee changes) will be communicated via email at least 30 days in advance.
            </p>
          </section>

          {/* Contact */}
          <section className="legal-section">
            <h2>14. Contact Information</h2>
            <p>For questions about these Terms of Service:</p>
            <div className="contact-info">
              <p><strong>Email:</strong> <a href="mailto:legal@riderspool.com">legal@riderspool.com</a></p>
              <p><strong>Phone:</strong> +254 700 000 000</p>
              <p><strong>Address:</strong> Riderspool Ltd, Nairobi, Kenya</p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="legal-section highlight-section">
            <h2>15. Acknowledgment</h2>
            <p>
              By creating an account or using Riderspool, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service,
              including all fee structures, data collection practices, and liability limitations.
            </p>
          </section>
        </div>

        <div className="legal-footer">
          <p>&copy; 2025 Riderspool. All rights reserved.</p>
          <div className="legal-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
