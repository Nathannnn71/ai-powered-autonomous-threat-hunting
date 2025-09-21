# Windows to EC2 Deployment - Alternative Method
# Since you're on Windows, we'll create the files directly on EC2

# === STEP 1: Connect to EC2 ===
# Use the browser terminal from AWS Console

# === STEP 2: Run these commands in EC2 browser terminal ===

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Create project directory
mkdir -p ~/ai-threat-dashboard
cd ~/ai-threat-dashboard

# Create server.js file directly on EC2
cat > server.js << 'EOF'
import express from 'express';
import path from 'path';
import AWS from 'aws-sdk';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// AWS Configuration
AWS.config.update({ region: 'us-east-1' });
const s3 = new AWS.S3();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint to get latest threat data
app.get('/api/getData', async (req, res) => {
  try {
    console.log('📊 Fetching latest threat data...');
    
    // Get latest analysis from S3
    const params = {
      Bucket: 'wazuh-results',
      Key: 'latest_analysis.json'
    };
    
    const data = await s3.getObject(params).promise();
    const threatData = JSON.parse(data.Body.toString());
    
    // Add timestamp
    threatData.timestamp = new Date().toISOString();
    
    console.log('✅ Data retrieved successfully');
    res.json(threatData);
    
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    
    // Fallback to sample data if S3 fails
    const fallbackData = {
      summary: {
        summary: "Dynamic dashboard running! Connecting to Wazuh data...",
        common_patterns: ["Connection pending", "Data loading"],
        key_findings: ["System initializing"],
        total_logs: 0,
        normal_logs: 0,
        abnormal_logs: 0
      },
      logs: [],
      metrics: [],
      timestamp: new Date().toISOString()
    };
    
    res.json(fallbackData);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    buckets: {
      raw: 'wazuh-raw',
      results: 'wazuh-results'
    }
  });
});

// Simple HTML page for testing
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>AI Threat Dashboard</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <h1>🛡️ AI Threat Dashboard</h1>
        <p>✅ Server running successfully!</p>
        <h3>Test Endpoints:</h3>
        <ul>
          <li><a href="/api/health">Health Check</a></li>
          <li><a href="/api/getData">Get Threat Data</a></li>
        </ul>
        <p><strong>Next:</strong> Upload your React build files to replace this page.</p>
      </body>
    </html>
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 AI Threat Dashboard running on port ${port}`);
  console.log(`📊 API: http://44.211.174.174:${port}/api/getData`);
  console.log(`❤️ Health: http://44.211.174.174:${port}/api/health`);
});

export default app;
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "ai-threat-dashboard",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "aws-sdk": "^2.1691.0"
  }
}
EOF

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
export default {
  apps: [{
    name: "ai-threat-dashboard",
    script: "server.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      AWS_REGION: "us-east-1"
    }
  }]
};
EOF

# Install dependencies
npm install

# Start the application
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Check status
pm2 status

echo "🎉 Dashboard deployed! Visit: http://44.211.174.174:3000"