import React from 'react';

function About() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>About Multilingual Mandi</h1>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
        The Multilingual Mandi is a revolutionary platform designed for the 
        <strong> 26 Jan Prompt Challenge</strong> to build a Viksit Bharat using Generative AI.
      </p>
      
      <h2>🎯 Our Mission</h2>
      <p>
        To empower India's local markets with AI, making trade more inclusive, 
        transparent, and efficient by breaking language barriers and providing 
        intelligent price discovery tools.
      </p>

      <h2>🛠️ Technology Stack</h2>
      <ul>
        <li><strong>Frontend:</strong> React.js for modern, responsive UI</li>
        <li><strong>Backend:</strong> Python FastAPI for AI integration</li>
        <li><strong>AI Services:</strong> Translation, Price Discovery, Negotiation Assistant</li>
        <li><strong>Real-time:</strong> WebSockets for live communication</li>
      </ul>

      <h2>🌟 Key Features</h2>
      <ul>
        <li>Multilingual support (Hindi, English, Regional languages)</li>
        <li>AI-powered price recommendations</li>
        <li>Real-time negotiation assistance</li>
        <li>Vendor empowerment tools</li>
        <li>Market analytics and insights</li>
      </ul>
    </div>
  );
}

export default About;