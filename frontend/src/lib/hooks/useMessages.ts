import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES, GET_MESSAGE, GET_MESSAGES_PAGINATED, ADD_MESSAGE, DELETE_MESSAGE } from '../graphql/queries/message.queries';
import { Message, MessageData, MessagesData, MessageInput, DeleteMessageResponse } from '../graphql/types/message.types';

/**
 * Hook for fetching all messages
 */
export const useMessages = () => {
  const { data, loading, error, refetch } = useQuery<MessagesData>(GET_MESSAGES);

  // Transform backend 'message' field to frontend 'content' field
  const messages = data?.messages?.map(msg => ({
    ...msg,
    content: msg.message
  })) || [];

  return {
    messages,
    loading,
    error: error?.message,
    refetch
  };
};

/**
 * Hook for fetching messages with pagination
 */
export const useMessagesPaginated = (limit: number = 10, offset: number = 0) => {
  const { data, loading, error, fetchMore } = useQuery(GET_MESSAGES_PAGINATED, {
    variables: { limit, offset }
  });

  const messages = data?.messagesPaginated?.messages?.map((msg: any) => ({
    ...msg,
    content: msg.message
  })) || [];

  return {
    messages,
    total: data?.messagesPaginated?.total || 0,
    hasMore: data?.messagesPaginated?.hasMore || false,
    loading,
    error: error?.message,
    fetchMore
  };
};

/**
 * Hook for fetching a single message by ID
 */
export const useMessage = (id: string) => {
  const { data, loading, error } = useQuery<MessageData>(GET_MESSAGE, {
    variables: { id },
    skip: !id
  });
  
  const message = data?.message ? {
    ...data.message,
    content: data.message.message
  } : null;

  return {
    message,
    loading,
    error: error?.message,
    notFound: !loading && !error && !data?.message
  };
};

/**
 * Hook for adding a new message
 */
export const useAddMessage = () => {
  const [addMessageMutation, { loading, error }] = useMutation(ADD_MESSAGE, {
    refetchQueries: [{ query: GET_MESSAGES }],
    awaitRefetchQueries: true
  });

  const addMessage = async (input: MessageInput) => {
    try {
      const result = await addMessageMutation({
        variables: { input }
      });
      return result.data?.addMessage;
    } catch (err) {
      throw err;
    }
  };

  return {
    addMessage,
    loading,
    error: error?.message
  };
};

/**
 * Hook for deleting a message
 */
export const useDeleteMessage = () => {
  const [deleteMessageMutation, { loading, error }] = useMutation(DELETE_MESSAGE, {
    refetchQueries: [{ query: GET_MESSAGES }],
    awaitRefetchQueries: true
  });

  const deleteMessage = async (id: string): Promise<DeleteMessageResponse> => {
    try {
      const result = await deleteMessageMutation({
        variables: { id }
      });
      return result.data?.deleteMessage;
    } catch (err) {
      throw err;
    }
  };

  return {
    deleteMessage,
    loading,
    error: error?.message
  };
};
