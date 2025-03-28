import React, { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import Avatar from "../ui/Avatar";
import { Chat } from "../../types/chat.types";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { Users, CheckCheck, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isSelected, onClick }) => {
  const { state: authState } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const onlineUsers = (socket as any).onlineUsers || {};

  // Memoize derived data to improve performance
  const chatData = useMemo(() => {
    // Get other user for 1-on-1 chats
    const otherUser = !chat.isGroupChat
      ? chat.users.find((user) => user._id !== authState.user?._id)
      : null;

    // Chat name
    const chatName = chat.isGroupChat
      ? chat.chatName
      : otherUser?.username || "Unknown User";

    // Avatar
    const avatar = chat.isGroupChat ? undefined : otherUser?.avatar;

    // Status
    const status =
      !chat.isGroupChat && otherUser
        ? onlineUsers[otherUser._id]
          ? "online" as const
          : "offline" as const
        : undefined;

    // Latest message preview
    let messagePreview = "No messages yet";
    if (chat.latestMessage) {
      const sender =
        chat.latestMessage.sender._id === authState.user?._id
          ? "You"
          : chat.latestMessage.sender.username;

      messagePreview = `${sender}: ${chat.latestMessage.content.substring(
        0,
        30
      )}${chat.latestMessage.content.length > 30 ? "..." : ""}`;
    }

    // Format time
    let timeDisplay = "";
    if (chat.latestMessage) {
      const messageDate = new Date(chat.latestMessage.createdAt);
      const now = new Date();
      const diffInHours =
        (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        timeDisplay = messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (diffInHours < 168) {
        timeDisplay = messageDate.toLocaleDateString([], { weekday: "short" });
      } else {
        timeDisplay = messageDate.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });
      }
    }

    // Check if message is from current user
    const isMessageFromCurrentUser = chat.latestMessage
      ? chat.latestMessage.sender._id === authState.user?._id
      : false;

    return {
      chatName,
      avatar,
      status,
      messagePreview,
      timeDisplay,
      isMessageFromCurrentUser,
      hasUnreadMessages: false, // Placeholder - implement actual logic
    };
  }, [chat, authState.user, onlineUsers]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Navigate programmatically to ensure proper state updates
    navigate(`/chat/${chat._id}`);

    // Call the provided onClick handler
    onClick();
  };

  return (
    <div
      className={`px-4 py-3.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 ${
        isSelected
          ? "bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500 pl-3"
          : ""
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
    >
      <div className="flex items-center space-x-3">
        {chat.isGroupChat ? (
          <div className="relative w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="text-white" size={20} />
          </div>
        ) : (
          <div className="relative flex-shrink-0">
            <Avatar
              src={chatData.avatar}
              alt={chatData.chatName}
              status={chatData.status}
              size="md"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {chatData.chatName}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {chatData.timeDisplay}
            </span>
          </div>

          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[75%]">
              {chatData.messagePreview}
            </p>

            <div className="flex items-center ml-2">
              {chatData.isMessageFromCurrentUser && (
                <CheckCheck size={16} className="text-blue-500 flex-shrink-0" />
              )}

              {chatData.hasUnreadMessages && (
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
