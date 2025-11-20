import api from './axios';

export const notificationsAPI = {
  // Get all notifications for current user
  getNotifications: () => api.get('notifications/'),

  // Get a specific notification
  getNotification: (id) => api.get(`notifications/${id}/`),

  // Get unread notifications
  getUnreadNotifications: () => api.get('notifications/unread/'),

  // Mark notification as read
  markAsRead: (id) => api.post(`notifications/${id}/mark_as_read/`),

  // Mark all notifications as read
  markAllAsRead: () => api.post('notifications/mark_all_as_read/'),

  // Delete a notification (admin only)
  deleteNotification: (id) => api.delete(`notifications/${id}/`),
};

export const notificationTemplatesAPI = {
  // Get all templates (admin only)
  getTemplates: () => api.get('notification-templates/'),

  // Get a specific template (admin only)
  getTemplate: (id) => api.get(`notification-templates/${id}/`),

  // Create a template (admin only)
  createTemplate: (data) => api.post('notification-templates/', data),

  // Update a template (admin only)
  updateTemplate: (id, data) => api.put(`notification-templates/${id}/`, data),

  // Delete a template (admin only)
  deleteTemplate: (id) => api.delete(`notification-templates/${id}/`),

  // Send notification using template (admin only)
  sendNotification: (data) => api.post('notification-templates/send/', data),
};
