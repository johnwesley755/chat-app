import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatContext } from '../../context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';

const ChatView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, selectChat } = useContext(ChatContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id && state.chats.length > 0) {
      // Find the chat by ID from the existing chats
      const chatToSelect = state.chats.find(chat => chat._id === id);
      if (chatToSelect) {
        selectChat(chatToSelect);
      }
    }
  }, [id, state.chats, selectChat]);
  
  const handleBack = () => {
    navigate('/chat');
  };
  
  if (!state.selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader chat={state.selectedChat} onBack={handleBack} />
      {state.messages && <MessageList messages={state.messages} />}
      <MessageInput chatId={state.selectedChat._id} />
    </div>
  );
};

export default ChatView;