# FileForge — MERN File Converter

A full-stack file conversion web application built with the MERN stack (MongoDB, Express, React, Node.js).

---

## Features

- **Drag & Drop Upload** — Drop any file directly onto the converter
- **10+ Format Conversions** — Images, documents, spreadsheets, and data files
- **Conversion History** — Track past conversions (MongoDB with 24h TTL auto-delete)
- **Privacy-first** — Files deleted from server after 1 hour
- **Dark UI** — Polished interface with animated transitions

---

## Supported Conversions

| Input         | Output Options                          |
|---------------|-----------------------------------------|
| JPG/JPEG      | PNG, WebP, AVIF, TIFF, PDF             |
| PNG           | JPG, WebP, AVIF, TIFF, PDF             |
| WebP          | JPG, PNG, AVIF, TIFF, PDF              |
| AVIF          | JPG, PNG, WebP, TIFF, PDF              |
| GIF           | JPG, PNG, WebP, PDF                    |
| DOCX          | TXT, HTML                              |
| XLSX          | CSV                                    |
| CSV           | JSON, XLSX                             |
| JSON          | CSV                                    |
| TXT           | PDF, JSON                              |

---

## Tech Stack

| Layer       | Technology          |
|-------------|---------------------|
| Frontend    | React 18            |
| Routing     | React Router v6     |
| HTTP client | Axios               |
| File upload UI | react-dropzone   |
| Toasts      | react-hot-toast     |
| Backend     | Node.js + Express   |
| Database    | MongoDB + Mongoose  |
| File upload | Multer              |
| Images      | Sharp               |
| PDF         | pdf-lib             |
| DOCX parse  | Mammoth             |
| Spreadsheet | SheetJS (xlsx)      |

---

## Project Structure

```
file-converter/
├── package.json            # Root — run both servers with concurrently
├── server/
│   ├── index.js            # Express app entry point
│   ├── .env                # Environment variables
│   ├── models/
│   │   └── Conversion.js   # Mongoose schema
│   └── routes/
│       ├── conversion.js   # Conversion logic + API
│       └── history.js      # History CRUD
└── client/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.js / index.css
        ├── components/
        │   ├── Navbar.js / .css
        │   ├── FileDropper.js / .css
        │   ├── FormatSelector.js / .css
        │   └── ConversionResult.js / .css
        ├── pages/
        │   ├── Home.js / .css
        │   ├── History.js / .css
        │   └── About.js / .css
        └── utils/
            └── api.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
git clone <your-repo>
cd file-converter

# Install everything
npm install
npm run install:all
```

### 2. Configure environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fileconverter
```

For MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/fileconverter
```

### 3. Run in development

```bash
# Run both frontend + backend together
npm run dev
```

Or separately:

```bash
# Terminal 1 — Backend
npm run start:server

# Terminal 2 — Frontend
npm run start:client
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## API Endpoints

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| POST   | /api/convert          | Upload and convert a file    |
| GET    | /api/convert/supported| List supported conversions   |
| GET    | /api/history          | Get conversion history       |
| DELETE | /api/history/:id      | Delete a history record      |
| GET    | /api/health           | Health check                 |

### POST /api/convert

**Form data:**
- `file` — The file to convert (multipart)
- `targetFormat` — Target format string (e.g. `"png"`, `"pdf"`)

**Response:**
```json
{
  "success": true,
  "conversionId": "uuid-here",
  "originalName": "photo.jpg",
  "originalFormat": "jpg",
  "convertedFormat": "png",
  "originalSize": 204800,
  "convertedSize": 185000,
  "downloadUrl": "/converted/uuid-here.png"
}
```

---

## Deployment Notes

- Set `REACT_APP_API_URL` in client env to your server URL for production
- Use a process manager like PM2 for the Node server
- Consider using cloud storage (S3) for converted files in production
- MongoDB Atlas recommended for hosted database

---

## License

MIT
