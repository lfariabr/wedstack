import mongoose, { Document, Schema } from 'mongoose';

export interface iMessage extends Document {
  name: string;
  message: string;
  // reactions: string[]; #TODO
  createdAt: Date;
  }
const MessageSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    // reactions: { type: Array, required: false, default: [] }, #TODO
  },
  { timestamps: true }
);

// Middleware to set createdAt when a message is created
MessageSchema.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

export default mongoose.model<iMessage>('Message', MessageSchema);
