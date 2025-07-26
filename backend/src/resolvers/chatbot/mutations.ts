import { GraphQLError } from 'graphql';
import { checkAuth } from '../../utils/authUtils';
import { rateLimit } from '../../middleware/rateLimiter';
import ChatMessage from '../../models/ChatMessage';
import { chatWithAI } from '../../services/openai';
import mongoose from 'mongoose';
import config from '../../config/config';

export const chatbotMutations = {
  askQuestion: async (_: any, { question }: { question: string }, context: any) => {
    // Check authentication
    const user = checkAuth(context);
    
    // Enforce rate limiting - 1 question per hour by default
    const rateLimitInfo = await rateLimit(
      'chatbot', 
      config.rateLimitMaxRequests, 
      config.rateLimitWindow
    )(_, {}, context);
    
    try {
      // Get answer from AI
      const answer = await chatWithAI(question);
      
      // Save the chat message
      const chatMessage = new ChatMessage({
        userId: new mongoose.Types.ObjectId(user.id),
        question,
        answer,
        modelUsed: 'gpt-3.5-turbo',
      });
      
      await chatMessage.save();
      
      return {
        message: chatMessage,
        rateLimitInfo,
      };
    } catch (error: any) {
      console.error('Chatbot error:', error.message);
      throw new GraphQLError('Failed to get response from AI service', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  },
};