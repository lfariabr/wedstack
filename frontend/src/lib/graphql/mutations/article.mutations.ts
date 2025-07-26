import { gql } from '@apollo/client';
import { ARTICLE_FRAGMENT } from '../queries/article.queries';

export const CREATE_ARTICLE = gql`
  mutation CreateArticle($input: ArticleInput!) {
    createArticle(input: $input) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($id: ID!, $input: ArticleUpdateInput!) {
    updateArticle(id: $id, input: $input) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const PUBLISH_ARTICLE = gql`
  mutation PublishArticle($id: ID!) {
    publishArticle(id: $id) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const UNPUBLISH_ARTICLE = gql`
  mutation UnpublishArticle($id: ID!) {
    unpublishArticle(id: $id) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id)
  }
`;
