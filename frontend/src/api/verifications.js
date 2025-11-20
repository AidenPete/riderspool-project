import api from './axios';

// Verifications API endpoints
export const verificationsAPI = {
  // Get all verifications
  getVerifications: async (params = {}) => {
    const response = await api.get('verifications/', { params });
    return response.data;
  },

  // Get single verification
  getVerification: async (id) => {
    const response = await api.get(`verifications/${id}/`);
    return response.data;
  },

  // Create verification request
  createVerification: async () => {
    const response = await api.post('verifications/', {});
    return response.data;
  },

  // Get my verification status
  getMyVerification: async () => {
    const response = await api.get('verifications/my-verification/');
    return response.data;
  },

  // Approve verification (admin)
  approveVerification: async (id, adminNotes = '') => {
    const response = await api.post(`verifications/${id}/approve/`, {
      adminNotes,
    });
    return response.data;
  },

  // Reject verification (admin)
  rejectVerification: async (id, rejectionData) => {
    const response = await api.post(`verifications/${id}/reject/`, rejectionData);
    return response.data;
  },

  // Upload document
  uploadDocument: async (id, documentData) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('documentType', documentData.documentType);
    formData.append('document', documentData.document);
    formData.append('fileName', documentData.fileName);
    formData.append('fileSize', documentData.fileSize);

    const response = await api.post(`verifications/${id}/upload_document/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Verification Documents API
export const verificationDocumentsAPI = {
  // Get all documents
  getDocuments: async (params = {}) => {
    const response = await api.get('documents/', { params });
    return response.data;
  },

  // Get single document
  getDocument: async (id) => {
    const response = await api.get(`documents/${id}/`);
    return response.data;
  },
};

export default verificationsAPI;
