import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '../shared/lib/utils';

export const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/quizzes"
          className="text-xl font-bold tracking-tight text-indigo-400"
        >
          QuizBuilder
        </Link>
        <div className="flex gap-4 sm:gap-6">
          <NavLink
            to="/quizzes"
            className={({ isActive }) =>
              cn(
                'text-sm font-medium transition-colors',
                isActive
                  ? 'text-indigo-400'
                  : 'text-zinc-400 hover:text-zinc-100'
              )
            }
          >
            Quizzes
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              cn(
                'text-sm font-medium transition-colors',
                isActive
                  ? 'text-indigo-400'
                  : 'text-zinc-400 hover:text-zinc-100'
              )
            }
          >
            Create
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
