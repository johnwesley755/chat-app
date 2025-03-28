export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  phoneNumber?: string;
  location?: string;
  lastActive?: string;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  privacy: {
    showStatus: boolean;
    showLastSeen: boolean;
    readReceipts: boolean;
  };
}

export interface UserState {
  currentUser: User | null;
  profile: UserProfile | null;
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
}

export interface UserSearchResult {
  users: User[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  bio?: string;
  phoneNumber?: string;
  location?: string;
  avatar?: string;
}

export interface UserPasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}