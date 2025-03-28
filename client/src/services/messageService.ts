import api from './api';
import { Message } from '../types/chat.types';

export const getMessages = async (chatId: string): Promise<Message[]> => {
  const response = await api.get(`/messages/${chatId}`);
  return response.data;
};

export const sendMessage = async (content: string, chatId: string): Promise<Message> => {
  const response = await api.post('/messages', { content, chatId });
  return response.data;
};

export const markMessagesAsRead = async (chatId: string): Promise<void> => {
  await api.put(`/messages/read/${chatId}`);
};