export interface ChatResponse {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: UserInfo[];
  latestMessage?: MessageInfo;
  groupAdmin?: UserInfo;
  createdAt: Date;
  updatedAt: Date;
}

interface UserInfo {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline';
}

interface MessageInfo {
  _id: string;
  sender: UserInfo;
  content: string;
  chat: string;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGroupChatInput {
  name: string;
  users: string[];
}

export interface UpdateGroupChatInput {
  chatName: string;
}

export interface AddRemoveUserInput {
  userId: string;
}