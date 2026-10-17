import { useEffect, useRef, useState } from 'react'
import { getCourseDay, courseDays } from '../course'
import { completeCourseSection, emptyProgress, getCourseProgress, isDayUnlocked, saveCourseDraft } from '../course/progress'
import { sections, type CourseProgress, type SectionId } from '../course/progressTypes'
import { AudioRecorder } from '../components/course/AudioRecorder'

const labels: Record<SectionId, string> = { input: 'Lesetext', questions: 'Verstehen', expressions: 'Ausdrücke', output: 'Deine Stimme', selfCheck: 'Vergleichen', review: 'Festigen' }
const minutes = [30, 20, 20, 30, 10, 10]
const instructions: Record<SectionId, string> = {
  input: 'Lies zuerst ohne Wörterbuch. Formuliere anschließend die Hauptthese in einem Satz. Lies erneut und markiere gedanklich Begründungen und Einschränkungen.',
  questions: 'Antworte mit eigenen Worten. Vergleiche erst danach mit der Lösung und begründe mögliche Abweichungen.',
  expressions: 'Sprich die Beispiele laut. Bilde für jede Wendung einen eigenen Satz aus deinem Alltag und wiederhole ihn ohne Vorlage.',
  output: 'Plane drei Kernaussagen. Formuliere anschließend frei. Verwende mindestens vier Wendungen aus dieser Lektion.',
  selfCheck: 'Vergleiche Aufbau und Ausdruck mit dem Beispiel. Es ist eine mögliche Antwort, keine einzig richtige Lösung. Überarbeite deinen Text bei Bedarf.',
  review: 'Schließe den Text. Fasse das Thema aus dem Gedächtnis zusammen und formuliere deinen wichtigsten Gedanken noch einmal.',
}

export function LessonScreen({ day, onBack }: { day: number; onBack: () => void }) {
  const lesson = getCourseDay(day)
  const [progress, setProgress] = useState<CourseProgress>()
  const [step, setStep] = useState(0)
  const [revealed, setRevealed] = useState<number[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [audioBusy, setAudioBusy] = useState(false)
  const [saved, setSaved] = useState('')
  const queue = useRef<Promise<unknown>>(Promise.resolve())
  useEffect(() => {
    let active = true
    getCourseProgress().then(records => {
      if (!active) return
      if (!isDayUnlocked(day, records)) { setError('Dieser Tag ist noch gesperrt.'); return }
      const p = records.find(r => r.day === day) ?? emptyProgress(day)
      setProgress(p); setStep(Math.min(p.completedSections.length, sections.length - 1))
    }).catch(() => setError('Lernstand konnte nicht geladen werden. Bitte lade die Seite neu.'))
    return () => { active = false }
  }, [day])
  function draft(patch: Partial<Pick<CourseProgress, 'answers' | 'output' | 'checked' | 'reflection'>>) {
    setProgress(p => p ? { ...p, ...patch, answers: { ...p.answers, ...patch.answers } } : p)
    setSaved('Wird gespeichert …')
    queue.current = queue.current.then(() => saveCourseDraft(day, patch)).then(() => { setSaved('Lokal gespeichert'); setError('') }).catch(() => { setError('Speichern fehlgeschlagen. Bitte behalte diese Seite offen und versuche es erneut.'); setSaved('Nicht gespeichert') })
  }
  async function next() {
    if (!progress) return
    setSaving(true); setError('')
    try {
      await queue.current
      await saveCourseDraft(day, { answers: progress.answers, output: progress.output, checked: progress.checked, reflection: progress.reflection })
      await completeCourseSection(day, sections[step])
      const records = await getCourseProgress()
      setProgress(records.find(p => p.day === day))
      setStep(s => Math.min(s + 1, sections.length - 1))
      setSaved('Lokal gespeichert')
    } catch (e) { setError(e instanceof Error ? e.message : 'Speichern fehlgeschlagen.') }
    finally { setSaving(false) }
  }
  if (!progress) return <section className="screen"><button onClick={onBack}>Zurück</button><p role={error ? 'alert' : 'status'}>{error || 'Lektion wird geöffnet …'}</p></section>
  const section = sections[step]
  const completed = !!progress.completedAt
  return <section className="screen lesson-screen">
    <button className="back-link" onClick={onBack}>← Zur Übersicht</button>
    <p className="eyebrow">WOCHE {lesson.week} · TAG {day} · {step + 1} / 6</p><h2>{lesson.title}</h2>
    <nav className="steps" aria-label="Lernschritte">{sections.map((id, i) => <button key={id} aria-current={i === step ? 'step' : undefined} disabled={saving || i > progress.completedSections.length} onClick={() => setStep(i)}><span>{progress.completedSections.includes(id) ? '✓' : i + 1}</span>{labels[id]}</button>)}</nav>
    <fieldset className="panel lesson-fields" disabled={saving}><div className="section-top"><h3>{labels[section]}</h3><span className="badge">{minutes[step]} Min.</span></div><p className="instruction">{instructions[section]}</p>
      {section === 'input' && <div className="reading" lang="de">{lesson.input.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div>}
      {section === 'questions' && <div className="question-list">{lesson.questions.map((q, i) => <div className="question" key={i}><label htmlFor={'answer-'+i}><span className="number">0{i + 1}</span> {q.prompt}</label><textarea id={'answer-'+i} aria-label={'Antwort '+(i + 1)} value={progress.answers[i] ?? ''} onChange={e => draft({ answers: { [i]: e.target.value } })} placeholder="Deine Antwort auf Deutsch …" /><button disabled={!progress.answers[i]?.trim()} onClick={() => setRevealed(r => r.includes(i) ? r.filter(n => n !== i) : [...r, i])}>{revealed.includes(i) ? 'Lösung ausblenden' : 'Lösung anzeigen'}</button>{revealed.includes(i) && <div className="solution"><strong>{q.answer}</strong><p>{q.explanation}</p></div>}</div>)}</div>}
      {section === 'expressions' && <div className="expressions">{lesson.expressions.map((e, i) => <div key={e.german}><span className="number"> {String(i+1).padStart(2,'0')}</span><h4>{e.german}</h4><p>{e.meaning}</p><blockquote>{e.example}</blockquote></div>)}</div>}
      {section === 'output' && <><p className="task-prompt">{lesson.output}</p><AudioRecorder day={day} onBusy={setAudioBusy} /><label htmlFor="output">Deine schriftliche Antwort oder Sprechvorbereitung</label><textarea id="output" className="writing" value={progress.output} onChange={e => draft({ output: e.target.value })} placeholder="Hier beginnt dein eigener Text …" /><small>{progress.output.trim() ? progress.output.trim().split(/\s+/).length : 0} Wörter · automatisch gespeichert</small></>}
      {section === 'selfCheck' && <><h4>Musterantwort</h4><div className="reading solution">{lesson.modelAnswer.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div><h4>Dein Entwurf</h4><textarea aria-label="Entwurf überarbeiten" value={progress.output} onChange={e => draft({ output: e.target.value })} /><h4>Selbstcheck</h4><p className="muted">Hake ab, was du geprüft hast – auch wenn du weiter daran üben möchtest.</p>{lesson.selfCheck.map((item, i) => <label className="check-row" key={item}><input type="checkbox" checked={progress.checked.includes(i)} onChange={e => draft({ checked: e.target.checked ? [...progress.checked, i] : progress.checked.filter(n => n !== i) })} />{item}</label>)}</>}
      {section === 'review' && <><h4>Ohne Vorlage</h4><p>Nenne drei Aussagen des Textes und sprich zwei Sätze mit neuen Wendungen. {lesson.kind === 'lesson' ? 'Deine zehn Ausdrücke werden beim Abschließen zur Wiederholung hinzugefügt.' : 'Heute festigst du bekannte Wendungen; es werden keine doppelten Wiederholungskarten angelegt.'}</p>{day > 1 && <div className="solution"><h4>Aus einer früheren Lektion</h4><p>{courseDays.find(d => d.day === day - 1)?.output}</p></div>}<label htmlFor="reflection">Was möchtest du beim nächsten Mal besser ausdrücken?</label><textarea id="reflection" value={progress.reflection} onChange={e => draft({ reflection: e.target.value })} />{completed && <div role="status" className="solution">Lektion abgeschlossen. Deine Antwort und Ausdrücke sind gespeichert.</div>}</>}
    </fieldset>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="lesson-actions"><span className="muted" role="status">{saved}</span><button className="primary" disabled={saving || audioBusy} onClick={completed && step === 5 ? onBack : () => void next()}>{saving ? 'Speichern …' : completed && step === 5 ? 'Zur Übersicht' : step === 5 ? 'Lektion abschließen' : 'Schritt abschließen →'}</button></div>
  </section>
}
