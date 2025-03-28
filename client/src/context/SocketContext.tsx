import React, { createContext, useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { initializeSocket, disconnectSocket, getSocket } from '../services/socket';

export interface SocketContextProps {
  connected: boolean;
  onlineUsers: Record<string, boolean>;
  typingUsers: Record<string, boolean>;
  emit: (event: string, ...args: any[]) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
}

export const SocketContext = createContext<SocketContextProps>({
  connected: false,
  onlineUsers: {},
  typingUsers: {},
  emit: () => {},
  on: () => {},
  off: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = React.useState<Record<string, boolean>>({});
  const [typingUsers, setTypingUsers] = React.useState<Record<string, boolean>>({});
  const [connected, setConnected] = React.useState(false);
  
  useEffect(() => {
    // Only initialize socket if user is authenticated
    if (state.isAuthenticated && state.token) {
      const socket = getSocket(state.token);
      
      // Set connected status
      setConnected(socket.connected);
      
      // Listen for connection events
      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));
      
      // Listen for online users updates
      socket.on('online_users', (users: Record<string, boolean>) => {
        setOnlineUsers(users);
      });
      
      // Listen for typing status
      socket.on('typing', (data: { chatId: string, userId: string }) => {
        setTypingUsers(prev => ({ ...prev, [data.chatId]: true }));
      });
      
      socket.on('stop_typing', (data: { chatId: string, userId: string }) => {
        setTypingUsers(prev => ({ ...prev, [data.chatId]: false }));
      });
      
      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('online_users');
        socket.off('typing');
        socket.off('stop_typing');
        disconnectSocket();
      };
    }
  }, [state.isAuthenticated, state.token]);
  
  // Get the current socket instance (or null if not initialized)
  const socket = state.isAuthenticated && state.token ? getSocket(state.token) : null;
  
  // Create socket methods that will be exposed through context
  const emit = (event: string, ...args: any[]) => {
    if (socket) {
      socket.emit(event, ...args);
    }
  };
  
  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  };
  
  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socket) {
      socket.off(event, callback);
    }
  };
  
  return (
    <SocketContext.Provider value={{ 
      connected, 
      onlineUsers, 
      typingUsers,
      emit,
      on,
      off
    }}>
      {children}
    </SocketContext.Provider>
  );
};