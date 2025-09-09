import { gql } from '@apollo/client';

export const GET_PHOTOS_PAGINATED = gql`
  query PhotosPaginated($limit: Int = 20, $offset: Int = 0) {
    photosPaginated(limit: $limit, offset: $offset) {
      photos {
        id
        key
        url
        contentType
        width
        height
        uploaderName
        createdAt
      }
      total
      hasMore
    }
  }
`;

export const GET_PHOTO_UPLOAD_URL = gql`
  mutation GetPhotoUploadUrl($filename: String!, $contentType: String!, $passcode: String!) {
    getPhotoUploadUrl(filename: $filename, contentType: $contentType, passcode: $passcode) {
      url
      key
      contentType
      expiresIn
    }
  }
`;

export const ADD_PHOTO = gql`
  mutation AddPhoto($input: PhotoInput!) {
    addPhoto(input: $input) {
      id
      key
      url
      contentType
      width
      height
      uploaderName
      createdAt
    }
  }
`;

export type Photo = {
  id: string;
  key: string;
  url: string;
  contentType: string;
  width?: number | null;
  height?: number | null;
  uploaderName?: string | null;
  createdAt: string;
};
