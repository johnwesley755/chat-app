import express from 'express';
import { 
  sendMessage, 
  getMessages, 
  markMessagesAsRead 
} from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect as express.RequestHandler);

// Send a message
router.post('/', sendMessage as express.RequestHandler);

// Get all messages for a chat
router.get('/:chatId', getMessages as express.RequestHandler);

// Mark messages as read
router.put('/read/:chatId', markMessagesAsRead as express.RequestHandler);

export default router;