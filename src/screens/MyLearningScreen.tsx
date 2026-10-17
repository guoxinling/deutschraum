import { useEffect, useState } from 'react'
import { db } from '../db/database'
import { exportLearningData } from '../db/export'
import { useCourseProgress } from '../hooks/useCourse'
import { courseDays } from '../course'
import type { CourseAudio } from '../course/progressTypes'

function Recording({ audio }: { audio: CourseAudio }) {
  const [url, setUrl] = useState('')
  useEffect(() => { const u = URL.createObjectURL(audio.blob); setUrl(u); return () => URL.revokeObjectURL(u) }, [audio.blob])
  return <><audio controls src={url} /><a download={'deutschraum-tag-'+audio.day+'.'+(audio.blob.type.includes('mp4') ? 'm4a' : audio.blob.type.includes('ogg') ? 'ogg' : 'webm')} href={url}>Aufnahme herunterladen</a></>
}
export function MyLearningScreen() {
  const { progress, error } = useCourseProgress()
  const [audios, setAudios] = useState<CourseAudio[]>([])
  const [message, setMessage] = useState('')
  const [exporting, setExporting] = useState(false)
  const [original, setOriginal] = useState('')
  const [correction, setCorrection] = useState('')
  useEffect(() => { db.courseAudio.toArray().then(setAudios).catch(() => setMessage('Aufnahmen konnten nicht geladen werden.')) }, [])
  async function backup() {
    setExporting(true)
    try {
      const legacy = await exportLearningData()
      const cards = await db.courseCards.toArray()
      const blob = new Blob([JSON.stringify({ format: 'deutschraum-course-v1', legacy, courseProgress: progress, courseCards: cards }, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'deutschraum-lernstand.json'; a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMessage('Textdaten exportiert. Aufnahmen bitte einzeln herunterladen.')
    } catch { setMessage('Export fehlgeschlagen. Deine lokalen Daten bleiben erhalten.') }
    finally { setExporting(false) }
  }
  async function addCorrection() {
    if (!original.trim() || !correction.trim()) return
    try {
      await db.courseCards.put({ id: crypto.randomUUID(), day: Math.max(1, ...progress.map(p => p.day)), front: original.trim(), back: correction.trim(), example: 'Formuliere einen neuen Satz mit der korrigierten Form.', category: 'Eigene Korrektur', dueDate: '2000-01-01', intervalDays: 1, mastery: 0, reviews: 0 })
      setOriginal(''); setCorrection(''); setMessage('Deine Korrektur ist unter Wiederholen gespeichert.')
    } catch { setMessage('Die Korrektur konnte nicht gespeichert werden.') }
  }
  return <section className="screen"><p className="eyebrow">DEIN PERSÖNLICHES ARCHIV</p><h2 className="page-title">Deine Stimme wird sichtbarer.</h2>
    <div className="stats"><div><strong>{progress.filter(p => p.completedAt).length}<small>/ 28</small></strong><span>Tage abgeschlossen</span></div><div><strong>{progress.filter(p => p.output.trim()).length}</strong><span>Eigene Texte</span></div></div>
    {error && <p role="alert">{error}</p>}
    {!progress.length && <p>Dein Lernweg beginnt mit der ersten Lektion. Hier findest du danach deine Antworten und Reflexionen.</p>}
    {progress.map(p => <details className="panel" key={p.day}><summary>Tag {p.day} · {courseDays.find(l => l.day === p.day)?.title}<small>{p.completedAt ? 'Abgeschlossen' : 'In Arbeit'}</small></summary><h4>Dein Text</h4><p className="preserve">{p.output || 'Noch kein Text gespeichert.'}</p>{audios.filter(a => a.day === p.day).map(a => <Recording key={a.day} audio={a} />)}<h4>Deine Reflexion</h4><p className="preserve">{p.reflection || 'Noch keine Reflexion.'}</p><h4>Deine Antworten</h4>{Object.entries(p.answers).map(([n,a]) => <p key={n}><strong>{Number(n)+1}.</strong> {a}</p>)}</details>)}
    <details className="panel"><summary>Eigene Korrektur zur Wiederholung hinzufügen</summary><label>Ursprünglicher Satz<input value={original} onChange={e => setOriginal(e.target.value)} /></label><label>Korrigierte Form<input value={correction} onChange={e => setCorrection(e.target.value)} /></label><button onClick={() => void addCorrection()} disabled={!original.trim() || !correction.trim()}>Korrektur speichern</button></details>
    <article className="panel"><h3>Dein Lernstand gehört dir.</h3><p>Texte und Lernfortschritt werden in diesem Browser gespeichert. Exportiere sie gelegentlich; beim Löschen der Browserdaten gehen lokale Einträge verloren.</p><button disabled={exporting} onClick={() => void backup()}>{exporting ? 'Export läuft …' : 'Lernstand exportieren'}</button><p className="muted">JSON-Archiv für deine Unterlagen. Eine Wiederherstellung im Kurs ist noch nicht eingebaut. Audiodateien separat herunterladen.</p></article>
    {message && <p role="status">{message}</p>}
  </section>
}
