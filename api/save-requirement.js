/**
 * Vercel serverless function - deployed automatically at
 * https://<your-project>.vercel.app/api/save-requirement
 *
 * IMPORTANT: this file must live inside a folder literally named "api" at
 * the root of your repo - that's how Vercel recognizes it as a function.
 * Everything else in this project sits loose at the repo root on purpose,
 * so this is the only folder you ever need to get right.
 *
 * This is a plain (non-Express) function, which is what lets multer read
 * the raw multipart upload directly - no extra config needed for that
 * (the "disable body parser" trick you may see in tutorials is only
 * relevant for Next.js API routes, which this isn't).
 */

const multer = require('multer');
const sharp = require('sharp');

// Pinned to sharp 0.34.5 in package.json - see the note there for why.
// This app only ever reads photos (JPEG/PNG/HEIC) and always re-encodes to
// JPEG, so blocking these three loaders closes a known libvips CVE without
// needing the sharp version that currently fails to load on Vercel.
sharp.block({ operation: ['VipsForeignLoadNsgif', 'VipsForeignLoadTiff', 'VipsForeignLoadVips'] });

// Photos are shrunk to at most this wide, and re-encoded as JPEG at this
// quality. Lower either number for smaller files, raise for sharper photos.
const MAX_WIDTH = 1000;
const JPEG_QUALITY = 65;

// Vercel's serverless functions cap the whole request at ~4.5MB, so each
// photo is capped well below that - frontend app.js also lightly resizes
// photos in the browser before they're ever uploaded, and sends one row
// (with at most one photo) per request, for the same reason.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
}

async function compressPhoto(buffer) {
  return sharp(buffer)
    .rotate() // respects the photo's EXIF orientation (common on phone photos)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
    return;
  }

  try {
    await runMiddleware(req, res, upload.any());

    if (!req.body.rows) {
      res.status(400).json({ status: 'error', message: 'Missing "rows" field.' });
      return;
    }

    const rows = JSON.parse(req.body.rows);
    const files = req.files || [];

    for (const file of files) {
      const match = file.fieldname.match(/^photo_(\d+)$/);
      if (!match) continue;
      const idx = Number(match[1]);
      if (!rows[idx]) continue;

      const compressed = await compressPhoto(file.buffer);
      rows[idx].photo = `data:image/jpeg;base64,${compressed.toString('base64')}`;
    }

    const sheetUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
    if (!sheetUrl || sheetUrl.indexOf('PASTE_YOUR') !== -1) {
      res.status(500).json({
        status: 'error',
        message: 'GOOGLE_SHEET_WEBAPP_URL is not set as an environment variable on this Vercel project.'
      });
      return;
    }

    const sheetRes = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ rows })
    });

    const text = await sheetRes.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (parseErr) {
      console.error('[api/save-requirement] Apps Script did not return JSON:', text.slice(0, 500));
      res.status(502).json({
        status: 'error',
        message: 'Google Sheet did not return a valid response. Check that the Apps Script is deployed with access set to "Anyone", and check its Executions log for errors.'
      });
      return;
    }

    res.status(result.status === 'success' ? 200 : 500).json(result);

  } catch (err) {
    console.error('[api/save-requirement]', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};
