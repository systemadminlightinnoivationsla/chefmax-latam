FROM node:18-alpine

WORKDIR /app

# Copy the fixed server with totalProducts field
COPY fixed-server.js ./

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "fixed-server.js"]