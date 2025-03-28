import { User } from './auth.types';

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
  readBy: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  groupAdmin?: User;
  latestMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}
// Add or update the User interface to include the name property
