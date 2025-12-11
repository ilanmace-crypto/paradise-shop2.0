FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY database/ ../database/

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:10000/api/health || exit 1

# Start the app
CMD ["npm", "start"]
