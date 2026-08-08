import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { quizApi } from '@/entities/quiz/api';
import type { Quiz } from '@/entities/quiz/types';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ArrowLeft, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const QuizDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      quizApi
        .getById(id)
        .then((res) => setQuiz(res.data))
        .catch(() => {
          toast.error(t('Failed to load quiz'));
          navigate('/quizzes');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate, t]);

  if (loading)
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  if (!quiz) return null;

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/quizzes')}>
          <ArrowLeft className="w-4 h-4" /> {t('Back to list')}
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(`/quizzes/${id}/edit`)}
        >
          <Edit2 className="w-4 h-4" /> {t('Edit Quiz')}
        </Button>
      </header>

      <Card>
        <div className="border-b border-zinc-800 pb-6 mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
            {quiz.title}
          </h1>
          <p className="text-zinc-500 mt-2">
            {t('Created on', {
              date: new Date(quiz.createdAt).toLocaleDateString(),
            })}
          </p>
        </div>

        <section className="space-y-8" aria-label={t('Questions')}>
          {quiz.questions.map((q, i) => (
            <div
              key={q.id}
              className="bg-zinc-950/50 p-6 rounded-xl border border-zinc-800"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold mt-0.5">
                  {i + 1}
                </span>
                <p className="text-lg font-medium text-zinc-100 leading-relaxed">
                  {q.text}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {q.options.map((opt, oI) => {
                  const isCorrect = q.correctAnswers.includes(opt);
                  return (
                    <div
                      key={oI}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${isCorrect ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400'}`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                      )}
                      <span className="text-sm">{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </Card>
    </article>
  );
};
