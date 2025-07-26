export const rateTestTypes = `#graphql
  type RateLimitInfo {
    limit: Int!
    remaining: Int!
    resetTime: String!
  }

  extend type Query {
    testRateLimit: RateLimitInfo
  }
`;
