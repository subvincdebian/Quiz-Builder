import { z } from 'zod';

export const questionResponseSchema = z.object({
  id: z.string(),
  type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX', 'MULTIPLE_CHOICE']),
  text: z.string(),
  options: z.array(z.string()),
  correctAnswers: z.array(z.string()),
});

export const quizResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
  questions: z.array(questionResponseSchema),
  _count: z
    .object({
      questions: z.number(),
    })
    .optional(),
});
