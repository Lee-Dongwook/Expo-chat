export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  messages: ChatMessage[];
}
