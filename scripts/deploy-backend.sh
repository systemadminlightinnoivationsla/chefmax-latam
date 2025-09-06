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

# Resolve spec file
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
APP_SPEC="${BACKEND_APP_SPEC:-$PROJECT_DIR/backend-update.yaml}"

if [ ! -f "$APP_SPEC" ]; then
    echo "❌ Spec file not found: $APP_SPEC"
    echo "   Set BACKEND_APP_SPEC or place backend-update.yaml at repo root"
    exit 1
fi
echo "📄 Using spec: $APP_SPEC"

# Deploy backend
echo "🚀 Deploying backend to DigitalOcean..."
if doctl apps create --spec "$APP_SPEC" --wait; then
    echo "✅ Backend deployment successful!"
    
    # Get app info
    APP_ID=$(doctl apps list --format ID,Name | grep chefmax-backend | awk '{print $1}')
    if [ -n "$APP_ID" ]; then
        echo "📱 App ID: $APP_ID"
        if [ -n "$BACKEND_URL" ]; then
            echo "🔗 App URL: $BACKEND_URL"
        else
            echo "🔗 App URL: (configure BACKEND_URL to enable health checks)"
        fi
        
        # Show deployment status
        echo "📊 Deployment status:"
        doctl apps get $APP_ID
    fi
    
    # Test health endpoint
    if [ -n "$BACKEND_URL" ]; then
        echo "🏥 Testing health endpoint..."
        sleep 30
        if curl -f "$BACKEND_URL/health"; then
            echo "✅ Backend is healthy!"
        else
            echo "⚠️  Health check failed, but deployment completed"
        fi
    fi
    
else
    echo "❌ Backend deployment failed"
    exit 1
fi

echo ""
echo "🎉 Backend deployment completed successfully!"
if [ -n "$BACKEND_URL" ]; then
    echo "🔗 Backend URL: $BACKEND_URL"
fi
echo "📊 Monitor: https://cloud.digitalocean.com/apps"