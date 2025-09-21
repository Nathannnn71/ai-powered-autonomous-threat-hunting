module.exports = {
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
      AWS_REGION: "us-east-1",
      S3_BUCKET_RAW: "wazuh-raw",
      S3_BUCKET_RESULTS: "wazuh-results"
    }
  }]
};