import React, { useState, useEffect } from 'react';
import { getHistory, deleteHistory, getDownloadUrl } from '../utils/api';
import { Clock, Download, Trash2, RefreshCw, CheckCircle, XCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import './History.css';

const formatSize = (bytes) => {
  if (!bytes) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

const STATUS_ICONS = {
  completed: <CheckCircle size={14} />,
  failed: <XCircle size={14} />,
  processing: <Loader size={14} className="animate-spin" />,
};

const STATUS_COLORS = {
  completed: 'var(--accent-3)',
  failed: 'var(--accent-2)',
  processing: 'var(--accent)',
};

const History = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setRecords(data);
    } catch (err) {
      toast.error('Could not load history — is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteHistory(id);
      setRecords(prev => prev.filter(r => r.conversionId !== id));
      toast.success('Record deleted');
    } catch {
      toast.error('Failed to delete record');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = (record) => {
    if (!record.downloadUrl) return;
    const a = document.createElement('a');
    a.href = getDownloadUrl(record.downloadUrl);
    a.download = `${record.originalName.split('.')[0]}.${record.convertedFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="history-page">
      <div className="history-inner">
        <div className="history-header">
          <div>
            <h1>Conversion History</h1>
            <p>Your recent file conversions (auto-deleted after 24 hours)</p>
          </div>
          <button className="btn btn-ghost" onClick={fetchHistory} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="history-loading">
            <div className="loading-spinner" />
            <p>Loading history…</p>
          </div>
        ) : records.length === 0 ? (
          <div className="history-empty">
            <div className="empty-icon"><Clock size={36} /></div>
            <h3>No conversions yet</h3>
            <p>Your conversion history will appear here after you convert a file.</p>
            <a href="/" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '8px' }}>
              Convert a file
            </a>
          </div>
        ) : (
          <div className="history-list">
            {records.map((record, i) => (
              <div
                key={record.conversionId}
                className="history-item animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="item-formats">
                  <span className="fmt-tag from">{record.originalFormat?.toUpperCase()}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="arrow-svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="fmt-tag to">{record.convertedFormat?.toUpperCase()}</span>
                </div>

                <div className="item-info">
                  <p className="item-name">{record.originalName}</p>
                  <div className="item-meta">
                    <span
                      className="item-status"
                      style={{ color: STATUS_COLORS[record.status] }}
                    >
                      {STATUS_ICONS[record.status]}
                      {record.status}
                    </span>
                    <span className="item-dot">·</span>
                    <span>{formatSize(record.originalSize)}</span>
                    {record.convertedSize && (
                      <>
                        <span className="item-dot">→</span>
                        <span>{formatSize(record.convertedSize)}</span>
                      </>
                    )}
                    <span className="item-dot">·</span>
                    <span className="item-time">{timeAgo(record.createdAt)}</span>
                  </div>
                </div>

                <div className="item-actions">
                  {record.status === 'completed' && record.downloadUrl && (
                    <button
                      className="icon-btn download"
                      onClick={() => handleDownload(record)}
                      title="Download"
                    >
                      <Download size={15} />
                    </button>
                  )}
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(record.conversionId)}
                    disabled={deleting === record.conversionId}
                    title="Delete"
                  >
                    {deleting === record.conversionId
                      ? <Loader size={15} className="animate-spin" />
                      : <Trash2 size={15} />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
