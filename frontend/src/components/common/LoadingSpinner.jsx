import './LoadingSpinner.css';

function LoadingSpinner({ size = 'medium', fullScreen = false, message = '' }) {
  const content = (
    <div className={`loading-spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className={`spinner ${size}`}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  return content;
}

export default LoadingSpinner;
