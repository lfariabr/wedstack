'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, BotIcon, UserIcon, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { gql, useMutation } from '@apollo/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MarkdownMessage } from '@/components/chat/MarkdownMessage';
import { sendDiscordWebhook } from '@/utils/discord';
import { LockIcon, ClockIcon, AlertCircle } from 'lucide-react';

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
    onCompleted: (data) => {
      if (data?.askQuestion) {
        // Update rate limit info
        if (data.askQuestion.rateLimitInfo) {
          setRateLimitInfo(data.askQuestion.rateLimitInfo);
        }
        
        // Add bot response
        const botResponse: Message = {
          id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: data.askQuestion.message?.answer || "Sorry, I couldn't process your request.",
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
      }
      setIsLoading(false);
    },
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
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: errorMessage === 'Rate limit exceeded' 
          ? `You have reached your 5 messages/hour limit. Please try again later.` 
          : `Oops! ${errorMessage}`,
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
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        await askQuestion({
          variables: { question: input.trim() }
        });
      } catch (error) {
        // Error is handled by onError in the mutation setup
        console.error('Error sending message:', error);
      }
    } else {
      // Simulate API response delay for non-authenticated users
      setTimeout(() => {
        const botResponse: Message = {
          id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: `You need to be logged in to use this feature. Authenticated users can send up to 5 messages per hour. Please log in to continue.`,
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Set the input field with the suggestion
    setInput(suggestion);
    
    // Auto-submit after a short delay (like ChatGPT)
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
        form.dispatchEvent(submitEvent);
      }
    }, 100);
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 mb-4">
            Meet Luis's AI Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Get instant answers about Luis's experience, projects, and expertise.
            Trained on his professional background and technical knowledge.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-muted/50 p-6 rounded-lg border">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                <BotIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Answers</h3>
              <p className="text-muted-foreground text-sm">
                Get quick responses about Luis's background, skills, and experience.
              </p>
            </div>
            
            <div className="bg-muted/50 p-6 rounded-lg border">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                <LockIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">
                Your conversations are private and not stored long-term.
              </p>
            </div>
            
            <div className="bg-muted/50 p-6 rounded-lg border">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                <ClockIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Rate Limited</h3>
              <p className="text-muted-foreground text-sm">
                {isAuthenticated 
                  ? `You have ${rateLimitInfo?.remaining || 5}/5 messages remaining.`
                  : '5 messages per hour for authenticated users.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Suggested Questions Section */}
        {messages.length <= 3 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 text-center">What would you like to know?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {[
                {
                  question: "What's Luis's experience with React?",
                  description: "Learn about his React.js expertise and projects"
                },
                {
                  question: "Tell me about Luis's latest projects",
                  description: "Discover his most recent work and contributions"
                },
                {
                  question: "What technologies is Luis currently working with?",
                  description: "Find out about his current tech stack and tools"
                },
                {
                  question: "How can I contact Luis?",
                  description: "Get in touch for opportunities or questions"
                }
              ].map((item) => (
                <div 
                  key={item.question}
                  onClick={() => handleSuggestionClick(item.question)}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <h3 className="font-medium group-hover:text-primary">{item.question}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Authentication Alert */}
        {!isAuthenticated && (
          <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <AlertTitle className="text-blue-800 dark:text-blue-200 font-medium">
                Authentication Required
              </AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                Please <a href="/login" className="underline font-medium">log in</a> or <a href="/register" className="underline font-medium">register</a> to use the chatbot. 
                {isAuthenticated ? 'You can send up to 5 messages per hour.' : 'Authenticated users get 5 messages per hour.'}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Rate Limit Warning */}
        {isAuthenticated && rateLimitInfo?.remaining === 0 && rateLimitResetTime && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-5 w-5" />
            <div className="ml-3">
              <AlertTitle>Rate Limit Reached</AlertTitle>
              <AlertDescription>
                You've used all your messages. You can send another message in {timeUntilReset}.
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Chat Interface */}
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