import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  userId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  modelUsed: string;
  createdAt: Date;
}

const ChatMessageSchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    question: { 
      type: String, 
      required: true 
    },
    answer: { 
      type: String, 
      required: true 
    },
    modelUsed: { 
      type: String, 
      required: true,
      default: 'gpt-3.5-turbo' 
    },
  },
  { timestamps: true }
);

// Index for efficient querying by user
ChatMessageSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);