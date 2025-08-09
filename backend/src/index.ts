import express from 'express';
import http from 'http';
import cors from 'cors';
import config from './config/config';
import fs from 'fs';
import path from 'path';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { typeDefs } from './schemas/typeDefs';
import { resolvers } from './resolvers';
import { connectDB } from './db/connection';
import { connectRedis, disconnectRedis } from './services/redis';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { logger, requestLogger } from './utils/logger';

console.log(`Starting server in ${config.nodeEnv} mode`);

async function startServer() {
  // Create logs directory if it doesn't exist
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  try {
    // Connect to databases
    await connectDB();
    await connectRedis();
    
    // Create simple schema without middleware
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    
    const app = express();
    const httpServer = http.createServer(app);
    
    // Add request logging
    app.use(requestLogger);
    
    // Create Apollo Server
    const server = new ApolloServer({
      schema,
      introspection: true,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async requestDidStart() {
            return {
              async didEncounterErrors({ errors }) {
                errors.forEach(error => {
                  logger.error('GraphQL Error:', {
                    message: error.message,
                    path: error.path,
                    extensions: error.extensions,
                  });
                });
              },
            };
          },
        },
        ApolloServerPluginLandingPageLocalDefault({ 
          includeCookies: true,
        }),
      ],
    });
    
    await server.start();
    
    // Configure CORS
    const corsOptions = {
      origin: config.nodeEnv === 'production' 
        ? ['http://localhost:3000']
        : 'http://localhost:3000',
      credentials: true
    };
    
    app.use(cors(corsOptions));
    app.use(express.json());
    app.get('/health', (_, res) => {
      res.status(200).send('OK');
    });
    
    app.use('/graphql', 
      express.json(),
      cors(corsOptions),
      // @ts-ignore - Ignore Express type conflicts
      expressMiddleware(server, {
        context: async () => {
          // Simple context without auth
          return {};
        },
      })
    );
    
    await new Promise<void>(resolve => 
      httpServer.listen({ port: config.port }, resolve)
    );
    
    logger.info(`🚀 Server ready at http://localhost:${config.port}/graphql`);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await disconnectRedis();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await disconnectRedis();
  process.exit(0);
});