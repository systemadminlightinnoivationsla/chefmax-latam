#!/bin/bash

# ChefMax Deployment Script for DigitalOcean App Platform
set -e

echo "🚀 Starting ChefMax deployment..."

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl is not installed. Please install it first:"
    echo "   https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if user is authenticated
if ! doctl auth list &> /dev/null; then
    echo "❌ Please authenticate with DigitalOcean first:"
    echo "   doctl auth init"
    exit 1
fi

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
APP_SPEC_FILE="$PROJECT_DIR/.do/app.yaml"

# Check if app.yaml exists
if [[ ! -f "$APP_SPEC_FILE" ]]; then
    echo "❌ App specification file not found at $APP_SPEC_FILE"
    exit 1
fi

echo "📋 Using app specification: $APP_SPEC_FILE"

# Check if app already exists
APP_NAME="chefmax-system"
APP_ID=$(doctl apps list --format ID,Spec.Name --no-header | grep "$APP_NAME" | awk '{print $1}' || true)

if [[ -z "$APP_ID" ]]; then
    echo "🆕 Creating new app: $APP_NAME"
    APP_ID=$(doctl apps create --spec "$APP_SPEC_FILE" --format ID --no-header)
    echo "✅ App created with ID: $APP_ID"
else
    echo "🔄 Updating existing app: $APP_NAME (ID: $APP_ID)"
    doctl apps update "$APP_ID" --spec "$APP_SPEC_FILE" --wait
    echo "✅ App updated successfully"
fi

echo "⏳ Waiting for deployment to complete..."
doctl apps get "$APP_ID" --wait

# Get app info
APP_INFO=$(doctl apps get "$APP_ID" --format ID,Spec.Name,ActiveDeployment.Phase,LiveURL --no-header)
echo "📊 App Status: $APP_INFO"

# Extract URLs
BACKEND_URL=$(doctl apps get "$APP_ID" --format LiveURL --no-header | grep backend || echo "Not available")
FRONTEND_URL=$(doctl apps get "$APP_ID" --format LiveURL --no-header | grep -v backend | head -n1 || echo "Not available")

echo ""
echo "🎉 Deployment completed!"
echo "🌐 Frontend URL: $FRONTEND_URL"
echo "🔧 Backend URL: $BACKEND_URL"
echo "📈 App ID: $APP_ID"

# Test health endpoint
if [[ "$BACKEND_URL" != "Not available" ]]; then
    echo ""
    echo "🔍 Testing backend health endpoint..."
    if curl -fsSL "$BACKEND_URL/health" > /dev/null 2>&1; then
        echo "✅ Backend health check passed"
    else
        echo "⚠️  Backend health check failed - app may still be starting up"
    fi
fi

echo ""
echo "📝 Next steps:"
echo "   1. Set up database migrations: npm run db:migrate"
echo "   2. Configure environment secrets in DigitalOcean dashboard"
echo "   3. Set up DigitalOcean Spaces for media storage"
echo "   4. Configure domain and SSL certificates"
echo ""
echo "📚 View logs: doctl apps logs $APP_ID --follow"
echo "🎛️  Manage app: https://cloud.digitalocean.com/apps/$APP_ID"