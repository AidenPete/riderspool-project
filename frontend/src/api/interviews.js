import api from './axios';

// Interviews API endpoints
export const interviewsAPI = {
  // Get all interviews
  getInterviews: async (params = {}) => {
    const response = await api.get('interviews/', { params });
    return response.data;
  },

  // Get single interview
  getInterview: async (id) => {
    const response = await api.get(`interviews/${id}/`);
    return response.data;
  },

  // Create interview request
  createInterview: async (interviewData) => {
    const response = await api.post('interviews/', interviewData);
    return response.data;
  },

  // Update interview
  updateInterview: async (id, interviewData) => {
    const response = await api.put(`interviews/${id}/`, interviewData);
    return response.data;
  },

  // Confirm interview (provider)
  confirmInterview: async (id) => {
    const response = await api.post(`interviews/${id}/confirm/`);
    return response.data;
  },

  // Cancel interview
  cancelInterview: async (id, cancellationReason) => {
    const response = await api.post(`interviews/${id}/cancel/`, {
      cancellationReason,
    });
    return response.data;
  },

  // Reschedule interview
  rescheduleInterview: async (id, rescheduleData) => {
    const response = await api.post(`interviews/${id}/reschedule/`, rescheduleData);
    return response.data;
  },

  // Complete interview (employer)
  completeInterview: async (id) => {
    const response = await api.post(`interviews/${id}/complete/`);
    return response.data;
  },

  // Submit feedback (employer)
  submitFeedback: async (id, feedbackData) => {
    const response = await api.post(`interviews/${id}/feedback/`, feedbackData);
    return response.data;
  },

  // Mark provider as hired (employer)
  markAsHired: async (id) => {
    const response = await api.post(`interviews/${id}/mark_hired/`);
    return response.data;
  },

  // Delete interview
  deleteInterview: async (id) => {
    const response = await api.delete(`interviews/${id}/`);
    return response.data;
  },
};

// Office Locations API
export const officeLocationsAPI = {
  // Get all office locations
  getOfficeLocations: async (params = {}) => {
    const response = await api.get('office-locations/', { params });
    return response.data;
  },

  // Get single office location
  getOfficeLocation: async (id) => {
    const response = await api.get(`office-locations/${id}/`);
    return response.data;
  },
};

// Interview Feedback API
export const feedbackAPI = {
  // Get all feedback
  getFeedback: async (params = {}) => {
    const response = await api.get('feedback/', { params });
    return response.data;
  },

  // Get single feedback
  getSingleFeedback: async (id) => {
    const response = await api.get(`feedback/${id}/`);
    return response.data;
  },
};

export default interviewsAPI;
