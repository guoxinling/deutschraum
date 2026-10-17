import { describe, expect, it } from 'vitest'

import { gradeCard } from '../../src/domain/review'
import type { LearningCard } from '../../src/domain/types'

const card: LearningCard = { id: 'card-1', front: 'auf etwas eingehen', back: 'to address', category: 'collocation', dueDate: '2026-10-16', intervalDays: 3, mastery: 1 }

describe('gradeCard', () => {
  it('schedules a hard card earlier than a good card', () => {
    const now = new Date('2026-10-16T08:00:00Z')
    expect(gradeCard(card, 'hard', now).dueDate < gradeCard(card, 'good', now).dueDate).toBe(true)
  })

  it('schedules an again card for tomorrow', () => {
    expect(gradeCard(card, 'again', new Date('2026-10-16T08:00:00Z')).dueDate).toBe('2026-10-17')
  })
})
