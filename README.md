# 🎵 Sonic Music Upload Server

Node.js server for uploading MP3 files from Sonic Music app to Telegram channel via bot.

## 📋 Prerequisites

- Node.js 14+ installed
- Telegram Bot created via @BotFather
- Telegram Channel with bot as admin

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Bot Credentials

Open `index.js` and update lines 14-15:

```javascript
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // From @BotFather
const CHAT_ID = '-1003009155498'; // Your channel ID
```

**Your current setup:**
- Bot: `@sonicai_music_bot`
- Channel: `SonicAI Storage`
- Chat ID: `-1003009155498` ✅ (already filled)

### 3. Start Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 📡 API Endpoints

### `POST /upload`
Upload audio file to Telegram channel.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `audio` (file): MP3 file
  - `title` (string): Song title
  - `artist` (string): Artist name

**Response:**
```json
{
  "success": true,
  "file_id": "BQACAgIAAxkBAAIC...",
  "download_url": "https://api.telegram.org/file/bot.../audio.mp3",
  "title": "Song Title",
  "artist": "Artist Name",
  "duration": 180,
  "file_size": 4521234,
  "message": "Upload successful"
}
```

### `GET /file/:fileId`
Get download URL for uploaded file.

**Response:**
```json
{
  "file_id": "BQACAgIAAxkBAAIC...",
  "download_url": "https://api.telegram.org/file/bot.../audio.mp3",
  "file_path": "audio/file_123.mp3"
}
```

### `GET /`
Server info and available endpoints.

### `GET /health`
Health check endpoint.

## 🧪 Test with cURL

```bash
# Upload test
curl -X POST http://localhost:3000/upload \
  -F "audio=@test.mp3" \
  -F "title=Test Song" \
  -F "artist=Test Artist"

# Get file URL
curl http://localhost:3000/file/BQACAgIAAxkBAAIC...
```

## 🔧 Configuration

### Environment Variables

You can use environment variables instead of hardcoded values:

```bash
export BOT_TOKEN="your_bot_token"
export CHAT_ID="-1003009155498"
export PORT=3000
```

Then update `index.js`:
```javascript
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const CHAT_ID = process.env.CHAT_ID || '-1003009155498';
```

### File Size Limit

Default: 50MB. To change, edit line 24 in `index.js`:
```javascript
limits: { fileSize: 100 * 1024 * 1024 } // 100MB
```

## 📱 Android App Integration

Update `ServerManager.kt` in your Android app:

```kotlin
private const val SERVER_URL = "http://YOUR_SERVER_IP:3000"

suspend fun uploadAudio(file: File, title: String, artist: String): Result<String> {
    val requestBody = MultipartBody.Builder()
        .setType(MultipartBody.FORM)
        .addFormDataPart("audio", file.name,
            file.asRequestBody("audio/mpeg".toMediaTypeOrNull()))
        .addFormDataPart("title", title)
        .addFormDataPart("artist", artist)
        .build()
    
    val request = Request.Builder()
        .url("$SERVER_URL/upload")
        .post(requestBody)
        .build()
    
    // ... handle response
}
```

## 🐛 Troubleshooting

### Bot not authorized
- Make sure bot is added to channel as admin
- Check bot has permission to post messages

### Upload fails
- Verify BOT_TOKEN is correct
- Check CHAT_ID format (should start with `-100`)
- Ensure channel is public or bot is member

### File too large
- Telegram limit: 50MB for bots
- Check file size before upload

## 📝 Logs

Server logs all operations:
```
[UPLOAD] Request received
[UPLOAD] Processing: Song Title by Artist Name
[UPLOAD] File size: 4521234 bytes
[UPLOAD] Success! File ID: BQACAgIAAxkBAAIC...
```

## 🔐 Security Notes

- Keep BOT_TOKEN secret
- Use HTTPS in production
- Consider adding API authentication
- Validate file types on server side

## 📦 Deployment

### Local Testing
```bash
npm start
# Access at http://localhost:3000
```

### Deploy to Render (Recommended)

Render provides free HTTPS hosting for Node.js apps.

#### 1. Prepare Repository

```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: Sonic Music server"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/sonic-music-server.git
git push -u origin main
```

#### 2. Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `sonic-music-server`
   - **Environment**: `Docker`
   - **Region**: Choose closest to users
   - **Branch**: `main`
   - **Instance Type**: Free

#### 3. Add Environment Variables

In Render dashboard, add these environment variables:

```
BOT_TOKEN=8457626060:AAE7zNIqwscoJ_gyV50DbsmrwzgA6GqGTk8
CHAT_ID=-1003009155498
PORT=3000
```

#### 4. Configure Health Check

- **Health Check Path**: `/health`
- Render will automatically monitor this endpoint

#### 5. Deploy

- Click **"Create Web Service"**
- Wait for build (2-3 minutes)
- Your server will be live at: `https://your-service-name.onrender.com`

#### 6. Update Android App

In `local.properties`:
```properties
API_BASE_RELEASE=https://your-service-name.onrender.com/
```

#### 7. Verify Deployment

```bash
# Test health endpoint
curl https://your-service-name.onrender.com/health

# Should return:
# {"ok":true,"status":"healthy","timestamp":"..."}
```

### Alternative: Railway / Fly.io

**Railway:**
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

**Fly.io:**
```bash
flyctl launch
flyctl deploy
```

### Production Checklist

- [ ] BOT_TOKEN set as environment variable
- [ ] CHAT_ID configured correctly
- [ ] Health check endpoint working (`/health` returns `{"ok":true}`)
- [ ] HTTPS enabled (automatic with Render)
- [ ] Upload tested with curl/Postman
- [ ] Android app updated with production URL
- [ ] Logs show `[RENDER READY]` on startup

---

**Status:** ✅ Ready to use with your bot and channel
