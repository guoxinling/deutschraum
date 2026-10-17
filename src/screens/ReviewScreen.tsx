import { useEffect, useState } from 'react'
import { liveQuery } from 'dexie'
import { db } from '../db/database'
import { gradeCourseCard, localDate } from '../course/progress'
import type { CourseCard } from '../course/progressTypes'
import { courseDays } from '../course'
import { useCourseProgress } from '../hooks/useCourse'

export function ReviewScreen() {
  const [cards, setCards] = useState<CourseCard[]>([])
  const [ready, setReady] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { progress } = useCourseProgress()
  useEffect(() => {
    const sub = liveQuery(() => db.courseCards.toArray()).subscribe({ next: value => { setCards(value); setReady(true) }, error: () => setError('Karten konnten nicht geladen werden.') })
    return () => sub.unsubscribe()
  }, [])
  const due = cards.filter(c => c.dueDate <= localDate()).sort((a,b) => a.dueDate.localeCompare(b.dueDate) || a.id.localeCompare(b.id))
  const card = due[0]
  const recent = [...progress].filter(p => p.completedAt).sort((a,b) => b.day - a.day)[0]
  async function rate(quality: 'again' | 'hard' | 'good') {
    if (!card) return
    setBusy(true); setError('')
    try {
      await gradeCourseCard(card.id, quality)
      const updated = await db.courseCards.get(card.id)
      setMessage('Nächste Wiederholung: '+updated?.dueDate)
      setRevealed(false)
    } catch { setError('Bewertung konnte nicht gespeichert werden. Versuche es erneut.') }
    finally { setBusy(false) }
  }
  return <section className="screen"><p className="eyebrow">WIEDERHOLEN & ANWENDEN</p><h2 className="page-title">Was bleibt, wird benutzt.</h2>
    <p className="lead">{due.length} fällige Karten · {cards.length} Ausdrücke in deiner Sammlung</p>
    {error && <p role="alert">{error}</p>}
    {!ready && !error && <p role="status">Karten werden geladen …</p>}
    {ready && !card && <article className="panel"><h3>{cards.length ? 'Für heute alles wiederholt.' : 'Noch keine Karten.'}</h3><p>{cards.length ? 'Deine nächsten Wiederholungen erscheinen am geplanten Tag.' : 'Schließe deine erste Lektion ab. Ihre zehn Ausdrücke erscheinen automatisch hier.'}</p></article>}
    {card && <article className="panel recall-card"><p className="eyebrow">TAG {card.day} · {card.category}</p><h3>{card.front}</h3><p>Erkläre den Ausdruck und bilde einen eigenen Satz, bevor du die Antwort öffnest.</p>
      {!revealed ? <button className="primary" onClick={() => setRevealed(true)}>Antwort aufdecken</button> : <><div className="solution"><strong>{card.back}</strong><blockquote>{card.example}</blockquote></div><div className="rating"><button disabled={busy} onClick={() => void rate('again')}>Noch einmal</button><button disabled={busy} onClick={() => void rate('hard')}>Schwer</button><button disabled={busy} className="primary" onClick={() => void rate('good')}>Gut</button></div></>}
    </article>}
    {message && <p role="status" className="saved">{message}</p>}
    {recent && <article className="panel"><p className="eyebrow">NOCH EINMAL IN EIGENEN WORTEN</p><h3>Deine Stimme · Tag {recent.day}</h3><p>{courseDays.find(l => l.day === recent.day)?.output}</p><p className="muted">Antworte heute ohne deine erste Fassung anzusehen. Vergleiche danach mit dem Text unter „Mein Lernen“.</p></article>}
  </section>
}
