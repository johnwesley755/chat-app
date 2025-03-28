import React from 'react';
import { format } from 'date-fns';
import Avatar from '../ui/Avatar';
import { Message } from '../../types/chat.types';
import { useAuth } from '../../hooks/useAuth';
import { CheckCheck } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { state } = useAuth();
  const isOwnMessage = message.sender._id === state.user?._id;

  return (
    <div
      className={`flex ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`flex max-w-[70%] ${
          isOwnMessage ? 'flex-row-reverse' : 'flex-row'
        } items-end`}
      >
        {!isOwnMessage && (
          <div className="flex-shrink-0 mr-2 mb-1">
            <Avatar
              src={message.sender.avatar}
              alt={message.sender.username}
              size="sm"
            />
          </div>
        )}
        <div>
          {!isOwnMessage && (
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 ml-1">
              {message.sender.username}
            </p>
          )}
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-sm ${
              isOwnMessage
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <div
            className={`flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 ${
              isOwnMessage ? 'justify-end' : 'justify-start'
            }`}
          >
            <span>{format(new Date(message.createdAt), 'h:mm a')}</span>
            {isOwnMessage && (
              <CheckCheck size={14} className="ml-1 text-blue-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;