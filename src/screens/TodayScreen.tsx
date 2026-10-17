import { courseDays } from '../course'
import { useCourseProgress } from '../hooks/useCourse'
import { sections } from '../course/progressTypes'
import { weekTitles } from '../course/catalog'

export function TodayScreen({ onStart }: { onStart: (day: number) => void }) {
  const { progress, ready, error } = useCourseProgress()
  if (error) return <p role="alert">{error}</p>
  if (!ready) return <p role="status">Dein Lernraum wird geöffnet …</p>
  const next = Array.from({ length: 28 }, (_, n) => n + 1).find(day => !progress.some(p => p.day === day && p.completedAt))
  const lesson = courseDays.find(day => day.day === next)
  const record = progress.find(p => p.day === next)
  const count = record?.completedSections.length ?? 0
  return <section className="screen">
    <div className="section-top"><p className="eyebrow">DEIN DEUTSCH. DEIN RAUM.</p><span className="badge">4 Wochen · C1 Neustart</span></div>
    <h2 className="page-title">Zurück in die Sprache.</h2>
    <p className="lead">Ein Thema. Ein neuer Gedanke. Jeden Tag ein Stück mehr Deutsch.</p>
    {courseDays.length < 28 && <p className="muted">Aktuell verfügbar: {courseDays.length} von 28 Kurstagen. Woche 1 ist vollständig; Woche 2–4 sind in Vorbereitung.</p>}
    {lesson ? <article className="lesson-hero">
      <p className="eyebrow">WOCHE {lesson.week} · TAG {lesson.day.toString().padStart(2, '0')}</p>
      <h3>{lesson.title}</h3><p>{weekTitles[lesson.week - 1]}</p>
      <div className="lesson-meta"><span>◷ ca. {lesson.estimatedMinutes} Min.</span><span>6 Lernschritte</span><span>Originaltext</span></div>
      <button className="primary" onClick={() => onStart(lesson.day)}>{count || record?.answers[0] ? 'Lektion fortsetzen' : 'Heutige Lektion starten'} <span aria-hidden="true">↗</span></button>
      <progress value={count} max={sections.length} aria-label="Lektionsfortschritt" /><small>{count} von 6 Schritten abgeschlossen</small>
    </article> : <article className="panel"><h3>{next ? 'Dein bisheriger Lernweg ist abgeschlossen.' : 'Vier Wochen geschafft.'}</h3><p>{next ? 'Die weiteren Kurstage werden noch ausgearbeitet. Deine bisherigen Lektionen bleiben im Kurs verfügbar.' : 'Nutze dein Archiv und die Wiederholungen, um deine Fortschritte zu festigen.'}</p></article>}
    <div className="section-top"><h3>So lernst du heute</h3><span className="muted">Alles bereits vorbereitet</span></div>
    <div className="journey">{[['01', 'Verstehen', 'Text lesen, Gedanken ordnen, Fragen beantworten.'], ['02', 'Ausdrücken', 'Wendungen anwenden und selbst Stellung beziehen.'], ['03', 'Festigen', 'Mit dem Modell vergleichen und gezielt wiederholen.']].map(([n, title, description]) => <div key={n}><span className="number">{n}</span><h4>{title}</h4><p>{description}</p></div>)}</div>
    <p className="quiet-note">Lesen & eigene Stimme · Audiovertonung folgt später. Du kannst deine mündliche Antwort aufnehmen.</p>
  </section>
}
