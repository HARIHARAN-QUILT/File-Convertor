import React, { useState } from 'react';
import toast from 'react-hot-toast';
import FileDropper, { FilePreview } from '../components/FileDropper';
import FormatSelector from '../components/FormatSelector';
import ConversionResult from '../components/ConversionResult';
import { convertFile } from '../utils/api';
import { Zap, Shield, Clock, Layers } from 'lucide-react';
import './Home.css';

const STEPS = {
  UPLOAD: 'upload',
  SELECT: 'select',
  CONVERTING: 'converting',
  RESULT: 'result',
};

const features = [
  { icon: <Zap size={18} />, label: 'Instant', desc: 'Converts in seconds, no waiting' },
  { icon: <Shield size={18} />, label: 'Private', desc: 'Files deleted after 1 hour' },
  { icon: <Clock size={18} />, label: 'History', desc: 'Track your conversions' },
  { icon: <Layers size={18} />, label: '10+ Formats', desc: 'Images, docs, data files' },
];

const Home = () => {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileSelected = (f) => {
    setFile(f);
    setTargetFormat('');
    setStep(STEPS.SELECT);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setTargetFormat('');
    setStep(STEPS.UPLOAD);
  };

  const handleConvert = async () => {
    if (!file || !targetFormat) {
      toast.error('Please select a file and output format');
      return;
    }
    setIsConverting(true);
    setProgress(0);
    setStep(STEPS.CONVERTING);

    try {
      const data = await convertFile(file, targetFormat, (pct) => setProgress(pct));
      setResult(data);
      setStep(STEPS.RESULT);
      toast.success('Conversion complete!');
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Conversion failed';
      setResult({ success: false, error: errMsg });
      setStep(STEPS.RESULT);
      toast.error(errMsg);
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTargetFormat('');
    setResult(null);
    setProgress(0);
    setStep(STEPS.UPLOAD);
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <span className="badge-dot" />
            Free & Open Source
          </div>
          <h1 className="hero-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Convert any file,<br />
            <span className="gradient-text">instantly.</span>
          </h1>
          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Images, documents, spreadsheets, and data files — <br />
            transformed in seconds, right in your browser.
          </p>
        </div>
      </div>

      {/* Main converter card */}
      <div className="converter-section">
        <div className="converter-card card animate-fade-in" style={{ animationDelay: '0.3s' }}>

          {/* Step indicator */}
          <div className="step-indicator">
            {['Upload', 'Format', 'Convert'].map((s, i) => {
              const stepKeys = [STEPS.UPLOAD, STEPS.SELECT, STEPS.CONVERTING];
              const active = stepKeys.indexOf(step) >= i || step === STEPS.RESULT;
              const current = stepKeys.indexOf(step) === i;
              return (
                <React.Fragment key={s}>
                  <div className={`step-dot ${active ? 'active' : ''} ${current ? 'current' : ''}`}>
                    {active && stepKeys.indexOf(step) > i ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    ) : <span>{i + 1}</span>}
                  </div>
                  <span className={`step-label ${active ? 'active' : ''}`}>{s}</span>
                  {i < 2 && <div className={`step-line ${active && stepKeys.indexOf(step) > i ? 'active' : ''}`} />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step: Upload */}
          {step === STEPS.UPLOAD && (
            <div className="step-content">
              <FileDropper onFileSelected={handleFileSelected} />
            </div>
          )}

          {/* Step: Select format */}
          {step === STEPS.SELECT && (
            <div className="step-content">
              <FilePreview file={file} onRemove={handleRemoveFile} />
              <div className="divider" />
              <FormatSelector
                file={file}
                selectedFormat={targetFormat}
                onFormatSelect={setTargetFormat}
              />
              {targetFormat && (
                <div className="convert-action animate-fade-in">
                  <button
                    className="btn btn-primary convert-btn"
                    onClick={handleConvert}
                    disabled={isConverting}
                  >
                    <Zap size={16} />
                    Convert to {targetFormat.toUpperCase()}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step: Converting */}
          {step === STEPS.CONVERTING && (
            <div className="step-content converting-state">
              <div className="converting-animation">
                <div className="convert-ring" />
                <div className="convert-ring ring-2" />
                <div className="convert-icon">
                  <Zap size={28} />
                </div>
              </div>
              <h3>Converting your file…</h3>
              <p className="converting-sub">
                {file?.name} → {targetFormat?.toUpperCase()}
              </p>
              <div className="progress-wrap">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.max(progress, 15)}%` }}
                  />
                </div>
                <span className="progress-label">{progress || '…'}%</span>
              </div>
            </div>
          )}

          {/* Step: Result */}
          {step === STEPS.RESULT && (
            <div className="step-content">
              <ConversionResult result={result} onConvertAnother={handleReset} />
            </div>
          )}
        </div>

        {/* Features row */}
        <div className="features-row">
          {features.map((f, i) => (
            <div
              key={f.label}
              className="feature-chip animate-fade-in"
              style={{ animationDelay: `${0.4 + i * 0.07}s` }}
            >
              <span className="feature-icon">{f.icon}</span>
              <div>
                <span className="feature-label">{f.label}</span>
                <span className="feature-desc">{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
