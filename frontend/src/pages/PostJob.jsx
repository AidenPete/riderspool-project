import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { jobsAPI } from '../api';
import { toast } from '../utils/toast';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/common/PageHeader';
import './PostJob.css';

function PostJob() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    requirements: '',
    responsibilities: '',
    employmentType: 'full-time',
    experienceRequired: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'KES',
    salaryPeriod: 'monthly',
    benefits: '',
    region: '',
    city: '',
    specificLocation: '',
    isRemote: false,
    numberOfPositions: 1,
    applicationDeadline: '',
  });
  const [showCompensation, setShowCompensation] = useState(true);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'motorbike-rider', label: 'Motorbike Rider' },
    { value: 'car-driver', label: 'Car Driver' },
    { value: 'truck-driver', label: 'Truck Driver' },
  ];

  const employmentTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
  ];

  const regions = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
    'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    }

    if (!formData.experienceRequired) {
      newErrors.experienceRequired = 'Experience required is needed';
    } else if (isNaN(formData.experienceRequired) || formData.experienceRequired < 0) {
      newErrors.experienceRequired = 'Please enter a valid number';
    }

    if (!formData.region) {
      newErrors.region = 'Region is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (formData.salaryMin && formData.salaryMax) {
      if (parseFloat(formData.salaryMin) > parseFloat(formData.salaryMax)) {
        newErrors.salaryMax = 'Maximum salary must be greater than minimum';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.warning('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Prepare data for API
      const jobData = {
        ...formData,
        experienceRequired: parseInt(formData.experienceRequired),
        numberOfPositions: parseInt(formData.numberOfPositions),
        // Only include salary if showCompensation is true
        salaryMin: showCompensation && formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        salaryMax: showCompensation && formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        applicationDeadline: formData.applicationDeadline || null,
      };

      await jobsAPI.createJob(jobData);
      toast.success('Job posted successfully!');
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.response?.data?.error || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.userType !== 'employer') {
    return (
      <PageLayout maxWidth="500px">
        <div className="unauthorized">
          <h2>Unauthorized</h2>
          <p>Only employers can post jobs.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="900px">
      <PageHeader
        title="Post a New Job"
        subtitle="Find the perfect service provider for your needs"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Post a Job' }
        ]}
      />

      <form onSubmit={handleSubmit} className="post-job-form">
        {/* Job Details Section */}
        <div className="form-section">
          <h2>Job Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">
                Job Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="e.g., Personal Driver"
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Job Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              rows="6"
              placeholder="Describe the job role, what the provider will be doing, and any other relevant details..."
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="requirements">
              Requirements <span className="required">*</span>
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              className={errors.requirements ? 'error' : ''}
              rows="4"
              placeholder="List the required qualifications, skills, licenses, etc..."
            />
            {errors.requirements && <span className="error-message">{errors.requirements}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="responsibilities">Key Responsibilities</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the main responsibilities (optional)..."
            />
          </div>
        </div>

        {/* Employment Details Section */}
        <div className="form-section">
          <h2>Employment Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employmentType">Employment Type</label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
              >
                {employmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experienceRequired">
                Years of Experience Required <span className="required">*</span>
              </label>
              <input
                type="number"
                id="experienceRequired"
                name="experienceRequired"
                value={formData.experienceRequired}
                onChange={handleChange}
                className={errors.experienceRequired ? 'error' : ''}
                min="0"
                placeholder="e.g., 3"
              />
              {errors.experienceRequired && <span className="error-message">{errors.experienceRequired}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="numberOfPositions">Number of Positions</label>
              <input
                type="number"
                id="numberOfPositions"
                name="numberOfPositions"
                value={formData.numberOfPositions}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Compensation Section */}
        <div className="form-section">
          <div className="section-header">
            <h2>Compensation</h2>
            <div className="form-group checkbox-group compensation-toggle">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showCompensation}
                  onChange={(e) => setShowCompensation(e.target.checked)}
                />
                <span>Display salary information publicly</span>
              </label>
              <p className="helper-text">
                {showCompensation
                  ? 'Salary details will be visible to all providers'
                  : 'Salary will be discussed during the interview process'}
              </p>
            </div>
          </div>

          {showCompensation && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="salaryMin">Minimum Salary</label>
                  <input
                    type="number"
                    id="salaryMin"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    placeholder="e.g., 30000"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="salaryMax">Maximum Salary</label>
                  <input
                    type="number"
                    id="salaryMax"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    className={errors.salaryMax ? 'error' : ''}
                    placeholder="e.g., 50000"
                  />
                  {errors.salaryMax && <span className="error-message">{errors.salaryMax}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="salaryCurrency">Currency</label>
                  <select
                    id="salaryCurrency"
                    name="salaryCurrency"
                    value={formData.salaryCurrency}
                    onChange={handleChange}
                  >
                    <option value="KES">KES</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="salaryPeriod">Period</label>
                  <select
                    id="salaryPeriod"
                    name="salaryPeriod"
                    value={formData.salaryPeriod}
                    onChange={handleChange}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="benefits">Additional Benefits</label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows="3"
              placeholder="List any additional benefits (housing, meals, transport, etc.)..."
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="form-section">
          <h2>Location</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="region">
                Region <span className="required">*</span>
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={errors.region ? 'error' : ''}
              >
                <option value="">Select region...</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {errors.region && <span className="error-message">{errors.region}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? 'error' : ''}
                placeholder="e.g., Westlands"
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="specificLocation">Specific Location Details</label>
            <input
              type="text"
              id="specificLocation"
              name="specificLocation"
              value={formData.specificLocation}
              onChange={handleChange}
              placeholder="e.g., Near ABC Mall, XYZ Street"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleChange}
              />
              <span>Remote work available</span>
            </label>
          </div>
        </div>

        {/* Application Deadline */}
        <div className="form-section">
          <h2>Application Deadline</h2>

          <div className="form-group">
            <label htmlFor="applicationDeadline">Deadline (Optional)</label>
            <input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Form Actions */}
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
            disabled={loading}
          >
            {loading ? 'Posting Job...' : 'Post Job'}
          </Button>
        </div>
      </form>

      {loading && <LoadingSpinner fullScreen message="Posting your job..." />}
    </PageLayout>
  );
}

export default PostJob;
