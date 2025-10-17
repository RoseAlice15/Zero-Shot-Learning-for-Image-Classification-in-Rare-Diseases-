import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import DiseaseCard from './components/DiseaseCard';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResults(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/classify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during classification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      
      <main className="App-main">
        <div className="container">
          <FileUpload 
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onSubmit={handleSubmit}
            loading={loading}
          />
          
          {error && (
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}

          {results && (
            <div className="results-section">
              <h2>Classification Results</h2>
              <p className="results-info">Based on the uploaded image, here are the possible conditions:</p>
              
              <div className="results-container">
                {results.predictions.map((prediction, index) => (
                  <DiseaseCard
                    key={index}
                    index={index}
                    disease={prediction.disease}
                    confidence={prediction.confidence}
                    description={prediction.description}
                    symptoms={prediction.symptoms}
                    treatment={prediction.treatment}
                    prevalence={prediction.prevalence}
                  />
                ))}
              </div>
              
              <div className="results-footer">
                <p>
                  <strong>Note:</strong> This tool uses AI for preliminary analysis and should not replace 
                  professional medical diagnosis. Always consult healthcare providers for accurate diagnosis and treatment.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="App-footer">
        <div className="container">
          <p>Rare Disease Classification System &copy; {new Date().getFullYear()}</p>
          <p>For educational and research purposes only</p>
        </div>
      </footer>
    </div>
  );
}

export default App;