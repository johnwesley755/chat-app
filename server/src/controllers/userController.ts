import { Request, Response } from 'express';
import User from '../models/userModel';
import { logger } from '../utils/logger';

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Get query parameter for search
    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    // Find users excluding current user
    const users = await User.find({
      ...keyword,
      _id: { $ne: (req as any).user._id },
    }).select('-password');

    res.json(users);
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req: Request, res: Response) => {
  try {
    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is updating their own profile
    if ((user._id as any).toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    // Update user fields
    const { username, email, avatar } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      status: updatedUser.status,
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { username: { $regex: req.query.keyword, $options: 'i' } },
            { email: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find({
      ...keyword,
      _id: { $ne: (req as any).user._id },
    }).select('-password');

    res.json(users);
  } catch (error) {
    logger.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};