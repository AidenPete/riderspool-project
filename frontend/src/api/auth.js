import api from './axios';

// Auth API endpoints
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return await api.post('auth/register/', userData);
  },

  // Login user
  login: async (credentials) => {
    return await api.post('auth/login/', credentials);
  },

  // Logout user
  logout: async (refreshToken) => {
    return await api.post('auth/logout/', {
      refresh_token: refreshToken,
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return await api.get('auth/me/');
  },

  // Update current user
  updateCurrentUser: async (userData) => {
    return await api.put('auth/me/', userData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return await api.post('auth/change-password/', passwordData);
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return await api.post('auth/refresh/', {
      refresh: refreshToken,
    });
  },

  // Get user settings
  getSettings: async () => {
    return await api.get('settings/');
  },

  // Update user settings
  updateSettings: async (settingsData) => {
    return await api.patch('settings/', settingsData);
  },
};

export default authAPI;
