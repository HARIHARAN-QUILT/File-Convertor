import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import History from './pages/History';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a24',
            color: '#f0f0ff',
            border: '1px solid rgba(255,255,0.1)',
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: '14px',
          }
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;