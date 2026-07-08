import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export interface ToastItem {
  id: string
  amount: number
  type: 'xp' | 'levelup' | 'belt' | 'quiz'
  message: string
}

const typeIcons: Record<string, JSX.Element> = {
  xp: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  levelup: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ),
  belt: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  quiz: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
}

const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  xp: { bg: 'rgba(0,255,65,0.15)', border: 'rgba(0,255,65,0.3)', text: 'var(--text-accent)' },
  levelup: { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', text: '#c084fc' },
  belt: { bg: 'rgba(255,176,0,0.15)', border: 'rgba(255,176,0,0.3)', text: '#fbbf24' },
  quiz: { bg: 'rgba(88,166,255,0.15)', border: 'rgba(88,166,255,0.3)', text: '#60a5fa' },
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
      {items.map((item, i) => {
        const colors = typeColors[item.type] || typeColors.xp
        return (
          <div
            key={item.id}
            className="animate-slide-up px-4 py-2.5 rounded-xl backdrop-blur-xl font-mono text-sm flex items-center gap-2 shadow-lg"
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
              borderWidth: '1px',
              color: colors.text,
              animationDelay: `${i * 100}ms`
            }}
          >
            {typeIcons[item.type] || typeIcons.xp}
            <span>{item.message}</span>
          </div>
        )
      })}
    </div>
  )
}
