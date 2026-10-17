import type { PlanInput, StudyDay, Task } from './types'

const id = (prefix: string, date: string, index: number) => `${prefix}-${date}-${index}`
const task = (date: string, index: number, type: Task['type'], plannedMinutes: number, instructions: string, outputMode?: Task['outputMode']): Task => ({ id: id(type, date, index), type, plannedMinutes, status: 'pending', instructions, outputMode })

export function createDailyPlan({ date, availableMinutes, focusTopic }: PlanInput): StudyDay {
  const spoken = Number(date.slice(-2)) % 2 === 1
  const outputMode = spoken ? 'spoken' : 'written'
  const outputInstruction = spoken ? `Sprich frei über ${focusTopic} und nimm deine Antwort auf.` : `Schreibe 150–250 Wörter über ${focusTopic}.`
  const tasks = availableMinutes === 30
    ? [task(date, 0, 'input', 12, `Nimm einen kurzen Impuls zu ${focusTopic} auf.`), task(date, 1, 'output', 10, outputInstruction, outputMode), task(date, 2, 'review', 8, 'Wiederhole heute fällige Karten aktiv.')]
    : [task(date, 0, 'input', 50, `Lies oder höre konzentriert zu ${focusTopic}.`), task(date, 1, 'output', 30, outputInstruction, outputMode), task(date, 2, 'review', 25, 'Wiederhole heute fällige Karten aktiv.'), task(date, 3, 'reflection', 15, 'Notiere Fehler und plane morgen.')]
  return { id: `day-${date}`, date, availableMinutes, focusTopic, tasks }
}

export function rescheduleIncompleteTasks(days: StudyDay[], now: Date): Task[] {
  const today = now.toISOString().slice(0, 10)
  return days.filter((day) => day.date < today).flatMap((day) => day.tasks).filter((item) => item.status !== 'completed')
}
