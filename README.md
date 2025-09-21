# AI-Powered Autonomous Threat Hunting Dashboard

A comprehensive cybersecurity monitoring system built with React and integrated with Wazuh SIEM for real-time threat detection and analysis. This project demonstrates both local development capabilities and production-ready deployment using AWS serverless architecture.

## 🌐 Live Demo

**Production Dashboard:** [http://ai-powered-autonomous-threat-hunting-website.s3-website-us-east-1.amazonaws.com](http://ai-powered-autonomous-threat-hunting-website.s3-website-us-east-1.amazonaws.com)

**API Endpoints:**
- Health Check: `https://rvwk89e37a.execute-api.us-east-1.amazonaws.com/prod/health`
- Threat Data: `https://rvwk89e37a.execute-api.us-east-1.amazonaws.com/prod/data`

## 🚀 Project Overview

This AI-powered threat hunting dashboard provides comprehensive cybersecurity monitoring through multiple approaches. Think of it as your **personal security operations center** that can run locally for development or globally for production use.

### 🖥️ Local Development Mode
Perfect for learning, development, and demonstrations:
- **Real-time Dashboard:** Interactive React application with live threat visualization
- **Mock Data Integration:** Simulated realistic threat scenarios (no real security data needed)
- **Hot Reload:** Instant updates during development with Vite
- **Component-based Architecture:** Modular design for easy customization
- **No Dependencies:** Works completely offline - great for presentations!

### 🌐 Production Mode (Real Wazuh Integration)
Enterprise-grade deployment with actual security monitoring:
- **Real Threat Data:** Connected to actual Wazuh SIEM collecting real security events
- **Global Accessibility:** Deployed on AWS for worldwide access
- **Static-Dynamic Hybrid:** Fast loading with real-time data updates
- **Cost-Effective:** Enterprise-grade scalability for less than $10/month

## 🏗️ How It Works

### 🖥️ Local Development Flow (Simple & Fast)
```
Your Computer → React Dashboard → Mock Data → Instant Demo
      ↓               ↓             ↓           ↓
   VS Code        Live Updates   Fake Threats  No Setup Needed
```
*Perfect for: Learning React, developing features, giving presentations without internet*

### 🌐 Production Flow (Real Security Monitoring)
```
Real Attacks → Wazuh SIEM → Raw Logs (S3) → AI Analysis (Lambda) → Dashboard (You!)
     ↓              ↓            ↓              ↓                ↓
SSH Attacks    Log Collection  wazuh-raw     Smart Detection   Live Threats
Brute Force    Real-time       Bucket        wazuh-results     Global Access
Failed Logins  Monitoring      Storage       Processed Data    Any Device
```

### 🔍 What Happens with Real Data:

1. **Wazuh Collects:** Your EC2 instances run Wazuh agents monitoring for suspicious activity
2. **Raw Storage:** All security logs go to `wazuh-raw` S3 bucket (think of it as a security camera recording)
3. **Smart Analysis:** Lambda functions analyze patterns and detect threats, storing results in `wazuh-results` bucket
4. **Dashboard Display:** Your React app fetches this processed intelligence and shows it beautifully
5. **Real-time Updates:** Every time you refresh, you get the latest threat analysis

## 🛠️ Technology Stack (Human-Friendly Explanation)

### 🎨 Frontend (What You See)
- **React 19** - The modern way to build interactive websites (like Facebook uses)
- **Vite** - Super-fast development server (your code updates instantly)
- **Tailwind CSS** - Beautiful styling without writing complex CSS
- **Recharts** - Pretty charts and graphs for threat visualization
- **React Router** - Multiple pages that work smoothly (Dashboard, Alerts, Logs)

### ⚡ Backend & Cloud (The Smart Stuff)
- **AWS Lambda** - Code that runs only when needed (pay per use, very cheap)
- **AWS API Gateway** - The bridge between your dashboard and the data
- **AWS S3** - Cloud storage for both your website files and security data
- **AWS SDK v3** - Modern tools to connect everything together

### 🔒 Security & Data (The Real Magic)
- **Wazuh SIEM** - Open-source security monitoring (like a digital security guard)
- **MITRE ATT&CK Framework** - Industry standard for categorizing cyber threats
- **Real-time Log Analysis** - Automatically spots suspicious patterns
- **Two S3 Buckets:**
  - `wazuh-raw`: Stores original security logs (like security camera footage)
  - `wazuh-results`: Stores processed threat intelligence (like security reports)

## 📊 What You'll See (Features Explained)

### 🖥️ Main Dashboard
- **Live Threat Map:** See attacks happening in real-time with pretty charts
- **Alert Counter:** How many threats detected today vs. normal activity
- **Top Threats:** What kind of attacks are most common (SSH attacks, login failures, etc.)
- **Confidence Scores:** How sure the AI is about each threat (85% confidence = very likely real)

### 🚨 Alert Management
- **Real Alerts:** When production mode detects actual SSH brute-force attacks
- **Mock Alerts:** When local mode shows simulated threats for demo
- **Alert Details:** Click any alert to see full investigation report
- **MITRE Mapping:** See which official attack techniques were used (T1021.004 = SSH attacks)

### 📋 Security Logs
- **Raw Log Viewer:** See the actual security events as they happened
- **Smart Filtering:** Find specific types of threats or time periods
- **Investigation Notes:** AI-generated explanations of what each event means
- **Source IPs:** Track where attacks are coming from (like 192.168.1.225)

### 🎯 Why This Matters (Real-World Impact)

**For Students:** Learn modern cybersecurity with real tools used by professionals
**For Developers:** See how to build scalable security applications 
**For Security Teams:** Template for building custom threat hunting tools
**For Presentations:** Impressive demo that works locally OR live on the internet

## 🔧 Getting Started

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **npm or yarn** - Package manager
- **Git** - Version control
- **AWS CLI** (optional, for deployment)
- **VS Code** (recommended) - IDE with extensions

### Quick Start (Local Development)

1. **Clone the Repository**
```bash
git clone <repository-url>
cd ai-threat-dashboard
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Open Dashboard**
Navigate to `http://localhost:5173` in your browser

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting
npm run lint
```

### Local Development Features

The local development environment includes:
- **Live Dashboard:** Interactive threat monitoring interface
- **Mock Data:** Realistic simulated security events
- **Component Library:** Reusable UI components (Alerts, Logs, Charts)
- **API Simulation:** Local endpoints mimicking production behavior
- **Hot Reload:** Instant updates when code changes

### Environment Configuration

#### For Local Development
No additional configuration needed - runs with mock data out of the box.

#### For Production API Integration
Create `.env` file:
```bash
# Production API endpoints
VITE_API_BASE_URL=https://rvwk89e37a.execute-api.us-east-1.amazonaws.com/prod

# Development settings
VITE_DEV_MODE=false
VITE_MOCK_DATA=false
```

## 🚀 Two Ways to Run This Project

### 🖥️ Option 1: Local Demo (5 Minutes Setup)
Perfect for learning, development, and presentations without internet:

```bash
# 1. Get the code
git clone <repository-url>
cd ai-threat-dashboard

# 2. Install everything
npm install

# 3. Start the dashboard
npm run dev

# 4. Open in your browser
# Go to: http://localhost:5173
```

**What you get:**
- ✅ Full interactive dashboard
- ✅ Realistic mock threat data
- ✅ All features working locally
- ✅ No AWS account needed
- ✅ Perfect for presentations

### 🌐 Option 2: Production with Real Data
Enterprise-grade deployment with actual Wazuh security monitoring:

**Live Demo:** [http://ai-powered-autonomous-threat-hunting-website.s3-website-us-east-1.amazonaws.com](http://ai-powered-autonomous-threat-hunting-website.s3-website-us-east-1.amazonaws.com)

**What you get:**
- ✅ Real SSH attack detection
- ✅ Actual Wazuh SIEM data
- ✅ Global accessibility
- ✅ Production-grade scalability
- ✅ Real threat intelligence

#### The Real Data Pipeline:
1. **Wazuh agents** on EC2 instances monitor for real security events
2. **Raw logs** get stored in `wazuh-raw` S3 bucket (like a security DVR)
3. **Lambda functions** analyze patterns and detect real threats
4. **Processed intelligence** goes to `wazuh-results` bucket (like security reports)
5. **Your dashboard** fetches this real data via API Gateway
6. **You see actual attacks** happening in real-time!

#### 1. Lambda Functions
**Function Name:** `ai-threat-dashboard-api`
- **Runtime:** Node.js 18.x
- **Memory:** 256 MB
- **Timeout:** 30 seconds
- **Permissions:** S3 read access

#### 2. API Gateway
**API Name:** `ai-threat-dashboard-api`
- **Type:** REST API
- **Stage:** prod
- **CORS:** Enabled
- **Endpoints:** `/health`, `/data`

#### 3. S3 Configuration
**Buckets:**
- `ai-powered-autonomous-threat-hunting-website` - Static hosting
- `wazuh-raw` - Raw security logs
- `wazuh-results` - Processed threat intelligence

#### 4. Static Website Hosting
- **Hosting Type:** S3 Static Website
- **Index Document:** `index.html`
- **Error Document:** `index.html` (for SPA routing)
- **Public Access:** Enabled via bucket policy

#### Deployment Steps
1. **Build the application:**
```bash
npm run build
```

2. **Upload to S3:**
Upload `dist/` contents to your S3 bucket

3. **Configure S3 static hosting**
4. **Set bucket policy for public access**
5. **Test the live deployment**

## 📈 Scalability & Performance

### Cost Optimization
- **S3 Static Hosting:** ~$0.50/month for typical traffic
- **Lambda Compute:** Pay-per-request pricing
- **API Gateway:** $3.50 per million requests
- **Total Estimated Cost:** <$10/month for moderate usage

### Performance Benefits
- **Global CDN:** S3 static hosting with edge locations
- **Serverless Auto-scaling:** Lambda handles traffic spikes automatically
- **Minimal Latency:** Static assets served from nearest edge location
- **High Availability:** 99.9% uptime SLA from AWS

## 🔒 Security Features

### Data Protection
- **Encryption at Rest:** S3 server-side encryption (SSE-S3)
- **Encryption in Transit:** HTTPS/TLS for all communications
- **Access Control:** IAM roles with least privilege principles

### Threat Intelligence
- **Real-time Processing:** Sub-second threat detection
- **Pattern Recognition:** Machine learning-based anomaly detection
- **Threat Attribution:** Source IP tracking and geolocation
- **Mitigation Recommendations:** Automated response suggestions

## 📊 Real Threat Data Examples

Here's what the dashboard shows when connected to real Wazuh data:

### 🚨 Actual Security Events Detected:
```json
{
  "summary": {
    "summary": "Multiple SSH brute-force attempts detected from 3 different IPs",
    "total_logs": 1247,
    "normal_logs": 1156,
    "abnormal_logs": 91
  },
  "real_attacks": [
    {
      "src_ip": "192.168.1.225",
      "attack_type": "SSH Brute Force", 
      "confidence": 85,
      "mitre_id": "T1021.004",
      "description": "Repeated failed SSH login attempts"
    },
    {
      "src_ip": "192.168.2.25", 
      "attack_type": "Credential Stuffing",
      "confidence": 80,
      "mitre_id": "T1110.001",
      "description": "Multiple password attempts on different accounts"
    }
  ]
}
```

### 🔍 What This Means in Plain English:
- **SSH Brute Force:** Someone trying to guess passwords to log into your servers
- **Confidence 85%:** The AI is 85% sure this is a real attack (not false alarm)
- **MITRE T1021.004:** Official cybersecurity classification for SSH attacks
- **Source IPs:** The actual computer addresses where attacks came from

### 📈 Dashboard Visualization:
- **Charts show:** Attack trends over time
- **Maps display:** Geographic location of attackers
- **Alerts list:** Each individual security event
- **Recommendations:** What to do about each threat

## 🚀 Future Enhancements

- **Real-time WebSocket Updates** - Live threat feed without refresh
- **Advanced ML Models** - Enhanced threat prediction capabilities  
- **Multi-Cloud Support** - Azure and GCP integration
- **Mobile App** - Native iOS/Android applications
- **Advanced Visualizations** - 3D network topology views

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Wazuh Team** - Open-source SIEM platform
- **AWS** - Cloud infrastructure and serverless services
- **React Community** - Frontend framework and ecosystem
- **MITRE** - ATT&CK framework for threat classification
