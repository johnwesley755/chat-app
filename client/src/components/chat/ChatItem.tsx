import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../ui/Avatar';
import { Chat } from '../../types/chat.types';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { MessageCircle, Users, CheckCheck } from 'lucide-react';

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isSelected, onClick }) => {
  const { state: authState } = useAuth();
  const socket = useSocket();
  // Use type assertion to avoid TypeScript error
  const onlineUsers = (socket as any).onlineUsers || {};
  
  // Get chat name (for group chat) or other user's name (for 1-on-1)
  const getChatName = () => {
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    
    const otherUser = chat.users.find(
      (user) => user._id !== authState.user?._id
    );
    return otherUser?.username || 'Unknown User';
  };
  
  // Get avatar for chat (group icon or other user's avatar)
  const getAvatar = () => {
    if (chat.isGroupChat) {
      return undefined; // Use default group avatar instead of null
    }
    
    const otherUser = chat.users.find(
      (user) => user._id !== authState.user?._id
    );
    return otherUser?.avatar;
  };
  
  // Get online status for 1-on-1 chats
  const getStatus = () => {
    if (chat.isGroupChat) {
      return undefined;
    }
    
    const otherUser = chat.users.find(
      (user) => user._id !== authState.user?._id
    );
    
    if (!otherUser) return 'offline';
    
    return onlineUsers[otherUser._id] ? 'online' : 'offline';
  };
  
  // Format the latest message preview
  const getLatestMessagePreview = () => {
    if (!chat.latestMessage) {
      return 'No messages yet';
    }
    
    const sender = chat.latestMessage.sender._id === authState.user?._id
      ? 'You'
      : chat.latestMessage.sender.username;
    
    return `${sender}: ${chat.latestMessage.content.substring(0, 30)}${
      chat.latestMessage.content.length > 30 ? '...' : ''
    }`;
  };
  
  // Format the time of the latest message
  const getLatestMessageTime = () => {
    if (!chat.latestMessage) {
      return '';
    }
    
    return formatDistanceToNow(new Date(chat.latestMessage.createdAt), {
      addSuffix: true,
    });
  };

  // Check if there are unread messages
  const hasUnreadMessages = () => {
    // This is a placeholder - implement your unread message logic here
    return false;
  };
  
  return (
    <div
      className={`px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
        isSelected ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        {chat.isGroupChat ? (
          <div className="relative w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="text-white" size={20} />
          </div>
        ) : (
          <div className="relative flex-shrink-0">
            <Avatar
              src={getAvatar()}
              alt={getChatName()}
              status={getStatus()}
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {getChatName()}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {getLatestMessageTime()}
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {getLatestMessagePreview()}
            </p>
            
            <div className="flex items-center ml-2">
              {chat.latestMessage && chat.latestMessage.sender._id === authState.user?._id && (
                <CheckCheck size={16} className="text-blue-500 flex-shrink-0" />
              )}
              
              {hasUnreadMessages() && (
                <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium ml-1">
                  3
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;