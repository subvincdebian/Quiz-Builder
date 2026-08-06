import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex flex-row items-center justify-center gap-2 whitespace-nowrap px-5 min-h-[44px] rounded-md font-medium transition-all duration-200 ease-in-out active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20',
    ghost:
      'bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 border border-zinc-700',
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};
