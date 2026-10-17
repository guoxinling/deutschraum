import { describe, expect, it } from 'vitest'

import { createDailyPlan } from '../../src/domain/planner'
import { createWeeklyReport } from '../../src/domain/weeklyReport'
import type { ErrorNote, OutputRecord } from '../../src/domain/types'

describe('createWeeklyReport', () => {
  it('aggregates activity and chooses tied error categories deterministically', () => {
    const day = createDailyPlan({ date: '2026-10-16', availableMinutes: 30, focusTopic: 'Arbeit' })
    day.tasks.forEach((task) => { task.status = 'completed' })
    const outputs: OutputRecord[] = [{ id: 'o1', taskId: day.tasks[1].id, type: 'written', wordCount: 180, createdAt: '2026-10-16T08:00:00.000Z' }]
    const errors: ErrorNote[] = [
      { id: 'e1', category: 'Wortstellung', original: '...', correction: '...', status: 'open' },
      { id: 'e2', category: 'Kasus', original: '...', correction: '...', status: 'open' },
    ]
    const report = createWeeklyReport([day], outputs, errors, new Date('2026-10-16T08:00:00Z'))
    expect(report.completedTasks).toBe(3)
    expect(report.writtenWordCount).toBe(180)
    expect(report.topErrorCategory).toBe('Kasus')
  })
})
