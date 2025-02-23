export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  reactions?: { [emoji: string]: string[] };
  readBy?: string[];
  attachments?: string[];
}

export interface ChatRoom {
  id: string;
  name: string;
  type: "group" | "private";
  messages: ChatMessage[];
}
