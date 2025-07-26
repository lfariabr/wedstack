// TypeScript interfaces for Article data

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  slug: string;
  published: boolean;
  tags?: string[];
  excerpt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesData {
  articles: Article[];
}

export interface PublishedArticlesData {
  publishedArticles: Article[];
}

export interface ArticleData {
  article: Article;
}

export interface ArticleVars {
  id: string;
}

/**
 * Input type for creating a new article
 * Matches the GraphQL ArticleInput type from the backend
 */
export interface ArticleInput {
  title: string;
  content: string;
  imageUrl: string;
  slug: string; // Required by the backend schema
  excerpt?: string;
  tags?: string[];
}

/**
 * Input type for updating an existing article
 * Matches the GraphQL ArticleUpdateInput type from the backend
 */
export interface ArticleUpdateInput extends ArticleInput {
  // Same fields as ArticleInput, but as a separate type for the GraphQL schema
}

/**
 * Response from article mutations
 */
export interface ArticleMutationResponse {
  article: Article;
}
