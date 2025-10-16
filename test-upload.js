const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'https://sonic-music-server.onrender.com';
// const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  console.log('🧪 Testing Sonic Music Server Endpoints\n');
  
  // Test 1: Health Check
  console.log('1️⃣ Testing GET /health...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
  
  // Test 2: Tracks endpoint
  console.log('\n2️⃣ Testing GET /tracks...');
  try {
    const response = await axios.get(`${BASE_URL}/tracks`);
    console.log(`✅ Tracks endpoint returned ${response.data.length} tracks`);
    if (response.data.length > 0) {
      console.log('   Sample track:', response.data[0]);
    }
  } catch (error) {
    console.error('❌ Tracks endpoint failed:', error.message);
  }
  
  // Test 3: Upload endpoint (only if test file exists)
  console.log('\n3️⃣ Testing POST /upload...');
  const testFile = './test-audio.mp3';
  if (fs.existsSync(testFile)) {
    try {
      const form = new FormData();
      form.append('audio', fs.createReadStream(testFile));
      form.append('title', 'Test Upload');
      form.append('artist', 'Test Artist');
      
      const response = await axios.post(`${BASE_URL}/upload`, form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      
      console.log('✅ Upload successful:', response.data);
    } catch (error) {
      console.error('❌ Upload failed:', error.response?.status, error.response?.data || error.message);
    }
  } else {
    console.log('⚠️  Skipping upload test (no test-audio.mp3 file found)');
  }
  
  console.log('\n🏁 Test complete!');
}

testEndpoints();
