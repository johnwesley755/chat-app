import api from './api';
import { Chat } from '../types/chat.types';

export const getChats = async (): Promise<Chat[]> => {
  const response = await api.get('/chats');
  return response.data;
};

export const accessChat = async (userId: string): Promise<Chat> => {
  const response = await api.post('/chats', { userId });
  return response.data;
};

export const createGroupChat = async (users: string[], name: string): Promise<Chat> => {
  const response = await api.post('/chats/group', { users, name });
  return response.data;
};

export const updateGroupChat = async (chatId: string, chatName: string): Promise<Chat> => {
  const response = await api.put(`/chats/group/${chatId}`, { chatName });
  return response.data;
};

export const addUserToGroup = async (chatId: string, userId: string): Promise<Chat> => {
  const response = await api.put(`/chats/group/${chatId}/add`, { userId });
  return response.data;
};

export const removeUserFromGroup = async (chatId: string, userId: string): Promise<Chat> => {
  const response = await api.put(`/chats/group/${chatId}/remove`, { userId });
  return response.data;
};