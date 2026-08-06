import React, { useEffect, useState } from 'react';
import {
  FileQuestion,
  RefreshCw,
  Plus,
  AlertCircle,
  Search,
} from 'lucide-react';
import { quizApi } from '../../entities/quiz/api';
import type { Quiz } from '../../entities/quiz/types';
import { QuizListGrid } from '../../widgets/quiz/QuizListGrid';
import { Skeleton } from '../../shared/ui/Skeleton';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';
import { useDebounce } from '../../shared/hooks/useDebounce';

export const QuizListPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const fetchQuizzes = () => {
    setLoading(true);
    setError(null);
    quizApi
      .getAll()
      .then((res) => setQuizzes(res.data))
      .catch((err) => {
        console.error(err);
        setError(
          'Не удалось загрузить квизы. Проверьте соединение с сервером.'
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [debouncedSearch]);

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await quizApi.delete(id);
      setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch {
      alert('Failed to delete quiz');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          Available Quizzes
        </h1>
        <Input
          placeholder="Search quizzes..."
          className="w-full sm:w-64"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          aria-label="Search quizzes"
        />
      </div>

      {loading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Loading quizzes"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : error ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md mx-auto"
          role="alert"
        >
          <AlertCircle className="h-12 w-12 text-rose-500" />
          <p className="text-zinc-100">{error}</p>
          <Button variant="ghost" onClick={fetchQuizzes}>
            <RefreshCw className="mr-2 h-4 w-4" /> Попробовать снова
          </Button>
        </div>
      ) : isSearching ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-busy="true"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 max-w-md mx-auto">
          {search ? (
            <>
              <Search className="h-12 w-12 text-zinc-600" />
              <h2 className="text-xl font-medium text-zinc-100">
                Ничего не найдено
              </h2>
              <p className="text-zinc-400">
                Попробуйте изменить поисковый запрос.
              </p>
              <Button onClick={() => setSearch('')}>Сбросить поиск</Button>
            </>
          ) : (
            <>
              <FileQuestion className="h-12 w-12 text-zinc-600" />
              <h2 className="text-xl font-medium text-zinc-100">
                У вас пока нет квизов
              </h2>
              <p className="text-zinc-400">
                Создайте свой первый квиз, чтобы начать тестирование.
              </p>
              <Button onClick={() => (window.location.href = '/create')}>
                <Plus className="mr-2 h-4 w-4" /> Создать первый квиз
              </Button>
            </>
          )}
        </div>
      ) : (
        <QuizListGrid quizzes={filteredQuizzes} onDelete={handleDelete} />
      )}
    </div>
  );
};
