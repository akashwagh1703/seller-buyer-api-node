#!/bin/bash

# Nerace API Deployment Script
set -e

echo "🚀 Starting Nerace API Deployment..."

# Configuration
APP_NAME="nerace-api"
APP_DIR="/var/www/nerace-api-node"
BACKUP_DIR="/var/backups/nerace-api"
NODE_VERSION="18"

# Create backup
echo "📦 Creating backup..."
sudo mkdir -p $BACKUP_DIR
sudo cp -r $APP_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true

# Install Node.js if not exists
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js $NODE_VERSION..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not exists
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    sudo npm install -g pm2
fi

# Create app directory
sudo mkdir -p $APP_DIR
cd $APP_DIR

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Set permissions
sudo chown -R $USER:$USER $APP_DIR
chmod -R 755 $APP_DIR

# Create logs directory
mkdir -p logs uploads

# Stop existing PM2 process
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Setup nginx (optional)
if command -v nginx &> /dev/null; then
    echo "🌐 Configuring Nginx..."
    sudo cp nginx.conf /etc/nginx/sites-available/nerace-api
    sudo ln -sf /etc/nginx/sites-available/nerace-api /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
fi

echo "✅ Deployment completed!"
echo "🌐 API running at: http://localhost:3000"
echo "📊 Health check: http://localhost:3000/health"
echo "📋 PM2 status: pm2 status"