#!/bin/bash

# ChefMax DigitalOcean Deployment Script
# Creates a new app using the app spec configuration

set -e

echo "🚀 ChefMax - DigitalOcean App Platform Deployment"
echo "================================================"

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl CLI is not installed."
    echo "📖 Install from: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if user is authenticated
if ! doctl auth list &> /dev/null; then
    echo "❌ Not authenticated with DigitalOcean"
    echo "🔑 Run: doctl auth init"
    exit 1
fi

echo "✅ Prerequisites checked"

# Deploy the application
echo "🏗️  Creating ChefMax application on DigitalOcean App Platform..."
echo "📋 Using spec file: .do/app.yaml"

# Create the app
doctl apps create --spec .do/app.yaml --wait

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! ChefMax has been deployed to DigitalOcean App Platform"
    echo ""
    echo "📊 Check deployment status:"
    echo "   doctl apps list"
    echo ""
    echo "🌐 Once deployed, your app will be available at the URLs shown above"
    echo "⚙️  Don't forget to configure your environment secrets in DO dashboard"
    echo ""
    echo "🔧 Required secrets to configure:"
    echo "   - DATABASE_URL (PostgreSQL connection string)"
    echo "   - JWT_SECRET (for authentication)"
    echo "   - JWT_REFRESH_SECRET (for refresh tokens)"
    echo "   - REDIS_URL (for caching/sessions)"
    echo "   - SPACES_ACCESS_KEY (for media storage)"
    echo "   - SPACES_SECRET_KEY (for media storage)"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi