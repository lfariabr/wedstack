import Message from '../../models/Message';
import { logger } from '../../utils/logger';

export const messageMutations = {
  // Add a new message
  addMessage: async (_: any, { input }: { input: { name: string; message: string } }) => {
    try {
      logger.info(`Adding new message from: ${input.name}`);
      
      // Validate input
      if (!input.name || !input.message) {
        throw new Error('Name and message are required');
      }
      
      if (input.name.length > 100) {
        throw new Error('Name must be less than 100 characters');
      }
      
      if (input.message.length > 1000) {
        throw new Error('Message must be less than 1000 characters');
      }
      
      // Create new message
      const newMessage = new Message({
        name: input.name.trim(),
        message: input.message.trim()
      });
      
      const savedMessage = await newMessage.save();
      
      // Map MongoDB _id to GraphQL id
      const mappedMessage = {
        ...savedMessage.toObject(),
        id: String(savedMessage._id),
      };
      
      logger.info(`Successfully added message with ID: ${String(savedMessage._id)}`);
      return mappedMessage;
    } catch (error) {
      logger.error('Error adding message:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to add message');
    }
  },

  // Delete a message (for moderation)
  deleteMessage: async (_: any, { id }: { id: string }) => {
    try {
      logger.info(`Deleting message with ID: ${id}`);
      
      const deletedMessage = await Message.findByIdAndDelete(id);
      
      if (!deletedMessage) {
        logger.warn(`Message not found for deletion: ${id}`);
        throw new Error('Message not found');
      }
      
      logger.info(`Successfully deleted message: ${id}`);
      return {
        success: true,
        message: 'Message deleted successfully'
      };
    } catch (error) {
      logger.error(`Error deleting message ${id}:`, error);
      throw new Error('Failed to delete message');
    }
  }
};
