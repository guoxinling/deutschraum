export const navigationItems = [{ id: 'Heute', icon: '◒', zh: '今天' }, { id: 'Kurs', icon: '▤', zh: '课程' }, { id: 'Wiederholen', icon: '↻', zh: '复习' }, { id: 'Mein Lernen', icon: '◉', zh: '我的' }]
export function BottomNav({ active, onChange }: { active: string; onChange: (value: string) => void }) {
  return <nav aria-label="Hauptnavigation" className="bottom-navigation">{navigationItems.map(item => <button aria-current={active === item.id ? 'page' : undefined} key={item.id} onClick={() => onChange(item.id)}><span aria-hidden="true" className="nav-icon">{item.icon}</span><span>{item.id}</span><small>{item.zh}</small></button>)}</nav>
}
