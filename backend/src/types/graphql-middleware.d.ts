declare module 'graphql-middleware' {
    import { GraphQLSchema } from 'graphql';
    
    export function applyMiddleware(
      schema: GraphQLSchema,
      ...middlewares: any[]
    ): GraphQLSchema;
  }