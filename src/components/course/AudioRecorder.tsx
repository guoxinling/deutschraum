import { useEffect, useRef, useState } from 'react'
import { db } from '../../db/database'

export function AudioRecorder({ day, onBusy }: { day: number; onBusy?: (busy: boolean) => void }) {
  const recorder = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const alive = useRef(true)
  const [recording, setRecording] = useState(false)
  const [pending, setPending] = useState(false)
  const [saving, setSaving] = useState(false)
  const [extension, setExtension] = useState('webm')
  const [url, setUrl] = useState('')
  const [unsaved, setUnsaved] = useState<Blob>()
  const [error, setError] = useState('')
  useEffect(() => { onBusy?.(pending || recording || saving || !!unsaved) }, [onBusy, pending, recording, saving, unsaved])
  useEffect(() => () => { onBusy?.(false) }, [onBusy])
  useEffect(() => {
    alive.current = true
    db.courseAudio.get(day).then(audio => { if (audio && alive.current) { setUrl(URL.createObjectURL(audio.blob)); setExtension(audio.blob.type.includes('mp4') ? 'm4a' : audio.blob.type.includes('ogg') ? 'ogg' : 'webm') } }).catch(() => setError('Gespeicherte Aufnahme konnte nicht geladen werden.'))
    return () => { alive.current = false; if (recorder.current?.state === 'recording') recorder.current.stop(); stream.current?.getTracks().forEach(t => t.stop()) }
  }, [day])
  useEffect(() => () => { if (url) URL.revokeObjectURL(url) }, [url])
  async function save(blob: Blob) {
    if (alive.current) setSaving(true)
    try { await db.courseAudio.put({ day, blob, createdAt: new Date().toISOString() }); if (alive.current) { setUnsaved(undefined); setError('') } }
    catch { if (alive.current) { setUnsaved(blob); setError('Aufnahme noch nicht gespeichert. Bitte erneut versuchen oder herunterladen.') } }
    finally { if (alive.current) setSaving(false) }
  }
  async function start() {
    setError(''); setPending(true)
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!alive.current) { media.getTracks().forEach(t => t.stop()); return }
      stream.current = media
      const r = new MediaRecorder(media); recorder.current = r
      const chunks: BlobPart[] = []
      r.ondataavailable = event => { if (event.data.size) chunks.push(event.data) }
      r.onstop = () => {
        media.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunks, { type: r.mimeType || 'audio/webm' })
        if (alive.current) { setRecording(false); setUrl(URL.createObjectURL(blob)); setExtension(blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm') }
        if (blob.size) void save(blob)
      }
      r.onerror = () => { media.getTracks().forEach(t => t.stop()); if (alive.current) { setRecording(false); setError('Die Aufnahme wurde unterbrochen. Du kannst schriftlich antworten.') } }
      r.start(); setRecording(true)
    } catch { stream.current?.getTracks().forEach(t => t.stop()); setError('Mikrofon nicht verfügbar oder nicht erlaubt. Nutze die schriftliche Antwort.') }
    finally { if (alive.current) setPending(false) }
  }
  const supported = typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
  return <div className="audio-box">
    <h4>Deine mündliche Antwort</h4><p>Aufnahmen bleiben in diesem Browser. Beim Verlassen wird die Aufnahme beendet und gespeichert.</p>
    {supported ? <button disabled={pending || saving || !!unsaved} onClick={() => recording ? recorder.current?.stop() : void start()}>{saving ? 'Aufnahme wird gespeichert …' : pending ? 'Mikrofon wird geöffnet …' : recording ? 'Aufnahme beenden' : url ? 'Aufnahme ersetzen' : 'Aufnahme starten'}</button> : <p>Aufnahme hier nicht verfügbar. Du kannst unten schriftlich antworten.</p>}
    {url && <><audio controls src={url} /><a href={url} download={'deutschraum-tag-'+day+'.'+extension}>Aufnahme herunterladen</a></>}
    {error && <p role="alert">{error}</p>}{unsaved && <button onClick={() => void save(unsaved)}>Speichern erneut versuchen</button>}
  </div>
}
