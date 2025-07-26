import { GraphQLError } from 'graphql';
import { checkAuth } from '../../utils/authUtils';
import ChatMessage from '../../models/ChatMessage';
import mongoose from 'mongoose';

export const chatbotQueries = {
  chatHistory: async (_: any, { limit, offset }: { limit: number, offset: number }, context: any) => {
    // Check authentication
    const user = checkAuth(context);
    
    // Get chat history for the user
    return await ChatMessage.find({ 
      userId: new mongoose.Types.ObjectId(user.id) 
    })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
  },
};