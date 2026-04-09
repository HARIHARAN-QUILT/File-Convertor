import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, ImageIcon, FileText, Database, Code } from 'lucide-react';
import './FileDropper.css';

const getFileIcon = (type) => {
  if (type.startsWith('image/')) return <ImageIcon size={20} />;
  if (type.includes('pdf') || type.includes('document') || type.includes('word')) return <FileText size={20} />;
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return <Database size={20} />;
  if (type.includes('json') || type.includes('text')) return <Code size={20} />;
  return <File size={20} />;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileCategory = (type, name) => {
  const ext = name.split('.').pop().toLowerCase();
  if (type.startsWith('image/')) return 'image';
  if (['pdf', 'docx', 'doc'].includes(ext)) return 'document';
  if (['xlsx', 'xls', 'csv'].includes(ext)) return 'data';
  if (['txt', 'json'].includes(ext)) return 'text';
  return 'other';
};

const getCategoryColor = (cat) => ({
  image: '#6affe0',
  document: '#7c6aff',
  data: '#ff6a9b',
  text: '#ffb86a',
  other: '#aaaacc'
})[cat] || '#aaaacc';

const FileDropper = ({ onFileSelected }) => {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setDragOver(false);
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
    multiple: false,
    maxSize: 50 * 1024 * 1024,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.tiff'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`dropper ${isDragActive ? 'drag-active' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="dropper-content">
        <div className={`dropper-icon ${isDragActive ? 'animate-float' : ''}`}>
          <Upload size={32} strokeWidth={1.5} />
        </div>
        <div className="dropper-text">
          <h3>{isDragActive ? 'Release to upload' : 'Drop your file here'}</h3>
          <p>or <span className="browse-text">browse to choose</span></p>
          <p className="dropper-hint">Images, PDFs, DOCX, XLSX, CSV, JSON, TXT — up to 50MB</p>
        </div>
        <div className="dropper-formats">
          {[
            { label: 'Images', color: '#6affe0' },
            { label: 'Documents', color: '#7c6aff' },
            { label: 'Spreadsheets', color: '#ff6a9b' },
            { label: 'Data', color: '#ffb86a' },
          ].map(f => (
            <span key={f.label} className="format-pill" style={{ '--pill-color': f.color }}>
              {f.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FilePreview = ({ file, onRemove }) => {
  const ext = file.name.split('.').pop().toLowerCase();
  const category = getFileCategory(file.type, file.name);
  const color = getCategoryColor(category);

  return (
    <div className="file-preview animate-fade-in">
      <div className="file-preview-icon" style={{ '--icon-color': color }}>
        {getFileIcon(file.type)}
      </div>
      <div className="file-preview-info">
        <p className="file-name">{file.name}</p>
        <div className="file-meta">
          <span className="format-badge" style={{ background: `${color}18`, color }}>
            {ext.toUpperCase()}
          </span>
          <span className="file-size">{formatFileSize(file.size)}</span>
        </div>
      </div>
      <button className="remove-btn" onClick={onRemove} title="Remove file">
        <X size={16} />
      </button>
    </div>
  );
};

export default FileDropper;
