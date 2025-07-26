import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../queries/user.queries';

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: ID!, $role: Role!) {
    updateUserRole(id: $id, role: $role) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
