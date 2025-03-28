import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  searchUsers 
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect as express.RequestHandler);

// Get all users
router.get('/', getUsers as express.RequestHandler);

// Search users
router.get('/search', searchUsers as express.RequestHandler);

// Get user by ID
router.get('/:id', getUserById as express.RequestHandler);

// Update user
router.put('/:id', updateUser as express.RequestHandler);

export default router;