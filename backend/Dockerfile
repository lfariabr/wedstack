# Use Node.js 18 as the base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies - use regular npm install since package-lock might be out of sync
RUN npm install

# Copy TypeScript configurations and source code
COPY tsconfig*.json ./
COPY src ./src

# Build the TypeScript code with production config
RUN npm run build:prod

# Create production image
FROM node:18-alpine AS production

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies - using regular npm install for compatibility
RUN npm install --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 4000

# Run the application
CMD ["node", "dist/index.js"]
