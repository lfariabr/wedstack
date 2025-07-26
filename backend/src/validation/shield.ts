import { shield, rule, allow } from 'graphql-shield';
import { checkAuth, checkRole } from '../utils/authUtils';
import { validateInput } from './middleware';
import { registerSchema, loginSchema } from './schemas/user.schema';
import { projectInputSchema, projectUpdateSchema } from './schemas/project.schema';
import { articleInputSchema, articleUpdateSchema } from './schemas/article.schema';
import { chatbotInputSchema } from './schemas/chatbot.schema';

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

const validateProjectInput = rule({ cache: 'no_cache' })(
  validateInput(projectInputSchema)
);

const validateProjectUpdate = rule({ cache: 'no_cache' })(
  validateInput(projectUpdateSchema, 'input')
);

const validateArticleInput = rule({ cache: 'no_cache' })(
  validateInput(articleInputSchema)
);

const validateArticleUpdate = rule({ cache: 'no_cache' })(
  validateInput(articleUpdateSchema, 'input')
);

const validateChatbotInput = rule({ cache: 'no_cache' })(
  validateInput(chatbotInputSchema, 'question')
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
      projects: allow,
      project: allow,
      featuredProjects: allow,
      articles: allow,
      article: allow,
      articleBySlug: allow,
      publishedArticles: allow,
      articlesByCategory: allow,
      articlesByTag: allow,
      
      // Protected queries
      me: isAuthenticated,
      chatHistory: isAuthenticated,
      testRateLimit: isAuthenticated,
    },
    Mutation: {
      // Public mutations
      register: validateRegister,
      login: validateLogin,
      
      // Admin-only mutations
      createProject: and(isAdmin, validateProjectInput),
      updateProject: and(isAdmin, validateProjectUpdate),
      deleteProject: isAdmin,
      createArticle: and(isAdmin, validateArticleInput),
      updateArticle: and(isAdmin, validateArticleUpdate),
      deleteArticle: isAdmin,
      publishArticle: isAdmin,
      unpublishArticle: isAdmin,
      
      // User mutations
      askQuestion: and(isAuthenticated, validateChatbotInput),
      logout: isAuthenticated,
    },
  },
  {
    fallbackError: (error: any) => {
      console.log('Shield error:', error);
      
    //   // Handle Zod validation errors
    //   if (error && error.originalError && error.originalError.name === 'ZodError') {
    //     return new Error(error.originalError.issues[0].message);
    //   }
      
    //   // Handle regular errors
    //   if (error instanceof Error) {
    //     return new Error(error.message);
    //   }
      
    //   return new Error('An unknown error occurred');
    // },
    console.error('SHIELD ERROR DETAILS:', error);
    return error instanceof Error 
    ? error 
    : new Error(error?.message || 'Permission denied');
}
  }
);