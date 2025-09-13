FROM node:18-alpine

WORKDIR /app

# Copy server file
COPY server.js ./

# Expose port
EXPOSE 3001

# Start the optimized server with totalProducts fix
CMD ["node", "server.js"]