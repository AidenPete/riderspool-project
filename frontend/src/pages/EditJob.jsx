import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { jobsAPI } from '../api';
import { toast } from '../utils/toast';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './PostJob.css'; // Reuse the same CSS

function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    requirements: '',
    responsibilities: '',
    employmentType: '',
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
    numberOfPositions: '1',
    applicationDeadline: '',
  });

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const data = await jobsAPI.getJob(jobId);

      // Pre-fill form with job data
      setFormData({
        title: data.title || '',
        category: data.category || '',
        description: data.description || '',
        requirements: data.requirements || '',
        responsibilities: data.responsibilities || '',
        employmentType: data.employmentType || '',
        experienceRequired: data.experienceRequired || '',
        salaryMin: data.salaryMin || '',
        salaryMax: data.salaryMax || '',
        salaryCurrency: data.salaryCurrency || 'KES',
        salaryPeriod: data.salaryPeriod || 'monthly',
        benefits: data.benefits || '',
        region: data.region || '',
        city: data.city || '',
        specificLocation: data.specificLocation || '',
        isRemote: data.isRemote || false,
        numberOfPositions: data.numberOfPositions || '1',
        applicationDeadline: data.applicationDeadline ? data.applicationDeadline.split('T')[0] : '',
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
      navigate('/employer/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      const jobData = {
        ...formData,
        experienceRequired: formData.experienceRequired ? parseInt(formData.experienceRequired) : 0,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        numberOfPositions: parseInt(formData.numberOfPositions) || 1,
      };

      await jobsAPI.updateJob(jobId, jobData);

      toast.success('Job updated successfully!');
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.detail || 'Failed to update job');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Card>
          <div className="loading-state">
            <p>Loading job details...</p>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="900px">
      <PageHeader
        title="Edit Job Posting"
        subtitle="Update your job listing details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'My Jobs', path: '/employer/jobs' },
          { label: 'Edit Job' },
        ]}
      />

      <Card>
        <form onSubmit={handleSubmit} className="post-job-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Experienced Motorbike Rider"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="motorbike-rider">Motorbike Rider</option>
                  <option value="car-driver">Car Driver</option>
                  <option value="truck-driver">Truck Driver</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="employmentType">Employment Type *</label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Provide a detailed description of the role..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Requirements</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="4"
                placeholder="List the qualifications and requirements..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="responsibilities">Responsibilities</label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows="4"
                placeholder="List the key responsibilities..."
              />
            </div>
          </div>

          {/* Compensation */}
          <div className="form-section">
            <h3>Compensation & Benefits</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salaryMin">Minimum Salary</label>
                <input
                  type="number"
                  id="salaryMin"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  min="0"
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
                  min="0"
                  placeholder="e.g., 50000"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salaryCurrency">Currency</label>
                <select
                  id="salaryCurrency"
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleChange}
                >
                  <option value="KES">KES (Kenyan Shilling)</option>
                  <option value="USD">USD (US Dollar)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="salaryPeriod">Pay Period</label>
                <select
                  id="salaryPeriod"
                  name="salaryPeriod"
                  value={formData.salaryPeriod}
                  onChange={handleChange}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="benefits">Benefits & Perks</label>
              <textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows="3"
                placeholder="List any benefits, allowances, or perks..."
              />
            </div>
          </div>

          {/* Requirements & Details */}
          <div className="form-section">
            <h3>Requirements & Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experienceRequired">Years of Experience Required</label>
                <input
                  type="number"
                  id="experienceRequired"
                  name="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 3"
                />
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
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="applicationDeadline">Application Deadline</label>
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

          {/* Location */}
          <div className="form-section">
            <h3>Location</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="region">Region *</label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Region</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kisumu">Kisumu</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Eldoret">Eldoret</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Nairobi"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specificLocation">Specific Location</label>
              <input
                type="text"
                id="specificLocation"
                name="specificLocation"
                value={formData.specificLocation}
                onChange={handleChange}
                placeholder="e.g., Westlands, ABC Plaza"
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
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

          {/* Form Actions */}
          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/employer/jobs')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Job'}
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
}

export default EditJob;
