import redisClient from './redis';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
}

export class RateLimiter {
    constructor(
      private prefix: string = 'rate-limit:',
      private defaultExpiry: number = 3600 // 1 hour in seconds
) {}

    /**
   * Check if a key is rate limited
   * @param key The unique key to check (e.g., userId or IP)
   * @param limit Maximum number of requests allowed in the time window
   * @param expiry Time window in seconds
   * @returns Result of rate limit check
   */
  async limit(
    key: string,
    limit: number = 1,
    expiry: number = this.defaultExpiry
  ): Promise<RateLimitResult> {
    const redisKey = `${this.prefix}${key}`;
    
    // Get current count
    const count = await redisClient.get(redisKey);
    const currentCount = count ? parseInt(count, 10) : 0;
    
    // Check if limit is reached
    if (currentCount >= limit) {
      // Get time to reset
      const ttl = await redisClient.ttl(redisKey);
      const resetTime = new Date(Date.now() + ttl * 1000);
      
      return {
        success: false,
        limit,
        remaining: 0,
        resetTime,
      };
    }
    
    // Increment count
    await redisClient.incr(redisKey);
    
    // Set expiry if it's a new key
    if (currentCount === 0) {
      await redisClient.expire(redisKey, expiry);
    }
    
    // Get time to reset
    const ttl = await redisClient.ttl(redisKey);
    const resetTime = new Date(Date.now() + ttl * 1000);
    
    return {
      success: true,
      limit,
      remaining: limit - (currentCount + 1),
      resetTime,
    };
  }

  /**
   * Reset rate limit for a key
   * @param key The unique key to reset
   */
  async reset(key: string): Promise<void> {
    const redisKey = `${this.prefix}${key}`;
    await redisClient.del(redisKey);
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter();