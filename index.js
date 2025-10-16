const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 🔐 CONFIGURATION - Environment variables
// ============================================
const BOT_TOKEN = process.env.BOT_TOKEN || '8457626060:AAE7zNIqwscoJ_gyV50DbsmrwzgA6GqGTk8'; // From @BotFather
const CHAT_ID = process.env.CHAT_ID || '-1003009155498'; // Your channel ID

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ============================================
// Multer setup for file uploads
// ============================================
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// ============================================
// Middleware
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Sonic Music Upload Server',
    version: '1.0.0',
    endpoints: {
      upload: 'POST /upload',
      health: 'GET /health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// ============================================
// 🎵 UPLOAD ENDPOINT
// ============================================
app.post('/upload', upload.single('audio'), async (req, res) => {
  console.log('[UPLOAD] Request received');
  
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  const { title = 'Unknown', artist = 'Unknown Artist' } = req.body;
  const filePath = req.file.path;

  try {
    console.log(`[UPLOAD] Processing: ${title} by ${artist}`);
    console.log(`[UPLOAD] File size: ${req.file.size} bytes`);

    // Upload to Telegram channel
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('audio', fs.createReadStream(filePath), {
      filename: req.file.originalname || 'audio.mp3',
      contentType: 'audio/mpeg'
    });
    form.append('title', title);
    form.append('performer', artist);

    const uploadResponse = await axios.post(
      `${TELEGRAM_API}/sendAudio`,
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000 // 2 minutes timeout
      }
    );

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    if (!uploadResponse.data.ok) {
      throw new Error('Telegram API returned not ok');
    }

    const audioData = uploadResponse.data.result.audio;
    const fileId = audioData.file_id;

    // Get file URL from Telegram
    const fileInfoResponse = await axios.get(
      `${TELEGRAM_API}/getFile?file_id=${fileId}`
    );

    if (!fileInfoResponse.data.ok) {
      throw new Error('Failed to get file info from Telegram');
    }

    const filePath_tg = fileInfoResponse.data.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath_tg}`;

    console.log(`[UPLOAD] Success! File ID: ${fileId}`);
    
    // Return response
    res.json({
      success: true,
      file_id: fileId,
      download_url: downloadUrl,
      title: title,
      artist: artist,
      duration: audioData.duration || 0,
      file_size: audioData.file_size || req.file.size,
      message: 'Upload successful'
    });

  } catch (error) {
    console.error('[UPLOAD] Error:', error.message);
    
    // Clean up on error
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error('[CLEANUP] Error:', cleanupError.message);
    }

    res.status(500).json({
      error: 'Upload failed',
      message: error.message,
      details: error.response?.data || null
    });
  }
});

// ============================================
// 📥 GET FILE URL ENDPOINT (optional utility)
// ============================================
app.get('/file/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const fileInfoResponse = await axios.get(
      `${TELEGRAM_API}/getFile?file_id=${fileId}`
    );

    if (!fileInfoResponse.data.ok) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = fileInfoResponse.data.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    res.json({
      file_id: fileId,
      download_url: downloadUrl,
      file_path: filePath
    });

  } catch (error) {
    console.error('[GET_FILE] Error:', error.message);
    res.status(500).json({ error: 'Failed to get file URL' });
  }
});

// ============================================
// Error handling
// ============================================
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// Start server
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('════════════════════════════════════════');
  console.log('🎵 Sonic Music Upload Server');
  console.log('════════════════════════════════════════');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Host: 0.0.0.0 (listening on all interfaces)`);
  console.log(`🤖 Bot Token: ${BOT_TOKEN.substring(0, 10)}...`);
  console.log(`💬 Channel ID: ${CHAT_ID}`);
  console.log('════════════════════════════════════════');
  
  const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  console.log(`✅ Ready at: ${baseUrl}`);
  console.log(`📤 Upload endpoint: ${baseUrl}/upload`);
  console.log(`❤️  Health check: ${baseUrl}/health`);
  console.log('════════════════════════════════════════');
  console.log('[RENDER READY] Server initialized successfully\n');
});
