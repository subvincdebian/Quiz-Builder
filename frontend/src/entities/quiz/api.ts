import { apiClient } from '../../shared/api/apiClient';
import type { Quiz } from './types';
import type { QuizFormData } from '../../features/quiz/schema';

export const quizApi = {
  getAll: () => apiClient.get<Quiz[]>('/quizzes'),
  getById: (id: string) => apiClient.get<Quiz>(`/quizzes/${id}`),
  create: (data: QuizFormData) => apiClient.post<Quiz>('/quizzes', data),
  delete: (id: string) => apiClient.delete(`/quizzes/${id}`),
};
