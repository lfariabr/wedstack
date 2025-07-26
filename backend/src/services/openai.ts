import OpenAI from 'openai';
import config from '../config/config';
import luisProfile from '../data/luis-profile.json';

// Creating openAi client
const openai = new OpenAI({
    apiKey: config.openaiApiKey,
});

// Cache the stringified profile to avoid repeated JSON.stringify
let cachedProfile: string | null = null;

const getSystemPrompt = (): string => {
  // Return cached version if available
  if (cachedProfile) {
    return `You are acting on behalf of Luis Faria.
    Refer to the following professional background:
    
    ${cachedProfile}
    
    Only answer questions based on this information in a markdown format so it is easy to read. Avoid BIG blocks of text.
    If the user asks for code or advice, respond as Luis would based on his experience.`;
  }

  // Generate and cache the profile context
  cachedProfile = JSON.stringify(luisProfile, null, 2);
  
  return `You are acting on behalf of Luis Faria.
  Refer to the following professional background:
  
  ${cachedProfile}
  
  Only answer questions based on this information in a markdown format so it is easy to read. Avoid BIG blocks of text.
  If the user asks for code or advice, respond as Luis would based on his experience.`;
};

/**
 * Chat with AI using OpenAI's GPT models
 * @param prompt User's question
 * @param modelName Model to use (defaults to gpt-3.5-turbo)
 * @returns AI response
 */
export const chatWithAI = async (
    prompt: string, 
    modelName: string = 'gpt-3.5-turbo'
  ): Promise<string> => {
    try {
      const response = await openai.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });
  
      return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error: any) {
      console.error('OpenAI API error:', error.message);
      throw new Error('Failed to get response from AI service');
    }
  };
  
  export default openai;