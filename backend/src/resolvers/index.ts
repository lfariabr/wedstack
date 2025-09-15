import { messageQueries } from './messages/queries';
import { messageMutations } from './messages/mutations';
import { guestQueries } from './guests/queries';
import { guestMutations } from './guests/mutations';
import { photoQueries } from './photos/queries';
import { photoMutations } from './photos/mutations';
import { qrCodeQueries } from './qrcode/queries';
import { qrCodeMutations } from './qrcode/mutations';

// Combine all resolvers
export const resolvers = {
  Query: {
    ...guestQueries,
    ...messageQueries,
    ...photoQueries,
    ...qrCodeQueries,
  },
  
  Mutation: {
    ...guestMutations,
    ...messageMutations,
    ...photoMutations,
    ...qrCodeMutations,
  }
};
