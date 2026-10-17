import { db } from '../db/database'
import { getCourseDay } from './index'
import { sections, type CourseProgress, type SectionId } from './progressTypes'

export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export const emptyProgress = (day: number): CourseProgress => ({ day, completedSections: [], answers: {}, output: '', checked: [], reflection: '', updatedAt: new Date().toISOString() })
export const getCourseProgress = () => db.courseProgress.toArray()
export const isDayUnlocked = (day: number, progress: CourseProgress[]) => Number.isInteger(day) && day >= 1 && day <= 28 && (day === 1 || Array.from({ length: day - 1 }, (_, n) => n + 1).every(n => progress.some(p => p.day === n && !!p.completedAt)))

export async function saveCourseDraft(day: number, patch: Partial<Pick<CourseProgress, 'answers' | 'output' | 'checked' | 'reflection'>>) {
  getCourseDay(day)
  await db.transaction('rw', db.courseProgress, async () => {
    const progress = await db.courseProgress.get(day) ?? emptyProgress(day)
    await db.courseProgress.put({ ...progress, ...patch, answers: { ...progress.answers, ...patch.answers }, updatedAt: new Date().toISOString() })
  })
}

export async function completeCourseSection(day: number, section: SectionId) {
  const lesson = getCourseDay(day)
  await db.transaction('rw', db.courseProgress, db.courseCards, db.courseAudio, async () => {
    if (!isDayUnlocked(day, await getCourseProgress())) throw new Error('Bitte schließe zuerst den vorherigen Kurstag ab.')
    const progress = await db.courseProgress.get(day) ?? emptyProgress(day)
    if (progress.completedSections.includes(section)) return
    const index = sections.indexOf(section)
    if (index < 0 || !sections.slice(0, index).every(id => progress.completedSections.includes(id))) throw new Error('Bitte bearbeite zuerst den vorherigen Schritt.')
    if (section === 'questions' && lesson.questions.some((_, i) => !progress.answers[i]?.trim())) throw new Error('Bitte versuche zuerst alle sechs Fragen.')
    if (section === 'output' && !progress.output.trim() && !await db.courseAudio.get(day)) throw new Error('Bitte speichere deinen Text oder eine Aufnahme.')
    if (section === 'selfCheck' && lesson.selfCheck.some((_, i) => !progress.checked.includes(i))) throw new Error('Bitte prüfe alle Punkte der Checkliste.')
    progress.completedSections.push(section)
    progress.updatedAt = new Date().toISOString()
    if (section === 'review') {
      progress.completedAt = new Date().toISOString()
      for (const [i, expression] of (lesson.kind === 'lesson' ? lesson.expressions : []).entries()) {
        const id = `course-${day}-${i}`
        if (!await db.courseCards.get(id)) await db.courseCards.put({ id, day, front: expression.german, back: expression.meaning, example: expression.example, category: 'Ausdruck', dueDate: localDate(), intervalDays: 1, mastery: 0, reviews: 0 })
      }
    }
    await db.courseProgress.put(progress)
  })
}

export async function gradeCourseCard(id: string, quality: 'again' | 'hard' | 'good', now = new Date()) {
  await db.transaction('rw', db.courseCards, async () => {
    const card = await db.courseCards.get(id)
    if (!card) throw new Error('Karte nicht gefunden.')
    const intervalDays = quality === 'again' ? 1 : quality === 'hard' ? Math.max(2, Math.ceil(card.intervalDays * 1.2)) : Math.max(3, card.intervalDays * 2)
    const next = new Date(now); next.setDate(next.getDate() + intervalDays)
    await db.courseCards.put({ ...card, intervalDays, dueDate: localDate(next), reviews: card.reviews + 1, mastery: Math.max(0, card.mastery + (quality === 'good' ? 1 : quality === 'again' ? -1 : 0)) })
  })
}
