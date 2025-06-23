import { errorMiddleware } from './middleware/errorMiddleware';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';


import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import { initializeSocketIO } from './config/socket';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: [process.env.CLIENT_URL || 'https://chat-app-beta-six-31.vercel.app', 'https://chat-5ctg4pfwi-john-wesleys-projects-57e81bf5.vercel.app'],
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

// Add root route handler here
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Chat Application API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      chats: '/api/chats',
      messages: '/api/messages'
    }
  });
});

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: [process.env.CLIENT_URL || 'https://chat-app-beta-six-31.vercel.app', 'https://chat-5ctg4pfwi-john-wesleys-projects-57e81bf5.vercel.app'],
    credentials: true,
  },
});

// Socket.IO
initializeSocketIO(io);

// Error middleware
app.use(errorMiddleware);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://johnwesley8113:v9kmS6jnuLSks4IH@cluster0.gpsnyuz.mongodb.net/';
mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Start server with port fallback
    const startServer = (port: number) => {
      server.listen(port)
        .on('error', (err: any) => {
          if (err.code === 'EADDRINUSE') {
            logger.warn(`Port ${port} is already in use, trying port ${port + 1}`);
            startServer(port + 1);
          } else {
            logger.error('Server error:', err);
            process.exit(1);
          }
        })
        .on('listening', () => {
          const address = server.address();
          const actualPort = typeof address === 'object' && address ? address.port : port;
          logger.info(`Server running on port ${actualPort}`);
        });
    };

    const PORT = parseInt(process.env.PORT || '5000', 10);
    startServer(PORT);
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});