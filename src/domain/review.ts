import type { LearningCard } from './types'

const toDate = (date: Date, days: number) => { const result = new Date(date); result.setUTCDate(result.getUTCDate() + days); return result.toISOString().slice(0, 10) }

export function gradeCard(card: LearningCard, quality: 'again' | 'hard' | 'good', now: Date): LearningCard {
  const intervalDays = quality === 'again' ? 1 : quality === 'hard' ? Math.max(2, card.intervalDays) : Math.max(3, card.intervalDays * 2)
  return { ...card, intervalDays, dueDate: toDate(now, intervalDays), mastery: Math.max(0, card.mastery + (quality === 'good' ? 1 : quality === 'again' ? -1 : 0)) }
}
