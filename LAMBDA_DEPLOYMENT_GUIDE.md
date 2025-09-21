# Step-by-Step Lambda Deployment Guide

## Step 1: Create Lambda Function

1. **Go to AWS Console → Lambda**
2. **Click "Create function"**
3. **Choose "Author from scratch"**
4. **Configure:**
   - Function name: `ai-threat-dashboard-api`
   - Runtime: `Node.js 18.x`
   - Architecture: `x86_64`
5. **Click "Create function"**

## Step 2: Add Function Code

1. **In the Lambda console, scroll down to "Code source"**
2. **Delete the default code in `index.js`**
3. **Copy and paste the code from `lambda-function.js`**
4. **Click "Deploy"**

## Step 3: Configure Lambda Settings

1. **Go to "Configuration" tab**
2. **Click "General configuration" → "Edit"**
3. **Set:**
   - Timeout: `30 seconds`
   - Memory: `256 MB`
4. **Click "Save"**

## Step 4: Add S3 Permissions

1. **Go to "Configuration" tab → "Permissions"**
2. **Click on the execution role name**
3. **Click "Add permissions" → "Attach policies"**
4. **Search and select: `AmazonS3ReadOnlyAccess`**
5. **Click "Add permissions"**

## Step 5: Create API Gateway

1. **Go to AWS Console → API Gateway**
2. **Click "Create API"**
3. **Choose "REST API" → "Build"**
4. **Configure:**
   - API name: `ai-threat-dashboard-api`
   - Endpoint Type: `Regional`
5. **Click "Create API"**

## Step 6: Configure API Gateway

1. **Click "Actions" → "Create Resource"**
2. **Resource Name: `api`**
3. **Resource Path: `/api`**
4. **Enable CORS: ✓**
5. **Click "Create Resource"**

6. **Select `/api` resource**
7. **Click "Actions" → "Create Resource"**
8. **Resource Name: `getData`**
9. **Resource Path: `/getData`**
10. **Click "Create Resource"**

11. **Select `/api/getData` resource**
12. **Click "Actions" → "Create Method"**
13. **Choose `GET` → Click ✓**
14. **Configure:**
    - Integration type: `Lambda Function`
    - Lambda Region: `us-east-1`
    - Lambda Function: `ai-threat-dashboard-api`
15. **Click "Save"**

## Step 7: Deploy API

1. **Click "Actions" → "Deploy API"**
2. **Deployment stage: `[New Stage]`**
3. **Stage name: `prod`**
4. **Click "Deploy"**

## Step 8: Test Your API

You'll get a URL like:
`https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod`

Test endpoints:
- `GET /api/getData` - Your threat data
- `GET /api/health` - Health check

## Step 9: Update Your React App

Update the API URL in your dashboard to use the new Lambda endpoint.

## Expected Result:
✅ Serverless API running on Lambda
✅ Connected to your S3 buckets  
✅ CORS enabled for your dashboard
✅ No EC2 required!