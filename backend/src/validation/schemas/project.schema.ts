import { z } from 'zod';

// Project input validation
export const projectInputSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  imageUrl: z.string().url('Image URL must be a valid URL'),
  githubUrl: z.string().url('GitHub URL must be a valid URL').optional(),
  liveUrl: z.string().url('Live URL must be a valid URL').optional(),
  featured: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
});

// Project update validation
export const projectUpdateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  technologies: z.array(z.string()).min(1, 'At least one technology is required').optional(),
  imageUrl: z.string().url('Image URL must be a valid URL').optional(),
  githubUrl: z.string().url('GitHub URL must be a valid URL').optional().nullable(),
  liveUrl: z.string().url('Live URL must be a valid URL').optional().nullable(),
  featured: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
});

// Export types
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;