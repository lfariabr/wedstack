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

// Query to get published messages
export const GET_PUBLISHED_MESSAGES = gql`
  query GetPublishedMessages {
    publishedMessages {
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