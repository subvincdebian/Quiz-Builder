import { http, HttpResponse } from 'msw';

const quizzes = [
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
];
