# Wedstack Project

## Project Overview
A wedding invitation web application built with Next.js, TypeScript, Node.js, GraphQL, and AWS — with real-time content, gift handling, and presence confirmation.

## Key Features
- 💌 Leave a message to the couple (stored in database)
- 💳 Stripe integration to receive gifts from invitees
- ✅ Confirm presence with a friendly widget
- 📅 Page with all wedding details
- 🍽️ Menu preview with design-matched layout
- 🎨 Dynamic backgrounds per section (SVG patterns)
- 🌗 Light/dark mode with improved readability
- 🕊️ Soft animated layout & frufru circular text

## Tech Stack
### Frontend
- Next.js 14+ with TypeScript
- Apollo Client for GraphQL integration
- TailwindCSS for styling
- shadcn/ui for components
- NextAuth.js for authentication
- Stripe for payments

### Backend
- Node.js with Express
- Apollo Server for GraphQL
- Relay for efficient data fetching

## Project Structure
```
wedstack/
├── _docs/          # Documentation
├── frontend/       # Next.js with TypeScript
├── backend/        # Node.js, Apollo, GraphQL API
├── certbot/        # Certbot configuration
├── nginx/          # Nginx configuration
└── scripts/        # Project scripts
```

## Version History  
| Version | Feature Highlights |
|---------|-------------------|
| **1.x** | Project setup + MongoDB integration |
| **2.x** | Guests module + Dockerization |
| **3.x** | Language switcher PT/EN + AWS deployment trials |
| **4.x** | Stripe integration + DigitalOcean Go Live |

👉 [Full changelog here](https://github.com/lfariabr/wedstack/blob/master/_docs/notesWedstack.md).

## Getting Started
1. Clone this repository
2. Set up environment variables
3. Install dependencies
   - Frontend: `cd frontend && npm install --legacy-peer-deps`
   - Backend: `cd backend && npm install --legacy-peer-deps`
4. Run development servers
   - Frontend: `cd frontend && npm run dev`
   - Backend: `cd backend && npm run dev`