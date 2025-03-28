import express from 'express';
import { 
  accessChat, 
  getChats, 
  createGroupChat, 
  updateGroupChat, 
  addToGroup, 
  removeFromGroup 
} from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect as express.RequestHandler);

// Access or create one-to-one chat
router.post('/', accessChat as express.RequestHandler);

// Get all chats for a user
router.get('/', getChats as express.RequestHandler);

// Create group chat
router.post('/group', createGroupChat as express.RequestHandler);

// Update group chat
router.put('/group/:id', updateGroupChat as express.RequestHandler);

// Add user to group
router.put('/group/:id/add', addToGroup as express.RequestHandler);

// Remove user from group
router.put('/group/:id/remove', removeFromGroup as express.RequestHandler);

export default router;