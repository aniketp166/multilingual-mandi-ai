import React, { useState, useEffect } from 'react';

function Home() {
  const [apiStatus, setApiStatus] = useState('Checking...');

  useEffect(() => {
    // Test connection to backend
    fetch('http://localhost:8000/')
      .then(response => response.json())
      .then(data => {
        setApiStatus('✅ Connected to Backend');
        console.log('Backend response:', data);
      })
      .catch(error => {
        setApiStatus('❌ Backend not connected');
        console.error('Backend connection error:', error);
      });
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🇮🇳 Welcome to Multilingual Mandi</h1>
      <p style={{ fontSize: '18px', margin: '20px 0' }}>
        Empowering India's Local Markets with AI
      </p>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>Backend Connection Status:</h3>
        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{apiStatus}</p>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>🚀 Features Coming Soon:</h2>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>Real-time multilingual communication</li>
          <li>AI-driven price discovery</li>
          <li>Smart negotiation assistance</li>
          <li>Vendor dashboard and analytics</li>
          <li>Market insights and trends</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;