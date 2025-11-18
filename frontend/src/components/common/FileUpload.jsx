import { useState } from 'react';
import './FileUpload.css';

function FileUpload({ label, accept, onChange, value, error, helperText }) {
  const [preview, setPreview] = useState(value || null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      if (onChange) {
        onChange(file);
      }
    }
  };

  return (
    <div className="file-upload">
      {label && <label className="file-upload-label">{label}</label>}

      <div className={`file-upload-area ${error ? 'error' : ''}`}>
        {preview ? (
          <div className="file-preview">
            <img src={preview} alt="Preview" />
            <button
              type="button"
              className="remove-file"
              onClick={() => {
                setPreview(null);
                setFileName('');
                if (onChange) onChange(null);
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="file-upload-trigger">
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="file-input-hidden"
            />
            <div className="file-upload-content">
              <div className="upload-icon">📁</div>
              <div className="upload-text">
                {fileName || 'Click to upload or drag and drop'}
              </div>
              <div className="upload-hint">
                {helperText || 'Supported formats: JPG, PNG, PDF (Max 5MB)'}
              </div>
            </div>
          </label>
        )}
      </div>

      {error && <span className="file-upload-error">{error}</span>}
    </div>
  );
}

export default FileUpload;
