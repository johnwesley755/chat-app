import { Request, Response } from 'express';
import Message from '../models/messageModel';
import User from '../models/userModel';
import Chat from '../models/chatModel';
import { logger } from '../utils/logger';

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is part of the chat
    if (!chat.users.includes((req as any).user._id)) {
      return res.status(403).json({ message: 'You are not part of this chat' });
    }

    // Create new message
    const newMessage = {
      sender: (req as any).user._id,
      content,
      chat: chatId,
    };

    // Create message and handle population with proper typing
    let message = await Message.create(newMessage);
    
    // Use any type for populated message to avoid TypeScript errors
    let populatedMessage: any = await message.populate('sender', 'username avatar');
    populatedMessage = await populatedMessage.populate('chat');
    populatedMessage = await User.populate(populatedMessage, {
      path: 'chat.users',
      select: 'username avatar email status',
    });

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(201).json(populatedMessage);
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is part of the chat
    if (!chat.users.includes((req as any).user._id)) {
      return res.status(403).json({ message: 'You are not part of this chat' });
    }

    // Get all messages for the chat
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username avatar email')
      .populate('chat');

    res.json(messages);
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:chatId
// @access  Private
export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is part of the chat
    if (!chat.users.includes((req as any).user._id)) {
      return res.status(403).json({ message: 'You are not part of this chat' });
    }

    // Mark all unread messages as read
    await Message.updateMany(
      {
        chat: chatId,
        readBy: { $ne: (req as any).user._id },
      },
      {
        $addToSet: { readBy: (req as any).user._id },
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    logger.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};