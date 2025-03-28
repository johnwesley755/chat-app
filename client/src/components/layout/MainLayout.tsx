import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, LogOut, Settings, User, Moon, Sun } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../ui/Avatar";
import ThemeSelector from "../ui/ThemeSelector";

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const { state: authState, logout } = useAuth();
  const { user } = authState;

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setShowProfileMenu(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5] dark:bg-gray-900 overflow-hidden">
      {/* WhatsApp-like layout with sidebar and main content */}
      <div className="flex w-full h-full max-w-[1600px] mx-auto shadow-xl">
        {/* Sidebar - always visible on desktop, toggleable on mobile */}
        <div 
          className={`h-full ${
            isMobile 
              ? `fixed inset-y-0 left-0 z-40 w-[80%] max-w-[420px] transform transition-transform duration-300 ease-in-out ${
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : 'w-[30%] min-w-[320px] max-w-[420px] border-r border-gray-200 dark:border-gray-700'
          }`}
        >
          {/* WhatsApp-like profile header in sidebar */}
          <div className="bg-[#008069] dark:bg-gray-800 p-3 flex items-center justify-between text-white">
            <div className="flex items-center">
              <div 
                className="relative cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.username || "Profile"}
                  size="md"
                  status="online"
                />
              </div>
              <span className="font-medium ml-3">{user?.username || "My Profile"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeSelector />
              <button className="p-1.5 rounded-full hover:bg-[#ffffff20]">
                <Settings size={20} />
              </button>
            </div>
          </div>
          
          {/* Profile dropdown menu */}
          {showProfileMenu && (
            <div className="absolute z-50 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700">
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowProfileMenu(false)}
              >
                <User size={18} className="mr-3" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="flex items-center w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut size={18} className="mr-3" />
                <span>Sign out</span>
              </button>
            </div>
          )}
          
          {/* Search bar like WhatsApp */}
          <div className="p-2 bg-white dark:bg-gray-800">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search or start new chat" 
                className="w-full py-2 pl-10 pr-4 bg-[#f0f2f5] dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none"
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Rest of the sidebar content */}
          <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        </div>

        {/* Main content area */}
        <main 
          className={`flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-gray-800 ${
            isMobile ? 'w-full' : ''
          }`}
        >
          {/* Mobile header with WhatsApp-like tabs */}
          {isMobile && (
            <div className="bg-[#008069] dark:bg-gray-700 text-white">
              {/* Top header with app name */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  {!sidebarOpen && (
                    <button
                      onClick={toggleSidebar}
                      className="mr-3"
                      aria-label="Open sidebar"
                    >
                      <Menu size={24} />
                    </button>
                  )}
                  <h1 className="text-xl font-semibold">Chat App</h1>
                </div>
                <ThemeSelector />
              </div>
              
              {/* WhatsApp-like tabs */}
              <div className="flex text-sm font-medium">
                <div className="flex-1 text-center py-3 border-b-2 border-white">
                  CHATS
                </div>
                <div className="flex-1 text-center py-3 opacity-70">
                  STATUS
                </div>
                <div className="flex-1 text-center py-3 opacity-70">
                  CALLS
                </div>
              </div>
            </div>
          )}

          {/* Chat content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Outlet />
          </div>
        </main>

        {/* Overlay for mobile when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>

      {/* Mobile floating action button - WhatsApp style */}
      {isMobile && !sidebarOpen && !location.pathname.includes('/chat/') && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 z-50 p-4 bg-[#008069] hover:bg-[#00705d] text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
          aria-label="New chat"
        >
          <Menu size={24} />
        </button>
      )}
    </div>
  );
};

export default MainLayout;
