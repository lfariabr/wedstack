# Feature Qr Code Scaffolding
Goal: create a simple service to transform a link, on this case, https://wedstack.com/share-love, into a QR code that can be scanned by guests to access the share love page.

We will safely store the link's image credentials in mongoDB that we have set up and consume it from them.

On this file we'll document the step by step approach to fitting this into the existing codebase, displaying the versatility of the system I've engineered on the MERN stack.

- [X] Open issue for the QR code feature
- [X] Scaffold QRCode feature using Claude4 mapping next steps following taking into account the `ftMemoryLane.md` file
- [X] Create model file `QRCode.ts`
- [X] Add QRCode types to GraphQL Schema 
- [X] Create `QRCodeService.ts` to create, store and retrieve QR codes from DB (QRCodeService class with generateQRCode, getQRCodeByUrl and getAllQRCodes static methods)
- [X] Create `qrCodeTypes` with specific fields
- [X] Integrate `qrCodeTypes` to typeDefs at `schemas/typeDefs.ts`
- [X] Create QRCode resolvers with queries and mutations
- [X] Integrate QRCode resolvers to index.ts at `resolvers/index.ts`
- [X] Test QRCodeService with:
```typescript
# Generate QR code for the share-love URL

# Operation
mutation GenerateQRCode($input: QRCodeInput!) {
  generateQRCode(input: $input) {
    id
    url
    qrCodeData
    format
    size
    createdAt
    updatedAt
  }
}

# Variables
{
  "input": { 
    "url": "https://weddingln.com/memory-lane",
    "size": 300 
  }
}
```

```typescript
# Retrieve existing QR code

# Operation
query GetQRCodeByUrl($url: String!) {
  qrCode(url: $url) {
    id
    url
    qrCodeData
    format
    size
    createdAt
    updatedAt
  }
}

# Variables
{
  "url": "https://weddingln.com/memory-lane"
}
```

- [X] Map response and tie it to a page (I have used frontend/app/qr-code/page.tsx)
```typescript
{
  "data": {
    "generateQRCode": {
      "id": "68c89aa5e64e9559aa90321d",
      "url": "https://weddingln.com/memory-lane",
      "qrCodeData": "data:image/png;base64,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",
      "format": "png",
      "size": 300,
      "createdAt": "1757977253251",
      "updatedAt": "1757977253251"
    }
  }
}
```
- [X] Validate usage:
```typescript
<img src="data:image/png;base64,{qrCodeData}" alt="Share Love QR Code" />
```

> The QR code will be stored as a base64 data URL that can be used directly in <img> tags or downloaded for printing on wedding materials. No reliance on external QR code generators!