// TypeScript interfaces for Message data

export interface Message {
  id: string;
  name: string;
  content: string; // Changed from 'message' to 'content' to match UI usage
  createdAt: string;
}

export interface MessagesData {
  messages: Message[];
}

export interface PublishedMessagesData {
  publishedMessages: Message[];
}

export interface MessageData {
  message: Message;
}

export interface MessageVars {
  id: string;
}

/**
 * Input type for creating a new message
 * Matches the GraphQL MessageInput type from the backend
 */
export interface MessageInput {
  name: string;
  message: string; // Backend uses 'message' field
}

/**
 * Input type for updating an existing message
 * Matches the GraphQL MessageUpdateInput type from the backend
 */
export interface MessageUpdateInput extends MessageInput {
  // Same fields as MessageInput, but as a separate type for the GraphQL schema
}

/**
 * Response from message mutations
 */
export interface MessageMutationResponse {
  message: Message;
}

/**
 * Response from delete message mutation
 */
export interface DeleteMessageResponse {
  success: boolean;
  message: string;
}
