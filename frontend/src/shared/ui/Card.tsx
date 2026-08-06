import React from 'react';

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
};
