import { Server as SocketIOServer, Socket } from 'socket.io';
import { registerChatHandlers } from './chatHandler';
import { registerUserHandlers } from './userHandler';
import { logger } from '../utils/logger';

export const initializeSockets = (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Register handlers
    registerUserHandlers(socket);
    registerChatHandlers(socket);
  });
};