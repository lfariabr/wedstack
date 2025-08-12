#!/bin/bash

# SSL Setup Script for Wedstack AWS Deployment
# This script sets up Let's Encrypt SSL certificates for weddingln.com

set -e

echo "🔐 Setting up SSL certificates for weddingln.com..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Variables
DOMAIN="weddingln.com"
EMAIL="your-email@domain.com"  # Replace with your email
STAGING_DIR="/var/app/staging"

echo "📍 Working directory: $STAGING_DIR"
cd $STAGING_DIR

# Step 1: Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Step 2: Start nginx without SSL first (for Let's Encrypt challenge)
echo "🌐 Starting nginx for Let's Encrypt challenge..."
docker compose up -d gateway

# Wait for nginx to be ready
sleep 10

# Step 3: Get SSL certificates
echo "🔑 Requesting SSL certificates from Let's Encrypt..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Step 4: Restart all services with SSL
echo "🔄 Restarting all services with SSL..."
docker compose down
docker compose up -d

# Step 5: Set up certificate renewal
echo "⏰ Setting up automatic certificate renewal..."
cat > /etc/cron.d/certbot-renew << EOF
# Renew Let's Encrypt certificates twice daily
0 12 * * * root cd $STAGING_DIR && docker compose run --rm certbot renew --quiet && docker compose exec gateway nginx -s reload
EOF

# Step 6: Test SSL
echo "🧪 Testing SSL configuration..."
sleep 15
if curl -f -s https://$DOMAIN/health > /dev/null; then
    echo "✅ SSL setup successful! Your site is now available at https://$DOMAIN"
else
    echo "⚠️  SSL setup completed but health check failed. Please check the logs:"
    echo "   docker compose logs gateway"
fi

echo "🎉 SSL setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update your DNS to point $DOMAIN to this server's IP"
echo "2. Test your website at https://$DOMAIN"
echo "3. Certificates will auto-renew via cron job"
echo ""
echo "🔍 Useful commands:"
echo "   docker compose logs gateway    # Check nginx logs"
echo "   docker compose logs certbot    # Check certificate logs"
echo "   docker compose ps              # Check service status"
