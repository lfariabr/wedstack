import Message from '../../models/Message';
import { logger } from '../../utils/logger';

export const messageQueries = {
  // Get all messages
  messages: async () => {
    try {
      logger.info('Fetching all messages from database');
      const messages = await Message.find({})
        .sort({ createdAt: -1 }) // Most recent first
        .lean(); // Return plain objects for better performance
      
      // Map MongoDB _id to GraphQL id
      const mappedMessages = messages.map(msg => ({
        ...msg,
        id: msg._id.toString(),
      }));
      
      logger.info(`Successfully fetched ${messages.length} messages`);
      return mappedMessages;
    } catch (error) {
      logger.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  },

  // Get message by ID
  message: async (_: any, { id }: { id: string }) => {
    try {
      logger.info(`Fetching message with ID: ${id}`);
      const message = await Message.findById(id).lean();
      
      if (!message) {
        logger.warn(`Message not found with ID: ${id}`);
        throw new Error('Message not found');
      }
      
      // Map MongoDB _id to GraphQL id
      const mappedMessage = {
        ...message,
        id: message._id.toString(),
      };
      
      logger.info(`Successfully fetched message: ${id}`);
      return mappedMessage;
    } catch (error) {
      logger.error(`Error fetching message ${id}:`, error);
      throw new Error('Failed to fetch message');
    }
  },

  // Get messages with pagination
  messagesPaginated: async (_: any, { limit = 10, offset = 0 }: { limit?: number; offset?: number }) => {
    try {
      logger.info(`Fetching messages with pagination - limit: ${limit}, offset: ${offset}`);
      
      const messages = await Message.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .lean();
      
      // Map MongoDB _id to GraphQL id
      const mappedMessages = messages.map(msg => ({
        ...msg,
        id: msg._id.toString(),
      }));
      
      const total = await Message.countDocuments({});
      
      logger.info(`Successfully fetched ${messages.length} messages (${total} total)`);
      
      return {
        messages: mappedMessages,
        total,
        hasMore: offset + limit < total
      };
    } catch (error) {
      logger.error('Error fetching paginated messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }
};
