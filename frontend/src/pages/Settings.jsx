import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUser } from '../features/auth/authSlice';
import { authAPI } from '../api';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './Settings.css';

function Settings() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [activeSection, setActiveSection] = useState('account');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Account
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',

    // Availability (providers only)
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: { start: '08:00', end: '17:00' },
    availableWeekends: false,
    availableHolidays: false,

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    interviewAlerts: true,
    marketingEmails: false,

    // Location (providers only)
    preferredRegions: [],
    willingToRelocate: false,
    maxTravelDistance: '50',
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const regions = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale'];

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await authAPI.getSettings();
        setFormData(prev => ({
          ...prev,
          workingDays: settings.workingDays || prev.workingDays,
          workingHours: settings.workingHours || prev.workingHours,
          availableWeekends: settings.availableWeekends || false,
          availableHolidays: settings.availableHolidays || false,
          emailNotifications: settings.emailNotifications !== undefined ? settings.emailNotifications : true,
          smsNotifications: settings.smsNotifications || false,
          interviewAlerts: settings.interviewAlerts !== undefined ? settings.interviewAlerts : true,
          marketingEmails: settings.marketingEmails || false,
          preferredRegions: settings.preferredRegions || [],
          maxTravelDistance: String(settings.maxTravelDistance || 50),
        }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Sections based on user type
  const sections = user?.userType === 'provider'
    ? [
        { id: 'account', label: 'Account', icon: '👤' },
        { id: 'availability', label: 'Availability', icon: '📅' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'location', label: 'Location', icon: '📍' },
      ]
    : [
        { id: 'account', label: 'Account', icon: '👤' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
      ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleRegionToggle = (region) => {
    setFormData(prev => ({
      ...prev,
      preferredRegions: prev.preferredRegions.includes(region)
        ? prev.preferredRegions.filter(r => r !== region)
        : [...prev.preferredRegions, region]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Handle password change separately if passwords are provided
      if (formData.currentPassword && formData.newPassword && formData.confirmPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          alert('New passwords do not match');
          setIsSaving(false);
          return;
        }

        try {
          await authAPI.changePassword({
            old_password: formData.currentPassword,
            new_password: formData.newPassword,
            new_password2: formData.confirmPassword,
          });

          // Clear password fields
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }));

          alert('Password changed successfully!');
        } catch (error) {
          const errorMessage = error.response?.data?.old_password ||
                              error.response?.data?.new_password ||
                              error.response?.data?.message ||
                              'Failed to change password';
          alert(errorMessage);
          setIsSaving(false);
          return;
        }
      }

      // Update phone if changed
      if (formData.phone !== user?.phone) {
        await authAPI.updateCurrentUser({ phone: formData.phone });
        dispatch(updateUser({ ...user, phone: formData.phone }));
      }

      // Save all other settings
      const settingsData = {
        workingDays: formData.workingDays,
        workingHours: formData.workingHours,
        availableWeekends: formData.availableWeekends,
        availableHolidays: formData.availableHolidays,
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        interviewAlerts: formData.interviewAlerts,
        marketingEmails: formData.marketingEmails,
        preferredRegions: formData.preferredRegions,
        maxTravelDistance: parseInt(formData.maxTravelDistance) || 50,
        willingToRelocate: formData.willingToRelocate,
      };

      await authAPI.updateSettings(settingsData);

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Settings save error:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="settings-page">
        <Navbar />
        <div className="settings-container">
          <div className="settings-header">
            <h1>Settings</h1>
            <p>Loading your preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <Navbar />

      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account preferences</p>
        </div>

        <div className="settings-layout">
          {/* Sidebar */}
          <div className="settings-sidebar">
            {sections.map(section => (
              <button
                key={section.id}
                className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="sidebar-icon">{section.icon}</span>
                <span className="sidebar-label">{section.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="settings-content">
            <form onSubmit={handleSave}>
              {/* Account Section */}
              {activeSection === 'account' && (
                <Card title="Account Settings">
                  <div className="settings-section">
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                      <small className="field-hint">Contact support to change your email</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+254 700 000000"
                      />
                    </div>

                    <hr className="section-divider" />

                    <h3 className="subsection-title">Change Password</h3>

                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Availability Section */}
              {activeSection === 'availability' && (
                <Card title="Availability Settings">
                  <div className="settings-section">
                    <div className="form-group">
                      <label>Working Days</label>
                      <p className="field-description">Select the days you are available for work</p>
                      <div className="days-grid">
                        {weekDays.map(day => (
                          <label key={day} className="day-checkbox">
                            <input
                              type="checkbox"
                              checked={formData.workingDays.includes(day)}
                              onChange={() => handleDayToggle(day)}
                            />
                            <span>{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-group">
                        <label htmlFor="startTime">Start Time</label>
                        <input
                          type="time"
                          id="startTime"
                          value={formData.workingHours.start}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            workingHours: { ...prev.workingHours, start: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="endTime">End Time</label>
                        <input
                          type="time"
                          id="endTime"
                          value={formData.workingHours.end}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            workingHours: { ...prev.workingHours, end: e.target.value }
                          }))}
                        />
                      </div>
                    </div>

                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="availableWeekends"
                          checked={formData.availableWeekends}
                          onChange={handleInputChange}
                        />
                        <span>Available to work on weekends</span>
                      </label>

                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="availableHolidays"
                          checked={formData.availableHolidays}
                          onChange={handleInputChange}
                        />
                        <span>Available to work on public holidays</span>
                      </label>
                    </div>
                  </div>
                </Card>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <Card title="Notification Preferences">
                  <div className="settings-section">
                    <p className="field-description">Choose how you want to be notified</p>

                    <div className="notification-options">
                      <div className="notification-item">
                        <div className="notification-info">
                          <h4>Email Notifications</h4>
                          <p>Receive updates via email</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={formData.emailNotifications}
                            onChange={handleInputChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="notification-item">
                        <div className="notification-info">
                          <h4>SMS Notifications</h4>
                          <p>Receive updates via text message</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            name="smsNotifications"
                            checked={formData.smsNotifications}
                            onChange={handleInputChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="notification-item">
                        <div className="notification-info">
                          <h4>Interview Request Alerts</h4>
                          <p>Get notified when employers request interviews</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            name="interviewAlerts"
                            checked={formData.interviewAlerts}
                            onChange={handleInputChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="notification-item">
                        <div className="notification-info">
                          <h4>Marketing Emails</h4>
                          <p>Receive tips, news, and promotional content</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            name="marketingEmails"
                            checked={formData.marketingEmails}
                            onChange={handleInputChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Location Section */}
              {activeSection === 'location' && (
                <Card title="Location Preferences">
                  <div className="settings-section">
                    <div className="form-group">
                      <label>Preferred Work Regions</label>
                      <p className="field-description">Select regions where you prefer to work</p>
                      <div className="regions-grid">
                        {regions.map(region => (
                          <label key={region} className="region-checkbox">
                            <input
                              type="checkbox"
                              checked={formData.preferredRegions.includes(region)}
                              onChange={() => handleRegionToggle(region)}
                            />
                            <span>{region}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="maxTravelDistance">Maximum Travel Distance (km)</label>
                      <input
                        type="number"
                        id="maxTravelDistance"
                        name="maxTravelDistance"
                        value={formData.maxTravelDistance}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="50"
                      />
                      <small className="field-hint">Maximum distance you're willing to travel for work</small>
                    </div>

                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="willingToRelocate"
                          checked={formData.willingToRelocate}
                          onChange={handleInputChange}
                        />
                        <span>Willing to relocate for the right opportunity</span>
                      </label>
                    </div>
                  </div>
                </Card>
              )}

              {/* Save Button */}
              <div className="settings-actions">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
