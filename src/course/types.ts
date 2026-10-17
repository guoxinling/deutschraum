export interface CourseQuestion { prompt: string; answer: string; explanation: string }
export interface CourseExpression { german: string; meaning: string; example: string }
export interface CourseDay { day: number; week: number; kind: 'lesson' | 'review'; theme: string; title: string; estimatedMinutes: number; input: string; questions: CourseQuestion[]; expressions: CourseExpression[]; output: string; modelAnswer: string; selfCheck: string[] }
