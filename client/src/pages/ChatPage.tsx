import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../components/chat/ChatBox';
import GroupChatModal from '../components/chat/GroupChatModal';
import Button from '../components/ui/Button';
import { Users, Search, Plus, MessageCircle, Settings, Bell } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const { id } = useParams<{ id: string }>();

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header with improved styling - fixed position to ensure visibility */}
      <div className="sticky top-0 z-10 p-4 border-b dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <span>Chats</span>
            <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-0.5 ml-2">5</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
      
      {/* Main content area with height constraints to respect header */}
      <div className="flex-grow overflow-hidden relative">
        <ChatBox />
      </div>
      
      {/* Mobile floating action button with improved styling */}
      <button 
        onClick={() => setShowGroupModal(true)}
        className="md:hidden fixed bottom-6 right-6 z-10 p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
      >
        <Plus size={24} />
      </button>
      
      {showGroupModal && (
        <GroupChatModal
          isOpen={showGroupModal}
          onClose={() => setShowGroupModal(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;