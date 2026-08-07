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
import { Modal } from '../../shared/ui/Modal';
import { useDebounce } from '../../shared/hooks/useDebounce';
import toast from 'react-hot-toast';

export const QuizListPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const fetchQuizzes = () => {
    setLoading(true);
    setError(null);
    quizApi
      .getAll()
      .then((res) => setQuizzes(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load quizzes. Please try again.');
        toast.error('Failed to load quizzes');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleDelete = async () => {
    if (!quizToDelete) return;
    try {
      await quizApi.delete(quizToDelete.id);
      setQuizzes(quizzes.filter((q) => q.id !== quizToDelete.id));
      toast.success('Quiz deleted successfully');
      setQuizToDelete(null);
    } catch {
      toast.error('Failed to delete quiz');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
      </header>

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
        <section
          className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md mx-auto"
          role="alert"
        >
          <AlertCircle className="h-12 w-12 text-rose-500" />
          <p className="text-zinc-100">{error}</p>
          <Button variant="ghost" onClick={fetchQuizzes}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try again
          </Button>
        </section>
      ) : filteredQuizzes.length === 0 ? (
        <section className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 max-w-md mx-auto">
          {search ? (
            <>
              <Search className="h-12 w-12 text-zinc-600" />
              <h2 className="text-xl font-medium text-zinc-100">
                No results found
              </h2>
              <p className="text-zinc-400">Try adjusting your search query.</p>
              <Button onClick={() => setSearch('')}>Clear search</Button>
            </>
          ) : (
            <>
              <FileQuestion className="h-12 w-12 text-zinc-600" />
              <h2 className="text-xl font-medium text-zinc-100">
                No quizzes yet
              </h2>
              <p className="text-zinc-400">
                Create your first quiz to get started.
              </p>
              <Button onClick={() => (window.location.href = '/create')}>
                <Plus className="mr-2 h-4 w-4" /> Create first quiz
              </Button>
            </>
          )}
        </section>
      ) : (
        <QuizListGrid
          quizzes={filteredQuizzes}
          onDelete={(id) =>
            setQuizToDelete(quizzes.find((q) => q.id === id) || null)
          }
        />
      )}

      <Modal
        isOpen={!!quizToDelete}
        onClose={() => setQuizToDelete(null)}
        title="Delete Quiz"
        onConfirm={handleDelete}
      >
        Are you sure you want to delete "{quizToDelete?.title}"? This action
        cannot be undone.
      </Modal>
    </div>
  );
};
