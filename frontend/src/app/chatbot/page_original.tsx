'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, BotIcon, UserIcon, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { gql, useMutation } from '@apollo/client';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MarkdownMessage } from '@/components/chat/MarkdownMessage';
import { sendDiscordWebhook } from '@/utils/discord';

// GraphQL mutation for sending a message to the chatbot
const ASK_QUESTION_MUTATION = gql`
  mutation AskQuestion($question: String!) {
    askQuestion(question: $question) {
      message {
        id
        question
        answer
        modelUsed
        createdAt
      }
      rateLimitInfo {
        remaining
        resetTime
      }
    }
  }
`;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface RateLimitInfo {
  remaining: number;
  resetTime: string;
}

export default function ChatbotPage() {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m Luis\'s AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [rateLimitResetTime, setRateLimitResetTime] = useState<Date | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');

  // Update countdown timer for rate limit reset
  useEffect(() => {
    if (!rateLimitResetTime) return;
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const resetTime = new Date(rateLimitResetTime);
      const diffMs = resetTime.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setRateLimitError(null);
        setRateLimitResetTime(null);
        setTimeUntilReset('');
        return;
      }
      
      // Calculate minutes and seconds
      const diffMinutes = Math.floor(diffMs / 60000);
      const diffSeconds = Math.floor((diffMs % 60000) / 1000);
      
      // Format as MM:SS
      setTimeUntilReset(`${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`);
    };
    
    // Initial calculation
    calculateTimeRemaining();
    
    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [rateLimitResetTime]);

  // Setup GraphQL mutation
  const [askQuestion] = useMutation(ASK_QUESTION_MUTATION, {
    onError: (error) => {
      console.error('Chatbot API error:', error);
      
      let errorMessage = error.message;
      let resetTimeString = '';
      
      // Extract rate limit information from the error
      if (error.graphQLErrors?.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        
        if (graphQLError.extensions?.code === 'RATE_LIMITED' && graphQLError.extensions.resetTime) {
          resetTimeString = graphQLError.extensions.resetTime;
          setRateLimitResetTime(new Date(resetTimeString));
          errorMessage = 'You have reached your 5 messages/hour limit.';
          setRateLimitError(errorMessage);
        }
      }
      
      // Add error message from the bot
      const botErrorMessage: Message = {
        id: Date.now().toString(),
        content: errorMessage === 'Rate limit exceeded' 
          ? `You have reached your 5 messages/hour limit. Please try again later.` 
          : `Ops! ${errorMessage}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botErrorMessage]);
      setIsLoading(false);
    }
  });

  const handleButtonClick = async () => {
    await sendDiscordWebhook('Chatbot button was clicked');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    if (isAuthenticated) {
      try {
        // Send message to API if user is authenticated
        const { data } = await askQuestion({
          variables: { question: input.trim() }
        });
        
        // Update rate limit info
        if (data?.askQuestion?.rateLimitInfo) {
          setRateLimitInfo(data.askQuestion.rateLimitInfo);
        }
        
        // Add bot response
        const botResponse: Message = {
          id: Date.now().toString(),
          content: data?.askQuestion?.message?.answer || "Sorry, I couldn't process your request.",
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        // Error is handled by onError in the mutation setup
      } finally {
        setIsLoading(false);
      }
    } else {
      // Simulate API response delay for non-authenticated users
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `You need to be logged in to use this feature. Authenticated users can send up to 5 messages per hour. Please log in to continue.`,
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-4xl px-4">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground">
            Chat with my custom AI assistant powered by advanced language models.
          </p>
          {isAuthenticated && rateLimitInfo && rateLimitInfo.remaining > 0 && (
            <p className="mt-2 font-medium text-blue-500">You have {rateLimitInfo.remaining}/5 message{rateLimitInfo.remaining !== 1 ? 's' : ''} remaining.</p>
          )}
        </div>
        
        {!isAuthenticated && (
          <Alert className="mb-6 px-4 py-3 text-sm flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div>
              You need to <a href="/login" className="underline font-medium">log in</a> or <a href="/register" className="underline font-medium">register</a> to use the chatbot.
              <br />
              <span className="text-muted-foreground">Limit: 5 messages per hour.</span>
            </div>
          </Alert>
        )}
        
        {rateLimitError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {rateLimitError} {timeUntilReset && (
                <span className="font-medium">
                  You can send another message in {timeUntilReset}.
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {isAuthenticated && rateLimitInfo && rateLimitInfo.remaining === 0 && rateLimitResetTime && (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You've reached your message limit. You can send another message in {timeUntilReset}.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="border rounded-lg overflow-hidden shadow bg-card">
          <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  } p-4 rounded-lg`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex-shrink-0">
                      <BotIcon className="h-5 w-5 mt-0.5" />
                    </div>
                  )}
                  <div className="overflow-x-auto w-full">
                    <MarkdownMessage 
                      content={message.content} 
                      className={message.sender === 'user' ? 'text-primary-foreground' : ''}
                    />
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="flex-shrink-0">
                      <UserIcon className="h-5 w-5 mt-0.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} onClick={handleButtonClick}>
              <SendIcon className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        <div className="mt-6 text-sm text-muted-foreground text-center">
          <p>This AI assistant is powered by a custom model trained on Luis's technical expertise and preferences.</p>
          <p>All conversations are private and not stored longer than needed to provide the service.</p>
          
          {rateLimitResetTime && (
            <p className="mt-2 text-amber-500">Rate limit reached. Next message available in {timeUntilReset}.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}