import api from './axios';

// Jobs API
const jobsAPI = {
  // Get all jobs (filtered by user type on backend)
  getJobs: (params = {}) => api.get('jobs/', { params }),

  // Get single job by ID
  getJob: (id) => api.get(`jobs/${id}/`),

  // Create new job posting (employers only)
  createJob: (data) => api.post('jobs/', data),

  // Update job posting
  updateJob: (id, data) => api.patch(`jobs/${id}/`, data),

  // Delete job posting
  deleteJob: (id) => api.delete(`jobs/${id}/`),

  // Close job posting
  closeJob: (id) => api.post(`jobs/${id}/close/`),

  // Mark job as filled
  markJobFilled: (id) => api.post(`jobs/${id}/mark_filled/`),

  // Get applications for a job (employer only)
  getJobApplications: (id) => api.get(`jobs/${id}/applications/`),

  // Search jobs with filters
  searchJobs: (filters) => api.get('jobs/', { params: filters }),
};

// Job Applications API
const jobApplicationsAPI = {
  // Get all applications (filtered by user type on backend)
  getApplications: (params = {}) => api.get('applications/', { params }),

  // Get single application by ID
  getApplication: (id) => api.get(`applications/${id}/`),

  // Create new job application (providers only)
  applyForJob: (data) => api.post('applications/', data),

  // Update application status (employers only)
  updateApplicationStatus: (id, data) => api.post(`applications/${id}/update_status/`, data),

  // Withdraw application (providers only)
  withdrawApplication: (id) => api.post(`applications/${id}/withdraw/`),

  // Get provider's applications
  getMyApplications: () => api.get('applications/my-applications/'),
};

// Alias for easier import
const applicationsAPI = {
  createApplication: (data) => api.post('applications/', data),
  getMyApplications: () => api.get('applications/my-applications/'),
  getApplication: (id) => api.get(`applications/${id}/`),
  withdrawApplication: (id) => api.post(`applications/${id}/withdraw/`),
};

export { jobApplicationsAPI, applicationsAPI };
export default jobsAPI;
