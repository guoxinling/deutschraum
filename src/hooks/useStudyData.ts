import { useCallback } from 'react'
import { createDailyPlan } from '../domain/planner'
import { gradeCard } from '../domain/review'
import type { ErrorNote, LearningCard, OutputRecord } from '../domain/types'
import { db, repository, type Material } from '../db/database'

export function useStudyData() {
  const getOrCreatePlan = useCallback(async (date: string, availableMinutes: 30 | 120, focusTopic: string) => (await db.studyDays.get(`day-${date}`)) ?? db.transaction('rw', db.studyDays, async () => { const plan = createDailyPlan({ date, availableMinutes, focusTopic }); await db.studyDays.put(plan); return plan }), [])
  return { saveMaterial: (material: Material) => repository.saveMaterial(material), saveOutput: (output: OutputRecord) => db.outputs.put(output), saveError: (error: ErrorNote) => db.errors.put(error), completeTask: async (dayId: string, taskId: string) => { const day = await db.studyDays.get(dayId); if (!day) return; day.tasks = day.tasks.map((task) => task.id === taskId ? { ...task, status: 'completed' } : task); await db.studyDays.put(day) }, gradeReviewCard: async (card: LearningCard, quality: 'again' | 'hard' | 'good') => db.learningCards.put(gradeCard(card, quality, new Date())), getOrCreatePlan }
}
