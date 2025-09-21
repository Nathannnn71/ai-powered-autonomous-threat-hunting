# Windows PowerShell Deployment Script
# AI Threat Dashboard to EC2

$EC2_IP = "44.211.174.174"  # WebServer instance
$KEY_PATH = "C:\path\to\InfiLoop-only-key.pem"  # Update this path
$USER = "ubuntu"

Write-Host "🚀 Deploying AI Threat Dashboard to EC2..." -ForegroundColor Green
Write-Host "📍 Target: $EC2_IP" -ForegroundColor Yellow

# Check if files exist
if (-not (Test-Path "dist\")) {
    Write-Host "❌ dist folder not found. Run 'npm run build' first!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Files ready for deployment:" -ForegroundColor Cyan
Get-ChildItem -Name server.js, package.json, ecosystem.config.js, dist

Write-Host "`n🔧 Next steps:" -ForegroundColor Yellow
Write-Host "1. Download your key file: InfiLoop-only-key.pem" -ForegroundColor White
Write-Host "2. Update KEY_PATH in this script" -ForegroundColor White
Write-Host "3. Run deployment commands below" -ForegroundColor White

Write-Host "`n📋 Deployment Commands:" -ForegroundColor Cyan
Write-Host "# 1. Connect to EC2" -ForegroundColor Gray
Write-Host "ssh -i `"$KEY_PATH`" $USER@$EC2_IP" -ForegroundColor White

Write-Host "`n# 2. Upload files (run from Windows)" -ForegroundColor Gray
Write-Host "scp -i `"$KEY_PATH`" server.js $USER@${EC2_IP}:~/" -ForegroundColor White
Write-Host "scp -i `"$KEY_PATH`" package.json $USER@${EC2_IP}:~/" -ForegroundColor White
Write-Host "scp -i `"$KEY_PATH`" ecosystem.config.js $USER@${EC2_IP}:~/" -ForegroundColor White
Write-Host "scp -i `"$KEY_PATH`" -r dist/ $USER@${EC2_IP}:~/" -ForegroundColor White

Write-Host "`n# 3. Setup on EC2 (run after connecting)" -ForegroundColor Gray
@"
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Install app dependencies
npm install

# Start the application
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Check status
pm2 status
"@ | Write-Host -ForegroundColor White

Write-Host "`n🌐 Your dashboard will be available at:" -ForegroundColor Green
Write-Host "http://$EC2_IP:3000" -ForegroundColor Cyan