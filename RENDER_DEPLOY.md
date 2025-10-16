# 🚀 Sonic Music Server - Render Deployment Guide

## Prerequisites
- GitHub account
- Render account (sign up at https://render.com - free)
- Your Telegram bot token ready

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
cd D:\mp3\server

# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Sonic Music upload server"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/sonic-music-server.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Render

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** and authorize Render
4. Select your `sonic-music-server` repository
5. Configure settings:

```
Name: sonic-music-server
Environment: Docker
Region: Singapore (or closest to your users)
Branch: main
Instance Type: Free
```

### 3. Environment Variables

In the Render dashboard, add these environment variables:

| Key | Value |
|-----|-------|
| `BOT_TOKEN` | `8457626060:AAE7zNIqwscoJ_gyV50DbsmrwzgA6GqGTk8` |
| `CHAT_ID` | `-1003009155498` |
| `PORT` | `3000` |

### 4. Health Check Configuration

Render will automatically detect the health check from the Dockerfile, but you can also set it manually:

- **Health Check Path**: `/health`
- **Expected Response**: `{"ok":true, ...}`

### 5. Deploy!

Click **"Create Web Service"**

Render will:
- Clone your repo
- Build Docker image
- Deploy container
- Assign HTTPS URL

Build time: ~2-3 minutes

### 6. Get Your Server URL

After deployment, you'll get a URL like:
```
https://sonic-music-server-xxxx.onrender.com
```

### 7. Update Android App

Edit `D:\mp3\android\local.properties`:

```properties
API_BASE_RELEASE=https://sonic-music-server-xxxx.onrender.com/
```

Replace `xxxx` with your actual Render service name.

### 8. Verify Deployment

```bash
# Test health endpoint
curl https://your-service-name.onrender.com/health

# Expected response:
# {"ok":true,"status":"healthy","timestamp":"2025-10-16T..."}

# Test info endpoint
curl https://your-service-name.onrender.com/

# Expected response:
# {"status":"online","service":"Sonic Music Upload Server", ...}
```

### 9. Test Upload

```bash
curl -X POST https://your-service-name.onrender.com/upload \
  -F "audio=@test.mp3" \
  -F "title=Test Song" \
  -F "artist=Test Artist"
```

### 10. Build Release APK

```bash
cd D:\mp3\android
.\gradlew assembleRelease

# APK location:
# app/build/outputs/apk/release/app-release.apk
```

## 🔍 Monitor Logs

In Render dashboard:
- Go to your service
- Click **"Logs"** tab
- Look for: `[RENDER READY] Server initialized successfully`

## ⚠️ Important Notes

### Free Tier Limitations
- **Spin down**: After 15 minutes of inactivity, server goes to sleep
- **Cold start**: First request after sleep takes ~30-60 seconds
- **Uptime**: Not 24/7 (restarts every ~90 days)

For production, consider upgrading to paid plan ($7/month) for:
- No spin down
- Better performance
- More resources

### Keeping Server Awake (Optional)

Use a cron job or UptimeRobot to ping health endpoint every 10 minutes:

```bash
# Ping health endpoint
curl https://your-service-name.onrender.com/health
```

## 🐛 Troubleshooting

### Build Failed
- Check Dockerfile syntax
- Verify package.json exists
- Check Render logs for specific error

### 503 Service Unavailable
- Server might be spinning up (wait 30-60 seconds)
- Check environment variables are set correctly

### Upload Fails
- Verify BOT_TOKEN is correct
- Check CHAT_ID format
- Ensure bot is admin in channel

## 📊 Success Indicators

✅ Build logs show: `Successfully built`
✅ Logs show: `[RENDER READY] Server initialized successfully`
✅ Health check returns: `{"ok":true}`
✅ Upload endpoint works with test file
✅ Android release build connects successfully

## 🎉 Done!

Your Sonic Music server is now:
- ✅ Live on HTTPS
- ✅ Accessible from Android app
- ✅ Uploading to Telegram channel
- ✅ Ready for release builds

---

**Support:** Check Render docs at https://render.com/docs
