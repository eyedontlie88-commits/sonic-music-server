# ✅ Deployment Checklist - Sonic Music Server

## Pre-Deployment Verification

### Server Files Ready
- [x] `Dockerfile` created (node:20-alpine, EXPOSE 3000)
- [x] `index.js` uses `process.env.PORT`, `BOT_TOKEN`, `CHAT_ID`
- [x] `.env.example` created with all required variables
- [x] `.gitignore` includes `.env` (secrets protected)
- [x] `.dockerignore` created (optimizes Docker build)
- [x] `GET /health` returns `{"ok": true}` (status 200)
- [x] Server logs `[RENDER READY]` on startup
- [x] Server listens on `0.0.0.0` (not just localhost)
- [x] `README.md` updated with Render deployment steps

### Upload Endpoint Unchanged
- [x] `POST /upload` logic unchanged
- [x] Telegram integration working
- [x] Response format matches Android app expectations

## Render Deployment Steps

### 1. GitHub Setup
- [ ] Create GitHub repository
- [ ] Push server code to GitHub
- [ ] Verify `.env` is NOT in repository
- [ ] Verify all files are pushed

### 2. Render Configuration
- [ ] Sign up/login to Render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set Environment to "Docker"
- [ ] Choose region (Singapore recommended)
- [ ] Select "Free" instance type

### 3. Environment Variables
Add these in Render dashboard:
- [ ] `BOT_TOKEN=8457626060:AAE7zNIqwscoJ_gyV50DbsmrwzgA6GqGTk8`
- [ ] `CHAT_ID=-1003009155498`
- [ ] `PORT=3000`

### 4. Health Check
- [ ] Set path to `/health`
- [ ] Render automatically monitors endpoint

### 5. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for build (~2-3 minutes)
- [ ] Check logs for `[RENDER READY]`
- [ ] Note your HTTPS URL

## Post-Deployment Testing

### Server Tests
```bash
# Replace YOUR_URL with actual Render URL
export SERVER_URL="https://sonic-music-server-xxxx.onrender.com"

# Test 1: Health check
curl $SERVER_URL/health
# Expected: {"ok":true,"status":"healthy",...}

# Test 2: Server info
curl $SERVER_URL/
# Expected: {"status":"online","service":"Sonic Music Upload Server",...}

# Test 3: Upload test file
curl -X POST $SERVER_URL/upload \
  -F "audio=@test.mp3" \
  -F "title=Test Song" \
  -F "artist=Test Artist"
# Expected: {"success":true,"file_id":"...","download_url":"...",...}
```

### Server Tests Checklist
- [ ] Health check returns 200 OK
- [ ] Health check returns `{"ok":true}`
- [ ] Upload endpoint accepts file
- [ ] File uploaded to Telegram channel
- [ ] Response includes `file_id` and `download_url`
- [ ] No errors in Render logs

## Android App Integration

### Update Configuration
Edit `D:\mp3\android\local.properties`:
- [ ] Set `API_BASE_RELEASE=https://your-render-url.onrender.com/`
- [ ] Keep trailing slash `/`

### Build Release
```bash
cd D:\mp3\android
.\gradlew assembleRelease
```

- [ ] Build succeeds without errors
- [ ] APK generated at `app/build/outputs/apk/release/app-release.apk`
- [ ] Install release APK on test device

### App Tests
- [ ] Release build connects to HTTPS server
- [ ] No CLEARTEXT_COMMUNICATION errors
- [ ] Upload functionality works
- [ ] File appears in Telegram channel
- [ ] Metadata saved to Firestore
- [ ] Track appears in RecyclerView
- [ ] Playback works

## Success Criteria

### Server
- ✅ Live at HTTPS URL
- ✅ Health check passing
- ✅ Upload endpoint functional
- ✅ Logs show `[RENDER READY]`

### Android App
- ✅ Debug build uses HTTP (localhost)
- ✅ Release build uses HTTPS (Render)
- ✅ Upload flow complete
- ✅ No security errors

## Troubleshooting

### Build Failed on Render
- Check Dockerfile syntax
- Verify package.json exists
- Check Render logs for specific error

### 503 Service Unavailable
- Wait 30-60 seconds (server spinning up)
- Free tier spins down after 15 min inactivity

### Upload Fails
- Verify BOT_TOKEN in Render env vars
- Check CHAT_ID format
- Ensure bot is admin in Telegram channel

### Android App Can't Connect
- Verify HTTPS URL in `local.properties`
- Check URL has trailing slash
- Rebuild release APK
- Check logcat for network errors

## Final Verification

- [ ] Server: `curl https://your-url.onrender.com/health` returns 200
- [ ] Android: Release APK uploads file successfully
- [ ] Telegram: File appears in channel
- [ ] Logs: Both server and app show no errors
- [ ] Ready for production use!

---

**Date Completed:** _________________

**Render URL:** _________________

**Status:** 🎉 Ready for Production
