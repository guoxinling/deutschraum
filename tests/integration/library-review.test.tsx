import 'fake-indexeddb/auto'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { ReviewScreen } from '../../src/screens/ReviewScreen'
import { db } from '../../src/db/database'
afterEach(async () => { cleanup(); await db.courseCards.clear() })
it('has no fabricated card for a new learner', async () => {
  render(<ReviewScreen />)
  expect(await screen.findByText(/noch keine karten/i)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Gut' })).not.toBeInTheDocument()
})
it('reviews a saved expression and persists its new date', async () => {
  await db.courseCards.put({ id: 'c1', day: 1, front: 'etwas begründen', back: 'Gründe erklären', example: 'Ich begründe meine Wahl.', category: 'Ausdruck', dueDate: '2020-01-01', intervalDays: 1, mastery: 0, reviews: 0 })
  render(<ReviewScreen />)
  fireEvent.click(await screen.findByRole('button', { name: /antwort aufdecken/i }))
  expect(screen.getByText('Gründe erklären')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Gut' }))
  await waitFor(async () => expect((await db.courseCards.get('c1'))?.reviews).toBe(1))
  expect(await screen.findByText(/nächste wiederholung/i)).toBeInTheDocument()
})
