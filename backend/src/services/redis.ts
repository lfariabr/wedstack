import { createClient } from 'redis';
import config from '../config/config';

const redisClient = createClient({
    url: config.redisUrl
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

// Connect to Redis
export const connectRedis = async (): Promise<void> => {
    try {
      await redisClient.connect();
    } catch (error) {
      console.error('Redis connection error:', error);
    }
  };
  
  // Disconnect from Redis
  export const disconnectRedis = async (): Promise<void> => {
    try {
      await redisClient.disconnect();
      console.log('Disconnected from Redis');
    } catch (error) {
      console.error('Redis disconnection error:', error);
    }
  };
  
// Get Redis client instance
export const getRedisClient = () => {
  return redisClient;
};
  
export default redisClient;