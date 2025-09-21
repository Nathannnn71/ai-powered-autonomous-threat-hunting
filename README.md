
# InfiLoop – AI-Powered Autonomous Threat Hunting

InfiLoop is a **single-page React dashboard** that visualizes AI-generated security analysis (`latest_analysis.json`) produced by backend **AWS Lambda + Bedrock workflows** and stored in **Amazon S3**.

---

## 🚀 Live Data Source
Frontend pulls data directly from S3:

```

s3://\<YOUR\_BUCKET>/latest\_analysis.json

```

---

## ⚡ Core Features (Frontend)

### 1. Threat Overview (24h)
- AI-generated summary narrative  
- Common patterns & key findings  
- Log counts: **total / normal / abnormal**

### 2. Abnormal Log Triage
- Per-log details:  
  `original_log`, `hypothesis_id`, `src_ip`, `hypothesis`,  
  `observed_patterns`, `confidence_score`, `confidence`,  
  `category`, `vulnerabilities`, `investigation_log`, `recommendations`
- Collapsible panels for streamlined review

### 3. Acknowledge Workflow (Alerts Page)
- Acknowledge alerts **per-log** or in **bulk**  
- Persistence via **localStorage**

### 4. Logs Center
- Structured table view:  
  `rule_desc`, `times`, `IPs`, `MITRE IDs / tactics / techniques`  
- Parses embedded JSON inside log messages

### 5. Metrics Panels
- **Alerts evolution** over time  
- **Recent logs trend** (driven by metrics array)

### 6. (Optional) Chatbot Component
- Can **POST to a Lambda / API Gateway endpoint** for AI assistance  
- Remove component file to disable

---

## 🛠️ AWS Backend (Typical Flow)

| Service           | Purpose                                                    |
|-------------------|------------------------------------------------------------|
| **AWS Lambda**    | Orchestrates log ingestion, enrichment & AI analysis       |
| **Amazon Bedrock**| LLM-based summarization & hypothesis generation            |
| **Amazon S3**     | Stores `latest_analysis.json` consumed by the UI           |
| **Amazon EC2 / Agents** | Source of raw security / system logs (Wazuh, syslog) |
| **Amazon CloudWatch** | Log storage & Lambda execution metrics                 |
| **AWS IAM**       | Least-privilege roles for Lambda, S3, and Bedrock access   |
| **Amazon SNS**    | (Optional) alert notifications for abnormal events         |

---

## 📌 Notes
- Frontend can be hosted on **S3 + CloudFront** or any static hosting service.
- Ensure **CORS configuration** on the S3 bucket for browser access.
- For production, integrate with **IAM roles** and restrict public access.

---
```

Would you like me to also add **installation & deployment instructions** (React build + AWS setup) so the README is ready for GitHub users to clone and run?
