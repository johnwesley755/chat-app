import express from 'express';
import { body } from 'express-validator';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser 
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Register user
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  // @ts-ignore - Ignoring TypeScript error for Express route handler
  registerUser
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  // @ts-ignore - Ignoring TypeScript error for Express route handler
  loginUser
);

// Logout user
// @ts-ignore - Ignoring TypeScript error for Express route handler
router.get('/logout', protect, logoutUser);

// Get current user
// @ts-ignore - Ignoring TypeScript error for Express route handler
router.get('/me', protect, getCurrentUser);

export default router;