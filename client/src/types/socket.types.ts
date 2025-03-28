

export interface SocketEvents {
  connect: () => void;
  disconnect: () => void;
  setup: (userData: { _id: string }) => void;
  join_chat: (chatId: string) => void;
  typing: (chatId: string) => void;
  stop_typing: (chatId: string) => void;
  new_message: (message: any) => void;
  user_online: (userId: string) => void;
  user_offline: (userId: string) => void;
}

export interface TypingState {
  [chatId: string]: boolean;
}

export interface OnlineUsers {
  [userId: string]: boolean;
}