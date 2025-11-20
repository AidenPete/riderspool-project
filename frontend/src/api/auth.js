import api from './axios';

// Auth API endpoints
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('auth/register/', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('auth/login/', credentials);
    return response.data;
  },

  // Logout user
  logout: async (refreshToken) => {
    const response = await api.post('auth/logout/', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('auth/me/');
    return response.data;
  },

  // Update current user
  updateCurrentUser: async (userData) => {
    const response = await api.put('auth/me/', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('auth/change-password/', passwordData);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post('auth/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};

export default authAPI;
