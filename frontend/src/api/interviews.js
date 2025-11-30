import api from './axios';

// Interviews API endpoints
export const interviewsAPI = {
  // Get all interviews
  getInterviews: async (params = {}) => {
    const response = await api.get('interviews/', { params });
    return response;
  },

  // Get single interview
  getInterview: async (id) => {
    const response = await api.get(`interviews/${id}/`);
    return response;
  },

  // Create interview request
  createInterview: async (interviewData) => {
    const response = await api.post('interviews/', interviewData);
    return response;
  },

  // Update interview
  updateInterview: async (id, interviewData) => {
    const response = await api.put(`interviews/${id}/`, interviewData);
    return response;
  },

  // Confirm interview (provider)
  confirmInterview: async (id) => {
    const response = await api.post(`interviews/${id}/confirm/`);
    return response;
  },

  // Cancel interview
  cancelInterview: async (id, cancellationReason) => {
    const response = await api.post(`interviews/${id}/cancel/`, {
      cancellationReason,
    });
    return response;
  },

  // Reschedule interview
  rescheduleInterview: async (id, rescheduleData) => {
    const response = await api.post(`interviews/${id}/reschedule/`, rescheduleData);
    return response;
  },

  // Complete interview (employer)
  completeInterview: async (id) => {
    const response = await api.post(`interviews/${id}/complete/`);
    return response;
  },

  // Submit feedback (employer)
  submitFeedback: async (id, feedbackData) => {
    const response = await api.post(`interviews/${id}/feedback/`, feedbackData);
    return response;
  },

  // Mark provider as hired (employer)
  markAsHired: async (id) => {
    const response = await api.post(`interviews/${id}/mark_hired/`);
    return response;
  },

  // Delete interview
  deleteInterview: async (id) => {
    const response = await api.delete(`interviews/${id}/`);
    return response;
  },
};

// Office Locations API
export const officeLocationsAPI = {
  // Get all office locations
  getOfficeLocations: async (params = {}) => {
    const response = await api.get('office-locations/', { params });
    return response;
  },

  // Get single office location
  getOfficeLocation: async (id) => {
    const response = await api.get(`office-locations/${id}/`);
    return response;
  },
};

// Interview Feedback API
export const feedbackAPI = {
  // Get all feedback
  getFeedback: async (params = {}) => {
    const response = await api.get('feedback/', { params });
    return response;
  },

  // Get single feedback
  getSingleFeedback: async (id) => {
    const response = await api.get(`feedback/${id}/`);
    return response;
  },
};

export default interviewsAPI;
