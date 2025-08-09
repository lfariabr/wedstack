import { articleTypes } from './types/articleTypes';
import { userTypes } from './types/userTypes';
import { rateTestTypes } from './types/rateTestTypes';
import { messageTypes } from './types/messageTypes';
import { guestTypes } from './types/guestTypes';

export const typeDefs = `#graphql
  ${articleTypes}
  ${userTypes}
  ${rateTestTypes}
  ${messageTypes}
  ${guestTypes}

  type Query {
    # Test query
    hello: String
    
    # Article queries
    articles(limit: Int, offset: Int): [Article!]!
    article(id: ID): Article
    articleBySlug(slug: String!): Article
    publishedArticles(limit: Int, offset: Int): [Article!]!
    articlesByCategory(category: String!, limit: Int, offset: Int): [Article!]!
    articlesByTag(tag: String!, limit: Int, offset: Int): [Article!]!
    
    # User queries
    users: [User!]!
    user(id: ID!): User
    me: User

    # Rate limit test query
    testRateLimit: RateLimitInfo

    # Message queries
    messages: [Message!]!
    message(id: ID!): Message
    messagesPaginated(limit: Int = 10, offset: Int = 0): MessagesPaginated!
    
    # Guest queries
    guests: [Guest!]!
    guest(id: ID!): Guest
  }

  type Mutation {
    # Article mutations
    createArticle(input: ArticleInput!): Article!
    updateArticle(id: ID!, input: ArticleUpdateInput!): Article!
    deleteArticle(id: ID!): Boolean!
    publishArticle(id: ID!): Article!
    unpublishArticle(id: ID!): Article!
    
    # Auth mutations
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: Boolean!
    updateUserRole(id: ID!, role: Role!): User!
    deleteUser(id: ID!): Boolean!

    # Message mutations
    addMessage(input: MessageInput!): Message!
    deleteMessage(id: ID!): DeleteMessageResponse!
  }

  type Subscription {
    articlePublished: Article
    register: AuthPayload
    login: AuthPayload
    logout: Boolean
  }
`;
