import api from './api';
import { User } from '../types/auth.types';

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const searchUsers = async (search: string): Promise<User[]> => {
  const response = await api.get(`/users?search=${search}`);
  return response.data;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const uploadAvatar = async (userId: string, formData: FormData): Promise<User> => {
  const response = await api.post(`/users/${userId}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};