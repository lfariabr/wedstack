import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { CREATE_ARTICLE, DELETE_ARTICLE, PUBLISH_ARTICLE, UNPUBLISH_ARTICLE, UPDATE_ARTICLE } from '../graphql/mutations/article.mutations';
import { GET_ARTICLES, GET_PUBLISHED_ARTICLES } from '../graphql/queries/article.queries';
import { Article, ArticleInput, ArticleUpdateInput } from '../graphql/types/article.types';

/**
 * Custom hook for article mutation operations
 * Provides functions for creating, updating, publishing/unpublishing and deleting articles
 */
export const useArticleMutations = () => {
  // Create Article Mutation
  const [createArticleMutation, { loading: createLoading }] = useMutation(CREATE_ARTICLE, {
    refetchQueries: [{ query: GET_ARTICLES }],
    onCompleted: () => {
      toast.success('Article created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create article: ${error.message}`);
    }
  });

  // Update Article Mutation
  const [updateArticleMutation, { loading: updateLoading }] = useMutation(UPDATE_ARTICLE, {
    refetchQueries: [{ query: GET_ARTICLES }, { query: GET_PUBLISHED_ARTICLES }],
    onCompleted: () => {
      toast.success('Article updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update article: ${error.message}`);
    }
  });

  // Publish Article Mutation
  const [publishArticleMutation, { loading: publishLoading }] = useMutation(PUBLISH_ARTICLE, {
    refetchQueries: [{ query: GET_ARTICLES }, { query: GET_PUBLISHED_ARTICLES }],
    onCompleted: () => {
      toast.success('Article published successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to publish article: ${error.message}`);
    }
  });

  // Unpublish Article Mutation
  const [unpublishArticleMutation, { loading: unpublishLoading }] = useMutation(UNPUBLISH_ARTICLE, {
    refetchQueries: [{ query: GET_ARTICLES }, { query: GET_PUBLISHED_ARTICLES }],
    onCompleted: () => {
      toast.success('Article unpublished successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to unpublish article: ${error.message}`);
    }
  });

  // Delete Article Mutation
  const [deleteArticleMutation, { loading: deleteLoading }] = useMutation(DELETE_ARTICLE, {
    refetchQueries: [{ query: GET_ARTICLES }, { query: GET_PUBLISHED_ARTICLES }],
    onCompleted: () => {
      toast.success('Article deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to delete article: ${error.message}`);
    }
  });

  /**
   * Create a new article
   */
  const createArticle = async (input: ArticleInput): Promise<Article | null> => {
    try {
      const { data } = await createArticleMutation({
        variables: { input }
      });
      return data?.createArticle || null;
    } catch (error) {
      console.error('Error creating article:', error);
      return null;
    }
  };

  /**
   * Update an existing article
   */
  const updateArticle = async (id: string, input: ArticleUpdateInput): Promise<Article | null> => {
    try {
      const { data } = await updateArticleMutation({
        variables: { id, input }
      });
      return data?.updateArticle || null;
    } catch (error) {
      console.error('Error updating article:', error);
      return null;
    }
  };

  /**
   * Publish an article
   */
  const publishArticle = async (id: string): Promise<Article | null> => {
    try {
      const { data } = await publishArticleMutation({
        variables: { id }
      });
      return data?.publishArticle || null;
    } catch (error) {
      console.error('Error publishing article:', error);
      return null;
    }
  };

  /**
   * Unpublish an article
   */
  const unpublishArticle = async (id: string): Promise<Article | null> => {
    try {
      const { data } = await unpublishArticleMutation({
        variables: { id }
      });
      return data?.unpublishArticle || null;
    } catch (error) {
      console.error('Error unpublishing article:', error);
      return null;
    }
  };

  /**
   * Delete an article
   */
  const deleteArticle = async (id: string): Promise<boolean> => {
    try {
      const { data } = await deleteArticleMutation({
        variables: { id }
      });
      return data?.deleteArticle || false;
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  };

  return {
    createArticle,
    updateArticle,
    publishArticle,
    unpublishArticle,
    deleteArticle,
    loading: {
      create: createLoading,
      update: updateLoading,
      publish: publishLoading,
      unpublish: unpublishLoading,
      delete: deleteLoading,
      any: createLoading || updateLoading || publishLoading || unpublishLoading || deleteLoading
    }
  };
};
