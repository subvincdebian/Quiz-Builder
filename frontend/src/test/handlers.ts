import { http, HttpResponse } from 'msw';

interface QuizQuestion {
  id: string;
  type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX' | 'MULTIPLE_CHOICE';
  text: string;
  options: string[];
  correctAnswers: string[];
}

interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  questions: QuizQuestion[];
  _count?: {
    questions: number;
  };
}

const quizzes: Quiz[] = [
  {
    id: '1',
    title: 'Test Quiz',
    createdAt: '2026-08-07T00:00:00Z',
    questions: [],
    _count: { questions: 5 },
  },
];

export const handlers = [
  http.get('http://localhost:3000/quizzes', () => {
    return HttpResponse.json(quizzes);
  }),
  http.get('http://localhost:3000/quizzes/:id', ({ params }) => {
    const quiz = quizzes.find((q) => q.id === params.id);
    return quiz
      ? HttpResponse.json(quiz)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post('http://localhost:3000/quizzes', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: 'new-id', ...body }, { status: 201 });
  }),
  http.put('http://localhost:3000/quizzes/:id', async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: params.id, ...body }, { status: 200 });
  }),
];
