export interface Question {
  id: string;
  type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX' | 'MULTIPLE_CHOICE';
  text: string;
  options: string[];
  correctAnswers: string[];
}

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
  _count?: {
    questions: number;
  };
}
