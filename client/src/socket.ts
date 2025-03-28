import { io, Socket } from 'socket.io-client';
import { SocketEvents } from './types/socket.types';

let socket: Socket<SocketEvents> | null = null;

export const initializeSocket = (): Socket<SocketEvents> => {
  if (!socket) {
    const token = localStorage.getItem('token');
    
    socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      auth: {
        token,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
  }
  
  return socket;
};

export const getSocket = (): Socket<SocketEvents> => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};