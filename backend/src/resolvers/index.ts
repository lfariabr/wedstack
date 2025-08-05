import { articleQueries } from './articles/queries';
import { articleMutations } from './articles/mutations';
import { userQueries } from './users/queries';
import { userMutations } from './users/mutations';
import { rateTestQueries } from './rateTest/queries';
import { messageQueries } from './messages/queries';
import { messageMutations } from './messages/mutations';

// Combine all resolvers
export const resolvers = {
  Query: {
    ...articleQueries,
    ...userQueries,
    ...rateTestQueries,
    ...messageQueries,
  },
  
  Mutation: {
    ...articleMutations,
    ...userMutations,
    ...messageMutations,
  }
};
