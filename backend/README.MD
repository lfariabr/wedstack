# Backend documentation

Menu:
1. Setup
2. Typescript and initial server architecture
3. Backend setup
4. Setting up MongoDB
5. Creating datamodels (projects, articles, etc)
6. Expand graphQL schema/resolvers
7. Implementing authentication with JWT
8. Testing endpoints and auth
9. Implement Redis for Rate Limiting
10. Implementing OpenAI Chatbot
11. Implementing Data Validation and Error Handling
12. Implement Testing backend
13. Dockerize Backend
14. Implement CI/CD

## 1. Setup

1. First we'll create folders
mkdir -p backend shared docs

2. We'll set up the backend Node.js project 
cd backend
npm init -y

3. Then we'll install the required dependencies
npm install express@4.18.2
npm install @apollo/server graphql
npm install jsonwebtoken redis mongoose dotenv cors

4. Development dependencies:
npm install --save-dev typescript ts-node nodemon @types/express @types/node

## 2. Typescript and initial server architecture

1. Initialize Typescript
npx tsc --init

2. Create the initial server architecture
mkdir -p src/models src/resolvers src/schemas src/controllers src/middleware src/utils src/config

3. Create env variables file
touch .env

4. Update the scripts in package.json for development
npm pkg set scripts.start="node dist/index.js" scripts.dev="nodemon --exec ts-node src/index.ts" scripts.build="tsc"

5. Create our main server file
touch src/index.ts

6. And finally, a basic config file
touch src/config/config.ts

## 3. Backend Setup

1. Created environment variables in `.env`
echo "PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_key_change_in_production
REDIS_URL=redis://localhost:6379" > .env

2. Implemented configuration loading in `src/config/config.ts`
backend/src/config/config.ts

3. Created basic GraphQL schema in `src/schemas/typeDefs.ts`
mkdir -p src/schemas
cat > src/schemas/typeDefs.ts << 'EOF'
export const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;
EOF

4. Implemented resolvers in `src/resolvers/index.ts`
mkdir -p src/resolvers
cat > src/resolvers/resolvers.ts << 'EOF'
export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};
EOF

5. Set up the main server in `src/index.ts` with:
- Express application
- Apollo Server integration
- CORS support
- Health check endpoint
- Graceful shutdown handling

6. Install missing dependencies
npm install @apollo/server@^4.0.0

7. To start the development server:
```bash
npm run dev
```

## 4. Setting up MongoDB

1. Create a MongoDB database
mkdir -p src/db
touch src/db/connection.ts

2. Implement MongoDB connection in `src/db/connection.ts`
backend/src/db/connection.ts

3. Update `src/index.ts` to connect to MongoDB
backend/src/index.ts
import { connectDB } from './db/connection';

MongoDB Setup Options:
- Local: Use MongoDB Community Edition installed on your machine
- Cloud: Use MongoDB Atlas for a cloud-hosted database
  - Create an account at mongodb.com
  - Create a new cluster
  - Add your IP to the access list
  - Create a database user
  - Get your connection string and update .env

## 5. Creating datamodels (projects, articles, etc)

1. First, let's create the Project model:
mkdir -p src/models
cat > src/models/Project.ts

2. Create the Article model:
mkdir -p src/models
cat > src/models/Article.ts

3. Create the User model:
mkdir -p src/models
cat > src/models/User.ts + Authentication

4. Install bycrypt, mongoose and bcryptjs
npm install bcryptjs mongoose
npm install --save-dev @types/bcryptjs

## 6. Expand graphQL schema/resolvers

1. Reorganize schema structure
mkdir -p src/schemas/types

2. Create individual type definitions
mkdir -p src/schemas/types

3. Create type definitions for projects
mkdir -p src/schemas/types/projectTypes.ts

4. Create type definitions for articles
mkdir -p src/schemas/types/articleTypes.ts

5. Create type definitions for users
mkdir -p src/schemas/types/userTypes.ts

6. Update typeDefs.ts to import and use the new type definitions

7. Create resolver folders and files for each entity:
- Implement resolvers for projects, articles and users
mkdir -p src/resolvers/projects src/resolvers/articles src/resolvers/users
(or)
mkdir src/resolvers/projects
mkdir src/resolvers/articles
mkdir src/resolvers/users

## 7. Implement authentication with JWT
1. Created user resolvers:
   - User queries (`src/resolvers/users/queries.ts`)
   - User mutations (`src/resolvers/users/mutations.ts`)

2. Implemented authentication middleware (`src/middleware/auth.ts`):
   - JWT token verification
   - User extraction from token
   - Role-based access control

3. Added authentication context to Apollo Server:
   - User information available in resolvers
   - Protected mutations requiring authentication

4. Created auth utilities (`src/utils/authUtils.ts`):
   - Helper functions to check authentication
   - Helper functions to check role permissions

5. Updated project and article mutations to require admin authentication

Authentication flow:
1. User registers with name, email, and password
2. Password is hashed before saving to the database
3. User logs in with email and password
4. Server verifies credentials and returns a JWT token
5. Client includes the token in the Authorization header for authenticated requests
6. Server verifies the token and adds the user to the context
7. Resolvers check the context for authentication and permissions

Testing authentication:
- Register a user: mutation { register(input: { name: "Admin User", email: "luis@luis.com", password: "xxxxxxx" }) { token user { id name email } } }
- Login: mutation { login(input: { email: "test@test.com", password: "test" }) { token user { id name email } } }
- Use the token in the HTTP headers: { "Authorization": "Bearer YOUR_TOKEN_HERE" }


## 8. Testing endpoints and auth
1. Registering an admin User
```
mutation RegisterAdmin {
  register(input: {
    name: "Admin User"
    email: "admin@example.com"
    password: "securePassword123"
  }) {
    token
    user {
      id
      name
      email
      role
      createdAt
    }
  }
}
```

2. Registering a normal user
```
mutation RegisterUser {
  register(input: {
    name: "Regular User"
    email: "user@example.com"
    password: "userPassword123"
  }) {
    token
    user {
      id
      name
      email
      role
      createdAt
    }
  }
}
```

3. Create a script to convert a user to admin
backend/src/scripts/makeAdmin.ts
```
npx ts-node src/scripts/makeAdmin.ts admin@example.com
```

4. Login as admin 
```
query Me {
  me {
    id
    name
    email
    role
    lastLogin
  }
}
```

Then, in Apollo Explorer:
Click on "Headers" at the bottom of the screen
Add a header:
```
{ "Authorization": "Bearer YOUR_TOKEN_HERE" }
```

## 9. Implement Redis and Rate Limiting

1. Install redis
npm install redis
npm install --save-dev @types/redis

2. Create a Redis service
mkdir -p src/services
src/services/redis.ts

3. Create a rate limiter service
src/services/rateLimiter.ts

4. Update the server to connect to Redis
src/index.ts

5. Implement rate limit middleware
src/middleware/rateLimiter.ts

6. Create a test schema for rate limiting
src/schemas/types/rateTestTypes.ts

7. Update the main schema including the rate limit test query
src/schemas/typeDefs.ts

8. Create a test resolver to test the rate limit
src/resolvers/rateTest/queries.ts

9. Update the main resolver to include the rate limit test resolver
src/resolvers/index.ts

10. Test
- Logging in and getting one token:
```
mutation Login {
  login(input: {
    email: "test@test.com", 
    password: "test"
  }) {
    token
    user {
      id
      name
      email
    }
  }
}
```
- Set the auth header in Apollo Explorer:
```
{ "Authorization": "Bearer YOUR_TOKEN_HERE" }
```
- Test the rate limit test query:
```
query TestRateLimit {
  testRateLimit {
    limit
    remaining
    reset
  }
}
```

- You should get a response like this:
```
{
  "data": {
    "testRateLimit": {
      "limit": 2,
      "remaining": 1,
      "reset": 60
    }
  }
}
```

- If you try to test the rate limit test query again, you should get a response like this:
```
{
  "errors": [
    {
      "message": "Rate limit exceeded",
      "extensions": {
        "code": "RATE_LIMIT_EXCEEDED"
      }
    }
  ]
}
```

## 10. Implementing AI Chatbot

1. Install open ai
npm install openai

2. Create a new file in src/services/openai.ts

3. Update config to include openai api key
src/config/config.ts

4. Create ChatMessage model for storing conversations
src/models/ChatMessage.ts

5. Add chatbot types to graphql schema
src/schemas/types/chatbotTypes.ts

6. Update main schema file to include chatbot types
src/schemas/typeDefs.ts

7. Create a resolver for the chatbot
src/resolvers/chatbot/queries.ts
src/resolvers/chatbot/mutations.ts

8. Update the main resolver to include the chatbot resolver
src/resolvers/index.ts

9. Test
- Ask a question:
```
mutation AskQuestion {
  askQuestion(question: "What is the capital of France?") {
    message {
      id
      question
      answer
      modelUsed
      createdAt
    }
    rateLimitInfo {
      limit
      remaining
      resetTime
    }
  }
}
```
- Get chat history:
```
query ChatHistory {
  chatHistory(limit: 10, offset: 0) {
    id
    question
    answer
    modelUsed
    createdAt
  }
}
```

## 11. Implementing Data Validation and Error Handling
- Implement input validation for all GraphQL mutations
- Create standardized error responses
- Add logging middleware for better debugging

1. Installing necessary packages
```bash
npm install zod graphql-middleware graphql-shield winston
npm install --save-dev @types/graphql-middleware @types/graphql-shield
npm install @graphql-tools/schema graphql-middleware
```
zod: Type-safe schema validation
graphql-middleware & graphql-shield: Middleware for GraphQL resolvers
winston: Structured logging

2. Create a validation directory and schema files
```bash
mkdir -p src/validation/schemas
src/validation/schemas/user.schema.ts
src/validation/schemas/article.schema.ts
src/validation/schemas/project.schema.ts
src/validation/schemas/chatbot.schema.ts
```

3. Create middleware and shield files
```bash
src/validation/middleware.ts
src/validation/shield.ts
```

4. Create utils/logger using winston
```bash
src/utils/logger.ts
```

5. Create a src/types for graphql-middleware and graphql-shield
```bash
src/types/graphql-middleware.ts
src/types/graphql-shield.ts
```

6. Update TypeScript config to recognize the types
tsconfig.json

7. Update index.ts to include permissions from shield, logger from logger, fs from fs and path from path
```bash
src/index.ts
```

## 12. Implement Testing backend

1. Let's install Jest and related dependencies
npm install --save-dev jest ts-jest @types/jest supertest @shelf/jest-mongodb
npm install --save-dev @testing-library/react-hooks @apollo/client

2. Create Jest configuration file
```bash
touch jest.config.js

```
3. Configure Jest for TypeScript and MongoDB testing
// jest.config.js
module.exports = {
  preset: '@shelf/jest-mongodb',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  verbose: true,
};
```

4. Create a test directory structure
```bash
mkdir -p src/__tests__/unit
mkdir -p src/__tests__/integration
mkdir -p src/__tests__/helpers
```

5. Create a test database config
```bash
touch src/__tests__/helpers/dbHandler.ts
```

6. Update packa.json script for testing
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

7. Create test server
```bash
touch src/__tests__/helpers/testServer.ts
```

8. Create jest.config.js
```bash
touch jest.config.js
```

9. Create a steup file referenced in jest.config.js
```bash
touch src/__tests__/helpers/setup.ts
```

10. Run tests
npm test - Run all tests
npm run test:watch - Run tests in watch mode during development
npm run test:coverage - Generate detailed coverage reports

```bash
npm run test
```

## 13. Dockerize Backend

1. Create Dockerfile for backend
```bash
touch Dockerfile
```

2. Create docker-compose.yml for backend (development)
```bash
touch docker-compose.yml
```

3. Create docker-compose-prod.yml for backend (production)
```bash
touch docker-compose-prod.yml
```

4. Organize .env.example with all the variables

5. Create scripts for docker-dev.sh and docker-prod.sh
```bash
touch scripts/docker-dev.sh
touch scripts/docker-prod.sh
```

6. Create a Production-Ready .dockerignore File
```bash
touch .dockerignore
```

7. Update permissions for scripts at package.json
"docker:dev": "bash scripts/docker-dev.sh",
"docker:prod": "bash scripts/docker-prod.sh",
"docker:stop": "docker-compose down",
"docker:logs": "docker-compose logs -f",
"docker:clean": "docker system prune -af"

8. Make shell scripts executable
```bash
chmod +x scripts/docker-dev.sh
chmod +x scripts/docker-prod.sh
```

9. Final considerations:
### Docker Setup

Docker allows us to containerize our application for consistent deployment across different environments.

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

#### Development Environment

To run the application in development mode:

```bash
# Using npm script
npm run docker:dev

# Or directly
docker-compose up --build
```

This will:
1. Build the Docker images
2. Start the backend, MongoDB, and Redis containers
3. Mount source code for hot reloading
4. Expose ports for local development

#### Production Environment

For production deployment:

1. Create a `.env.production` file with secure credentials:
```bash
cp .env.example .env.production
# Edit .env.production with your production values
```

2. Run the production deployment:
```bash
# Using npm script
npm run docker:prod

# Or directly
docker-compose -f docker-compose.prod.yml up -d
```

The production setup includes:
- Multi-stage builds for smaller images
- Security enhancements (MongoDB auth, Redis password)
- Proper logging configuration
- Container health checks
- Service scaling options

#### Docker Commands

```bash
# Stop all containers
npm run docker:stop

# View logs
npm run docker:logs

# Clean up Docker system (removes unused images/containers)
npm run docker:clean
```

### Environment Configuration

The application supports different environments through environment variables:

- `.env` - Local development without Docker
- `.env.example` - Template for required variables
- `.env.production` - Production environment (create this manually)

### CI/CD Pipeline

For continuous integration and deployment, consider:

1. GitHub Actions or GitLab CI for automated testing
2. Docker Hub or AWS ECR for image registry
3. Automated deployment to your hosting platform (AWS, DigitalOcean, etc.)

Example GitHub Actions workflow is provided in `.github/workflows/main.yml`.

# Start development environment
npm run docker:dev

# For production (create .env.production first)
npm run docker:prod

# Stop all running containers
docker-compose down

# Start with the updated configuration
docker-compose up --build

# Stop all running containers
docker-compose down

## 14. Implement CI/CD

1. Setup github repo
git init
git add .
git commit -m "Initial commit with Docker and CI/CD setup"
git remote add origin 
git push -u origin main

2. Configure Github Secrets
In your GitHub repository, go to Settings > Secrets and Variables > Actions and add the following secrets:

- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token (create one at https://hub.docker.com/settings/security)
- `DEPLOY_HOST`: Your server's IP address or hostname
- `DEPLOY_USER`: SSH username for your server
- `DEPLOY_KEY`: SSH private key for accessing your server
- `DEPLOY_PATH`: Path to your application on the server (e.g., `/home/user/portfolio-backend`)
- `JWT_SECRET`: Secret key for JWT authentication
- `MONGO_USER`: MongoDB username
- `MONGO_PASSWORD`: MongoDB password
- `REDIS_PASSWORD`: Redis password

3. Our workflow file (`.github/workflows/main.yml`) defines a pipeline with three stages:

1. **Test**: Runs your test suite to ensure code quality
2. **Build**: Builds and pushes a Docker image to Docker Hub
3. **Deploy**: Deploys the application to your production server

The workflow is triggered on push to main/master branches and on pull requests.

4. Deployment Process
- Pulls the latest Docker images
- Creates `.env.production` if it doesn't exist
- Updates environment variables from GitHub secrets
- Starts the application using Docker Compose
- Cleans up unused Docker resources

5. Monitoring Deployments

You can monitor your deployments in the "Actions" tab of your GitHub repository. Each workflow run will show the status of your tests, build, and deployment.

6. Manual Deployment

If you need to deploy manually, you can use:

```bash
# SSH into your server
ssh user@your-server

# Navigate to your application directory
cd /path/to/your/app

# Pull the latest image
docker-compose -f docker-compose.prod.yml pull

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Clean up
docker system prune -af
```

7. Best Practices
- Keep secrets in GitHub Secrets, never in code
- Use semantic versioning for Docker images
- Implement proper monitoring and logging
- Consider setting up staging environments
- Add notifications for successful/failed deployments