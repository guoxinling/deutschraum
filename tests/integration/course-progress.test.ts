import 'fake-indexeddb/auto'
import { afterEach, expect, it } from 'vitest'
import { db } from '../../src/db/database'
import { completeCourseSection, getCourseProgress, saveCourseDraft, isDayUnlocked, gradeCourseCard } from '../../src/course/progress'
import { courseDays } from '../../src/course'

afterEach(async () => { await db.courseProgress.clear(); await db.courseCards.clear() })

it('keeps attempts and writing after closing the database', async () => {
  await saveCourseDraft(1, { answers: { 0: 'Der schnelle Zugriff fehlt.' }, output: 'Mein eigener Text.' })
  await completeCourseSection(1, 'input')
  db.close()
  await db.open()
  const records = await getCourseProgress()
  expect(records[0].output).toBe('Mein eigener Text.')
  expect(records[0].answers[0]).toBe('Der schnelle Zugriff fehlt.')
  expect(records[0].completedSections).toEqual(['input'])
  expect(isDayUnlocked(2, records)).toBe(false)
})

it('finishes the complete first week without duplicating expressions on the review day', async () => {
  for (const lesson of courseDays) {
    await completeCourseSection(lesson.day, 'input')
    await saveCourseDraft(lesson.day, {
      answers: Object.fromEntries(lesson.questions.map((_, i) => [i, 'Mein Versuch'])),
      output: 'Meine eigene Zusammenfassung', checked: lesson.selfCheck.map((_, i) => i),
    })
    for (const section of ['questions', 'expressions', 'output', 'selfCheck', 'review'] as const) await completeCourseSection(lesson.day, section)
  }
  expect((await getCourseProgress()).filter(p => p.completedAt)).toHaveLength(7)
  expect(await db.courseCards.count()).toBe(60)
  expect((await db.courseCards.toArray()).some(c => c.day === 7)).toBe(false)
})

it('rejects skipping sections and completing unanswered exercises', async () => {
  await expect(completeCourseSection(1, 'questions')).rejects.toThrow()
  await completeCourseSection(1, 'input')
  await expect(completeCourseSection(1, 'questions')).rejects.toThrow()
})

it('completes once and creates ten stable expression cards without resetting ratings', async () => {
  await completeCourseSection(1, 'input')
  await saveCourseDraft(1, { answers: Object.fromEntries(Array.from({ length: 6 }, (_, n) => [n, 'Mein Versuch'])), output: 'Meine Antwort', checked: [0, 1, 2, 3] })
  for (const section of ['questions', 'expressions', 'output', 'selfCheck', 'review'] as const) await completeCourseSection(1, section)
  expect(isDayUnlocked(2, await getCourseProgress())).toBe(true)
  expect(await db.courseCards.count()).toBe(10)
  const card = (await db.courseCards.toArray())[0]
  await gradeCourseCard(card.id, 'good', new Date('2026-10-20T12:00:00'))
  await completeCourseSection(1, 'review')
  expect((await db.courseCards.get(card.id))?.dueDate).toBe('2026-10-23')
  expect(await db.courseCards.count()).toBe(10)
})
