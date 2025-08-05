import { z } from 'zod';

// Message input validation
export const messageInputSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  message: z.string()
    .min(1, 'Message is required')
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim(),
});

// Export types
export type MessageInput = z.infer<typeof messageInputSchema>;
