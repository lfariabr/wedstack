import * as dbHandler from '../helpers/dbHandler';
import { executeOperation } from '../helpers/testServer';
import User, { UserRole } from '../../models/User';
import ChatMessage from '../../models/ChatMessage';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import bcrypt from 'bcryptjs';
import { connectRedis, disconnectRedis, getRedisClient } from '../../services/redis';

// Mock OpenAI service
jest.mock('../../services/openai', () => ({
  chatWithAI: jest.fn().mockResolvedValue('This is a mock AI response'),
}));

// Define test queries and mutations
const ASK_QUESTION_MUTATION = `
  mutation AskQuestion($question: String!) {
    askQuestion(question: $question) {
      message {
        id
        question
        answer
        modelUsed
      }
      rateLimitInfo {
        limit
        remaining
        resetTime
      }
    }
  }
`;

// Define the expected types for our GraphQL responses
interface ChatMessageType {
  id: string;
  question: string;
  answer: string;
  modelUsed: string;
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: string;
}

interface AskQuestionResponse {
  message: ChatMessageType;
  rateLimitInfo: RateLimitInfo;
}

// Type guard function to check if an object matches our expected structure
function isAskQuestionResponse(obj: any): obj is { askQuestion: AskQuestionResponse } {
  return (
    obj &&
    typeof obj === 'object' &&
    'askQuestion' in obj &&
    typeof obj.askQuestion === 'object' &&
    obj.askQuestion !== null &&
    'message' in obj.askQuestion &&
    'rateLimitInfo' in obj.askQuestion
  );
}

describe('Chatbot Resolvers', () => {
  let testUser: any;
  let authToken: string;
  
  // Connect to database and Redis before tests
  beforeAll(async () => {
    await dbHandler.connect();
    await connectRedis();
    
    // Create a test user
    const passwordHash = await bcrypt.hash('Test1234!', 10);
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: passwordHash,
      role: UserRole.USER
    });
    
    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser._id, role: testUser.role },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
    
    // Clear any existing rate limit data
    const redisClient = getRedisClient();
    await redisClient.flushDb();
  });
  
  // Disconnect after tests
  afterAll(async () => {
    await dbHandler.closeDatabase();
    await disconnectRedis();
  });
  
  it('should successfully ask a question and get a response', async () => {
    const variables = {
      question: 'What is the meaning of life?'
    };
    
    const context = { user: { id: testUser._id, role: testUser.role } };
    
    const response = await executeOperation(ASK_QUESTION_MUTATION, variables, context);
    
    // Check no errors occurred
    expect(response.body.kind).toBe('single');
    
    if (response.body.kind === 'single') {
      const { data, errors } = response.body.singleResult;
      
      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      
      // Validate that data has the expected structure using our type guard
      expect(isAskQuestionResponse(data)).toBe(true);
      
      if (isAskQuestionResponse(data)) {
        // Now TypeScript knows data has the right structure
        const { askQuestion } = data;
        
        // Check message properties
        expect(askQuestion.message.question).toBe(variables.question);
        expect(askQuestion.message.answer).toBe('This is a mock AI response');
        expect(askQuestion.message.modelUsed).toBe('gpt-3.5-turbo');
        
        // Check rate limit info
        expect(askQuestion.rateLimitInfo.limit).toBe(5); // Using the actual value from config
        expect(askQuestion.rateLimitInfo.remaining).toBe(4);
        expect(askQuestion.rateLimitInfo.resetTime).toBeTruthy();
      }
      
      // Check message was saved to database
      const messageInDb = await ChatMessage.findOne({ question: variables.question });
      expect(messageInDb).toBeTruthy();
      expect(messageInDb?.answer).toBe('This is a mock AI response');
    }
  });
  
  it('should enforce rate limiting after reaching the limit', async () => {
    const variables = {
      question: 'Another test question'
    };
    
    const context = { user: { id: testUser._id, role: testUser.role } };
    
    // Simulate hitting the rate limit by making multiple requests
    const limit = 5; // Match the actual limit in the environment
    
    for (let i = 0; i < limit; i++) {
      await executeOperation(ASK_QUESTION_MUTATION, variables, context);
    }
    
    // This request should be rate limited
    const response = await executeOperation(ASK_QUESTION_MUTATION, variables, context);
    
    expect(response.body.kind).toBe('single');
    
    if (response.body.kind === 'single') {
      const { errors } = response.body.singleResult;
      expect(errors).toBeDefined();
      expect(errors?.[0].message).toContain('Rate limit exceeded');
      expect(errors?.[0].extensions?.code).toBe('RATE_LIMITED');
    }
  });
});
