#!/bin/bash

# ChefMax Pre-Deploy Validation Script
# Validates environment and builds before deployment

set -e

echo "🔍 ChefMax Pre-Deploy Validation"
echo "================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track validation status
VALIDATION_PASSED=true

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
    VALIDATION_PASSED=false
}

# 1. Check Prerequisites
echo "🔧 Checking Prerequisites..."
echo "----------------------------"

if command -v doctl &> /dev/null; then
    echo_success "doctl CLI is installed"
else
    echo_error "doctl CLI is not installed"
fi

if doctl auth list &> /dev/null; then
    echo_success "doctl is authenticated"
else
    echo_error "doctl is not authenticated"
fi

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo_success "Node.js is installed ($NODE_VERSION)"
else
    echo_error "Node.js is not installed"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo_success "npm is installed ($NPM_VERSION)"
else
    echo_error "npm is not installed"
fi

echo ""

# 2. Check Backend Dependencies and Build
echo "📦 Validating Backend..."
echo "------------------------"

if [ -f "back/package.json" ]; then
    echo_success "Backend package.json found"
    
    cd back/
    
    # Check if dependencies are installed
    if [ -d "node_modules" ]; then
        echo_success "Backend dependencies are installed"
    else
        echo_warning "Installing backend dependencies..."
        npm install
    fi
    
    # Test TypeScript compilation
    if npm run typecheck > /dev/null 2>&1; then
        echo_success "Backend TypeScript validation passed"
    else
        echo_error "Backend TypeScript validation failed"
    fi
    
    # Test build
    if npm run build > /dev/null 2>&1; then
        echo_success "Backend build successful"
    else
        echo_error "Backend build failed"
    fi
    
    # Check if server starts
    if [ -f "dist/server.js" ]; then
        echo_success "Backend build output exists"
    else
        echo_error "Backend build output missing"
    fi
    
    cd ..
else
    echo_error "Backend package.json not found"
fi

echo ""

# 3. Check Frontend Dependencies and Build
echo "🌐 Validating Frontend..."
echo "-------------------------"

if [ -f "front/package.json" ]; then
    echo_success "Frontend package.json found"
    
    cd front/
    
    # Check if dependencies are installed
    if [ -d "node_modules" ]; then
        echo_success "Frontend dependencies are installed"
    else
        echo_warning "Installing frontend dependencies..."
        npm install
    fi
    
    # Test TypeScript compilation
    if npm run typecheck > /dev/null 2>&1; then
        echo_success "Frontend TypeScript validation passed"
    else
        echo_error "Frontend TypeScript validation failed"
    fi
    
    # Test build
    if npm run build > /dev/null 2>&1; then
        echo_success "Frontend build successful"
    else
        echo_error "Frontend build failed"
    fi
    
    # Check if build output exists
    if [ -d "dist" ]; then
        echo_success "Frontend build output exists"
    else
        echo_error "Frontend build output missing"
    fi
    
    cd ..
else
    echo_error "Frontend package.json not found"
fi

echo ""

# 4. Check Configuration Files
echo "⚙️  Validating Configuration..."
echo "------------------------------"

if [ -f ".do/backend-app.yaml" ]; then
    echo_success "Backend DigitalOcean config found"
else
    echo_error "Backend DigitalOcean config missing"
fi

if [ -f ".do/frontend-app.yaml" ]; then
    echo_success "Frontend DigitalOcean config found"
else
    echo_error "Frontend DigitalOcean config missing"
fi

if [ -f "front/.env.production" ]; then
    echo_success "Frontend production environment config found"
else
    echo_warning "Frontend production environment config missing"
fi

if [ -f "back/.env.example" ]; then
    echo_success "Backend environment example found"
else
    echo_warning "Backend environment example missing"
fi

echo ""

# 5. Check Scripts
echo "📝 Validating Deploy Scripts..."
echo "-------------------------------"

SCRIPTS=("deploy-backend.sh" "deploy-frontend.sh" "deploy-full.sh")
for script in "${SCRIPTS[@]}"; do
    if [ -f "scripts/$script" ] && [ -x "scripts/$script" ]; then
        echo_success "$script is ready"
    else
        echo_error "$script is missing or not executable"
    fi
done

echo ""

# 6. Final Validation
echo "📋 Validation Summary"
echo "===================="

if [ "$VALIDATION_PASSED" = true ]; then
    echo_success "All validations passed! Ready for deployment."
    echo ""
    echo "🚀 To deploy, run:"
    echo "   ./scripts/deploy-backend.sh   (Deploy backend only)"
    echo "   ./scripts/deploy-frontend.sh  (Deploy frontend only)" 
    echo "   ./scripts/deploy-full.sh      (Deploy complete system)"
    echo ""
    exit 0
else
    echo_error "Some validations failed. Please fix the issues above before deploying."
    echo ""
    exit 1
fi