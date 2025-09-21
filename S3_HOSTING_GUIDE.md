# Alternative: Host Dashboard on S3 + CloudFront

Since EC2 access is restricted, let's use S3 Static Website + Lambda API:

## Architecture:
```
S3 Static Website (React) → CloudFront → Lambda API → S3 Data
```

## Step 1: Configure S3 for Static Website

1. **Go to S3 → Your bucket: `ai-powered-autonomous-threat-hunting-website`**
2. **Click "Properties" tab**
3. **Scroll to "Static website hosting"**
4. **Click "Edit"**
5. **Enable static website hosting**
6. **Index document: `index.html`**
7. **Error document: `index.html`**
8. **Click "Save changes"**

## Step 2: Update Bucket Policy

1. **Go to "Permissions" tab**
2. **Click "Bucket policy" → "Edit"**
3. **Add this policy:**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::ai-powered-autonomous-threat-hunting-website/*"
        }
    ]
}
```

## Step 3: Upload Your React Build

1. **Build your app locally:** `npm run build`
2. **Upload `dist/` contents to your S3 bucket**
3. **Your website will be available at the S3 website URL**

## Benefits:
✅ No EC2 required
✅ Works with student account permissions
✅ Serverless and cost-effective
✅ Automatic scaling