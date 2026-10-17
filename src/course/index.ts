import type { CourseDay } from './types'
import { week1 } from './week1'
import { day02 } from './day02'
import { day03 } from './day03'
import { day04 } from './day04'
import { day05 } from './day05'
import { day06 } from './day06'
import { day07 } from './day07'
export const courseDays: CourseDay[] = [...week1, day02, day03, day04, day05, day06, day07]
export const getCourseDay = (day: number): CourseDay => { const value = courseDays.find((item) => item.day === day); if (!value) throw new Error(`Kurs tag ${day} ist nicht verfügbar.`); return value }
export type { CourseDay, CourseExpression, CourseQuestion } from './types'
