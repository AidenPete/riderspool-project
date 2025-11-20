import api from './axios';

export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: () => api.get('admin/dashboard/stats/'),

  // Get interview analytics
  getInterviewAnalytics: (days = 30) =>
    api.get('admin/analytics/interviews/', { params: { days } }),
};

export default adminAPI;
