import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4" role="status">
        <span className="hidden">Loading...</span>
      </div>
    </div>
  );
};
