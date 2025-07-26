import { GraphQLError } from 'graphql';
import { ZodError, ZodSchema } from 'zod';
import { logger } from '../utils/logger';

/**
 * Formats a ZodError into a user-friendly error message
 */
export const formatZodError = (error: ZodError): string => {
  return error.errors
    .map((err) => {
      const field = err.path.join('.');
      return `${field}: ${err.message}`;
    })
    .join(', ');
};

/**
 * Middleware to validate input against a Zod schema
 */
export const validateInput = <T>(schema: ZodSchema<T>, inputName: string = 'input') => {
  return async (_: any, args: any, context: any, info: any) => {
    try {
      // Get the input from args
      const input = args[inputName];
      
      if (!input) {
        throw new GraphQLError(`Input '${inputName}' is required`, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      
      // Validate the input
      await schema.parseAsync(input);
      
      // Continue to the resolver
      return true;
    } catch (error) {
      // Log the validation error
      logger.warn(`Validation error in ${info.fieldName}:`, { error });
      
      // Handle ZodError
      if (error instanceof ZodError) {
        throw new GraphQLError(`Validation error: ${formatZodError(error)}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            validationErrors: error.errors,
          },
        });
      }
      
      // Handle other errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unexpected errors
      throw new GraphQLError('An unexpected error occurred during validation', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  };
};