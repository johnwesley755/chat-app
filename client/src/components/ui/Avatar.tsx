import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away';
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  status 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
  };

  return (
    <div className="relative inline-block">
      <img
        src={src || '/assets/images/default-avatar.png'}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 dark:border-gray-700`}
      />
      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ${
            statusColors[status]
          } ${size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'} ring-2 ring-white`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;