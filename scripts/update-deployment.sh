#!/bin/bash

# ChefMax DigitalOcean Update Deployment Script
# Updates an existing app deployment

set -e

echo "🔄 ChefMax - Update DigitalOcean Deployment"
echo "==========================================="

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl CLI is not installed."
    exit 1
fi

# Get app ID if provided, otherwise list apps
APP_ID="$1"

if [ -z "$APP_ID" ]; then
    echo "📋 Available applications:"
    doctl apps list
    echo ""
    echo "Usage: $0 <APP_ID>"
    echo "Example: $0 12345678-1234-1234-1234-123456789abc"
    exit 1
fi

echo "🔍 App ID: $APP_ID"
echo "🏗️  Creating new deployment..."

# Create new deployment
doctl apps create-deployment "$APP_ID" --wait

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! New deployment created"
    echo ""
    echo "📊 Check app status:"
    echo "   doctl apps get $APP_ID"
    echo ""
    echo "📝 View logs:"
    echo "   doctl apps logs $APP_ID --follow"
else
    echo "❌ Deployment update failed"
    exit 1
fi