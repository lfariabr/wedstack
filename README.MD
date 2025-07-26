# Wedstack Project

## Project Overview
A modern portfolio application built with Next.js, TypeScript, Node.js, GraphQL, and AWS.

## Key Features
- Leave a message to the couple saving on database
- Stripe integration to receive gifts from invitees
- Confirm presence for seamless integration
- Page with details for the date

(remove)
- Portfolio showcase with project highlights
- Articles section with categorization
- Secure login area with JWT authentication
- AI-powered chatbot (rate-limited to 1 question per hour per user)
- GraphQL API for portfolio and article data

## Tech Stack
### Frontend
- Next.js 14+ with TypeScript
- Apollo Client for GraphQL integration
- TailwindCSS for styling
- shadcn/ui for components
- NextAuth.js for authentication

### Backend
- Node.js with Express
- Apollo Server for GraphQL
- Relay for efficient data fetching
- Redis for caching and rate limiting
- AWS RDS/DynamoDB for data storage
- JWT for secure authentication

## Project Structure
```
wedstack/
├── frontend/          # Next.js with TypeScript
├── backend/           # Node.js, Apollo, GraphQL API
├── shared/            # Shared types and utilities
└── docs/              # Project documentation
```

## Getting Started
1. Clone this repository
2. Set up environment variables
3. Install dependencies
   - Frontend: `cd frontend && npm install --legacy-peer-deps`
   - Backend: `cd backend && npm install --legacy-peer-deps`
4. Run development servers
   - Frontend: `cd frontend && npm run dev`
   - Backend: `cd backend && npm run dev`

## Development Roadmap
1. Project setup and configuration
2. Backend API development
3. Frontend pages and components
4. Authentication and user management
5. AI chatbot integration
6. Testing and deployment