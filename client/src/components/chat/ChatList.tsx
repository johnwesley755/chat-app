import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { Chat } from '../../types/chat.types';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Users } from 'lucide-react';

interface ChatListProps {
  onNewChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onNewChat }) => {
  const { state, selectChat, getChats } = useContext(ChatContext);
  const { state: authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  // Add an effect to refresh chats when component mounts
  useEffect(() => {
    // Fetch chats when component mounts
    getChats();
  }, [getChats]);
  
  const handleSelectChat = async (chat: Chat) => {
    if (loading) return;
    setLoading(true);
    
    // Prevent default browser behavior that might cause scrolling
    try {
      await selectChat(chat);
    } catch (error) {
      console.error("Error selecting chat:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely get user name
  const getUserName = (user: any) => {
    return user?.name || user?.username || 'Unknown User';
  };

  // Helper function to get the other user in a 1:1 chat
  const getOtherUser = (chat: Chat) => {
    return chat.users.find((u) => u._id !== authState.user?._id);
  };

  // Helper function to format time
  const formatTime = (timestamp: string | undefined) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  // Helper function to get avatar URL
  const getAvatarUrl = (chat: Chat) => {
    if (chat.isGroupChat) {
      return (chat as any).groupAvatar || 'https://via.placeholder.com/40?text=Group';
    }
    const otherUser = getOtherUser(chat);
    return otherUser?.avatar || 'https://via.placeholder.com/40?text=User';
  };

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {state.loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : state.chats.length === 0 ? (
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <MessageCircle className="text-gray-400" size={48} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">No conversations yet</p>
          <button 
            onClick={onNewChat}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Start a new chat
          </button>
        </div>
      ) : (
        state.chats.map((chat) => {
          const otherUser = getOtherUser(chat);
          const isSelected = state.selectedChat?._id === chat._id;
          
          return (
            <div 
              key={chat._id}
              onClick={(e) => {
                e.preventDefault();
                handleSelectChat(chat);
              }}
              className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-50 dark:bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  {chat.isGroupChat ? (
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Users className="text-blue-500" size={20} />
                    </div>
                  ) : (
                    <img 
                      src={getAvatarUrl(chat)}
                      alt={chat.isGroupChat ? chat.chatName : getUserName(otherUser)}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                  )}
                  {otherUser?.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {chat.isGroupChat 
                        ? chat.chatName 
                        : getUserName(otherUser)}
                    </h3>
                    {chat.latestMessage && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(chat.latestMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {chat.latestMessage ? (
                      <>
                        <span className="font-medium">
                          {chat.latestMessage.sender._id === authState.user?._id
                            ? 'You: '
                            : ''}
                        </span>
                        {chat.latestMessage.content}
                      </>
                    ) : (
                      'No messages yet'
                    )}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatList;