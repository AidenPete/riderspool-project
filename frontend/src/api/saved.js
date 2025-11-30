import api from './axios';

// Saved Providers API endpoints
export const savedProvidersAPI = {
  // Get all saved providers for current employer
  getSavedProviders: async () => {
    const response = await api.get('saved-providers/');
    return response;
  },

  // Save a provider
  saveProvider: async (providerId) => {
    const response = await api.post('saved-providers/', {
      provider_id: providerId,
    });
    return response;
  },

  // Remove a saved provider
  removeSavedProvider: async (savedProviderId) => {
    const response = await api.delete(`saved-providers/${savedProviderId}/`);
    return response;
  },

  // Check if a provider is saved
  isProviderSaved: async (providerId) => {
    const providers = await savedProvidersAPI.getSavedProviders();
    return providers.some(sp => sp.provider?.id === providerId);
  },
};

export default savedProvidersAPI;
