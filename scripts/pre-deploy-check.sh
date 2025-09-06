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

echo "📦 Validating Backend Spec..."
echo "----------------------------"

if [ -f "backend-update.yaml" ]; then
    echo_success "Found backend-update.yaml (spec de DO)"
else
    echo_warning "backend-update.yaml missing (usa FRONTEND/BE para desplegar desde sus repos)"
fi

echo ""

echo "🌐 Validating Frontend Spec..."
echo "-----------------------------"

if [ -f ".do/frontend-app.yaml" ]; then
    echo_success "Found .do/frontend-app.yaml"
else
    echo_warning ".do/frontend-app.yaml missing (redeploy vía App ID)"
fi

echo ""

echo "⚙️  Validating Configuration..."
echo "------------------------------"

if [ -f "backend-update.yaml" ]; then
    echo_success "Backend DO spec present (backend-update.yaml)"
else
    echo_warning "No backend DO spec in this repo"
fi

if [ -f ".do/frontend-app.yaml" ]; then
    echo_success "Frontend DO spec present (.do/frontend-app.yaml)"
else
    echo_warning "No frontend DO spec in this repo"
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