import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/widgets/Navbar';
import { QuizListPage } from '@/pages/quiz/QuizListPage';
import { QuizDetailPage } from '@/pages/quiz/QuizDetailPage';
import { QuizForm } from '@/features/quiz/QuizForm';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          <Navbar />
          <main className="container mx-auto px-6 py-10">
            <Routes>
              <Route path="/" element={<Navigate to="/quizzes" />} />
              <Route path="/quizzes" element={<QuizListPage />} />
              <Route path="/quizzes/:id" element={<QuizDetailPage />} />
              <Route path="/quizzes/:id/edit" element={<QuizForm />} />
              <Route path="/create" element={<QuizForm />} />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
