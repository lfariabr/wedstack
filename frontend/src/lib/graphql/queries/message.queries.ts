import { gql } from '@apollo/client';

// Fragment for consistent message data shape
export const MESSAGE_FRAGMENT = gql`
  fragment MessageFields on Message {
    id
    name
    message
    createdAt
  }
`;

// Query to get all messages
export const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      ...MessageFields
    }
  }
  ${MESSAGE_FRAGMENT}
`;

// Query to get a single message by ID
export const GET_MESSAGE = gql`
  query GetMessage($id: ID!) {
    message(id: $id) {
      ...MessageFields
    }
  }
  ${MESSAGE_FRAGMENT}
`;

// Query to get messages with pagination
export const GET_MESSAGES_PAGINATED = gql`
  query GetMessagesPaginated($limit: Int = 10, $offset: Int = 0) {
    messagesPaginated(limit: $limit, offset: $offset) {
      messages {
        ...MessageFields
      }
      total
      hasMore
    }
  }
  ${MESSAGE_FRAGMENT}
`;

// Mutation to add a new message
export const ADD_MESSAGE = gql`
  mutation AddMessage($input: MessageInput!) {
    addMessage(input: $input) {
      ...MessageFields
    }
  }
  ${MESSAGE_FRAGMENT}
`;

// Mutation to delete a message
export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      success
      message
    }
  }
`;