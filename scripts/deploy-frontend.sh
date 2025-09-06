#!/bin/bash

# ChefMax Frontend Deployment Script
# Deploy React app to DigitalOcean App Platform

set -e

echo "🚀 ChefMax Frontend Deployment"
echo "==============================="

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
echo "📦 Building frontend locally..."
cd front/
npm run build
npm run typecheck
echo "✅ Local build successful"

cd ..

# Deploy frontend
echo "🚀 Deploying frontend to DigitalOcean..."
if doctl apps create --spec .do/frontend-app.yaml --wait; then
    echo "✅ Frontend deployment successful!"
    
    # Get app info
    APP_ID=$(doctl apps list --format ID,Name | grep chefmax-frontend | awk '{print $1}')
    if [ -n "$APP_ID" ]; then
        echo "📱 App ID: $APP_ID"
        echo "🔗 App URL: https://chefmax-frontend.ondigitalocean.app"
        
        # Show deployment status
        echo "📊 Deployment status:"
        doctl apps get $APP_ID
    fi
    
    # Test frontend
    echo "🌐 Testing frontend..."
    sleep 30
    if curl -f https://chefmax-frontend.ondigitalocean.app; then
        echo "✅ Frontend is live!"
    else
        echo "⚠️  Frontend test failed, but deployment completed"
    fi
    
else
    echo "❌ Frontend deployment failed"
    exit 1
fi

echo ""
echo "🎉 Frontend deployment completed successfully!"
echo "🔗 Frontend URL: https://chefmax-frontend.ondigitalocean.app"
echo "📊 Monitor: https://cloud.digitalocean.com/apps"