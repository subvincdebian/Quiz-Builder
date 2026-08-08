import { z } from 'zod';

export const optionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

export const questionSchema = z
  .object({
    type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX', 'MULTIPLE_CHOICE']),
    text: z.string().min(1, 'Question text is required'),
    options: z.array(optionSchema),
  })
  .refine(
    (data) => {
      if (data.type !== 'INPUT' && data.options.length < 2) return false;
      return true;
    },
    {
      message: 'At least 2 options are required for this question type',
      path: ['options'],
    }
  );

export const quizSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  questions: z.array(questionSchema).min(1, 'At least 1 question is required'),
});

export type QuizFormData = z.infer<typeof quizSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
