import { useEffect, useState, ReactNode } from 'react'
import { useGameStore } from '../../store/gameStore'

export interface ToastItem {
  id: string
  amount: number
  type: 'xp' | 'levelup' | 'belt' | 'quiz'
  message: string
}

const typeIcons: Record<string, ReactNode> = {
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

const typeColors: Record<string, { bg: string; border: string; text: string; amountText: string; glow?: string }> = {
  xp: { bg: 'var(--bg-glass)', border: 'var(--border-primary)', text: 'var(--text-primary)', amountText: 'var(--text-accent)' },
  levelup: { bg: 'var(--bg-glass)', border: 'var(--info)', text: 'var(--text-primary)', amountText: 'var(--info)', glow: '0 0 16px var(--info)' },
  belt: { bg: 'var(--bg-glass)', border: 'var(--border-primary)', text: 'var(--text-primary)', amountText: 'var(--text-accent)' },
  quiz: { bg: 'var(--bg-glass)', border: 'var(--border-primary)', text: 'var(--text-primary)', amountText: 'var(--text-accent)' },
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
            className="animate-slide-up px-4 py-2.5 rounded-xl backdrop-blur-xl font-mono text-sm flex items-center gap-2"
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              boxShadow: colors.glow || 'var(--shadow-md)',
              color: colors.text,
              animationDelay: `${i * 100}ms`
            }}
          >
            <span style={{ color: colors.amountText }}>{typeIcons[item.type] || typeIcons.xp}</span>
            <span>{item.message}</span>
            {item.amount > 0 && (
              <span className="font-bold ml-1" style={{ color: colors.amountText }}>+{item.amount}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
