import { Socket } from 'socket.io';
import { logger } from '../utils/logger';

export const registerChatHandlers = (socket: Socket) => {
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
};