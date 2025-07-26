export const userTypes = `#graphql
  enum Role {
    ADMIN
    EDITOR
    USER
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    lastLogin: String
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    me: User
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: Boolean!
    updateUserRole(id: ID!, role: Role!): User!
    deleteUser(id: ID!): Boolean!
  }
`;
