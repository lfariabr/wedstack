import { gql } from '@apollo/client';
import { MESSAGE_FRAGMENT } from '../queries/message.queries';

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($input: MessageInput!) {
    createMessage(input: $input) {
      ...MessageFields
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const UPDATE_MESSAGE = gql`
  mutation UpdateMessage($id: ID!, $input: MessageUpdateInput!) {
    updateMessage(id: $id, input: $input) {
      ...MessageFields
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const PUBLISH_MESSAGE = gql`
  mutation PublishMessage($id: ID!) {
    publishMessage(id: $id) {
      ...MessageFields
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const UNPUBLISH_MESSAGE = gql`
  mutation UnpublishMessage($id: ID!) {
    unpublishMessage(id: $id) {
      ...MessageFields
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: ID!) {
    deleteMessage(id: $id)
  }
`;
