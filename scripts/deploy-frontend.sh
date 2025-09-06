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

# Resolve spec file (optional for static site apps)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
FRONTEND_SPEC_CANDIDATE="$PROJECT_DIR/.do/frontend-app.yaml"

# Deploy frontend
echo "🚀 Deploying frontend to DigitalOcean..."
if [ -f "$FRONTEND_APP_SPEC" ]; then
    SPEC_FILE="$FRONTEND_APP_SPEC"
elif [ -f "$FRONTEND_SPEC_CANDIDATE" ]; then
    SPEC_FILE="$FRONTEND_SPEC_CANDIDATE"
else
    SPEC_FILE=""
fi

if [ -n "$SPEC_FILE" ]; then
    if doctl apps create --spec "$SPEC_FILE" --wait; then
        echo "✅ Frontend deployment successful!"
        
        # Get app info
        APP_ID=$(doctl apps list --format ID,Name | grep chefmax-frontend | awk '{print $1}')
        if [ -n "$APP_ID" ]; then
            echo "📱 App ID: $APP_ID"
            if [ -n "$FRONTEND_URL" ]; then
                echo "🔗 App URL: $FRONTEND_URL"
            else
                echo "🔗 App URL: (configure FRONTEND_URL to enable health checks)"
            fi
            
            # Show deployment status
            echo "📊 Deployment status:"
            doctl apps get $APP_ID
        fi
        
        # Test frontend
        if [ -n "$FRONTEND_URL" ]; then
            echo "🌐 Testing frontend..."
            sleep 30
            if curl -f "$FRONTEND_URL"; then
                echo "✅ Frontend is live!"
            else
                echo "⚠️  Frontend test failed, but deployment completed"
            fi
        fi
        
    else
        echo "❌ Frontend deployment failed"
        exit 1
    fi
else
    echo "ℹ️ No spec file found. If the frontend app ya existe, usa:"
    echo "   doctl apps create-deployment <FRONTEND_APP_ID> --wait"
    exit 0
fi
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
if [ -n "$FRONTEND_URL" ]; then
    echo "🔗 Frontend URL: $FRONTEND_URL"
fi
echo "📊 Monitor: https://cloud.digitalocean.com/apps"