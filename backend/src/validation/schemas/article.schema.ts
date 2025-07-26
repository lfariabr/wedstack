import { z } from 'zod';

// Article input validation
export const articleInputSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(100, 'Slug cannot exceed 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(200, 'Excerpt cannot exceed 200 characters'),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url('Image URL must be a valid URL').optional(),
  published: z.boolean().optional(),
});

// Article update validation
export const articleUpdateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters').optional(),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(100, 'Slug cannot exceed 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').optional(),
  content: z.string().min(50, 'Content must be at least 50 characters').optional(),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(200, 'Excerpt cannot exceed 200 characters').optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url('Image URL must be a valid URL').optional().nullable(),
  published: z.boolean().optional(),
});

// Export types
export type ArticleInput = z.infer<typeof articleInputSchema>;
export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>;