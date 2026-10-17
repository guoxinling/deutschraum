import { describe, expect, it } from 'vitest'
import { getCourseDay } from '../../src/course'
import { courseDays } from '../../src/course'
it('provides six distinct full lessons and a real consolidation day for week one', () => {
  expect(courseDays.filter(d => d.week === 1).map(d => d.day)).toEqual([1,2,3,4,5,6,7])
  for (const day of courseDays.filter(d => d.kind === 'lesson')) {
    const words = day.input.trim().split(/\s+/).length
    expect(words, 'word count day '+day.day).toBeGreaterThanOrEqual(600)
    expect(words).toBeLessThanOrEqual(900)
    expect(day.questions).toHaveLength(6)
    expect(day.expressions).toHaveLength(10)
    expect(day.modelAnswer.trim().split(/\s+/).length, 'model day '+day.day).toBeGreaterThanOrEqual(150)
    expect(new Set(day.expressions.map(e => e.german)).size).toBe(10)
  }
  expect(getCourseDay(7).kind).toBe('review')
})
describe('embedded course', () => { it('provides a complete first lesson', () => { const day = getCourseDay(1); expect(day.input.split(/\s+/).length).toBeGreaterThan(600); expect(day.questions).toHaveLength(6); expect(day.expressions).toHaveLength(10); expect(day.output).toBeTruthy(); expect(day.modelAnswer).toBeTruthy(); expect(day.selfCheck).toBeTruthy() }) })
