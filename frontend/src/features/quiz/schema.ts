import { z } from 'zod';

export const optionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

export const questionSchema = z.object({
  type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
  text: z.string().min(1, 'Question text is required'),
  options: z.array(optionSchema).min(2, 'At least 2 options are required'),
});

export const quizSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  questions: z.array(questionSchema).min(1, 'At least 1 question is required'),
});

export type QuizFormData = z.infer<typeof quizSchema>;
