#!/bin/bash
# BuildConnect Deployment Script
echo "🚀 Starting BuildConnect deployment"

# 1. Install dependencies
echo "🔧 Installing dependencies..."
npm install --production

# 2. Generate secrets if missing
if [ -z "$JWT_SECRET" ]; then
  export JWT_SECRET=$(openssl rand -hex 32)
  echo "🔑 Generated JWT_SECRET"
fi

if [ -z "$CSRF_SECRET" ]; then
  export CSRF_SECRET=$(openssl rand -hex 32)
  echo "🔑 Generated CSRF_SECRET"
fi

# 3. Start application
echo "🛠 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# 4. Save PM2 process list
pm2 save

# 5. Configure startup
echo "⚡ Setting up startup script..."
pm2 startup

echo "✅ Deployment complete! Application running in production mode."