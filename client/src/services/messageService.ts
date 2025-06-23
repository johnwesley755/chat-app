import api from './api';
import { Message } from '../types/chat.types';

export const getMessages = async (chatId: string): Promise<Message[]> => {
  const response = await api.get(`/api/messages/${chatId}`);
  return response.data;
};

export const sendMessage = async (content: string, chatId: string): Promise<Message> => {
  const response = await api.post('/api/messages', { content, chatId });

  return response.data;
};

export const markMessagesAsRead = async (chatId: string): Promise<void> => {
  await api.put(`/api/messages/read/${chatId}`);
};