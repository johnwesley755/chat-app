import { Socket } from 'socket.io';
import User from '../models/userModel';
import { logger } from '../utils/logger';

export const registerUserHandlers = (socket: Socket) => {
  // Setup user in socket
  socket.on('setup', async (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
    logger.info(`User setup: ${userData._id}`);

    // Update user status to online
    await User.findByIdAndUpdate(userData._id, { status: 'online' });
    socket.broadcast.emit('user status', { userId: userData._id, status: 'online' });
  });

  // User status
  socket.on('user online', async (userId) => {
    await User.findByIdAndUpdate(userId, { status: 'online' });
    socket.broadcast.emit('user status', { userId, status: 'online' });
  });

  socket.on('user offline', async (userId) => {
    await User.findByIdAndUpdate(userId, { status: 'offline' });
    socket.broadcast.emit('user status', { userId, status: 'offline' });
  });

  // Disconnect
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
};