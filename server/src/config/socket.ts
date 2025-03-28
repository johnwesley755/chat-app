import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../utils/logger';

export const initializeSocketIO = (io: SocketIOServer) => {
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Setup user in socket
    socket.on('setup', (userData) => {
      socket.join(userData._id);
      socket.emit('connected');
      logger.info(`User setup: ${userData._id}`);
    });

    // Join chat room
    socket.on('join chat', (room) => {
      socket.join(room);
      logger.info(`User joined room: ${room}`);
    });

    // Typing indicators
    socket.on('typing', (room) => {
      socket.to(room).emit('typing', room);
    });

    socket.on('stop typing', (room) => {
      socket.to(room).emit('stop typing', room);
    });

    // New message
    socket.on('new message', (newMessageReceived) => {
      const chat = newMessageReceived.chat;

      if (!chat.users) {
        logger.error('Chat users not defined');
        return;
      }

      // Send message to all users in the chat except the sender
      chat.users.forEach((user: any) => {
        if (user._id === newMessageReceived.sender._id) return;
        socket.to(user._id).emit('message received', newMessageReceived);
      });
    });

    // User status
    socket.on('user online', (userId) => {
      socket.broadcast.emit('user status', { userId, status: 'online' });
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });
};