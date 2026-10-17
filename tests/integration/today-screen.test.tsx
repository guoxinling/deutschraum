import 'fake-indexeddb/auto'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { App } from '../../src/App'
import { db } from '../../src/db/database'
import { LessonScreen } from '../../src/screens/LessonScreen'
import { completeCourseSection, saveCourseDraft } from '../../src/course/progress'
afterEach(async () => { cleanup(); await db.courseProgress.clear(); await db.courseCards.clear() })
it('opens real content, gates solutions and restores attempts after navigation', async () => {
  render(<App />)
  fireEvent.click(await screen.findByRole('button', { name: /lektion starten/i }))
  expect(await screen.findByRole('heading', { name: /lesetext/i })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /schritt abschließen/i }))
  const answer = await screen.findByLabelText('Antwort 1')
  expect(screen.getAllByRole('button', { name: /lösung anzeigen/i })[0]).toBeDisabled()
  fireEvent.change(answer, { target: { value: 'Der Zugriff auf vorhandenes Wissen fehlt.' } })
  fireEvent.click(screen.getAllByRole('button', { name: /lösung anzeigen/i })[0])
  expect(await screen.findByText('Der schnelle Zugriff auf vorhandenes Wissen.')).toBeInTheDocument()
  await waitFor(async () => expect((await db.courseProgress.get(1))?.answers[0]).toContain('Zugriff'))
  fireEvent.click(screen.getByRole('button', { name: /kurs/i }))
  expect(await screen.findByRole('heading', { name: /vier wochen/i })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /heute/i }))
  fireEvent.click(await screen.findByRole('button', { name: /fortsetzen/i }))
  expect(await screen.findByLabelText('Antwort 1')).toHaveValue('Der Zugriff auf vorhandenes Wissen fehlt.')
})

it('locks editing during section completion to avoid overwriting newer input', async () => {
  await completeCourseSection(1, 'input')
  await saveCourseDraft(1, { answers: Object.fromEntries(Array.from({ length: 6 }, (_, i) => [i, 'Mein Versuch'])) })
  render(<LessonScreen day={1} onBack={() => {}} />)
  const answer = await screen.findByLabelText('Antwort 1')
  fireEvent.click(screen.getByRole('button', { name: /schritt abschließen/i }))
  expect(answer).toBeDisabled()
  await screen.findByRole('heading', { name: 'Ausdrücke' })
})
