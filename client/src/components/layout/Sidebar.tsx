import React, { useEffect, useState, useContext } from "react";
import ChatList from "../chat/ChatList";
import UserSearch from "../chat/UserSearch";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  Plus,
  X,
  Users,
  Search,
  MessageCircle,
  ChevronLeft,
  UserPlus,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const chatContext = useContext(ChatContext) as any;
  const authContext = useContext(AuthContext) as any;
  const getChats = chatContext?.getChats;

  const handleSelectUser = async (user: any) => {
    try {
      // Create a new chat with the selected user
      console.log("Creating new chat with user:", user);
      
      // Close the modal first to improve UX
      setShowNewChatModal(false);
      
      // Get the token from auth context
      const token = authContext?.user?.token || localStorage.getItem('token');
      
      // Include the token in the request headers
      const response = await axios.post(
        'http://localhost:5000/api/chats', 
        { userId: user._id },
        { 
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const newChat = response.data;
      console.log("New chat created:", newChat);
      
      // Refresh the chat list
      if (getChats) {
        await getChats();
      }
      
      // Navigate to the new chat
      if (newChat && newChat._id) {
        navigate(`/chat/${newChat._id}`);
      } else {
        console.error("Failed to create chat");
        alert("Could not create chat. Please try again.");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("An error occurred while creating the chat. Please try again.");
    }
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  return (
    <aside
      className={`w-full md:w-[420px] bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 md:z-0 flex flex-col h-full shadow-lg max-w-full`}
    >
      <div className="flex-shrink-0 p-4 sm:p-6 border-b dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <MessageCircle className="mr-2 sm:mr-3 text-blue-500" size={24} />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent truncate">Conversations</span>
          </h2>
          <div className="flex space-x-2 sm:space-x-4">
            <button
              onClick={() => setSearchVisible(!searchVisible)}
              className="p-2 sm:p-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full transition-colors shadow-sm"
              aria-label="Search chats"
            >
              <Search size={18} />
            </button>
            <button
              onClick={handleNewChat}
              className="p-2 sm:p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
              aria-label="New chat"
            >
              <Plus size={18} />
            </button>
            {isMobile && (
              <button
                onClick={onToggle}
                className="md:hidden p-2 sm:p-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full transition-colors"
                aria-label="Close sidebar"
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>
        </div>

        {searchVisible && (
          <div className="mt-3 sm:mt-5 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full p-2.5 sm:p-3.5 pl-10 sm:pl-12 pr-3 sm:pr-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm sm:text-base"
            />
            <Search
              className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400 dark:text-gray-500"
              size={18}
            />
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 px-1 sm:px-2">
        <ChatList onNewChat={handleNewChat} />
      </div>

      {/* New Contact Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl transform transition-all animate-fadeIn border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <UserPlus className="mr-2 sm:mr-3 text-blue-500" size={20} />
                  New Contact
                </h3>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-5">
                Search for users to add as a contact
              </p>

              <div className="mb-6">
                <UserSearch onSelectUser={handleSelectUser} />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    setShowNewChatModal(false);
                    setShowNewGroupModal(true);
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors w-full sm:w-auto flex items-center justify-center shadow-sm"
                >
                  <Users size={16} className="mr-2" />
                  Create Group Instead
                </button>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors w-full sm:w-auto shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Group Modal (separate functionality) */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl transform transition-all animate-fadeIn border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Users className="mr-3 text-blue-500" size={22} />
                  Create Group Chat
                </h3>
                <button
                  onClick={() => setShowNewGroupModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Create a new group and add members
              </p>

              {/* Group creation form would go here */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="Enter group name"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add Members
                </label>
                <UserSearch onSelectUser={() => {}} />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowNewGroupModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors w-full sm:w-auto shadow-sm"
                >
                  Cancel
                </button>
                <button className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center w-full sm:w-auto">
                  <Users size={16} className="mr-2" />
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
