import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES, GET_MESSAGE, GET_MESSAGES_PAGINATED, ADD_MESSAGE, DELETE_MESSAGE } from '../graphql/queries/message.queries';
import { Message, MessageData, MessagesData, MessageInput, DeleteMessageResponse } from '../graphql/types/message.types';

/**
 * Hook for fetching all messages
 */
// Define the shape of the raw message from the API
interface RawMessagesData {
  messages: Array<{
    id: string;
    name: string;
    message: string;
    createdAt: string;
  }>;
}

export const useMessages = () => {
  const { data, loading, error, refetch } = useQuery<RawMessagesData>(GET_MESSAGES);

  // Transform the API response to match our Message type
  const messages = (data?.messages?.map(msg => ({
    id: msg.id,
    name: msg.name,
    content: msg.message, // Map 'message' from API to 'content' in our type
    createdAt: msg.createdAt
  })) || []) as Message[];

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
// Define the shape of the raw paginated response from the API
interface RawPaginatedMessagesData {
  messagesPaginated: {
    messages: Array<{
      id: string;
      name: string;
      message: string;
      createdAt: string;
    }>;
    total: number;
    hasMore: boolean;
  };
}

export const useMessagesPaginated = (limit: number = 10, offset: number = 0) => {
  const { data, loading, error, fetchMore } = useQuery<RawPaginatedMessagesData>(
    GET_MESSAGES_PAGINATED,
    { variables: { limit, offset } }
  );

  // Transform the API response to match our Message type
  const messages = (data?.messagesPaginated?.messages?.map(msg => ({
    id: msg.id,
    name: msg.name,
    content: msg.message, // Map 'message' from API to 'content' in our type
    createdAt: msg.createdAt
  })) || []) as Message[];

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
// Define the shape of the raw message from the API
interface RawMessage {
  id: string;
  name: string;
  message: string;  // This is the field name from the API
  createdAt: string;
}

// Define the shape of the GraphQL response
interface RawMessageData {
  message: RawMessage;
}

export const useMessage = (id: string) => {
  const { data, loading, error } = useQuery<RawMessageData>(GET_MESSAGE, {
    variables: { id },
    skip: !id
  });
  
  // Transform the API response to match our Message type
  const message = data?.message ? {
    id: data.message.id,
    name: data.message.name,
    content: data.message.message, // Map 'message' from API to 'content' in our type
    createdAt: data.message.createdAt
  } as Message : null;

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
