export interface Question {
  id: string;
  type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
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
