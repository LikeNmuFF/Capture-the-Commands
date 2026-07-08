import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export interface ToastItem {
  id: string
  amount: number
  type: 'xp' | 'levelup' | 'belt' | 'quiz'
  message: string
}

const typeStyles: Record<string, string> = {
  xp: 'bg-crt-green/20 border-crt-green/40 text-crt-green',
  levelup: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
  belt: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  quiz: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
}

const typeIcons: Record<string, string> = {
  xp: '⚡',
  levelup: '⬆',
  belt: '🎖',
  quiz: '📝',
}

export default function XPToast() {
  const [items, setItems] = useState<ToastItem[]>([])
  const toasts = useGameStore(s => s.xpToasts)

  useEffect(() => {
    if (toasts.length === 0) {
      setItems([])
      return
    }
    setItems(toasts)

    const timer = setTimeout(() => {
      useGameStore.getState().clearToasts()
      setItems([])
    }, 2500)

    return () => clearTimeout(timer)
  }, [toasts])

  if (items.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`animate-slide-up px-4 py-2.5 rounded-xl border backdrop-blur-xl ${typeStyles[item.type] || typeStyles.xp} font-mono text-sm flex items-center gap-2 shadow-lg`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <span>{typeIcons[item.type] || '✦'}</span>
          <span>{item.message}</span>
        </div>
      ))}
    </div>
  )
}
