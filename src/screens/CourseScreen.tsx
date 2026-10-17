import { courseDays } from '../course'
import { dayTitles, weekTitles } from '../course/catalog'
import { isDayUnlocked } from '../course/progress'
import { useCourseProgress } from '../hooks/useCourse'

export function CourseScreen({ onStart }: { onStart: (day: number) => void }) {
  const { progress, error } = useCourseProgress()
  return <section className="screen"><p className="eyebrow">DEIN LERNWEG</p><h2 className="page-title">Vier Wochen, neue Perspektiven.</h2>
    <p className="lead">Sechs Themen und ein Rückblick pro Woche. Dein Fortschritt bestimmt den nächsten Schritt.</p>
    {error && <p role="alert">{error}</p>}
    {weekTitles.map((title, week) => <section className="week-block" key={title}><div className="section-top"><h3><span className="muted">0{week + 1} / </span>{title}</h3></div>
      {dayTitles.slice(week * 7, week * 7 + 7).map((name, i) => {
        const day = week * 7 + i + 1
        const available = courseDays.some(l => l.day === day)
        const unlocked = available && isDayUnlocked(day, progress)
        const done = progress.some(p => p.day === day && p.completedAt)
        return <button className="day-row" key={day} disabled={!unlocked} onClick={() => onStart(day)}>
          <span className="day-number">{String(day).padStart(2, '0')}</span><span><strong>{name}</strong><small>{!available ? 'In Vorbereitung' : done ? 'Abgeschlossen · erneut öffnen' : !unlocked ? 'Zuerst den vorherigen Tag abschließen' : i === 6 ? 'Wochenrückblick' : 'Bereit zum Lernen'}</small></span><span aria-hidden="true">{done ? '✓' : unlocked ? '↗' : '·'}</span>
        </button>
      })}</section>)}
  </section>
}
