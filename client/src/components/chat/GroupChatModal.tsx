import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { searchUsers } from '../../services/userService';
import { User } from '../../types/auth.types';
import { useDebounce } from '../../hooks/useDebounce';
import Avatar from '../ui/Avatar';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

// Define a proper error interface
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { createGroupChat } = useChat();
  
  React.useEffect(() => {
    const searchForUsers = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const results = await searchUsers(debouncedSearchTerm);
        // Filter out already selected users
        const filteredResults = results.filter(
          (user) => !selectedUsers.some((selected) => selected._id === user._id)
        );
        setSearchResults(filteredResults);
        setError(null);
      } catch (error: unknown) {
        const apiError = error as ApiError;
        setError(apiError.response?.data?.message || apiError.message || 'Failed to search users');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    searchForUsers();
  }, [debouncedSearchTerm, selectedUsers]);
  
  const handleUserSelect = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchTerm('');
  };
  
  const handleUserRemove = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };
  
  const handleSubmit = async () => {
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }
    
    if (selectedUsers.length < 2) {
      setError('Please select at least 2 users');
      return;
    }
    
    setLoading(true);
    try {
      await createGroupChat(
        selectedUsers.map((user) => user._id),
        groupName.trim()
      );
      onClose();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setError(apiError.response?.data?.message || apiError.message || 'Failed to create group chat');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Create Group Chat
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <Input
          label="Group Name"
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fullWidth
          className="mb-4"
        />
        
        <Input
          label="Add Users"
          type="text"
          placeholder="Search users to add"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
        
        {error && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        
        {/* Selected users */}
        {selectedUsers.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Selected Users:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1"
                >
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {user.username}
                  </span>
                  <button
                    onClick={() => handleUserRemove(user._id)}
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Search results */}
        <div className="mt-4 max-h-40 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : searchResults.length > 0 ? (
            <ul className="divide-y dark:divide-gray-700">
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className="py-2 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer px-2 rounded"
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.username}
                    size="sm"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchTerm ? (
            <p className="text-center py-2 text-gray-500 dark:text-gray-400">
              No users found
            </p>
          ) : null}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={loading}
            disabled={selectedUsers.length < 2 || !groupName.trim()}
          >
            Create Group
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;