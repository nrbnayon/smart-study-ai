#!/bin/bash

echo "🚀 Starting deployment..."

cd /var/www/bass_port_pro_web || exit 1

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building Next.js..."
npm run build

echo "🔁 Restarting PM2 frontend..."
pm2 delete frontend
pm2 start ecosystem.config.js

echo "💾 Saving PM2 state..."
pm2 save

echo "🌐 Reloading Nginx..."
nginx -t && systemctl reload nginx

echo "✅ Deployment completed successfully!"