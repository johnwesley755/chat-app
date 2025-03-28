import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Menu,
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
  ArrowLeft,
  MessageCircle,
  Phone,
  Image,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../ui/Avatar";
import ThemeSelector from "../ui/ThemeSelector";

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state: authState, logout } = useAuth();
  const { user } = authState;
  const isInChatView = location.pathname.includes("/chat/");

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

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Main layout container with max width and shadow */}
      <div className="flex w-full h-full max-w-[1600px] mx-auto shadow-2xl rounded-lg overflow-hidden">
        {/* Sidebar - always visible on desktop, toggleable on mobile */}
        <div
          className={`h-full ${
            isMobile
              ? `fixed inset-y-0 left-0 z-40 w-[85%] max-w-[420px] transform transition-transform duration-300 ease-in-out ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "w-[30%] min-w-[320px] max-w-[420px] border-r border-gray-200 dark:border-gray-700"
          }`}
        >
          {/* Profile header in sidebar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-gray-900 p-4 flex items-center justify-between text-white">
            <div className="flex items-center">
              <div
                className="relative cursor-pointer transition-transform hover:scale-105"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.username || "Profile"}
                  size="md"
                  status="online"
                />
              </div>
              <span className="font-medium ml-3 text-lg">
                {user?.username || "My Profile"}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeSelector />
              <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Profile dropdown menu with enhanced styling */}
          {showProfileMenu && (
            <div className="absolute z-50 mt-1 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 border border-gray-200 dark:border-gray-700 animate-fadeIn">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Signed in as
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowProfileMenu(false)}
              >
                <User size={18} className="mr-3 text-blue-500" />
                <span>My Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowProfileMenu(false)}
              >
                <Settings size={18} className="mr-3 text-blue-500" />
                <span>Settings</span>
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="flex items-center w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                <span>Sign out</span>
              </button>
            </div>
          )}

          {/* Enhanced search bar */}
          <div className="p-3 bg-white dark:bg-gray-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Search or start new chat"
                className="w-full py-2.5 pl-10 pr-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-3 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Sidebar content */}
          <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        </div>

        {/* Main content area */}
        <main
          className={`flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-gray-800 ${
            isMobile ? "w-full" : ""
          }`}
        >
          {/* Mobile header with improved styling */}
          {isMobile && (
            <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-gray-900 text-white shadow-md">
              {/* Top header with app name */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  {isInChatView ? (
                    <button
                      onClick={handleGoBack}
                      className="mr-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
                      aria-label="Go back"
                    >
                      <ArrowLeft size={22} />
                    </button>
                  ) : (
                    <button
                      onClick={toggleSidebar}
                      className="mr-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
                      aria-label="Open sidebar"
                    >
                      <Menu size={22} />
                    </button>
                  )}
                  <h1 className="text-xl font-semibold flex items-center">
                    <span>Chat App</span>
                    {!isInChatView && (
                      <span className="ml-2 text-xs bg-white text-blue-600 rounded-full px-2 py-0.5">
                        5
                      </span>
                    )}
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <ThemeSelector />
                  {isInChatView && (
                    <button className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                      <Phone size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation tabs - only show on main view */}
              {!isInChatView && (
                <div className="flex text-sm font-medium">
                  <Link
                    to="/"
                    className="flex-1 text-center py-3 border-b-2 border-white flex items-center justify-center"
                  >
                    <MessageCircle size={16} className="mr-1" />
                    <span>CHATS</span>
                  </Link>
                  <div className="flex-1 text-center py-3 opacity-70 flex items-center justify-center">
                    <Image size={16} className="mr-1" />
                    <span>STATUS</span>
                  </div>
                  <div className="flex-1 text-center py-3 opacity-70 flex items-center justify-center">
                    <Phone size={16} className="mr-1" />
                    <span>CALLS</span>
                  </div>
                </div>
              )}
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
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>

      {/* Mobile floating action button - context aware */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={isInChatView ? handleGoBack : toggleSidebar}
          className={`fixed bottom-6 ${
            isInChatView ? "left-6" : "right-6"
          } z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center`}
          aria-label={isInChatView ? "Go back" : "Open menu"}
        >
          {isInChatView ? <ArrowLeft size={24} /> : <Menu size={24} />}
        </button>
      )}
    </div>
  );
};

export default MainLayout;
