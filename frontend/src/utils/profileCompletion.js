/**
 * Calculate profile completion percentage
 * Simple KYC-focused calculation
 */
export const calculateProfileCompletion = (profileData, uploadedDocs = {}) => {
  let completed = 0;
  let total = 7; // Total essential items

  // Essential Documents (3 items) - 43% weight
  if (profileData?.profilePhoto || uploadedDocs.profilePhoto) completed++;
  if (profileData?.idDocument || uploadedDocs.idDocument) completed++;
  if (profileData?.licenseDocument || uploadedDocs.licenseDocument) completed++;

  // Essential Information (2 items) - 28% weight
  if (profileData?.registeredName) completed++;
  if (profileData?.idNumber && profileData?.licenseNumber) completed++;

  // Professional Info (2 items) - 29% weight
  if (profileData?.bio) completed++;
  if (profileData?.skills) completed++;

  return Math.round((completed / total) * 100);
};

/**
 * Get pending tasks based on profile completion
 */
export const getPendingTasks = (profileData, uploadedDocs = {}) => {
  const tasks = [];

  // Check documents
  if (!profileData?.profilePhoto && !uploadedDocs.profilePhoto) {
    tasks.push({ id: 1, task: 'Upload Profile Photo', icon: '📸', priority: 'high' });
  }
  if (!profileData?.idDocument && !uploadedDocs.idDocument) {
    tasks.push({ id: 2, task: 'Upload ID Document', icon: '🆔', priority: 'high' });
  }
  if (!profileData?.licenseDocument && !uploadedDocs.licenseDocument) {
    tasks.push({ id: 3, task: 'Upload Driver\'s License', icon: '📄', priority: 'high' });
  }

  // Check information
  if (!profileData?.registeredName) {
    tasks.push({ id: 4, task: 'Enter Registered Name', icon: '👤', priority: 'high' });
  }
  if (!profileData?.idNumber || !profileData?.licenseNumber) {
    tasks.push({ id: 5, task: 'Add ID & License Numbers', icon: '🔢', priority: 'high' });
  }

  // Check professional info
  if (!profileData?.bio) {
    tasks.push({ id: 6, task: 'Write Professional Bio', icon: '💼', priority: 'medium' });
  }
  if (!profileData?.skills) {
    tasks.push({ id: 7, task: 'Add Skills', icon: '⭐', priority: 'medium' });
  }

  return tasks;
};
