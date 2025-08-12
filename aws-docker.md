1. Install CLIs
# macOS
brew install awscli
brew install awsebcli
# verify
aws --version
eb --version

2. 	Create IAM access keys (temporary is fine for learning), then:
aws configure
# paste Access Key, Secret, pick region (e.g. ap-southeast-2), default json
name of repo: wedstack

3. Tweak docker-compose.yml on root to match conditions
domain: weddingln.com
expires: 12 Aug 2026

4. create a single‑instance env on t3.small
eb create wedstack-env --single --instance_type t3.small

5. set it as default for this branch
eb use wedstack-env

6. (once created) add your env vars
eb setenv MONGODB_URI=mongodb://db:27017/wedstack \
          REDIS_URL=redis://cache:6379/0 \
          JWT_SECRET=$(openssl rand -hex 32) \
          RATE_LIMIT_WINDOW=60000 \
          RATE_LIMIT_MAX_REQUESTS=10

7. connect to db
eb ssh

8. Once connected, go to the staging directory
cd /var/app/staging

# Let's build and start everything now
sudo docker compose down
sudo docker system prune -f
sudo docker compose build --no-cache
sudo docker compose up -d

# Check the status
sudo docker compose ps

- down & up
sudo docker compose down --remove-orphans
sudo docker container prune -f
sudo docker compose up -d

Run these commands on your EC2 instance:
  # 1. Create .env file with environment variables
  sudo tee .env << 'EOF'
  MONGODB_URI=REDACTEDwedstack-db.lrcbdrm.mongodb.net/?retryWrites=true&w=majority&appName=wedstack-db
  REDIS_URL=redis://cache:6379/0
  JWT_SECRET=temp-secret-will-update-later
  RATE_LIMIT_WINDOW=60000
  RATE_LIMIT_MAX_REQUESTS=10
  EOF

  # 2. Restart Docker services with sudo
  sudo docker compose down --remove-orphans
  sudo docker compose up -d

  # 3. Check status
  sudo docker compose ps
  sudo docker compose logs