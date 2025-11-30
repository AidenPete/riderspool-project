import { useState, useCallback } from 'react';
import Toast from './Toast';
import './ToastContainer.css';

let toastId = 0;

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // This will be called from outside the component
  window.showToast = useCallback((message, type = 'success') => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
