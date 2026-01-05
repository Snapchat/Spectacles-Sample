// Quick local test - run with: node test-local.js
const axios = require('axios');

const SERVICE_URL = 'http://localhost:3000';

async function testHealthCheck() {
  try {
    const response = await axios.get(`${SERVICE_URL}/health`);
    console.log('✅ Health check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testStitchEndpoint() {
  try {
    const response = await axios.post(`${SERVICE_URL}/stitch`, {
      sessionId: 'test_session_123',
      bucket: 'specs-bucket',
      frameRate: 30,
      sampleRate: 44100
    });
    console.log('✅ Stitch endpoint:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Stitch endpoint failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Composite Stitcher Service...\n');
  
  const healthOk = await testHealthCheck();
  
  if (healthOk) {
    console.log('\n📝 Note: Stitch endpoint will fail without real Supabase data');
    console.log('         This is expected for local testing\n');
    await testStitchEndpoint();
  }
  
  console.log('\n✨ Tests complete!');
}

runTests();

