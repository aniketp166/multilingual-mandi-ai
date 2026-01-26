import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple pages for basic routing
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ padding: '20px', backgroundColor: '#FF6B35', color: 'white' }}>
          <h2>मल्टीलिंगुअल मंडी - Multilingual Mandi</h2>
          <div>
            <a href="/" style={{ color: 'white', margin: '0 10px' }}>Home</a>
            <a href="/about" style={{ color: 'white', margin: '0 10px' }}>About</a>
            <a href="/contact" style={{ color: 'white', margin: '0 10px' }}>Contact</a>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;