export interface MessageResponse {
  _id: string;
  sender: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  chat: string;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageInput {
  content: string;
  chatId: string;
}