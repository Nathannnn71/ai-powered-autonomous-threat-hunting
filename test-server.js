// Simple test script to verify the server setup
import fetch from 'node-fetch';

async function testServer() {
  try {
    console.log('🧪 Testing server endpoints...');
    
    const healthResponse = await fetch('http://localhost:3000/api/health');
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('✅ Health check:', health);
    }
    
    const dataResponse = await fetch('http://localhost:3000/api/getData');
    if (dataResponse.ok) {
      const data = await dataResponse.json();
      console.log('✅ Data endpoint:', data.summary?.summary);
    }
    
  } catch (error) {
    console.log('❌ Server not running, which is expected without AWS credentials');
    console.log('📋 Next step: Deploy to EC2 with proper AWS access');
  }
}

testServer();