import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { providersAPI } from '../api';
import { getMediaUrl } from '../api/axios';
import { calculateProfileCompletion } from '../utils/profileCompletion';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FileUpload from '../components/common/FileUpload';
import './ProfileCompletion.css';

function ProfileCompletion() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Documents
    profilePhoto: null,
    idDocument: null,
    licenseDocument: null,

    // Essential Info
    registeredName: '',
    idNumber: '',
    licenseNumber: '',
    bio: '',
    willingToRelocate: false,
    preferredLocations: '',

    // Skills
    additionalSkills: [],
  });

  const [currentSection, setCurrentSection] = useState('documents');
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState({
    profilePhoto: false,
    idDocument: false,
    licenseDocument: false
  });
  const [profileData, setProfileData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const skillSuggestions = [
    'First Aid',
    'Photography',
    'Videography',
    'Tour Guide',
    'Multiple Languages',
    'Navigation Expert',
    'Vehicle Maintenance',
    'Customer Service',
    'GPS Navigation',
    'Route Planning',
  ];

  // Fetch existing profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await providersAPI.getMyProfile();
        setProfileData(data);

        // Mark documents as uploaded if they exist
        setUploadedDocs({
          profilePhoto: !!data.profilePhoto,
          idDocument: !!data.idDocument,
          licenseDocument: !!data.licenseDocument
        });

        // Pre-fill form data
        if (data.registeredName) setFormData(prev => ({ ...prev, registeredName: data.registeredName }));
        if (data.idNumber) setFormData(prev => ({ ...prev, idNumber: data.idNumber }));
        if (data.licenseNumber) setFormData(prev => ({ ...prev, licenseNumber: data.licenseNumber }));
        if (data.bio) setFormData(prev => ({ ...prev, bio: data.bio }));
        if (data.willingToRelocate !== undefined) setFormData(prev => ({ ...prev, willingToRelocate: data.willingToRelocate }));
        if (data.preferredLocations) setFormData(prev => ({ ...prev, preferredLocations: data.preferredLocations }));
        if (data.skills) {
          const skillsArray = data.skills.split(',').map(s => s.trim());
          setFormData(prev => ({ ...prev, additionalSkills: skillsArray }));
        }

        // Check if profile is complete - if yes, show view mode
        const completion = calculateProfileCompletion(data);
        if (completion === 100) {
          setIsEditMode(false);
        } else {
          setIsEditMode(true);
        }
// eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.log('No existing profile found, starting fresh');
        setIsEditMode(true); // New profile, start in edit mode
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Calculate profile completion percentage using shared utility
  const calculateCompletion = () => {
    return calculateProfileCompletion(
      {
        ...profileData,
        registeredName: formData.registeredName || profileData?.registeredName,
        idNumber: formData.idNumber || profileData?.idNumber,
        licenseNumber: formData.licenseNumber || profileData?.licenseNumber,
        bio: formData.bio || profileData?.bio,
        skills: formData.additionalSkills.length > 0
          ? formData.additionalSkills.join(', ')
          : profileData?.skills,
      },
      uploadedDocs
    );
  };

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

  const handleRemoveFile = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
    // Note: This only removes from local state, not from server
    // To remove from server, you'd need to make an API call
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Add files if they exist
      if (formData.profilePhoto) {
        formDataToSend.append('profilePhoto', formData.profilePhoto);
      }
      if (formData.idDocument) {
        formDataToSend.append('idDocument', formData.idDocument);
      }
      if (formData.licenseDocument) {
        formDataToSend.append('licenseDocument', formData.licenseDocument);
      }

      // Add text fields
      if (formData.registeredName) formDataToSend.append('registeredName', formData.registeredName);
      if (formData.bio) formDataToSend.append('bio', formData.bio);
      if (formData.idNumber) formDataToSend.append('idNumber', formData.idNumber);
      if (formData.licenseNumber) formDataToSend.append('licenseNumber', formData.licenseNumber);

      // Add skills as comma-separated string
      if (formData.additionalSkills && formData.additionalSkills.length > 0) {
        formDataToSend.append('skills', formData.additionalSkills.join(', '));
      }

      // Add category and experience from user data
      formDataToSend.append('category', user.category || '');
      formDataToSend.append('experience', user.experience || 0);
      formDataToSend.append('availability', true);

      // Send to API using FormData
      const result = await providersAPI.updateMyProfile(formDataToSend);

      // Update profile data with server response
      setProfileData(result);

      // Update uploaded docs status
      setUploadedDocs({
        profilePhoto: !!result.profilePhoto,
        idDocument: !!result.idDocument,
        licenseDocument: !!result.licenseDocument
      });

      // Clear the local file selections after successful upload
      setFormData(prev => ({
        ...prev,
        profilePhoto: null,
        idDocument: null,
        licenseDocument: null
      }));

      alert('Profile updated successfully!');

      // Check if profile is now complete, if so switch to view mode
      const newCompletion = calculateProfileCompletion(result);
      if (newCompletion === 100) {
        setIsEditMode(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update profile. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'information', label: 'Information', icon: '👤' },
    { id: 'professional', label: 'Bio & Skills', icon: '⭐' },
  ];

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <div className="loading-message">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        <div className="profile-header">
          {/* Profile Photo Preview */}
          <div className="profile-photo-preview">
            {(formData.profilePhoto || profileData?.profilePhoto) ? (
              <img
                src={formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : getMediaUrl(profileData?.profilePhoto)}
                alt="Profile"
                className="profile-avatar-large"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {user?.fullName?.charAt(0).toUpperCase() || 'P'}
              </div>
            )}
          </div>

          <h1>{isEditMode ? 'Complete Your Profile' : 'My Profile'}</h1>
          <p>{isEditMode ? 'Help employers find you by completing your profile' : 'View and manage your professional profile'}</p>

          {!isEditMode && (
            <div className="profile-actions-header">
              <Button variant="primary" onClick={() => setIsEditMode(true)}>
                Edit Profile
              </Button>
            </div>
          )}

          {/* Profile Completion Progress */}
          <div className="profile-progress">
            <div className="progress-header">
              <span className="progress-label">Profile Completion</span>
              <span className="progress-percentage">{calculateCompletion()}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${calculateCompletion()}%` }}
              ></div>
            </div>
            {calculateCompletion() < 100 && (
              <p className="progress-hint">
                Complete all sections to increase your chances of getting interview requests!
              </p>
            )}
            {calculateCompletion() === 100 && (
              <p className="progress-success">
                ✓ Your profile is complete! You're more likely to get interview requests.
              </p>
            )}
          </div>
        </div>

        {/* Section Tabs - Only show in edit mode */}
        {isEditMode && (
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
        )}

        {isEditMode ? (
          <form onSubmit={handleSubmit}>
          {/* Documents Section */}
          {currentSection === 'documents' && (
            <Card title="Upload Documents">
              <div className="form-grid">
                <div className="document-upload-wrapper">
                  <FileUpload
                    label="Profile Photo"
                    accept="image/*"
                    value={formData.profilePhoto}
                    onChange={(file) => handleFileUpload('profilePhoto', file)}
                    helperText="Upload a professional photo (JPG, PNG - Max 5MB)"
                  />
                  {(uploadedDocs.profilePhoto || formData.profilePhoto) && (
                    <div className="upload-status-actions">
                      <div className="upload-status success">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Uploaded</span>
                      </div>
                      {formData.profilePhoto && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile('profilePhoto')}
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="document-upload-wrapper">
                  <FileUpload
                    label="National ID / Passport"
                    accept="image/*,application/pdf"
                    value={formData.idDocument}
                    onChange={(file) => handleFileUpload('idDocument', file)}
                    helperText="Clear photo of your ID (JPG, PNG, PDF - Max 5MB)"
                  />
                  {(uploadedDocs.idDocument || formData.idDocument) && (
                    <div className="upload-status-actions">
                      <div className="upload-status success">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Uploaded</span>
                      </div>
                      {formData.idDocument && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile('idDocument')}
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="document-upload-wrapper">
                  <FileUpload
                    label="Driver's License"
                    accept="image/*,application/pdf"
                    value={formData.licenseDocument}
                    onChange={(file) => handleFileUpload('licenseDocument', file)}
                    helperText="Valid driver's license (JPG, PNG, PDF - Max 5MB)"
                  />
                  {(uploadedDocs.licenseDocument || formData.licenseDocument) && (
                    <div className="upload-status-actions">
                      <div className="upload-status success">
                        <span className="status-icon">✓</span>
                        <span className="status-text">Uploaded</span>
                      </div>
                      {formData.licenseDocument && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile('licenseDocument')}
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Information Section */}
          {currentSection === 'information' && (
            <Card title="Essential Information">
              <div className="form-grid-2col">
                <div className="form-group full-width">
                  <label>Registered Full Name (As per ID) *</label>
                  <input
                    type="text"
                    name="registeredName"
                    value={formData.registeredName}
                    onChange={handleInputChange}
                    placeholder="Enter your full legal name"
                    required
                  />
                  <small className="field-hint">This should match the name on your ID document</small>
                </div>

                <div className="form-group">
                  <label>National ID Number *</label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your ID number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Driver's License Number *</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your license number"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Preferred Working Locations</label>
                  <input
                    type="text"
                    name="preferredLocations"
                    value={formData.preferredLocations}
                    onChange={handleInputChange}
                    placeholder="e.g., Nairobi, Mombasa, Kisumu"
                  />
                  <small className="field-hint">Enter cities or regions where you prefer to work (comma-separated)</small>
                </div>

                <div className="form-group full-width">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="willingToRelocate"
                        checked={formData.willingToRelocate}
                        onChange={(e) => setFormData(prev => ({ ...prev, willingToRelocate: e.target.checked }))}
                      />
                      <span>I am willing to relocate for work</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Professional Section - Bio & Skills Combined */}
          {currentSection === 'professional' && (
            <>
              <Card title="Professional Bio">
                <div className="form-group">
                  <label>Tell Employers About Yourself</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Describe your experience, skills, reliability, and what makes you a great service provider..."
                  />
                  <small className="field-hint">
                    Tip: Mention your years of experience, types of vehicles/machines you've operated,
                    and any special achievements or certifications
                  </small>
                </div>
              </Card>

              <Card title="Additional Skills">
                <div className="skills-section">
                  <p className="section-description">
                    Add any additional skills that make you stand out to employers
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
            </>
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
        ) : (
          /* View Mode - Display Profile */
          <div className="profile-view-mode">
            {/* Documents Card */}
            <Card title="Documents">
              <div className="profile-info-grid">
                <div className="info-item">
                  <label>Profile Photo</label>
                  <div className="doc-status">
                    {profileData?.profilePhoto ? (
                      <span className="status-badge verified">✓ Uploaded</span>
                    ) : (
                      <span className="status-badge pending">Not uploaded</span>
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <label>National ID / Passport</label>
                  <div className="doc-status">
                    {profileData?.idDocument ? (
                      <span className="status-badge verified">✓ Uploaded</span>
                    ) : (
                      <span className="status-badge pending">Not uploaded</span>
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <label>Driver's License</label>
                  <div className="doc-status">
                    {profileData?.licenseDocument ? (
                      <span className="status-badge verified">✓ Uploaded</span>
                    ) : (
                      <span className="status-badge pending">Not uploaded</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <Button variant="outline" size="small" onClick={() => { setIsEditMode(true); setCurrentSection('documents'); }}>
                  Edit Documents
                </Button>
              </div>
            </Card>

            {/* Information Card */}
            <Card title="Essential Information">
              <div className="profile-info-grid">
                <div className="info-item">
                  <label>Registered Full Name</label>
                  <div className="info-value">{profileData?.registeredName || 'Not provided'}</div>
                </div>
                <div className="info-item">
                  <label>National ID Number</label>
                  <div className="info-value">{profileData?.idNumber || 'Not provided'}</div>
                </div>
                <div className="info-item">
                  <label>Driver's License Number</label>
                  <div className="info-value">{profileData?.licenseNumber || 'Not provided'}</div>
                </div>
                <div className="info-item">
                  <label>Preferred Working Locations</label>
                  <div className="info-value">{profileData?.preferredLocations || 'Not specified'}</div>
                </div>
                <div className="info-item">
                  <label>Willing to Relocate</label>
                  <div className="info-value">{profileData?.willingToRelocate ? 'Yes' : 'No'}</div>
                </div>
              </div>
              <div className="card-actions">
                <Button variant="outline" size="small" onClick={() => { setIsEditMode(true); setCurrentSection('information'); }}>
                  Edit Information
                </Button>
              </div>
            </Card>

            {/* Professional Bio Card */}
            <Card title="Professional Bio">
              <div className={`bio-text ${!profileData?.bio ? 'empty' : ''}`}>
                {profileData?.bio || 'No bio provided yet'}
              </div>
              <div className="card-actions">
                <Button variant="outline" size="small" onClick={() => { setIsEditMode(true); setCurrentSection('professional'); }}>
                  Edit Bio
                </Button>
              </div>
            </Card>

            {/* Skills Card */}
            <Card title="Skills & Expertise">
              {profileData?.skills ? (
                <div className="skill-chips">
                  {profileData.skills.split(',').map((skill, index) => (
                    <div key={index} className="skill-chip view-mode">
                      {skill.trim()}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="bio-text empty">No skills added yet</p>
              )}
              <div className="card-actions">
                <Button variant="outline" size="small" onClick={() => { setIsEditMode(true); setCurrentSection('professional'); }}>
                  Edit Skills
                </Button>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="profile-view-actions">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button variant="primary" onClick={() => setIsEditMode(true)}>
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCompletion;
