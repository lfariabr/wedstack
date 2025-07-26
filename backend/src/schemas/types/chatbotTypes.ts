export const chatbotTypes = `#graphql
  type ChatMessage {
    id: ID!
    question: String!
    answer: String!
    modelUsed: String!
    createdAt: String!
  }

  type ChatResponse {
    message: ChatMessage!
    rateLimitInfo: RateLimitInfo!
  }

  extend type Query {
    chatHistory(limit: Int = 10, offset: Int = 0): [ChatMessage!]!
  }

  extend type Mutation {
    askQuestion(question: String!): ChatResponse!
  }
`;