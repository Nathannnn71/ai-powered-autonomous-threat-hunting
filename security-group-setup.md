# Security Group Configuration Guide

## Current Setup:
- Security Group: "Wazuh-SG"
- All instances use the same security group

## Required Ports for Dashboard:
- Port 22 (SSH) - Already open
- Port 3000 (Dashboard) - Need to add
- Port 80 (HTTP) - Optional

## Steps to Open Port 3000:

1. Go to AWS Console → EC2 → Security Groups
2. Click on "Wazuh-SG"
3. Click "Inbound rules" tab
4. Click "Edit inbound rules"
5. Click "Add rule"
6. Configure:
   - Type: Custom TCP
   - Port range: 3000
   - Source: 0.0.0.0/0 (Anywhere IPv4)
   - Description: Dashboard HTTP
7. Click "Save rules"

## Test Access:
After deployment, visit: http://44.211.174.174:3000