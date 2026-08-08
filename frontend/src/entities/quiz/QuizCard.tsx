import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../shared/ui/Card';
import type { Quiz } from './types';
import { Button } from '../../shared/ui/Button';
import { useNavigate } from 'react-router-dom';

export const QuizCard: React.FC<{
  quiz: Quiz;
  onDelete: (id: string) => void;
}> = ({ quiz, onDelete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const count = quiz._count?.questions || 0;
  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-semibold text-zinc-100">{quiz.title}</h3>
        <p className="text-zinc-400">{t('questions', { count })}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => navigate(`/quizzes/${quiz.id}`)}>
          {t('View')}
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
        >
          {t('Edit')}
        </Button>
        <Button variant="danger" onClick={() => onDelete(quiz.id)}>
          {t('Delete')}
        </Button>
      </div>
    </Card>
  );
};
