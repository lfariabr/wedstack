import { gql } from '@apollo/client';

// Fragment for consistent article data shape
export const ARTICLE_FRAGMENT = gql`
  fragment ArticleFields on Article {
    id
    title
    content
    imageUrl
    excerpt
    tags
    published
    createdAt
    updatedAt
  }
`;

// Query to get all articles
export const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

// Query to get published articles
export const GET_PUBLISHED_ARTICLES = gql`
  query GetPublishedArticles {
    publishedArticles {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

// Query to get a single article by ID
export const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;
