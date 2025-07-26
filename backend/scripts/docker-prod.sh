#!/bin/bash

# Check if environment file exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file is missing!"
    echo "Please create this file with your production credentials."
    exit 1
fi

# Stop any running containers
echo "🛑 Stopping any existing containers..."
docker-compose -f docker-compose.prod.yml down

# Pull latest images
echo "⬇️ Pulling latest images..."
docker-compose -f docker-compose.prod.yml pull

# Build and start the containers in detached mode
echo "🚀 Starting production environment..."
docker-compose -f docker-compose.prod.yml up --build -d

# Show status
echo "✅ Production deployment complete!"
docker-compose -f docker-compose.prod.yml ps
