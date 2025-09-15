export const qrCodeTypes = `#graphql
    type QRCode {
        id: ID!
        url: String!
        qrCodeData: String!
        format: String!
        size: Int!
        createdAt: String!
        updatedAt: String!
    }
    
    input QRCodeInput {
        url: String!
        size: Int = 300
        format: String = "png"
    }
`;