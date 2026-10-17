import { describe, expect, it } from 'vitest'

import { createDailyPlan, rescheduleIncompleteTasks } from '../../src/domain/planner'

describe('createDailyPlan', () => {
  it('creates the 120-minute learning loop', () => {
    const plan = createDailyPlan({ date: '2026-10-16', availableMinutes: 120, focusTopic: 'Arbeit' })
    expect(plan.tasks).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'input', plannedMinutes: 50 }),
      expect.objectContaining({ type: 'review', plannedMinutes: 25 }),
      expect.objectContaining({ type: 'reflection', plannedMinutes: 15 }),
      expect.objectContaining({ type: 'output', plannedMinutes: 30, outputMode: 'written' }),
    ]))
  })

  it('creates a compact plan no longer than 30 minutes', () => {
    const plan = createDailyPlan({ date: '2026-10-17', availableMinutes: 30, focusTopic: 'Arbeit' })
    expect(plan.tasks.map((task) => task.type)).toEqual(['input', 'output', 'review'])
    expect(plan.tasks.reduce((total, task) => total + task.plannedMinutes, 0)).toBeLessThanOrEqual(30)
  })
})

describe('rescheduleIncompleteTasks', () => {
  it('keeps skipped work instead of deleting it', () => {
    const day = createDailyPlan({ date: '2026-10-10', availableMinutes: 30, focusTopic: 'Arbeit' })
    day.tasks.slice(1).forEach((task) => { task.status = 'completed' })
    day.tasks[0].status = 'skipped'
    expect(rescheduleIncompleteTasks([day], new Date('2026-10-16T08:00:00Z'))).toHaveLength(1)
  })
})
