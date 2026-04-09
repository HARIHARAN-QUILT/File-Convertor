const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { PDFDocument, rgb } = require('pdf-lib');
const mammoth = require('mammoth');
const XLSX = require('xlsx');

let Conversion;
try {
  Conversion = require('../models/Conversion');
} catch (e) {
  Conversion = null;
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/tiff',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/plain', 'text/csv',
      'application/json'
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('File type not supported'));
  }
});

// Helper: get file extension
const getExt = (filename) => path.extname(filename).toLowerCase().replace('.', '');

// Helper: save conversion record
const saveRecord = async (data) => {
  if (!Conversion) return null;
  try {
    const record = new Conversion(data);
    return await record.save();
  } catch (e) {
    console.log('DB save failed:', e.message);
    return null;
  }
};

// Helper: update conversion record
const updateRecord = async (conversionId, data) => {
  if (!Conversion) return null;
  try {
    return await Conversion.findOneAndUpdate({ conversionId }, data, { new: true });
  } catch (e) {
    return null;
  }
};

// Convert image formats
const convertImage = async (inputPath, outputPath, toFormat) => {
  const sharpFormats = { jpg: 'jpeg', jpeg: 'jpeg', png: 'png', webp: 'webp', avif: 'avif', tiff: 'tiff', gif: 'gif' };
  const fmt = sharpFormats[toFormat] || toFormat;
  await sharp(inputPath).toFormat(fmt).toFile(outputPath);
};

// Convert image to PDF
const imageToPDF = async (inputPath, outputPath) => {
  const pdfDoc = await PDFDocument.create();
  const imgBytes = fs.readFileSync(inputPath);
  const ext = getExt(inputPath);
  let img;
  if (ext === 'png') img = await pdfDoc.embedPng(imgBytes);
  else img = await pdfDoc.embedJpg(imgBytes);
  const page = pdfDoc.addPage([img.width, img.height]);
  page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
};

// Convert DOCX to text
const docxToText = async (inputPath, outputPath) => {
  const result = await mammoth.extractRawText({ path: inputPath });
  fs.writeFileSync(outputPath, result.value);
};

// Convert DOCX to HTML
const docxToHtml = async (inputPath, outputPath) => {
  const result = await mammoth.convertToHtml({ path: inputPath });
  const html = `<!DOCTYPE html><html><body>${result.value}</body></html>`;
  fs.writeFileSync(outputPath, html);
};

// Convert CSV to JSON
const csvToJson = (inputPath, outputPath) => {
  const wb = XLSX.readFile(inputPath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(ws);
  fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
};

// Convert JSON to CSV
const jsonToCsv = (inputPath, outputPath) => {
  const json = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(Array.isArray(json) ? json : [json]);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, outputPath);
};

// Convert XLSX to CSV
const xlsxToCsv = (inputPath, outputPath) => {
  const wb = XLSX.readFile(inputPath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const csv = XLSX.utils.sheet_to_csv(ws);
  fs.writeFileSync(outputPath, csv);
};

// Convert CSV to XLSX
const csvToXlsx = (inputPath, outputPath) => {
  const wb = XLSX.readFile(inputPath);
  XLSX.writeFile(wb, outputPath);
};

// Text to PDF
const textToPdf = async (inputPath, outputPath) => {
  const text = fs.readFileSync(inputPath, 'utf8');
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const lines = text.split('\n');
  let y = 800;
  for (const line of lines) {
    if (y < 50) break;
    page.drawText(line.substring(0, 100), { x: 50, y, size: 12, color: rgb(0, 0, 0) });
    y -= 20;
  }
  fs.writeFileSync(outputPath, await pdfDoc.save());
};

// Main conversion handler
const performConversion = async (inputPath, outputPath, fromFormat, toFormat) => {
  const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'gif'];

  if (imageFormats.includes(fromFormat) && imageFormats.includes(toFormat)) {
    await convertImage(inputPath, outputPath, toFormat);
  } else if (imageFormats.includes(fromFormat) && toFormat === 'pdf') {
    // Convert to JPEG first if needed
    let srcPath = inputPath;
    if (!['jpg', 'jpeg', 'png'].includes(fromFormat)) {
      srcPath = inputPath + '_temp.jpg';
      await sharp(inputPath).jpeg().toFile(srcPath);
    }
    await imageToPDF(srcPath, outputPath);
    if (srcPath !== inputPath && fs.existsSync(srcPath)) fs.unlinkSync(srcPath);
  } else if (fromFormat === 'docx' && toFormat === 'txt') {
    await docxToText(inputPath, outputPath);
  } else if (fromFormat === 'docx' && toFormat === 'html') {
    await docxToHtml(inputPath, outputPath);
  } else if (fromFormat === 'csv' && toFormat === 'json') {
    csvToJson(inputPath, outputPath);
  } else if (fromFormat === 'json' && toFormat === 'csv') {
    jsonToCsv(inputPath, outputPath);
  } else if (fromFormat === 'xlsx' && toFormat === 'csv') {
    xlsxToCsv(inputPath, outputPath);
  } else if (fromFormat === 'csv' && toFormat === 'xlsx') {
    csvToXlsx(inputPath, outputPath);
  } else if (fromFormat === 'txt' && toFormat === 'pdf') {
    await textToPdf(inputPath, outputPath);
  } else if (fromFormat === 'txt' && toFormat === 'json') {
    const text = fs.readFileSync(inputPath, 'utf8');
    fs.writeFileSync(outputPath, JSON.stringify({ content: text }));
  } else {
    throw new Error(`Conversion from ${fromFormat} to ${toFormat} is not supported`);
  }
};

// POST /api/convert
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { targetFormat } = req.body;
  if (!targetFormat) return res.status(400).json({ error: 'Target format is required' });

  const conversionId = uuidv4();
  const fromFormat = getExt(req.file.originalname);
  const toFormat = targetFormat.toLowerCase();
  const outputFilename = `${conversionId}.${toFormat}`;
  const outputPath = path.join(__dirname, '../converted', outputFilename);
  const inputPath = req.file.path;

  // Save initial record
  await saveRecord({
    conversionId,
    originalName: req.file.originalname,
    originalFormat: fromFormat,
    convertedFormat: toFormat,
    originalSize: req.file.size,
    status: 'processing'
  });

  try {
    await performConversion(inputPath, outputPath, fromFormat, toFormat);
    const stats = fs.statSync(outputPath);
    const downloadUrl = `/converted/${outputFilename}`;

    await updateRecord(conversionId, {
      status: 'completed',
      convertedSize: stats.size,
      downloadUrl
    });

    // Cleanup upload
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

    res.json({
      success: true,
      conversionId,
      originalName: req.file.originalname,
      originalFormat: fromFormat,
      convertedFormat: toFormat,
      originalSize: req.file.size,
      convertedSize: stats.size,
      downloadUrl,
      filename: outputFilename
    });

    // Auto cleanup after 1 hour
    setTimeout(() => {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }, 3600000);

  } catch (error) {
    await updateRecord(conversionId, { status: 'failed', error: error.message });
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).json({ error: error.message || 'Conversion failed' });
  }
});

// GET /api/convert/supported
router.get('/supported', (req, res) => {
  const conversions = {
    image: {
      from: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'gif'],
      to: ['jpg', 'png', 'webp', 'avif', 'tiff', 'pdf']
    },
    document: {
      from: ['docx'],
      to: ['txt', 'html']
    },
    data: {
      from: ['csv', 'json', 'xlsx'],
      to: ['json', 'csv', 'xlsx']
    },
    text: {
      from: ['txt'],
      to: ['pdf', 'json']
    }
  };
  res.json(conversions);
});

module.exports = router;
