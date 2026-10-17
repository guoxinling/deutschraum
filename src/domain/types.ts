export type TaskType = 'input' | 'output' | 'review' | 'reflection'
export type TaskStatus = 'pending' | 'completed' | 'skipped'
export type OutputMode = 'spoken' | 'written'

export interface Task { id: string; type: TaskType; plannedMinutes: number; status: TaskStatus; instructions: string; outputMode?: OutputMode }
export interface StudyDay { id: string; date: string; availableMinutes: number; focusTopic: string; tasks: Task[]; reflection?: string }
export interface PlanInput { date: string; availableMinutes: 30 | 120; focusTopic: string }
export interface LearningCard { id: string; front: string; back: string; category: string; dueDate: string; intervalDays: number; mastery: number }
export interface OutputRecord { id: string; taskId: string; type: OutputMode; durationMinutes?: number; wordCount?: number; createdAt: string }
export interface ErrorNote { id: string; category: string; original: string; correction: string; status: 'open' | 'resolved' }
export interface WeeklyReport { completedTasks: number; inputMinutes: number; spokenOutputCount: number; spokenMinutes: number; writtenOutputCount: number; writtenWordCount: number; reviewCompletion: number; topErrorCategory?: string; strongestTopic?: string; nextFocus: string }
