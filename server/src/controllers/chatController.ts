import { Request, Response } from 'express';
import Chat from '../models/chatModel';
import User from '../models/userModel';
import { logger } from '../utils/logger';
// @desc    Create or access one-to-one chat
// @route   POST /api/chats
// @access  Private
export const accessChat = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }

    // Find existing chat between current user and selected user
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: {
        $all: [
          (req as any).user._id,
          userId
        ]
      }
    }).populate('users', '-password')
      .populate('latestMessage');
    
    // Populate sender details in latestMessage
    if (chat?.latestMessage) {
      chat = await (chat as any).populate({
        path: 'latestMessage.sender',
        select: 'username avatar email'
      });
    }

    // If chat exists, return it
    if (chat) {
      return res.json(chat);
    }

    // If chat doesn't exist, create a new one
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [(req as any).user._id, userId]
    };

    const newChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(newChat._id).populate('users', '-password');

    res.status(201).json(fullChat);
  } catch (error) {
    logger.error('Access chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
export const getChats = async (req: Request, res: Response) => {
  try {
    // Find all chats that the user is part of
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: (req as any).user._id } }
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });
    
    // Populate sender details in latestMessage
    const populatedChats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'username avatar email'
    });

    res.json(populatedChats);
  } catch (error) {
    logger.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create group chat
// @route   POST /api/chats/group
// @access  Private
export const createGroupChat = async (req: Request, res: Response) => {
  try {
    const { name, users } = req.body;

    if (!name || !users) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Parse users if it's a string
    let userArray = users;
    if (typeof users === 'string') {
      userArray = JSON.parse(users);
    }

    // Check if there are at least 2 users
    if (userArray.length < 2) {
      return res.status(400).json({ message: 'A group chat requires at least 3 users (including you)' });
    }

    // Add current user to the group
    userArray.push((req as any).user._id);

    // Create group chat
    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: userArray,
      groupAdmin: (req as any).user._id
    });

    // Fetch full group chat details
    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json(fullGroupChat);
  } catch (error) {
    logger.error('Create group chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update group chat
// @route   PUT /api/chats/group/:id
// @access  Private
export const updateGroupChat = async (req: Request, res: Response) => {
  try {
    const { chatName } = req.body;
    const { id } = req.params;

    // Check if chat exists and user is admin
    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: 'This is not a group chat' });
    }

    if (chat.groupAdmin?.toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can update group chat' });
    }

    // Update chat name
    chat.chatName = chatName || chat.chatName;
    await chat.save();

    // Fetch updated chat
    const updatedChat = await Chat.findById(id)
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.json(updatedChat);
  } catch (error) {
    logger.error('Update group chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add user to group
// @route   PUT /api/chats/group/:id/add
// @access  Private
export const addToGroup = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    // Check if chat exists and user is admin
    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: 'This is not a group chat' });
    }

    if (chat.groupAdmin?.toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can add users to group chat' });
    }

    // Check if user is already in the group
    if (chat.users.includes(userId as any)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    // Add user to group
    chat.users.push(userId as any);
    await chat.save();

    // Fetch updated chat
    const updatedChat = await Chat.findById(id)
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.json(updatedChat);
  } catch (error) {
    logger.error('Add to group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove user from group
// @route   PUT /api/chats/group/:id/remove
// @access  Private
export const removeFromGroup = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    // Check if chat exists and user is admin
    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: 'This is not a group chat' });
    }

    if (chat.groupAdmin?.toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can remove users from group chat' });
    }

    // Remove user from group
    chat.users = chat.users.filter(user => user.toString() !== userId);
    await chat.save();

    // Fetch updated chat
    const updatedChat = await Chat.findById(id)
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.json(updatedChat);
  } catch (error) {
    logger.error('Remove from group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};