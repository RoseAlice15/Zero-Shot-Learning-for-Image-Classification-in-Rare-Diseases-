import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="App-header">
      <h1>Rare Disease Classification System</h1>
      <p>Upload an image to classify rare diseases using advanced zero-shot learning</p>
      <div className="header-info">
        <span className="info-text">Powered by CLIP AI model</span>
        <span className="info-text">50+ rare diseases in database</span>
      </div>
    </header>
  );
};

export default Header;