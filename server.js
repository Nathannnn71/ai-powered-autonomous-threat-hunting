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
        summary: "Fallback mode - connecting to Wazuh data...",
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

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 AI Threat Dashboard running on port ${port}`);
  console.log(`📊 API: http://localhost:${port}/api/getData`);
  console.log(`❤️ Health: http://localhost:${port}/api/health`);
});

export default app;