FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev deps for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application (ensure vite is available via npx)
RUN npx vite build

# Install serve for production
RUN npm install -g serve

# Remove dev dependencies after build
RUN npm prune --production && npm cache clean --force

# Expose port
EXPOSE 80

# Start the application
CMD ["serve", "-s", "dist", "-l", "80"]