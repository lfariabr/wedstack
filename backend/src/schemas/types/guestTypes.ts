export const guestTypes = `#graphql
  type Guest {
    id: ID!
    name: String!
    phone: String!
    group: String!
    status: String!
    plusOnes: Int!
  }

  input GuestInput {
    name: String!
    phone: String!
    group: String!
    status: String!
    plusOnes: Int!
  }
`;