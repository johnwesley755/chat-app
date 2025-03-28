export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline';
  token?: string;
}