import { render, screen } from '@testing-library/react';
import { QuizCard } from '../QuizCard';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const mockQuiz = {
  id: '1',
  title: 'Test Quiz',
  createdAt: '2026-08-07T00:00:00Z',
  questions: [],
  _count: { questions: 5 },
};

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

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

  it('renders correctly without count', () => {
    render(
      <BrowserRouter>
        <QuizCard
          quiz={{ ...mockQuiz, _count: undefined }}
          onDelete={vi.fn()}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('0 questions')).toBeInTheDocument();
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

  it('navigates correctly', () => {
    render(
      <BrowserRouter>
        <QuizCard quiz={mockQuiz} onDelete={vi.fn()} />
      </BrowserRouter>
    );

    screen.getByRole('button', { name: /view/i }).click();
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/quizzes/1');

    screen.getByRole('button', { name: /edit/i }).click();
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/quizzes/1/edit');
  });
});
