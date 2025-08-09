import { gql } from '@apollo/client';

export const GET_GUESTS = gql`
  query GetGuests {
    guests {
      id
      name
      phone
      group
      status
      plusOnes
    }
  }
`;

export const GET_GUEST = gql`
  query GetGuest($id: ID!) {
    guest(id: $id) {
      id
      name
      phone
      group
      status
      plusOnes
    }
  }
`;

export const GET_GUESTS_BY_NAME = gql`
  query GetGuestsByName($name: String!) {
    guestsByName(name: $name) {
      id
      name
      phone
      group
      status
      plusOnes
    }
  }
`;

export const GET_GUESTS_BY_PHONE = gql`
  query GetGuestsByPhone($phone: String!) {
    guestsByPhone(phone: $phone) {
      id
      name
      phone
      group
      status
      plusOnes
    }
  }
`;

export const GET_GUESTS_BY_GROUP = gql`
  query GetGuestsByGroup($group: String!) {
    guestsByGroup(group: $group) {
      id
      name
      phone
      group
      status
      plusOnes
    }
  }
`;

export const GET_GUESTS_BY_STATUS = gql`
  query GetGuestsByStatus($status: String!) {
    guestsByStatus(status: $status) {
      id
      name
      phone
      group
      status
      plusOnes
    }
  }
`;

export const GET_GUESTS_BY_PLUS_ONES = gql`
  query GetGuestsByPlusOnes($plusOnes: Int!) {
    guestsByPlusOnes(plusOnes: $plusOnes) {
      id
      name
      phone
      group
      status
      plusOnes
    }
  }
`;

export const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`;
