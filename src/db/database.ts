import Dexie, { type Table } from 'dexie'

import type { ErrorNote, LearningCard, OutputRecord, StudyDay } from '../domain/types'
import type { CourseProgress, CourseCard, CourseAudio } from '../course/progressTypes'

export interface Material { id: string; title: string; topic: string; medium: string; difficulty: string; url?: string; text?: string; notes?: string; savedExpressions: string[] }
class LearningDatabase extends Dexie {
  courseProgress!: Table<CourseProgress, number>
  courseCards!: Table<CourseCard, string>
  courseAudio!: Table<CourseAudio, number>
  studyDays!: Table<StudyDay, string>; materials!: Table<Material, string>; learningCards!: Table<LearningCard, string>; outputs!: Table<OutputRecord, string>; errors!: Table<ErrorNote, string>
  constructor() {
    super('deutschraum')
    this.version(1).stores({ studyDays: 'id,date', materials: 'id,topic,medium,difficulty', learningCards: 'id,dueDate', outputs: 'id,taskId', errors: 'id,category,status' })
    this.version(2).stores({ courseProgress: 'day', courseCards: 'id,day,dueDate', courseAudio: 'day' })
  }
}
export const db = new LearningDatabase()
export const repository = { saveMaterial: (material: Material) => db.materials.put(material), saveLearningCard: (card: LearningCard) => db.learningCards.put(card) }
export async function clearLearningData() { await db.transaction('rw', db.studyDays, db.materials, db.learningCards, db.outputs, db.errors, async () => { await Promise.all([db.studyDays.clear(), db.materials.clear(), db.learningCards.clear(), db.outputs.clear(), db.errors.clear()]) }) }
