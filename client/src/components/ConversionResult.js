import React from 'react';
import { Download, CheckCircle, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';
import './ConversionResult.css';

const formatSize = (bytes) => {
  if (!bytes) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getSavings = (orig, conv) => {
  if (!orig || !conv) return null;
  const diff = orig - conv;
  const pct = Math.round((diff / orig) * 100);
  return { diff, pct, saved: diff > 0 };
};

const ConversionResult = ({ result, onConvertAnother }) => {
  if (!result) return null;

  const { success, error, originalName, originalFormat, convertedFormat,
          originalSize, convertedSize, downloadUrl } = result;
  const savings = getSavings(originalSize, convertedSize);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = downloadUrl.startsWith('http') ? downloadUrl : `http://localhost:5000${downloadUrl}`;
    a.download = `${originalName.split('.')[0]}.${convertedFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!success) {
    return (
      <div className="result-card result-error animate-fade-in">
        <div className="result-icon error-icon"><AlertCircle size={28} /></div>
        <div className="result-content">
          <h3>Conversion Failed</h3>
          <p className="error-message">{error || 'An unexpected error occurred'}</p>
        </div>
        <button className="btn btn-ghost" onClick={onConvertAnother}>
          <RotateCcw size={15} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="result-card result-success animate-fade-in">
      <div className="result-header">
        <div className="result-icon success-icon">
          <CheckCircle size={28} />
        </div>
        <div>
          <h3>Conversion Complete</h3>
          <div className="result-formats">
            <span className="fmt-chip from">{originalFormat.toUpperCase()}</span>
            <ArrowRight size={14} className="arrow-icon" />
            <span className="fmt-chip to">{convertedFormat.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="result-stats">
        <div className="stat-item">
          <span className="stat-label">Original</span>
          <span className="stat-value">{formatSize(originalSize)}</span>
        </div>
        {convertedSize && (
          <div className="stat-item">
            <span className="stat-label">Converted</span>
            <span className="stat-value">{formatSize(convertedSize)}</span>
          </div>
        )}
        {savings && (
          <div className="stat-item">
            <span className="stat-label">Size change</span>
            <span className={`stat-value ${savings.saved ? 'saved' : 'increased'}`}>
              {savings.saved ? '▼' : '▲'} {Math.abs(savings.pct)}%
            </span>
          </div>
        )}
      </div>

      <div className="result-filename">
        <span>{originalName.split('.')[0]}.{convertedFormat}</span>
      </div>

      <div className="result-actions">
        <button className="btn btn-primary" onClick={handleDownload}>
          <Download size={16} /> Download File
        </button>
        <button className="btn btn-ghost" onClick={onConvertAnother}>
          <RotateCcw size={15} /> Convert Another
        </button>
      </div>
    </div>
  );
};

export default ConversionResult;
