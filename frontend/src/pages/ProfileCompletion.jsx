import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUser } from '../features/auth/authSlice';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FileUpload from '../components/common/FileUpload';
import './ProfileCompletion.css';

function ProfileCompletion() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Documents
    profilePhoto: null,
    idDocument: null,
    licenseDocument: null,

    // Personal Info
    registeredName: '',
    dateOfBirth: '',
    gender: '',

    // Location
    region: '',
    city: '',
    willingToRelocate: false,

    // Professional
    vehicleExperience: [], // Array of {vehicleType, duration}
    bio: '',

    // Additional Skills
    additionalSkills: [],

    // Work Experience
    workExperience: [],

    // Certifications
    certifications: [],
  });

  const [currentSection, setCurrentSection] = useState('documents');
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const regions = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'];
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const allVehicleTypes = {
    'Motorbikes': ['Honda', 'Yamaha', 'TVS', 'Bajaj', 'Suzuki', 'Other Motorbike'],
    'Cars': ['Sedan', 'SUV', 'Hatchback', 'Station Wagon', 'Pickup'],
    'Trucks': ['Light Truck', 'Medium Truck', 'Heavy Truck', 'Trailer Truck'],
    'Buses': ['Mini Bus (14-seater)', 'Medium Bus (25-seater)', 'Full Size Bus (50+ seater)', 'Tour Coach'],
    'Machinery': ['Forklift', 'Crane', 'Excavator', 'Bulldozer', 'Grader', 'Loader', 'Other Machinery'],
  };

  const durationOptions = [
    'Less than 6 months',
    '6 months - 1 year',
    '1 - 2 years',
    '2 - 3 years',
    '3 - 5 years',
    '5 - 10 years',
    '10+ years',
  ];

  const skillSuggestions = [
    'First Aid',
    'Photography',
    'Videography',
    'Tour Guide',
    'Multiple Languages',
    'Navigation Expert',
    'Vehicle Maintenance',
    'Customer Service',
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const addSkill = (skill) => {
    if (skill && !formData.additionalSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        additionalSkills: [...prev.additionalSkills, skill]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      additionalSkills: prev.additionalSkills.filter(s => s !== skill)
    }));
  };

  const addVehicleExperience = (vehicleType) => {
    if (!formData.vehicleExperience.find(v => v.vehicleType === vehicleType)) {
      setFormData(prev => ({
        ...prev,
        vehicleExperience: [...prev.vehicleExperience, { vehicleType, duration: '' }]
      }));
    }
  };

  const removeVehicleExperience = (vehicleType) => {
    setFormData(prev => ({
      ...prev,
      vehicleExperience: prev.vehicleExperience.filter(v => v.vehicleType !== vehicleType)
    }));
  };

  const updateVehicleDuration = (vehicleType, duration) => {
    setFormData(prev => ({
      ...prev,
      vehicleExperience: prev.vehicleExperience.map(v =>
        v.vehicleType === vehicleType ? { ...v, duration } : v
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user data
      dispatch(updateUser({
        ...formData,
        profileCompleted: true,
      }));

      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'professional', label: 'Professional', icon: '💼' },
    { id: 'skills', label: 'Skills', icon: '⭐' },
  ];

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        <div className="profile-header">
          <h1>Complete Your Profile</h1>
          <p>Help employers find you by completing your profile</p>
        </div>

        {/* Section Tabs */}
        <div className="section-tabs">
          {sections.map(section => (
            <button
              key={section.id}
              className={`section-tab ${currentSection === section.id ? 'active' : ''}`}
              onClick={() => setCurrentSection(section.id)}
            >
              <span className="tab-icon">{section.icon}</span>
              <span className="tab-label">{section.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Documents Section */}
          {currentSection === 'documents' && (
            <Card title="Upload Documents">
              <div className="form-grid">
                <FileUpload
                  label="Profile Photo"
                  accept="image/*"
                  value={formData.profilePhoto}
                  onChange={(file) => handleFileUpload('profilePhoto', file)}
                  helperText="Upload a professional photo (JPG, PNG - Max 5MB)"
                />

                <FileUpload
                  label="National ID / Passport"
                  accept="image/*,application/pdf"
                  value={formData.idDocument}
                  onChange={(file) => handleFileUpload('idDocument', file)}
                  helperText="Clear photo of your ID (JPG, PNG, PDF - Max 5MB)"
                />

                <FileUpload
                  label="Driver's License"
                  accept="image/*,application/pdf"
                  value={formData.licenseDocument}
                  onChange={(file) => handleFileUpload('licenseDocument', file)}
                  helperText="Valid driver's license (JPG, PNG, PDF - Max 5MB)"
                />
              </div>
            </Card>
          )}

          {/* Personal Info Section */}
          {currentSection === 'personal' && (
            <Card title="Personal Information">
              <div className="form-grid-2col">
                <div className="form-group full-width">
                  <label>Registered Full Name (As per ID)</label>
                  <input
                    type="text"
                    name="registeredName"
                    value={formData.registeredName}
                    onChange={handleInputChange}
                    placeholder="Enter your full legal name"
                  />
                  <small className="field-hint">This should match the name on your ID document</small>
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select gender...</option>
                    {genders.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Region</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                  >
                    <option value="">Select region...</option>
                    {regions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="willingToRelocate"
                    checked={formData.willingToRelocate}
                    onChange={handleInputChange}
                  />
                  <span>Willing to relocate for work</span>
                </label>
              </div>
            </Card>
          )}

          {/* Professional Section */}
          {currentSection === 'professional' && (
            <Card title="Professional Details">
              <div className="form-group">
                <label>Vehicles/Machines Experience</label>
                <p className="field-description">Select all vehicles or machines you have experience with and specify the duration</p>
              </div>

              {/* Vehicle/Machine Experience Grid */}
              <div className="vehicle-experience-section">
                {Object.entries(allVehicleTypes).map(([category, types]) => (
                  <div key={category} className="vehicle-category">
                    <h4 className="category-title">{category}</h4>
                    <div className="vehicle-options">
                      {types.map(type => {
                        const isSelected = formData.vehicleExperience.find(v => v.vehicleType === type);
                        return (
                          <div key={type} className="vehicle-option">
                            <label className="vehicle-checkbox">
                              <input
                                type="checkbox"
                                checked={!!isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    addVehicleExperience(type);
                                  } else {
                                    removeVehicleExperience(type);
                                  }
                                }}
                              />
                              <span>{type}</span>
                            </label>
                            {isSelected && (
                              <select
                                className="duration-select"
                                value={isSelected.duration}
                                onChange={(e) => updateVehicleDuration(type, e.target.value)}
                              >
                                <option value="">Select duration...</option>
                                {durationOptions.map(duration => (
                                  <option key={duration} value={duration}>{duration}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Professional Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell employers about your experience, skills, and what makes you a great fit..."
                />
              </div>
            </Card>
          )}

          {/* Skills Section */}
          {currentSection === 'skills' && (
            <Card title="Additional Skills">
              <div className="skills-section">
                <p className="section-description">
                  Add any additional skills that make you stand out
                </p>

                <div className="skill-input-group">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Type a skill..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(newSkill);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addSkill(newSkill)}
                    variant="primary"
                    size="small"
                  >
                    Add
                  </Button>
                </div>

                <div className="skill-suggestions">
                  <p>Suggested skills:</p>
                  <div className="suggestion-chips">
                    {skillSuggestions.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        className="suggestion-chip"
                        onClick={() => addSkill(skill)}
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.additionalSkills.length > 0 && (
                  <div className="selected-skills">
                    <p>Your skills:</p>
                    <div className="skill-chips">
                      {formData.additionalSkills.map(skill => (
                        <div key={skill} className="skill-chip">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="remove-chip"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Save Draft & Exit
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save & Complete Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileCompletion;
