import React, { useState } from 'react';
import './DiseaseCard.css';

const DiseaseCard = ({ disease, confidence, description, symptoms, treatment, prevalence, index }) => {
  const [expanded, setExpanded] = useState(index === 0); // Expand first card by default

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Get confidence color based on percentage
  const getConfidenceColor = (conf) => {
    if (conf >= 70) return '#27ae60';
    if (conf >= 40) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className={`disease-card ${expanded ? 'expanded' : ''}`}>
      <div className="card-header" onClick={toggleExpand}>
        <h3>{disease}</h3>
        <div className="confidence-badge" style={{ backgroundColor: getConfidenceColor(confidence) }}>
          {confidence}% confidence
        </div>
        <span className="expand-icon">{expanded ? '−' : '+'}</span>
      </div>
      
      {expanded && (
        <div className="card-content">
          <div className="prevalence">Prevalence: {prevalence}</div>
          
          <div className="info-section">
            <h4>Description</h4>
            <p>{description}</p>
          </div>
          
          <div className="info-section">
            <h4>Symptoms</h4>
            <p>{symptoms}</p>
          </div>
          
          <div className="info-section">
            <h4>Treatment</h4>
            <p>{treatment}</p>
          </div>
          
          <div className="disclaimer">
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only. 
            Always consult healthcare professionals for medical advice and diagnosis.
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseCard;