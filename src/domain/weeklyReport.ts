import type { ErrorNote, OutputRecord, StudyDay, WeeklyReport } from './types'

export function createWeeklyReport(days: StudyDay[], outputs: OutputRecord[], errors: ErrorNote[], _endDate: Date): WeeklyReport {
  const tasks = days.flatMap((day) => day.tasks)
  const completed = tasks.filter((task) => task.status === 'completed')
  const inputMinutes = completed.filter((task) => task.type === 'input').reduce((sum, task) => sum + task.plannedMinutes, 0)
  const review = tasks.filter((task) => task.type === 'review')
  const counts = errors.filter((error) => error.status === 'open').reduce<Record<string, number>>((all, error) => ({ ...all, [error.category]: (all[error.category] ?? 0) + 1 }), {})
  const topErrorCategory = Object.entries(counts).sort(([a, left], [b, right]) => right - left || a.localeCompare(b, 'de'))[0]?.[0]
  const topicCounts = days.reduce<Record<string, number>>((all, day) => ({ ...all, [day.focusTopic]: (all[day.focusTopic] ?? 0) + completed.filter((task) => day.tasks.includes(task)).length }), {})
  const strongestTopic = Object.entries(topicCounts).sort(([a, left], [b, right]) => right - left || a.localeCompare(b, 'de'))[0]?.[0]
  const spoken = outputs.filter((output) => output.type === 'spoken')
  const written = outputs.filter((output) => output.type === 'written')
  return { completedTasks: completed.length, inputMinutes, spokenOutputCount: spoken.length, spokenMinutes: spoken.reduce((sum, output) => sum + (output.durationMinutes ?? 0), 0), writtenOutputCount: written.length, writtenWordCount: written.reduce((sum, output) => sum + (output.wordCount ?? 0), 0), reviewCompletion: review.length ? completed.filter((task) => task.type === 'review').length / review.length : 0, topErrorCategory, strongestTopic, nextFocus: topErrorCategory ? `Arbeite gezielt an ${topErrorCategory}.` : 'Wähle ein Thema für die kommende Woche.' }
}
