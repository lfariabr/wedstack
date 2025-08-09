import { gql } from '@apollo/client';

export const UPDATE_GUEST_STATUS = gql`
  mutation UpdateGuestStatus($id: ID!, $status: String!) {
    updateGuestStatus(id: $id, status: $status) {
      id
      name
      phone
      group
      status
      plusOnes
    }
  }
`;

export const UPDATE_GUEST_GROUP = gql`
  mutation UpdateGuestGroup($id: ID!, $group: String!) {
    updateGuestGroup(id: $id, group: $group) {
      id
      name
      phone
      group
      status
      plusOnes
    }
  }
`;

export const UPDATE_GUEST_PLUS_ONES = gql`
  mutation UpdateGuestPlusOnes($id: ID!, $plusOnes: Int!) {
    updateGuestPlusOnes(id: $id, plusOnes: $plusOnes) {
      id
      name
      phone
      group
      status
      plusOnes
    }
  }
`;
