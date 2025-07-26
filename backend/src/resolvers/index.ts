import { projectQueries } from './projects/queries';
import { projectMutations } from './projects/mutations';
import { articleQueries } from './articles/queries';
import { articleMutations } from './articles/mutations';
import { userQueries } from './users/queries';
import { userMutations } from './users/mutations';
import { rateTestQueries } from './rateTest/queries';
import { chatbotQueries } from './chatbot/queries';
import { chatbotMutations } from './chatbot/mutations';

// Combine all resolvers
export const resolvers = {
  Query: {
    ...projectQueries,
    ...articleQueries,
    ...userQueries,
    ...rateTestQueries,
    ...chatbotQueries,
  },
  
  Mutation: {
    ...projectMutations,
    ...articleMutations,
    ...userMutations,
    ...chatbotMutations,
  }
};
