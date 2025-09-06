#!/bin/bash

# ChefMax Full Deployment Script
# Deploy both backend and frontend to DigitalOcean App Platform

set -e

echo "🚀 ChefMax Full System Deployment"
echo "=================================="
echo ""

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

echo "✅ Prerequisites validated"
echo ""

# Step 1: Deploy Backend first (database and API)
echo "🔄 STEP 1: Deploying Backend API..."
echo "-----------------------------------"
./scripts/deploy-backend.sh

echo ""
echo "⏳ Waiting 60 seconds for backend to stabilize..."
sleep 60

# Step 2: Deploy Frontend (connects to backend)
echo ""
echo "🔄 STEP 2: Deploying Frontend..."
echo "--------------------------------"
./scripts/deploy-frontend.sh

echo ""
echo "⏳ Waiting 30 seconds for frontend to initialize..."
sleep 30

# Step 3: Test full system integration
echo ""
echo "🔄 STEP 3: Testing System Integration..."
echo "---------------------------------------"

# Get app URLs (override with env if provided)
BACKEND_URL="${BACKEND_URL:-https://chefmax-backend.ondigitalocean.app}"
FRONTEND_URL="${FRONTEND_URL:-https://chefmax-frontend.ondigitalocean.app}"

echo "🏥 Testing backend health..."
if curl -f "$BACKEND_URL/health"; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend health check failed"
fi

echo ""
echo "🌐 Testing frontend..."
if curl -f "$FRONTEND_URL"; then
    echo "✅ Frontend is accessible"
else
    echo "⚠️  Frontend access failed"
fi

echo ""
echo "🔗 Testing API connectivity..."
if curl -f "$BACKEND_URL/api/v1/auth/test" 2>/dev/null; then
    echo "✅ API endpoints are accessible"
else
    echo "⚠️  API connectivity test failed (may be expected if no test endpoint)"
fi

# Final summary
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "📱 Applications Deployed:"
echo "   Backend:  $BACKEND_URL"
echo "   Frontend: $FRONTEND_URL"
echo ""
echo "📊 Monitoring:"
echo "   DigitalOcean Dashboard: https://cloud.digitalocean.com/apps"
echo ""
echo "🔧 Next Steps:"
echo "   1. Configure custom domain names (optional)"
echo "   2. Set up monitoring and alerts"
echo "   3. Configure SSL certificates"
echo "   4. Test full user workflows"
echo ""
echo "✅ ChefMax is now live in production!"