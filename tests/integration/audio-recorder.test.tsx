import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { AudioRecorder } from '../../src/components/course/AudioRecorder'
import { db } from '../../src/db/database'
import { Blob as NativeBlob } from 'node:buffer'

afterEach(async () => { cleanup(); vi.unstubAllGlobals(); await db.courseAudio.clear() })

it('offers a text fallback and releases the busy state when microphone permission is denied', async () => {
  vi.stubGlobal('MediaRecorder', class {})
  vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn().mockRejectedValue(new Error('Denied')) } })
  const busy = vi.fn()
  render(<AudioRecorder day={1} onBusy={busy} />)
  fireEvent.click(screen.getByRole('button', { name: 'Aufnahme starten' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Nutze die schriftliche Antwort')
  await waitFor(() => expect(busy).toHaveBeenLastCalledWith(false))
  expect(await db.courseAudio.count()).toBe(0)
})

it('keeps the correct download extension for an MP4 recording', async () => {
  // fake-indexeddb uses Node's structuredClone; use its cloneable Blob implementation.
  vi.stubGlobal('Blob', NativeBlob)
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL() { return 'blob:test-recording' }
    static revokeObjectURL() {}
  })
  await db.courseAudio.put({ day: 1, blob: new Blob(['recording'], { type: 'audio/mp4' }), createdAt: new Date().toISOString() })
  render(<AudioRecorder day={1} />)
  expect(await screen.findByRole('link', { name: 'Aufnahme herunterladen' })).toHaveAttribute('download', 'deutschraum-tag-1.m4a')
})
