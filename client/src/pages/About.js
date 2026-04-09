import React from 'react';
import { Zap, Shield, Database, Code, Image, FileText, GitBranch } from 'lucide-react';
import './About.css';

const stack = [
  { layer: 'Frontend', tech: 'React 18', detail: 'Component-based UI with hooks', color: '#6affe0' },
  { layer: 'Routing', tech: 'React Router v6', detail: 'Client-side navigation', color: '#7c6aff' },
  { layer: 'Backend', tech: 'Node + Express', detail: 'REST API server', color: '#ff6a9b' },
  { layer: 'Database', tech: 'MongoDB + Mongoose', detail: 'Conversion history with TTL', color: '#ffb86a' },
  { layer: 'File Upload', tech: 'Multer', detail: 'Multipart form handling', color: '#6ad6ff' },
  { layer: 'Images', tech: 'Sharp', detail: 'High-performance image processing', color: '#c6ff6a' },
  { layer: 'PDF', tech: 'pdf-lib', detail: 'Create and edit PDF files', color: '#ff9d6a' },
  { layer: 'Documents', tech: 'Mammoth', detail: 'DOCX to HTML/text extraction', color: '#c0c0e0' },
  { layer: 'Spreadsheets', tech: 'SheetJS (xlsx)', detail: 'Excel, CSV, JSON conversion', color: '#ffdb6a' },
];

const conversions = [
  { category: 'Images', icon: <Image size={18} />, color: '#6affe0',
    items: ['JPG ↔ PNG', 'JPG ↔ WebP', 'Any → PDF', 'PNG → AVIF', 'WebP → TIFF', 'GIF → WebP'] },
  { category: 'Documents', icon: <FileText size={18} />, color: '#7c6aff',
    items: ['DOCX → TXT', 'DOCX → HTML'] },
  { category: 'Spreadsheets & Data', icon: <Database size={18} />, color: '#ff6a9b',
    items: ['XLSX → CSV', 'CSV → XLSX', 'CSV → JSON', 'JSON → CSV', 'TXT → JSON', 'TXT → PDF'] },
];

const About = () => (
  <div className="about-page">
    <div className="about-inner">

      {/* Hero */}
      <div className="about-hero">
        <div className="about-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M7 16V4M7 4L4 7M7 4L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 8V20M17 20L14 17M17 20L20 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1>FileForge</h1>
        <p className="about-tagline">A MERN stack file conversion tool — fast, private, and open source.</p>

        <div className="about-badges">
          <span className="about-badge"><Zap size={13} /> React 18</span>
          <span className="about-badge"><Code size={13} /> Express.js</span>
          <span className="about-badge"><Database size={13} /> MongoDB</span>
          <span className="about-badge"><Shield size={13} /> No tracking</span>
        </div>
      </div>

      {/* How it works */}
      <section className="about-section">
        <h2>How it works</h2>
        <div className="how-steps">
          {[
            { n: '01', title: 'Upload', desc: 'Drag and drop or browse for your file. Up to 50MB supported.' },
            { n: '02', title: 'Select format', desc: 'Choose your target format from the available options for that file type.' },
            { n: '03', title: 'Convert & download', desc: 'The server converts your file instantly. Download it right away.' },
          ].map(s => (
            <div key={s.n} className="how-step">
              <span className="step-num">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported conversions */}
      <section className="about-section">
        <h2>Supported conversions</h2>
        <div className="conversions-grid">
          {conversions.map(cat => (
            <div key={cat.category} className="conversion-card card">
              <div className="conv-header" style={{ '--cat-color': cat.color }}>
                <span className="conv-icon">{cat.icon}</span>
                <h3>{cat.category}</h3>
              </div>
              <ul className="conv-list">
                {cat.items.map(item => (
                  <li key={item}>
                    <span className="conv-item">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="about-section">
        <h2>Tech stack</h2>
        <div className="stack-table">
          <div className="stack-header">
            <span>Layer</span>
            <span>Technology</span>
            <span>Purpose</span>
          </div>
          {stack.map(row => (
            <div key={row.layer} className="stack-row">
              <span className="stack-layer" style={{ color: row.color }}>{row.layer}</span>
              <span className="stack-tech">{row.tech}</span>
              <span className="stack-detail">{row.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="about-section">
        <div className="privacy-card">
          <Shield size={24} />
          <div>
            <h3>Privacy first</h3>
            <p>
              Uploaded files are processed server-side and automatically deleted within 1 hour.
              Converted files expire after 24 hours. No data is shared with third parties.
              Conversion history is stored locally in your MongoDB instance.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <GitBranch size={14} />
        <span>Built with the MERN stack — MongoDB, Express, React, Node.js</span>
      </footer>

    </div>
  </div>
);

export default About;
