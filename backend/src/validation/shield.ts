import { shield, rule, allow } from 'graphql-shield';
import { checkAuth, checkRole } from '../utils/authUtils';
import { validateInput } from './middleware';
import { registerSchema, loginSchema } from './schemas/user.schema';
import { articleInputSchema, articleUpdateSchema } from './schemas/article.schema';
import { messageInputSchema } from './schemas/message.schema';

// Authentication rules
const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent: any, _args: any, context: any) => {
    try {
      checkAuth(context);
      return true;
    } catch (error) {
      return false;
    }
  }
);

const isAdmin = rule({ cache: 'contextual' })(
  async (_parent: any, _args: any, context: any) => {
    try {
      checkRole(context, 'ADMIN');
      return true;
    } catch (error) {
      return false;
    }
  }
);

// Validation rules
const validateRegister = rule({ cache: 'no_cache' })(
  validateInput(registerSchema)
);

const validateLogin = rule({ cache: 'no_cache' })(
  validateInput(loginSchema)
);

const validateArticleInput = rule({ cache: 'no_cache' })(
  validateInput(articleInputSchema)
);

const validateArticleUpdate = rule({ cache: 'no_cache' })(
  validateInput(articleUpdateSchema, 'input')
);

const validateMessageInput = rule({ cache: 'no_cache' })(
  validateInput(messageInputSchema, 'input')
);

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
      // Public queries
      hello: allow,
      articles: allow,
      article: allow,
      articleBySlug: allow,
      publishedArticles: allow,
      articlesByCategory: allow,
      articlesByTag: allow,
      
      // Message queries (public for wedding guests)
      messages: allow,
      message: allow,
      messagesPaginated: allow,
      
      // Protected queries
      me: isAuthenticated,
      users: isAdmin,
      user: isAdmin,
      testRateLimit: isAuthenticated,
    },
    Mutation: {
      // Public mutations
      register: validateRegister,
      login: validateLogin,
      
      // Message mutations (public for wedding guests with validation)
      addMessage: validateMessageInput,
      
      // Admin-only mutations
      createArticle: and(isAdmin, validateArticleInput),
      updateArticle: and(isAdmin, validateArticleUpdate),
      deleteArticle: isAdmin,
      publishArticle: isAdmin,
      unpublishArticle: isAdmin,
      updateUserRole: isAdmin,
      deleteUser: isAdmin,
      deleteMessage: isAdmin, // Only admins can delete messages
      
      // User mutations
      logout: isAuthenticated,
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