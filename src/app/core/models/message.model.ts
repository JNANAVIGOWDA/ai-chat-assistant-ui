/**
 * Message Model Interface
 * Defines the contract for chat messages between the candidate (user) and AI Interview Assistant.
 */
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

/**
 * ChatState Interface
 * Encapsulates the UI state for messages, loading status, and error states.
 */
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
