import React, { useState, useEffect } from 'react';
import { searchUsers } from '../../services/userService';
import Avatar from '../ui/Avatar';
import LoadingSpinner from '../ui/LoadingSpinner';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status?: string;
}

interface UserSearchProps {
  onSelectUser: (user: User) => void;
  excludeUserIds?: string[];
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser, excludeUserIds = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const users = await searchUsers(searchTerm);
        // Filter out excluded users
        const filteredUsers = users.filter(user => !excludeUserIds.includes(user._id));
        setSearchResults(filteredUsers);
      } catch (err) {
        setError('Failed to search users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchUsers, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, excludeUserIds]);

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {loading && (
          <div className="absolute right-2 top-2">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {searchResults.length > 0 && (
        <ul className="mt-2 border rounded-md overflow-hidden dark:border-gray-600">
          {searchResults.map((user) => (
            <li 
              key={user._id}
              onClick={() => onSelectUser(user)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
            >
              <Avatar 
                src={user.avatar} 
                alt={user.username} 
                size="sm" 
                status={user.status as "online" | "offline" | "away" | undefined}
              />
              <div className="ml-2">
                <p className="font-medium dark:text-white">{user.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {searchTerm.length >= 2 && searchResults.length === 0 && !loading && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">No users found</p>
      )}
    </div>
  );
};

export default UserSearch;