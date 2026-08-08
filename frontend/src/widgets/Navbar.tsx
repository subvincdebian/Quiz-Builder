import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../shared/lib/utils';
import { LanguageSwitcher } from '../shared/ui/LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/quizzes"
          className="text-xl font-bold tracking-tight text-indigo-400"
        >
          {t('QuizBuilder')}
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
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
            {t('Quizzes')}
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
            {t('Create')}
          </NavLink>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};
