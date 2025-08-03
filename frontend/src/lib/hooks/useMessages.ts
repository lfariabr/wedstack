import { useQuery } from '@apollo/client';
import { GET_MESSAGES, GET_MESSAGE, GET_PUBLISHED_MESSAGES } from '../graphql/queries/message.queries';
import { Message, MessageData, MessagesData, PublishedMessagesData } from '../graphql/types/message.types';

/**
 * Hook for fetching all Messages (including unpublished)
 * Intended for admin use
 */
export const useMessages = () => {
  const { data, loading, error } = useQuery<MessagesData>(GET_MESSAGES);

  return {
    messages: data?.messages || [],
    loading,
    error: error?.message
  };
};

/**
 * Hook for fetching only published messages
 * Intended for public-facing pages
 */
export const usePublishedMessages = () => {
  const { data, loading, error } = useQuery<PublishedMessagesData>(GET_PUBLISHED_MESSAGES);

  return {
    messages: data?.publishedMessages || [],
    loading,
    error: error?.message
  };
};

/**
 * Hook for fetching a single article by ID
 */
export const useMessage = (id: string) => {
  const { data, loading, error } = useQuery<MessageData>(GET_MESSAGE, {
    variables: { id },
    skip: !id
  });
  
  return {
    message: data?.message || null,
    loading,
    error: error?.message,
    notFound: !loading && !error && !data?.message
  };
};
