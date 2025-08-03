// TypeScript interfaces for Message data

export interface Message {
  name?: string;
  message: string;
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
 * Input type for creating a new article
 * Matches the GraphQL MessageInput type from the backend
 */
export interface MessageInput {
  name?: string;
  message: string;
  createdAt: string;
}

/**
 * Input type for updating an existing article
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
