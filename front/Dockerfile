FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies first
RUN npm install

# Copy source code
COPY . .

# Build using direct node_modules path
RUN ./node_modules/.bin/vite build

# Install serve globally for serving static files
RUN npm install -g serve

# Remove dev dependencies after successful build
RUN npm prune --production

# Expose port
EXPOSE 80

# Start the application serving the dist folder
CMD ["serve", "-s", "dist", "-l", "80"]