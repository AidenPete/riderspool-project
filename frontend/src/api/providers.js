import api from './axios';

// Providers API endpoints
export const providersAPI = {
  // Get all providers (with filters)
  getProviders: async (params = {}) => {
    const response = await api.get('providers/', { params });
    return response.data;
  },

  // Get single provider
  getProvider: async (id) => {
    const response = await api.get(`providers/${id}/`);
    return response.data;
  },

  // Get my provider profile
  getMyProfile: async () => {
    const response = await api.get('providers/my-profile/');
    return response.data;
  },

  // Create/Update provider profile
  updateMyProfile: async (profileData) => {
    const config = {};
    // If profileData is FormData, set proper headers
    if (profileData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
    const response = await api.put('providers/my-profile/', profileData, config);
    return response.data;
  },

  // Partial update provider profile
  patchMyProfile: async (profileData) => {
    const config = {};
    // If profileData is FormData, set proper headers
    if (profileData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
    const response = await api.patch('providers/my-profile/', profileData, config);
    return response.data;
  },

  // Get saved providers (employer)
  getSavedProviders: async () => {
    const response = await api.get('saved-providers/');
    return response.data;
  },

  // Save provider
  saveProvider: async (providerId) => {
    const response = await api.post('saved-providers/', {
      provider_id: providerId,
    });
    return response.data;
  },

  // Unsave provider
  unsaveProvider: async (providerId) => {
    const response = await api.delete(`saved-providers/unsave/${providerId}/`);
    return response.data;
  },
};

// Users API endpoints (admin)
export const usersAPI = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('users/', { params });
    return response.data;
  },

  // Get single user
  getUser: async (id) => {
    const response = await api.get(`users/${id}/`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`users/${id}/`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`users/${id}/`);
    return response.data;
  },
};

export default providersAPI;
