import React from 'react';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { Chat } from '../../types/chat.types';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';

interface ChatHeaderProps {
  chat: Chat;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onBack }) => {
  const { state } = useAuth();
  
  // Get chat name (for group chat) or other user's name (for 1-on-1)
  const getChatName = () => {
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    
    const otherUser = chat.users.find(
      (user) => user._id !== state.user?._id
    );
    return otherUser?.username || 'Unknown User';
  };
  
  // Get avatar for chat (group icon or other user's avatar)
  const getAvatar = () => {
    if (chat.isGroupChat) {
      return undefined;
    }
    
    const otherUser = chat.users.find(
      (user) => user._id !== state.user?._id
    );
    return otherUser?.avatar;
  };
  
  return (
    <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
      <button 
        onClick={onBack}
        className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
      >
        <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
      </button>
      
      <div className="flex items-center flex-1">
        {chat.isGroupChat ? (
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-blue-500 font-medium">{chat.chatName.substring(0, 2).toUpperCase()}</span>
          </div>
        ) : (
          <Avatar
            src={getAvatar()}
            alt={getChatName()}
            size="md"
          />
        )}
        
        <div className="ml-3">
          <h2 className="font-medium text-gray-900 dark:text-white">{getChatName()}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {chat.isGroupChat 
              ? `${chat.users.length} members` 
              : 'Online'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Phone size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Video size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <MoreVertical size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;