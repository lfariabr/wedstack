import { rateLimit } from '../../middleware/rateLimiter';

export const rateTestQueries = {
  testRateLimit: async (_: any, __: any, context: any) => {
    // Apply rate limiting - 2 requests per minute for testing
    const rateLimitInfo = await rateLimit('test', 2, 60)(_,__, context);
    return rateLimitInfo;
  },
};
