import React from 'react';
import './FormatSelector.css';

const CONVERSION_MAP = {
  // Images
  jpg: ['png', 'webp', 'avif', 'tiff', 'pdf'],
  jpeg: ['png', 'webp', 'avif', 'tiff', 'pdf'],
  png: ['jpg', 'webp', 'avif', 'tiff', 'pdf'],
  webp: ['jpg', 'png', 'avif', 'tiff', 'pdf'],
  avif: ['jpg', 'png', 'webp', 'tiff', 'pdf'],
  tiff: ['jpg', 'png', 'webp', 'avif', 'pdf'],
  gif: ['jpg', 'png', 'webp', 'pdf'],
  // Documents
  docx: ['txt', 'html'],
  doc: ['txt', 'html'],
  // Spreadsheets
  xlsx: ['csv'],
  xls: ['csv'],
  csv: ['json', 'xlsx'],
  // Text/Data
  json: ['csv'],
  txt: ['pdf', 'json'],
};

const FORMAT_LABELS = {
  jpg: 'JPEG', jpeg: 'JPEG', png: 'PNG', webp: 'WebP', avif: 'AVIF',
  tiff: 'TIFF', gif: 'GIF', pdf: 'PDF', docx: 'Word', txt: 'Text',
  html: 'HTML', csv: 'CSV', xlsx: 'Excel', json: 'JSON',
};

const FORMAT_COLORS = {
  jpg: '#ffb86a', jpeg: '#ffb86a', png: '#6affe0', webp: '#7c6aff',
  avif: '#ff6a9b', tiff: '#6ad6ff', gif: '#c6ff6a', pdf: '#ff6a6a',
  docx: '#6a9eff', txt: '#c0c0e0', html: '#ff9d6a', csv: '#6affb8',
  xlsx: '#6aff9d', json: '#ffdb6a',
};

const FormatSelector = ({ file, selectedFormat, onFormatSelect }) => {
  if (!file) return null;

  const ext = file.name.split('.').pop().toLowerCase();
  const availableFormats = CONVERSION_MAP[ext] || [];

  if (availableFormats.length === 0) {
    return (
      <div className="format-selector-empty">
        <p>No conversions available for .{ext} files</p>
      </div>
    );
  }

  return (
    <div className="format-selector">
      <div className="format-selector-header">
        <span className="format-from">
          <span className="format-badge" style={{
            background: `${FORMAT_COLORS[ext] || '#aaaacc'}18`,
            color: FORMAT_COLORS[ext] || '#aaaacc'
          }}>
            {FORMAT_LABELS[ext] || ext.toUpperCase()}
          </span>
        </span>
        <div className="arrow-line">
          <div className="arrow-track">
            <div className="arrow-dot" />
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="format-to-label">Choose output</span>
      </div>

      <div className="format-grid">
        {availableFormats.map(fmt => {
          const color = FORMAT_COLORS[fmt] || '#aaaacc';
          const isSelected = selectedFormat === fmt;
          return (
            <button
              key={fmt}
              className={`format-option ${isSelected ? 'selected' : ''}`}
              style={{
                '--fmt-color': color,
              }}
              onClick={() => onFormatSelect(fmt)}
            >
              <span className="fmt-ext">{fmt.toUpperCase()}</span>
              <span className="fmt-label">{FORMAT_LABELS[fmt] || fmt}</span>
              {isSelected && (
                <span className="fmt-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FormatSelector;
