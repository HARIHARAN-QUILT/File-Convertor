const mongoose = require('mongoose');

const conversionSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  originalFormat: { type: String, required: true },
  convertedFormat: { type: String, required: true },
  originalSize: { type: Number, required: true },
  convertedSize: { type: Number },
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
  downloadUrl: { type: String },
  error: { type: String },
  conversionId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // auto-delete after 24h
});

module.exports = mongoose.model('Conversion', conversionSchema);
