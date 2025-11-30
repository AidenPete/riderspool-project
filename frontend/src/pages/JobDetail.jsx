import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { jobsAPI, applicationsAPI } from '../api';
import { toast } from '../utils/toast';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './JobDetail.css';

function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availableFrom: '',
  });

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const data = await jobsAPI.getJob(jobId);
      setJob(data);

      // Check if user has already applied
      if (user?.userType === 'provider') {
        checkApplicationStatus();
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const applications = await applicationsAPI.getMyApplications();
      const applied = (applications.results || applications).some(
        app => app.job?.id === parseInt(jobId)
      );
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    if (!applicationData.coverLetter.trim()) {
      toast.warning('Please write a cover letter explaining your interest');
      return;
    }

    setApplying(true);
    try {
      await applicationsAPI.createApplication({
        job_id: parseInt(jobId),
        coverLetter: applicationData.coverLetter,
        expectedSalary: applicationData.expectedSalary,
        availableFrom: applicationData.availableFrom,
      });

      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setShowApplicationForm(false);
      setApplicationData({
        coverLetter: '',
        expectedSalary: '',
        availableFrom: '',
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (job) => {
    if (!job.salaryMin && !job.salaryMax) return 'Negotiable';

    const currency = job.salaryCurrency || 'KES';
    const period = job.salaryPeriod || 'monthly';

    if (job.salaryMin && job.salaryMax) {
      return `${currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} / ${period}`;
    } else if (job.salaryMin) {
      return `${currency} ${job.salaryMin.toLocaleString()}+ / ${period}`;
    } else {
      return `Up to ${currency} ${job.salaryMax.toLocaleString()} / ${period}`;
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingSpinner fullScreen message="Loading job details..." />
      </PageLayout>
    );
  }

  if (!job) {
    return (
      <PageLayout maxWidth="600px">
        <Card>
          <div className="error-state">
            <h2>Job Not Found</h2>
            <p>The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  const isProvider = user?.userType === 'provider';
  const isEmployer = user?.userType === 'employer';
  const isOwnJob = isEmployer && job.employer?.id === user?.id;

  return (
    <PageLayout maxWidth="1000px">
      <PageHeader
        title={job.title}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Browse Jobs', path: '/jobs' },
          { label: job.title }
        ]}
      />

      <div className="job-detail-container">
        {/* Job Header Card */}
        <Card className="job-header-card">
          <div className="job-header-content">
            <div className="company-section">
              <div className="company-icon-large">🏢</div>
              <div>
                <h2>{job.employer?.companyName || job.employer?.fullName || 'Company'}</h2>
                {job.employer?.industry && (
                  <p className="company-industry">{job.employer.industry}</p>
                )}
              </div>
            </div>

            <div className="job-meta-info">
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                <span>{job.city}, {job.region}</span>
                {job.isRemote && <span className="remote-tag">Remote Available</span>}
              </div>
              <div className="meta-item">
                <span className="meta-icon">💼</span>
                <span>{job.employmentType}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📊</span>
                <span>{job.experienceRequired} years experience required</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Apply Section for Providers */}
        {isProvider && !isOwnJob && (
          <Card>
            <div className="apply-section">
              {hasApplied ? (
                <div className="already-applied">
                  <div className="success-icon">✓</div>
                  <h3>Application Submitted</h3>
                  <p>You've already applied for this position. The employer will review your application soon.</p>
                  <Button variant="outline" onClick={() => navigate('/my-applications')}>
                    View My Applications
                  </Button>
                </div>
              ) : !showApplicationForm ? (
                <div className="apply-prompt">
                  <h3>Interested in this position?</h3>
                  <p>Submit your application with a cover letter explaining why you're a great fit.</p>
                  <Button
                    variant="primary"
                    size="large"
                    onClick={() => setShowApplicationForm(true)}
                  >
                    Apply Now
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="application-form">
                  <h3>Submit Your Application</h3>

                  <div className="form-group">
                    <label htmlFor="coverLetter">
                      Cover Letter / Expression of Interest <span className="required">*</span>
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={applicationData.coverLetter}
                      onChange={handleInputChange}
                      rows="8"
                      placeholder="Explain why you're interested in this position and why you'd be a great fit. Highlight your relevant experience and skills..."
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expectedSalary">Expected Salary (Optional)</label>
                      <input
                        type="number"
                        id="expectedSalary"
                        name="expectedSalary"
                        value={applicationData.expectedSalary}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="e.g., 50000"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="availableFrom">Available From (Optional)</label>
                      <input
                        type="date"
                        id="availableFrom"
                        name="availableFrom"
                        value={applicationData.availableFrom}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApplicationForm(false)}
                      disabled={applying}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={applying}
                    >
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        )}

        {/* Job Details */}
        <Card title="Job Details">
          <div className="job-details-grid">
            <div className="detail-item">
              <strong>Salary</strong>
              <p>{formatSalary(job)}</p>
            </div>
            <div className="detail-item">
              <strong>Employment Type</strong>
              <p>{job.employmentType}</p>
            </div>
            <div className="detail-item">
              <strong>Number of Positions</strong>
              <p>{job.numberOfPositions}</p>
            </div>
            <div className="detail-item">
              <strong>Experience Required</strong>
              <p>{job.experienceRequired} years</p>
            </div>
            {job.applicationDeadline && (
              <div className="detail-item">
                <strong>Application Deadline</strong>
                <p>{new Date(job.applicationDeadline).toLocaleDateString()}</p>
              </div>
            )}
            <div className="detail-item">
              <strong>Posted On</strong>
              <p>{new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card title="Job Description">
          <p className="job-description-text">{job.description}</p>
        </Card>

        {/* Requirements */}
        <Card title="Requirements">
          <p className="job-requirements-text">{job.requirements}</p>
        </Card>

        {/* Responsibilities */}
        {job.responsibilities && (
          <Card title="Key Responsibilities">
            <p className="job-responsibilities-text">{job.responsibilities}</p>
          </Card>
        )}

        {/* Benefits */}
        {job.benefits && (
          <Card title="Benefits">
            <p className="job-benefits-text">{job.benefits}</p>
          </Card>
        )}

        {/* Location Details */}
        <Card title="Location">
          <div className="location-details">
            <div className="location-item">
              <strong>Region:</strong>
              <p>{job.region}</p>
            </div>
            <div className="location-item">
              <strong>City:</strong>
              <p>{job.city}</p>
            </div>
            {job.specificLocation && (
              <div className="location-item">
                <strong>Specific Location:</strong>
                <p>{job.specificLocation}</p>
              </div>
            )}
            {job.isRemote && (
              <div className="location-item">
                <strong>Remote Work:</strong>
                <p className="remote-available">✓ Remote work is available for this position</p>
              </div>
            )}
          </div>
        </Card>

        {/* Employer Actions */}
        {isOwnJob && (
          <Card>
            <div className="employer-actions">
              <h3>Manage This Job</h3>
              <div className="action-buttons">
                <Button onClick={() => navigate(`/jobs/${jobId}/applications`)}>
                  View Applications ({job.applicationCount || 0})
                </Button>
                <Button variant="outline" onClick={() => navigate(`/jobs/${jobId}/edit`)}>
                  Edit Job
                </Button>
                <Button variant="outline" onClick={() => navigate('/employer/jobs')}>
                  Back to My Jobs
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}

export default JobDetail;
