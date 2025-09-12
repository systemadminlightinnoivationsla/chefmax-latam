FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies first
RUN npm install

# Copy source code
COPY . .

# Build using direct node_modules path
RUN ./node_modules/.bin/tsc

# Remove dev dependencies after successful build
RUN npm prune --production

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/server.js"]