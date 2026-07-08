import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { content } from '../../content'
import { getLevel, getRank } from '../../utils/levels'
import { useTheme } from '../../contexts/ThemeContext'

const beltColors: Record<string, string> = {
  white: '#d1d5db',
  yellow: '#facc15',
  orange: '#fb923c',
  green: '#22c55e',
  blue: '#3b82f6',
  red: '#ef4444',
  black: '#374151',
}

const beltNames: Record<string, string> = {
  white: 'White',
  yellow: 'Yellow',
  orange: 'Orange',
  green: 'Green',
  blue: 'Blue',
  red: 'Red',
  black: 'Black',
}

export default function BeltCeremony() {
  const tierJustCompleted = useGameStore(s => s.tierJustCompleted)
  const xp = useGameStore(s => s.xp)
  const clearTierComplete = useGameStore(s => s.clearTierComplete)
  const advanceToNextUnit = useGameStore(s => s.advanceToNextUnit)
  const { isDark } = useTheme()

  useEffect(() => {
    if (tierJustCompleted === null) return
    const timer = setTimeout(() => {}, 100)
    return () => clearTimeout(timer)
  }, [tierJustCompleted])

  if (tierJustCompleted === null) return null

  const tier = content.tiers.find(t => t.id === tierJustCompleted)
  if (!tier) return null

  const level = getLevel(xp)
  const rank = getRank(level)
  const beltColor = beltColors[tier.belt] || '#d1d5db'
  const name = beltNames[tier.belt] || tier.belt

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md animate-fade-in"
      style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)' }}
    >
      <div className="text-center px-6 animate-slide-up">
        <div
          className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center animate-pulse-glow"
          style={{
            backgroundColor: isDark ? `${beltColor}20` : `${beltColor}30`,
            border: `2px solid ${beltColor}`,
            boxShadow: `0 0 30px ${beltColor}40`
          }}
        >
          <svg className="w-12 h-12" style={{ color: beltColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {name} Belt Earned!
        </h1>

        <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
          {tier.name} — Complete
        </p>

        <p className="text-sm mb-8 font-mono" style={{ color: 'var(--text-tertiary)' }}>
          {rank.icon} Level {level} {rank.title}
        </p>

        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {tier.units.map(unit => (
              <span
                key={unit.id}
                className="text-xs px-3 py-1 rounded-full font-mono flex items-center gap-1"
                style={{
                  backgroundColor: isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)',
                  borderColor: 'var(--border-primary)',
                  borderWidth: '1px',
                  color: 'var(--text-accent)'
                }}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {unit.title}
              </span>
            ))}
          </div>

          <button
            onClick={() => {
              clearTierComplete()
              advanceToNextUnit()
            }}
            className="px-8 py-3 rounded-xl font-mono text-sm transition-all animate-pulse-glow active:scale-[0.98]"
            style={{
              backgroundColor: isDark ? 'rgba(0,255,65,0.2)' : 'rgba(0,119,34,0.2)',
              borderColor: 'var(--text-accent)',
              borderWidth: '1px',
              color: 'var(--text-accent)'
            }}
          >
            Continue to Next Belt →
          </button>
        </div>
      </div>
    </div>
  )
}
