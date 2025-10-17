import React from 'react';
import './FileUpload.css';

const FileUpload = ({ onFileSelect, selectedFile, previewUrl, onSubmit, loading }) => {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="upload-section">
      <h2>Upload Medical Image</h2>
      <form onSubmit={onSubmit} className="upload-form">
        <div className="file-input-container">
          <input 
            type="file" 
            id="file" 
            accept="image/*" 
            onChange={handleFileSelect} 
            className="file-input"
            disabled={loading}
          />
          <label htmlFor="file" className="file-label">
            {selectedFile ? 'Change Image' : 'Choose Medical Image'}
          </label>
          {selectedFile && (
            <span className="file-name">{selectedFile.name}</span>
          )}
        </div>
        
        {previewUrl && (
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={!selectedFile || loading}
          className="submit-button"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Analyzing Image...
            </>
          ) : 'Classify Disease'}
        </button>
        
        <div className="supported-formats">
          <p>Supported formats: JPG, PNG, BMP, TIFF</p>
          <p>Max file size: 16MB</p>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;