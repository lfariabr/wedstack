export const messageTypes = `#graphql
  type Message {
    id: ID!
    name: String!
    message: String!
    createdAt: String!
    updatedAt: String!
  }

  input MessageInput {
    name: String!
    message: String!
  }

  type MessagesPaginated {
    messages: [Message!]!
    total: Int!
    hasMore: Boolean!
  }

  type DeleteMessageResponse {
    success: Boolean!
    message: String!
  }
`;
