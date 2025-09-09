import { messageTypes } from './types/messageTypes';
import { guestTypes } from './types/guestTypes';
import { photoTypes } from './types/photoTypes';

export const typeDefs = `#graphql
  ${messageTypes}
  ${guestTypes}
  ${photoTypes}

  type Query {
    # Test query
    hello: String

    # Message queries
    messages: [Message!]!
    message(id: ID!): Message
    messagesPaginated(limit: Int = 10, offset: Int = 0): MessagesPaginated!
    
    # Guest queries
    guests: [Guest!]!
    guest(id: ID!): Guest
    guestsByName(name: String!): [Guest!]!
    guestsByPhone(phone: String!): [Guest!]!
    guestsByGroup(group: String!): [Guest!]!
    guestsByStatus(status: String!): [Guest!]!
    guestsByPlusOnes(plusOnes: Int!): [Guest!]!

    # Photo queries
    photos: [Photo!]!
    photo(id: ID!): Photo
    photosPaginated(limit: Int = 10, offset: Int = 0): PhotosPaginated!
  }

  type Mutation {
    # Message mutations
    addMessage(input: MessageInput!): Message!
    deleteMessage(id: ID!): DeleteMessageResponse!

    # Guest mutations
    updateGuestStatus(id: ID!, status: String!): Guest!
    updateGuestGroup(id: ID!, group: String!): Guest!
    updateGuestPlusOnes(id: ID!, plusOnes: Int!): Guest!

    # Photo mutations
    getPhotoUploadUrl(input: PhotoInput!): SignedUrlResponse!
    addPhoto(input: PhotoInput!): Photo!
  }
`;
