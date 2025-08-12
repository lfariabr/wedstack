#!/bin/bash

# SSL Setup Script for weddingln.com
# This script sets up Let's Encrypt SSL certificates for your wedding website

set -e

echo "🔐 Setting up SSL certificates for weddingln.com..."

# Create necessary directories
echo "📁 Creating certificate directories..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www
mkdir -p ./nginx/conf

# Set proper permissions
chmod -R 755 ./certbot
chmod -R 755 ./nginx

echo "🚀 Starting nginx for certificate validation..."

# Start nginx first (without SSL) for domain validation
docker-compose up -d reverse-proxy

# Wait for nginx to be ready
echo "⏳ Waiting for nginx to start..."
sleep 10

# Request SSL certificate
echo "📜 Requesting SSL certificate from Let's Encrypt..."
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email lfariaus@gmail.com \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d weddingln.com \
    -d www.weddingln.com

# Restart nginx with SSL configuration
echo "🔄 Restarting nginx with SSL configuration..."
docker-compose restart reverse-proxy

# Set up automatic renewal
echo "⏰ Setting up automatic certificate renewal..."
cat > ./renew-ssl.sh << 'EOF'
#!/bin/bash
# Automatic SSL renewal script
docker-compose run --rm certbot renew --quiet
docker-compose restart reverse-proxy
EOF

chmod +x ./renew-ssl.sh

# Add to crontab (run monthly)
echo "📅 Adding automatic renewal to crontab..."
(crontab -l 2>/dev/null; echo "0 3 1 * * /path/to/your/wedstack/renew-ssl.sh") | crontab -

echo "✅ SSL setup complete!"
echo ""
echo "🎉 Your wedding website is now secured with HTTPS!"
echo "🌐 Visit: https://weddingln.com"
echo ""
echo "📝 Next steps:"
echo "1. Update your email in the certbot command (replace your-email@example.com)"
echo "2. Point your domain DNS to this server's IP address"
echo "3. Test the website: https://weddingln.com"
echo ""
echo "🔄 To renew certificates manually: ./renew-ssl.sh"
