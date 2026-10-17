import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { TodayScreen } from './screens/TodayScreen'
import { CourseScreen } from './screens/CourseScreen'
import { LessonScreen } from './screens/LessonScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { MyLearningScreen } from './screens/MyLearningScreen'

export function App() {
  const [active, setActive] = useState('Heute')
  const [lesson, setLesson] = useState<number>()
  function navigate(value: string) { setLesson(undefined); setActive(value) }
  return <div className="app-shell">
    <header className="brand"><div><span className="brand-mark" aria-hidden="true">d.</span><h1>Deutschraum<span>DEIN PERSÖNLICHER LERNRAUM</span></h1></div><span className="edition">C1 / RESTART</span></header>
    <main>{lesson ? <LessonScreen key={lesson} day={lesson} onBack={() => setLesson(undefined)} /> : active === 'Heute' ? <TodayScreen onStart={setLesson} /> : active === 'Kurs' ? <CourseScreen onStart={setLesson} /> : active === 'Wiederholen' ? <ReviewScreen /> : <MyLearningScreen />}</main>
    <BottomNav active={active} onChange={navigate} />
  </div>
}
