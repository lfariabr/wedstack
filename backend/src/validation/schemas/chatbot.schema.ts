import { z } from 'zod';

/**
 * Validation schema for chatbot questions
 * Validates that questions are between 2-500 characters
 */
export const chatbotInputSchema = z.string()
  .min(2, 'Question must be at least 2 characters')
  .max(500, 'Question cannot exceed 500 characters');

// Export types for TypeScript
export type ChatbotInput = z.infer<typeof chatbotInputSchema>;
