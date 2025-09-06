#!/bin/bash

# ChefMax Backend Deployment Script
# Deploy backend API to DigitalOcean App Platform

set -e

echo "🚀 ChefMax Backend Deployment"
echo "=============================="

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl CLI is not installed. Please install it first:"
    echo "   brew install doctl (macOS)"
    echo "   snap install doctl (Ubuntu)"
    exit 1
fi

# Check if user is authenticated
if ! doctl auth list &> /dev/null; then
    echo "❌ doctl is not authenticated. Please run: doctl auth init"
    exit 1
fi

echo "✅ Environment checks passed"

# Build and validate locally first
echo "📦 Building backend locally..."
cd back/
npm run build
npm run typecheck
echo "✅ Local build successful"

cd ..

# Deploy backend
echo "🚀 Deploying backend to DigitalOcean..."
if doctl apps create --spec .do/backend-app.yaml --wait; then
    echo "✅ Backend deployment successful!"
    
    # Get app info
    APP_ID=$(doctl apps list --format ID,Name | grep chefmax-backend | awk '{print $1}')
    if [ -n "$APP_ID" ]; then
        echo "📱 App ID: $APP_ID"
        echo "🔗 App URL: https://chefmax-backend.ondigitalocean.app"
        
        # Show deployment status
        echo "📊 Deployment status:"
        doctl apps get $APP_ID
    fi
    
    # Test health endpoint
    echo "🏥 Testing health endpoint..."
    sleep 30
    if curl -f https://chefmax-backend.ondigitalocean.app/health; then
        echo "✅ Backend is healthy!"
    else
        echo "⚠️  Health check failed, but deployment completed"
    fi
    
else
    echo "❌ Backend deployment failed"
    exit 1
fi

echo ""
echo "🎉 Backend deployment completed successfully!"
echo "🔗 Backend URL: https://chefmax-backend.ondigitalocean.app"
echo "📊 Monitor: https://cloud.digitalocean.com/apps"