import { describe, it, expect } from 'vitest';
import { quizSchema, questionSchema } from '../schema';

describe('quiz schema', () => {
  it('should validate a correct quiz', () => {
    const validQuiz = {
      title: 'Test Quiz',
      questions: [
        {
          type: 'BOOLEAN',
          text: 'Is this true?',
          options: [
            { text: 'Yes', isCorrect: true },
            { text: 'No', isCorrect: false },
          ],
        },
      ],
    };
    expect(quizSchema.safeParse(validQuiz).success).toBe(true);
  });

  it('should fail if title is missing', () => {
    const invalidQuiz = {
      questions: [
        {
          type: 'BOOLEAN',
          text: 'Is this true?',
          options: [
            { text: 'Yes', isCorrect: true },
            { text: 'No', isCorrect: false },
          ],
        },
      ],
    };
    expect(quizSchema.safeParse(invalidQuiz).success).toBe(false);
  });

  it('should fail if options are missing for non-input types', () => {
    const invalidQuestion = {
      type: 'BOOLEAN',
      text: 'Question?',
      options: [{ text: 'Only one', isCorrect: true }],
    };
    expect(questionSchema.safeParse(invalidQuestion).success).toBe(false);
  });
});
