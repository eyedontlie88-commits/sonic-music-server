#!/bin/bash

# Test upload script for Sonic Music Server
# Usage: ./test-upload.sh path/to/audio.mp3

if [ -z "$1" ]; then
  echo "❌ Error: No file provided"
  echo "Usage: ./test-upload.sh path/to/audio.mp3"
  exit 1
fi

FILE_PATH="$1"
SERVER_URL="${SERVER_URL:-http://localhost:3000}"

if [ ! -f "$FILE_PATH" ]; then
  echo "❌ Error: File not found: $FILE_PATH"
  exit 1
fi

echo "🎵 Testing Sonic Music Upload Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 File: $FILE_PATH"
echo "🌐 Server: $SERVER_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📤 Uploading..."
response=$(curl -s -X POST "$SERVER_URL/upload" \
  -F "audio=@$FILE_PATH" \
  -F "title=Test Song" \
  -F "artist=Test Artist")

echo ""
echo "📥 Response:"
echo "$response" | jq . 2>/dev/null || echo "$response"
echo ""

# Check if successful
if echo "$response" | grep -q '"success":true'; then
  echo "✅ Upload successful!"
  
  # Extract file_id
  file_id=$(echo "$response" | jq -r '.file_id' 2>/dev/null)
  
  if [ ! -z "$file_id" ] && [ "$file_id" != "null" ]; then
    echo "📄 File ID: $file_id"
    echo ""
    echo "🔗 Testing file URL retrieval..."
    curl -s "$SERVER_URL/file/$file_id" | jq . 2>/dev/null
  fi
else
  echo "❌ Upload failed!"
fi
