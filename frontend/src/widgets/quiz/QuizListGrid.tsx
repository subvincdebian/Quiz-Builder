import React from 'react';
import { QuizCard } from '../../entities/quiz/QuizCard';
import type { Quiz } from '../../entities/quiz/types';

export const QuizListGrid: React.FC<{
  quizzes: Quiz[];
  onDelete: (id: string) => void;
}> = ({ quizzes, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} onDelete={onDelete} />
      ))}
    </div>
  );
};
