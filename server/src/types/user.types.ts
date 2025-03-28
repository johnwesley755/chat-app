export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline';
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  avatar?: string;
}