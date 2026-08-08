import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuizForm } from '../QuizForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { quizApi } from '../../../entities/quiz/api';
import * as router from 'react-router-dom';

// Mock only the router, not the API
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: vi.fn(),
  };
});

describe('QuizForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(router, 'useParams').mockReturnValue({ id: undefined });
  });

  it('renders correctly in create mode', () => {
    render(
      <BrowserRouter>
        <QuizForm />
      </BrowserRouter>
    );
    expect(screen.getByText('Create New Quiz')).toBeInTheDocument();
  });

  it('submits valid data successfully', async () => {
    const createSpy = vi.spyOn(quizApi, 'create');

    render(
      <BrowserRouter>
        <QuizForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Quiz Title/i), {
      target: { value: 'New Quiz' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Enter your question here.../i),
      { target: { value: 'Question 1' } }
    );

    const optionInputs = screen.getAllByPlaceholderText(/Option \d+/i);
    fireEvent.change(optionInputs[0], { target: { value: 'Opt 1' } });
    fireEvent.change(optionInputs[1], { target: { value: 'Opt 2' } });

    const submitButton = screen.getByRole('button', { name: /Create Quiz/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('handles type change correctly (Checkbox and Multiple Choice)', async () => {
    render(
      <BrowserRouter>
        <QuizForm />
      </BrowserRouter>
    );

    const typeSelectButtons = screen.getAllByRole('button', {
      name: /Boolean|Input|Checkbox|Multiple Choice/i,
    });

    // Checkbox
    fireEvent.click(typeSelectButtons[2]);
    await waitFor(() => {
      expect(screen.getByText(/Select all that apply/i)).toBeInTheDocument();
    });

    // Multiple Choice
    fireEvent.click(typeSelectButtons[3]);
    await waitFor(() => {
      expect(screen.getByText(/Select one/i)).toBeInTheDocument();
    });
  });

  it('allows duplicating a question', async () => {
    render(
      <BrowserRouter>
        <QuizForm />
      </BrowserRouter>
    );

    const copyButtons = screen.getAllByTitle('Duplicate question');
    fireEvent.click(copyButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByLabelText(/Question \d+/i)).toHaveLength(2);
    });
  });

  it('displays loading state when in edit mode', async () => {
    vi.spyOn(router, 'useParams').mockReturnValue({ id: '1' });

    render(
      <BrowserRouter>
        <QuizForm />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading quiz data/i)).toBeInTheDocument();
  });

  it('correctly handles Boolean type specific option requirement', async () => {
    render(
      <BrowserRouter>
        <QuizForm />
      </BrowserRouter>
    );

    const typeSelectButtons = screen.getAllByRole('button', {
      name: /Boolean|Input|Checkbox|Multiple Choice/i,
    });

    // Switch to BOOLEAN
    fireEvent.click(typeSelectButtons[0]);
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText(/Option \d+/i)).toHaveLength(2);
    });
  });

  it('correctly handles Input type specific option requirement', async () => {
    render(
      <BrowserRouter>
        <QuizForm />
      </BrowserRouter>
    );

    const typeSelectButtons = screen.getAllByRole('button', {
      name: /Boolean|Input|Checkbox|Multiple Choice/i,
    });

    // Switch to INPUT
    fireEvent.click(typeSelectButtons[1]);
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Correct answer/i)
      ).toBeInTheDocument();
    });
  });
});
