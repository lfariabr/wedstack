import { ApolloServer } from '@apollo/server';
import { typeDefs } from '../../schemas/typeDefs';
import { resolvers } from '../../resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { permissions } from '../../validation/shield';
import { applyMiddleware } from 'graphql-middleware';

/**
 * Creates a test Apollo Server instance with the same
 * schema and middleware as the production server.
 * @param {Object} contextValue - Mock context value to use for tests
 * @returns {ApolloServer} Apollo Server instance
 */
export const createTestServer = (contextValue = {}) => {
  // Create schema with permissions middleware
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const schemaWithMiddleware = applyMiddleware(schema, permissions);
  
  return new ApolloServer({
    schema: schemaWithMiddleware,
  });
};

/**
 * Executes a GraphQL query or mutation against a test server
 * @param {string} query - GraphQL query or mutation string
 * @param {Object} variables - Variables for the query
 * @param {Object} contextValue - Mock context value to use
 * @returns {Promise<Object>} Query result
 */
export const executeOperation = async (
  query: string,
  variables = {},
  contextValue = {}
) => {
  const server = createTestServer(contextValue);
  await server.start();
  
  const response = await server.executeOperation({
    query,
    variables,
  }, {
    contextValue
  });
  
  await server.stop();
  return response;
};

// Add a dummy test to avoid Jest's "no tests" error
describe('Test Server', () => {
  it('should define server creation and operation functions', () => {
    expect(typeof createTestServer).toBe('function');
    expect(typeof executeOperation).toBe('function');
  });
});
