export const articleTypes = `#graphql
  type Article {
    id: ID!
    title: String!
    slug: String!
    content: String!
    excerpt: String!
    categories: [String!]!
    tags: [String!]!
    imageUrl: String
    published: Boolean!
    publishedAt: String
    createdAt: String!
    updatedAt: String!
  }

  input ArticleInput {
    title: String!
    slug: String!
    content: String!
    excerpt: String!
    categories: [String!]
    tags: [String!]
    imageUrl: String
    published: Boolean
  }

  input ArticleUpdateInput {
    title: String
    slug: String
    content: String
    excerpt: String
    categories: [String!]
    tags: [String!]
    imageUrl: String
    published: Boolean
  }
`;
