FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev deps for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies after build (keep vite for serve if needed)
RUN npm ci --only=production && npm cache clean --force

# Install serve for production
RUN npm install -g serve

# Expose port
EXPOSE 80

# Start the application
CMD ["serve", "-s", "dist", "-l", "80"]