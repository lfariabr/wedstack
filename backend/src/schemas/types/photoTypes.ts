export const photoTypes = `#graphql
    type Photo {
        id: ID!
        key: String!
        url: String!
        contentType: String!
        width: Int
        height: Int
        uploaderName: String
        createdAt: String!
        updatedAt: String!
    }
    
    input PhotoInput {
        key: String!
        url: String!
        contentType: String!
        width: Int
        height: Int
        uploaderName: String
    }
    
    type PhotosPaginated {
        photos: [Photo!]!
        total: Int!
        hasMore: Boolean!
    }
    
    type SignedUrlResponse {
        url: String!
        key: String!
        contentType: String!
        expiresIn: Int!
    }
`;
