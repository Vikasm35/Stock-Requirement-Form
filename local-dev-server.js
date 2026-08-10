/**
 * Retail Stock Requirement Form - OPTIONAL local dev backend
 * -------------------------------------------------------------
 * You only need this if you want to run the form entirely on your own PC
 * instead of hosting it on Vercel. If you deployed to Vercel, api/save-requirement.js
 * does this same job there instead - you don't need to run this file too.
 *
 * Run:
 *   npm install     (once, from the project root)
 *   npm start
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const sharp = require('sharp');

sharp.block({ operation: ['VipsForeignLoadNsgif', 'VipsForeignLoadTiff', 'VipsForeignLoadVips'] });

const MAX_WIDTH = 1000;
const JPEG_QUALITY = 65;

// Falls back to this constant if GOOGLE_SHEET_WEBAPP_URL isn't set as an
// environment variable. Prefer setting it as an env var so it isn't sitting
// in plain text here if this ever ends up in a shared/public repo.
const GOOGLE_SHEET_WEBAPP_URL =
  process.env.GOOGLE_SHEET_WEBAPP_URL ||
  "https://script.google.com/macros/s/AKfycbwL0650nQIcl12kRvlc_-cHkVcqGkr93ya1_T3oz0aslzSztjh9dhSf8X6vyCk2fxk1/exec";

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // no Vercel payload ceiling locally, so more headroom
});

async function compressPhoto(buffer) {
  return sharp(buffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Stock Requirement backend is running.' });
});

app.post('/api/save-requirement', upload.any(), async (req, res) => {
  try {
    if (!req.body.rows) {
      return res.status(400).json({ status: 'error', message: 'Missing "rows" field.' });
    }
    const rows = JSON.parse(req.body.rows);
    const files = req.files || [];
    console.log(`[save-requirement] ${rows.length} row(s), ${files.length} photo(s) received`);

    for (const file of files) {
      const match = file.fieldname.match(/^photo_(\d+)$/);
      if (!match) continue;
      const idx = Number(match[1]);
      if (!rows[idx]) continue;

      const before = file.buffer.length;
      const compressed = await compressPhoto(file.buffer);
      console.log(`[save-requirement] row ${idx} photo: ${(before / 1024).toFixed(0)}KB -> ${(compressed.length / 1024).toFixed(0)}KB`);
      rows[idx].photo = `data:image/jpeg;base64,${compressed.toString('base64')}`;
    }

    const sheetRes = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ rows })
    });
    const text = await sheetRes.text();
    const result = JSON.parse(text);

    console.log('[save-requirement] Apps Script response:', result);
    res.json(result);

  } catch (err) {
    console.error('[save-requirement] error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Stock Requirement backend running on http://localhost:${PORT}`);
  console.log('Keep this window open while using the form.');
});
