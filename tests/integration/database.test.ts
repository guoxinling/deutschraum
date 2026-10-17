import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it } from 'vitest'

import { clearLearningData, repository } from '../../src/db/database'
import { exportLearningData, importLearningData } from '../../src/db/export'

afterEach(async () => { await clearLearningData() })

describe('learning data export', () => {
  it('exports saved materials and cards', async () => {
    const material = { id: 'm1', title: 'KI und Arbeit', topic: 'Arbeit', medium: 'article', difficulty: 'C1', savedExpressions: [] }
    const card = { id: 'c1', front: 'auf etwas eingehen', back: 'address', category: 'collocation', dueDate: '2026-10-16', intervalDays: 1, mastery: 0 }
    await repository.saveMaterial(material)
    await repository.saveLearningCard(card)
    const exported = await exportLearningData()
    expect(exported.materials).toContainEqual(material)
    expect(exported.learningCards).toContainEqual(card)
  })

  it('rejects malformed imports without replacing saved data', async () => {
    await repository.saveMaterial({ id: 'm1', title: 'Bleibt', topic: 'Arbeit', medium: 'article', difficulty: 'C1', savedExpressions: [] })
    await expect(importLearningData({ schemaVersion: 99 } as never)).rejects.toThrow(/ungültig/i)
    expect((await exportLearningData()).materials).toHaveLength(1)
  })
})
