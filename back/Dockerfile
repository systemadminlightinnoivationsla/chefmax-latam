FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev deps for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application (ensure TypeScript is available via npx)
RUN npx tsc

# Remove dev dependencies after build
RUN npm prune --production && npm cache clean --force

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]