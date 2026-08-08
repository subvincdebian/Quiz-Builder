import { apiClient } from '../../shared/api/apiClient';
import type { Quiz } from './types';
import { quizResponseSchema } from './schema';
import type { QuizFormData } from '../../features/quiz/schema';

export const quizApi = {
  getAll: async () => {
    const response = await apiClient.get<Quiz[]>('/quizzes');
    // Assuming a list structure, we could validate it here as well if needed
    return response;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<Quiz>(`/quizzes/${id}`);

    // Runtime validation using the response-specific schema
    const result = quizResponseSchema.safeParse(response.data);
    if (!result.success) {
      console.error('API Contract violation for getById:', result.error);
      throw new Error('Invalid data format received from server');
    }

    return { ...response, data: result.data };
  },
  create: (data: QuizFormData) => apiClient.post<Quiz>('/quizzes', data),
  update: (id: string, data: QuizFormData) =>
    apiClient.put<Quiz>(`/quizzes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/quizzes/${id}`),
};
