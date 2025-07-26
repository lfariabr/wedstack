#!/bin/bash
set -e

# Stop any running containers
echo "🛑 Stopping any existing containers..."
docker-compose down

echo "🚀 Starting development environment..."

# Create a temporary .dockerignore that explicitly excludes test files for the build
cat > .dockerignore.tmp << EOL
# Node.js
node_modules
npm-debug.log

# Version control
.git
.gitignore

# Test files - explicitly exclude these for the build
src/__tests__
jest.config.js
**/*.test.ts
**/*.spec.ts
coverage/

# Environment files (we'll inject these)
.env.production
EOL

# Use the temporary .dockerignore for the build
mv .dockerignore.tmp .dockerignore

# Build and start the containers in detached mode
docker-compose up --build -d

# Restore the original .dockerignore when the containers are stopped
trap "mv .dockerignore.bak .dockerignore 2>/dev/null || true" EXIT

echo "📋 Showing logs (press Ctrl+C to exit logs, containers will keep running)..."
docker-compose logs -f
