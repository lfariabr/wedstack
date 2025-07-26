import { GraphQLError } from 'graphql';
import { rateLimiter, RateLimitResult } from '../services/rateLimiter';

/**
 * Rate limit middleware for GraphQL resolvers
 * @param key Key prefix for rate limiting
 * @param limit Maximum number of requests allowed in the time window
 * @param expiry Time window in seconds (default: 1 hour)
 */
export const rateLimit = (key: string, limit: number = 1, expiry: number = 3600) => {
  return async (_: any, __: any, context: any) => {
    
    // Make sure user is authenticated
    if (!context.user) {
      throw new GraphQLError('Authentication required', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }
    
    // Use user ID as the rate limit key
    const userId = context.user.id;
    const limitKey = `${key}:${userId}`;
    
    // Check rate limit
    const result: RateLimitResult = await rateLimiter.limit(limitKey, limit, expiry);
    
    if (!result.success) {
      const resetTimeString = result.resetTime.toISOString();
      
      throw new GraphQLError('Rate limit exceeded', {
        extensions: {
          code: 'RATE_LIMITED',
          limit,
          remaining: result.remaining,
          resetTime: resetTimeString,
        },
      });
    }
    
    // Return rate limit information
    return {
      limit,
      remaining: result.remaining,
      resetTime: result.resetTime.toISOString(),
    };
  };
};