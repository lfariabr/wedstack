import { messageQueries } from './messages/queries';
import { messageMutations } from './messages/mutations';
import { guestQueries } from './guests/queries';
import { guestMutations } from './guests/mutations';
import { photoQueries } from './photos/queries';
import { photoMutations } from './photos/mutations';

// Basic queries
const basicQueries = {
  hello: () => 'Hello World! Wedding stack GraphQL API is running.',
};

// Combine all resolvers
export const resolvers = {
  Query: {
    ...basicQueries,
    ...guestQueries,
    ...messageQueries,
    ...photoQueries,
  },
  
  Mutation: {
    ...guestMutations,
    ...messageMutations,
    ...photoMutations,
  }
};
