import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center mb-2">
      <div className="text-gray-500 dark:text-gray-400 text-sm">
        Someone is typing
        <span className="inline-flex">
          <span className="animate-bounce mx-0.5">.</span>
          <span className="animate-bounce mx-0.5 animation-delay-200">.</span>
          <span className="animate-bounce mx-0.5 animation-delay-400">.</span>
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;