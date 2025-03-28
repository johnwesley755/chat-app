import { body, ValidationChain } from 'express-validator';

// User registration validation
export const registerValidation: ValidationChain[] = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('email')
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// User login validation
export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  body('password')
    .exists()
    .withMessage('Password is required'),
];

// Chat validation
export const chatValidation: ValidationChain[] = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),
];

// Group chat validation
export const groupChatValidation: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Group name is required'),
  body('users')
    .isArray({ min: 2 })
    .withMessage('At least 2 users are required for a group chat'),
];

// Message validation
export const messageValidation: ValidationChain[] = [
  body('content')
    .notEmpty()
    .withMessage('Message content is required'),
  body('chatId')
    .notEmpty()
    .withMessage('Chat ID is required'),
];

// User update validation
export const userUpdateValidation: ValidationChain[] = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
];