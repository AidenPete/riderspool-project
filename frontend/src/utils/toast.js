// Utility functions for showing toast notifications

export const toast = {
  success: (message) => {
    if (window.showToast) {
      window.showToast(message, 'success');
    }
  },

  error: (message) => {
    if (window.showToast) {
      window.showToast(message, 'error');
    }
  },

  warning: (message) => {
    if (window.showToast) {
      window.showToast(message, 'warning');
    }
  },

  info: (message) => {
    if (window.showToast) {
      window.showToast(message, 'info');
    }
  }
};
