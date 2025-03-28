import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { useSocket } from "../../hooks/useSocket";
import { Users, Phone, Video, MoreVertical, Info } from "lucide-react";
import { useState } from "react";
const ChatBox: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Use type assertion to avoid TypeScript error for actions
  const { state, actions: chatActions } = useChat() as any;
  const { state: authState } = useAuth();
  const { selectedChat, messages } = state;
  const socket = useSocket();
  // Use type assertion to avoid TypeScript error
  const typingUsers = (socket as any).typingUsers || {};
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat when ID from URL changes
  useEffect(() => {
    if (id && chatActions && chatActions.selectChat) {
      chatActions.selectChat(id);
      setShouldScrollToBottom(true);
    }
  }, [id, chatActions]);

  // Handle scrolling behavior
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        // Check if user is near bottom (within 50px)
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
        setShouldScrollToBottom(isNearBottom);
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Initial scroll to bottom when chat loads
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [selectedChat]);

  // Only scroll to bottom when new messages arrive if we should
  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScrollToBottom]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="text-blue-500 dark:text-blue-400" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            {id ? "Loading conversation..." : "No conversation selected"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {!id && "Select a chat from the sidebar or start a new conversation to begin messaging"}
          </p>
        </div>
      </div>
    );
  }

  // Get chat name
  const getChatName = () => {
    if (selectedChat.isGroupChat) {
      return selectedChat.chatName;
    }

    const otherUser = selectedChat.users.find(
      (user: { _id: string }) => user._id !== authState.user?._id
    );
    return otherUser?.username || "Unknown User";
  };

  // Get avatar for the chat
  const getAvatar = () => {
    if (selectedChat.isGroupChat) {
      return null; // Group chats use a default icon
    }
    
    const otherUser = selectedChat.users.find(
      (user: { _id: string }) => user._id !== authState.user?._id
    );
    return otherUser?.avatar;
  };

  // Check if someone is typing in this chat
  const isTyping =
    selectedChat._id in typingUsers ? typingUsers[selectedChat._id] : false;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Enhanced Header */}
      <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
          {selectedChat.isGroupChat ? (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
              <Users className="text-white" size={18} />
            </div>
          ) : (
            <img 
              src={getAvatar() || "https://via.placeholder.com/40?text=User"} 
              alt={getChatName()}
              className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200 dark:border-gray-600"
            />
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{getChatName()}</h2>
            {selectedChat.isGroupChat ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Users size={12} className="mr-1" />
                {selectedChat.users.length} members
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {/* You could add online status here */}
                Active now
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            <Phone size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            <Video size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            <Info size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Message Area with subtle background pattern */}
      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-50"
        style={{ 
          height: "calc(100% - 140px)", // Adjust based on your header and input area heights
          maxHeight: "calc(100% - 140px)",
          overscrollBehavior: 'contain'
        }}
      >
        <div className="min-h-full flex flex-col">
          <div className="flex-grow"></div> {/* This pushes messages to the bottom when there are few */}
          <MessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input Area */}
      <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        {isTyping && <TypingIndicator />}
        <MessageInput chatId={selectedChat._id} />
      </div>
    </div>
  );
};

export default ChatBox;
