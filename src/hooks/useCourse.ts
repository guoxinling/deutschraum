import { useEffect, useState } from 'react'
import { liveQuery } from 'dexie'
import { db } from '../db/database'
import type { CourseProgress } from '../course/progressTypes'

export function useCourseProgress() {
  const [progress, setProgress] = useState<CourseProgress[]>([])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const subscription = liveQuery(() => db.courseProgress.toArray()).subscribe({
      next: records => { setProgress(records); setReady(true) },
      error: () => { setError('Dein Lernstand konnte nicht geladen werden. Bitte erlaube lokalen Browserspeicher und lade neu.'); setReady(true) },
    })
    return () => subscription.unsubscribe()
  }, [])
  return { progress, ready, error }
}
