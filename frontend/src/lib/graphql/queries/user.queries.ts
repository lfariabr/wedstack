import { gql } from '@apollo/client';

// Fragment for consistent user data shape
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    name
    email
    role
    createdAt
    updatedAt
  }
`;

// Query to get all users
export const GET_USERS = gql`
  query GetUsers {
    users {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

// Query to get a single user by ID
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

// Query to get the current logged-in user
export const GET_ME = gql`
  query GetMe {
    me {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;
