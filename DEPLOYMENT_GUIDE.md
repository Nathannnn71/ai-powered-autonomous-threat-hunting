# AI Threat Dashboard - EC2 Deployment Guide

## Prerequisites Check ✅
- 3 EC2 instances running
- S3 buckets created (wazuh-raw, wazuh-results)
- Key pair available

## Step 1: Connect to EC2
```bash
# Replace with your actual values
ssh -i "your-keypair.pem" ubuntu@YOUR-EC2-PUBLIC-IP
```

## Step 2: Install Dependencies on EC2
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install AWS CLI (if not installed)
sudo apt install -y awscli

# Create project directory
mkdir -p ~/ai-threat-dashboard
cd ~/ai-threat-dashboard
```

## Step 3: Configure AWS CLI on EC2
```bash
# You'll need to run this on EC2 with your AWS credentials
aws configure
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]  
# Default region name: us-east-1
# Default output format: json
```

## Step 4: Upload Your Code
From your local machine (Windows):
```powershell
# Build the React app first
npm run build

# Upload files to EC2 (replace IP and key path)
scp -i "C:\path\to\your-key.pem" server.js ubuntu@YOUR-EC2-IP:~/ai-threat-dashboard/
scp -i "C:\path\to\your-key.pem" package.json ubuntu@YOUR-EC2-IP:~/ai-threat-dashboard/
scp -i "C:\path\to\your-key.pem" ecosystem.config.js ubuntu@YOUR-EC2-IP:~/ai-threat-dashboard/
scp -i "C:\path\to\your-key.pem" -r dist/ ubuntu@YOUR-EC2-IP:~/ai-threat-dashboard/
```

## Step 5: Start the Application on EC2
```bash
# On EC2 instance
cd ~/ai-threat-dashboard
npm install
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Check if it's running
pm2 status
```

## Step 6: Configure Security Group
- Go to AWS Console → EC2 → Security Groups
- Add inbound rule: Port 3000, Source: 0.0.0.0/0 (HTTP)
- Add inbound rule: Port 80, Source: 0.0.0.0/0 (HTTP)

## Step 7: Test Your Dashboard
- Visit: http://YOUR-EC2-PUBLIC-IP:3000
- API: http://YOUR-EC2-PUBLIC-IP:3000/api/health