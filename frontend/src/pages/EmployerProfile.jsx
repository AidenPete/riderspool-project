import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUser } from '../features/auth/authSlice';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FileUpload from '../components/common/FileUpload';
import './ProfileCompletion.css';

function EmployerProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    // Company Details
    companyName: user?.companyName || '',
    industry: user?.industry || '',
    contactPerson: user?.contactPerson || '',
    email: user?.email || '',
    phone: user?.phone || '',
    website: '',
    companySize: '',

    // Registration
    registrationNumber: '',
    registrationCertificate: null,

    // Physical Location
    officeAddress: '',
    region: '',
    city: '',
    postalCode: '',

    // Additional
    description: '',
  });

  const [errors, setErrors] = useState({});

  const industries = [
    'Construction',
    'NGO / Non-Profit',
    'Government',
    'Logistics & Transportation',
    'Agriculture',
    'Mining',
    'Manufacturing',
    'Hospitality & Tourism',
    'Real Estate',
    'Healthcare',
    'Education',
    'Technology',
    'Other',
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees',
  ];

  const regions = [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
    'Malindi',
    'Kitale',
    'Garissa',
    'Kakamega',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (name, file) => {
    setFormData(prev => ({ ...prev, [name]: file }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
    if (!formData.officeAddress) newErrors.officeAddress = 'Office address is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.city) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Replace with actual API call
      // PUT /api/employers/profile
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Employer profile updated:', formData);

      // Update user context
      dispatch(updateUser({
        ...user,
        companyName: formData.companyName,
        industry: formData.industry,
        profileComplete: true,
      }));

      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-completion-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>Company Profile</h1>
            <p>Complete your company information to start hiring service providers</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {/* Company Details Section */}
            <Card title="Company Details">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="companyName">
                    Company Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={errors.companyName ? 'error' : ''}
                    placeholder="ABC Construction Ltd"
                  />
                  {errors.companyName && <span className="error-message">{errors.companyName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="industry">
                    Industry <span className="required">*</span>
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={errors.industry ? 'error' : ''}
                  >
                    <option value="">Select industry</option>
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  {errors.industry && <span className="error-message">{errors.industry}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="contactPerson">
                    Contact Person <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={errors.contactPerson ? 'error' : ''}
                    placeholder="John Doe"
                  />
                  {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="companySize">Company Size</label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                  >
                    <option value="">Select company size</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="info@company.com"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="+254 700 000000"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="website">Company Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.company.com"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Company Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Brief description of your company and what you do..."
                  />
                </div>
              </div>
            </Card>

            {/* Business Registration Section */}
            <Card title="Business Registration">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="registrationNumber">
                    Business Registration Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className={errors.registrationNumber ? 'error' : ''}
                    placeholder="PVT-XXXXXXXXX"
                  />
                  {errors.registrationNumber && <span className="error-message">{errors.registrationNumber}</span>}
                </div>

                <div className="form-group full-width">
                  <label>Business Registration Certificate</label>
                  <FileUpload
                    label="Upload Certificate"
                    accept="image/*,application/pdf"
                    onChange={(file) => handleFileChange('registrationCertificate', file)}
                  />
                  <small className="field-hint">
                    Upload a clear copy of your business registration certificate (PDF or Image)
                  </small>
                </div>
              </div>
            </Card>

            {/* Physical Location Section */}
            <Card title="Office Location">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="officeAddress">
                    Office Address <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="officeAddress"
                    name="officeAddress"
                    value={formData.officeAddress}
                    onChange={handleChange}
                    className={errors.officeAddress ? 'error' : ''}
                    placeholder="Building name, street, floor, etc."
                  />
                  {errors.officeAddress && <span className="error-message">{errors.officeAddress}</span>}
                </div>

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
                    <option value="">Select region</option>
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
                    placeholder="Enter city"
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="00100"
                  />
                </div>
              </div>
            </Card>

            {/* Form Actions */}
            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EmployerProfile;
