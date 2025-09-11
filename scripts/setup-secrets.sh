#!/bin/bash

# ChefMax DigitalOcean Secrets Configuration Helper
# Helps configure environment variables in DigitalOcean App Platform

set -e

echo "🔐 ChefMax - DigitalOcean Secrets Configuration Helper"
echo "====================================================="

APP_ID="$1"

if [ -z "$APP_ID" ]; then
    echo "📋 Available applications:"
    doctl apps list
    echo ""
    echo "Usage: $0 <APP_ID>"
    exit 1
fi

echo "🔍 App ID: $APP_ID"
echo ""
echo "⚙️  Required Environment Variables to Configure:"
echo ""
echo "🔧 Backend API Service (api):"
echo "   - DATABASE_URL: PostgreSQL connection string"
echo "     Example: postgresql://username:password@host:port/database?sslmode=require"
echo ""
echo "   - JWT_SECRET: Secret for JWT tokens"
echo "     Generate: openssl rand -hex 32"
echo ""
echo "   - JWT_REFRESH_SECRET: Secret for refresh tokens"
echo "     Generate: openssl rand -hex 32"
echo ""
echo "   - REDIS_URL: Redis connection string"
echo "     Example: redis://localhost:6379"
echo ""
echo "   - SPACES_ACCESS_KEY: DigitalOcean Spaces access key"
echo "   - SPACES_SECRET_KEY: DigitalOcean Spaces secret key"
echo ""
echo "🌐 Frontend Web Service (web):"
echo "   - No additional secrets required (build-time vars are auto-configured)"
echo ""
echo "📖 Configuration Steps:"
echo "1. Go to: https://cloud.digitalocean.com/apps"
echo "2. Select your app: chefmax-platform"
echo "3. Go to Settings > Environment Variables"
echo "4. Add the secrets above for the 'api' service"
echo "5. Deploy to apply changes"
echo ""
echo "🚀 Quick deployment after setting secrets:"
echo "   ./scripts/update-deployment.sh $APP_ID"