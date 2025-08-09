import { shield, rule, allow } from 'graphql-shield';

// Helper function to combine rules
function and(...rules: any[]) {
  return rule({ cache: 'no_cache' })(async (parent: any, args: any, context: any, info: any) => {
    for (const r of rules) {
      const result = await r.resolve(parent, args, context, info);
      if (!result) return false;
    }
    return true;
  });
}

// Export shield middleware
export const permissions = shield(
  {
    Query: {
      guests: allow,
      messages: allow,
      message: allow,
      messagesPaginated: allow,
    },
    Mutation: {
      updateGuestStatus: allow,
      updateGuestGroup: allow,
      updateGuestPlusOnes: allow,
    },
  },
  {
    fallbackError: (error: any) => {
      console.log('Shield error:', error);
      console.error('SHIELD ERROR DETAILS:', error);
      return error instanceof Error 
        ? error 
        : new Error(error?.message || 'Permission denied');
    }
  }
);