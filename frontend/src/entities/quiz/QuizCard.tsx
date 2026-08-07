import React from 'react';
import { Card } from '../../shared/ui/Card';
import type { Quiz } from './types';
import { Button } from '../../shared/ui/Button';
import { useNavigate } from 'react-router-dom';

export const QuizCard: React.FC<{
  quiz: Quiz;
  onDelete: (id: string) => void;
}> = ({ quiz, onDelete }) => {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-semibold text-zinc-100">{quiz.title}</h3>
        <p className="text-zinc-400">{quiz._count?.questions || 0} questions</p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => navigate(`/quizzes/${quiz.id}`)}>
          View
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
        >
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(quiz.id)}>
          Delete
        </Button>
      </div>
    </Card>
  );
};
