import type { LearningCard } from '../domain/types'

export const sections = ['input', 'questions', 'expressions', 'output', 'selfCheck', 'review'] as const
export type SectionId = typeof sections[number]
export interface CourseProgress {
  day: number
  completedSections: SectionId[]
  answers: Record<number, string>
  output: string
  checked: number[]
  reflection: string
  completedAt?: string
  updatedAt: string
}
export interface CourseCard extends LearningCard { day: number; example: string; reviews: number }
export interface CourseAudio { day: number; blob: Blob; createdAt: string }
