import React from 'react';

function Contact() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Contact Us</h1>
      <p style={{ fontSize: '18px' }}>
        Built for the <strong>26 Jan Prompt Challenge - Viksit Bharat</strong>
      </p>
      
      <div style={{ marginTop: '30px' }}>
        <h2>🚀 Challenge Details</h2>
        <p><strong>Theme:</strong> Creating a real-time linguistic bridge for local trade</p>
        <p><strong>Goal:</strong> Empower India's local markets with AI</p>
        <p><strong>Focus:</strong> Inclusive, transparent, and efficient trade</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>📧 Get In Touch</h2>
        <p>This is a challenge submission project.</p>
        <p>For questions or collaboration opportunities, please reach out!</p>
      </div>

      <div style={{ 
        backgroundColor: '#FF6B35', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '30px'
      }}>
        <h3>🇮🇳 Jai Hind! Building for a Viksit Bharat</h3>
        <p>Together, we're making technology accessible to every Indian trader.</p>
      </div>
    </div>
  );
}

export default Contact;