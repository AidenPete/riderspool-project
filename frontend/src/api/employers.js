import api from './axios';

const employersAPI = {
  // Get my employer profile
  getMyProfile: async () => {
    const response = await api.get('employers/my-profile/');
    return response.data;
  },

  // Update my employer profile
  updateMyProfile: async (profileData) => {
    const config = {};
    // If profileData is FormData, set proper headers
    if (profileData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
    const response = await api.put('employers/my-profile/', profileData, config);
    return response.data;
  },

  // Get all employers (admin only)
  getAllEmployers: async () => {
    const response = await api.get('employers/');
    return response.data;
  },

  // Get employer by ID
  getEmployerById: async (id) => {
    const response = await api.get(`employers/${id}/`);
    return response.data;
  },
};

export default employersAPI;
