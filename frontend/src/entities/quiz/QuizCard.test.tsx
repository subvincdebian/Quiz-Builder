import { render, screen } from '@testing-library/react';
import { QuizCard } from './QuizCard';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const mockQuiz = {
  id: '1',
  title: 'Test Quiz',
  createdAt: '2026-08-07T00:00:00Z',
  questions: [],
  _count: { questions: 5 },
};

describe('QuizCard', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <QuizCard quiz={mockQuiz} onDelete={vi.fn()} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
    expect(screen.getByText('5 questions')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(
      <BrowserRouter>
        <QuizCard quiz={mockQuiz} onDelete={onDelete} />
      </BrowserRouter>
    );
    screen.getByRole('button', { name: /delete/i }).click();
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
