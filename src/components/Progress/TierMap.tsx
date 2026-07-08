import { useGameStore } from '../../store/gameStore'
import { content } from '../../content'
import { useTheme } from '../../contexts/ThemeContext'

const beltColors: Record<string, { bg: string; border: string; text: string }> = {
  white: { bg: '#f3f4f6', border: '#d1d5db', text: '#1f2937' },
  yellow: { bg: '#facc15', border: '#facc15', text: '#713f12' },
  orange: { bg: '#fb923c', border: '#fb923c', text: '#7c2d12' },
  green: { bg: '#22c55e', border: '#22c55e', text: '#14532d' },
  blue: { bg: '#3b82f6', border: '#3b82f6', text: '#1e3a5f' },
  red: { bg: '#ef4444', border: '#ef4444', text: '#7f1d1d' },
  black: { bg: '#1f2937', border: '#374151', text: '#ffffff' },
}

export default function TierMap() {
  const currentTierId = useGameStore(s => s.currentTierId)
  const completedUnits = useGameStore(s => s.completedUnits)
  const unlockedUnits = useGameStore(s => s.unlockedUnits)
  const { isDark } = useTheme()

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>Tier Progression</h3>
      <div className="space-y-2">
        {content.tiers.map(tier => {
          const isActive = tier.id === currentTierId
          const completed = tier.units.every(u => completedUnits.includes(u.id))
          const belt = beltColors[tier.belt] || beltColors.white

          return (
            <div
              key={tier.id}
              className="rounded-xl p-3 transition-all"
              style={{
                backgroundColor: isActive
                  ? (isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)')
                  : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                border: isActive
                  ? '1px solid var(--text-accent)'
                  : '1px solid var(--border-subtle)',
                opacity: completed ? 0.6 : isActive ? 1 : 0.5
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: belt.bg,
                    color: belt.text
                  }}
                >
                  {tier.belt.toUpperCase()}
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{tier.name}</span>
                {completed && <span className="text-xs ml-auto" style={{ color: 'var(--text-accent)' }}>✓</span>}
                {isActive && <span className="text-xs ml-auto font-mono animate-pulse-glow" style={{ color: 'var(--text-accent)' }}>▶ ACTIVE</span>}
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{tier.focus}</p>
              <div className="flex gap-1 mt-1.5">
                {tier.units.map(unit => {
                  const done = completedUnits.includes(unit.id)
                  const unlocked = unlockedUnits.includes(unit.id)
                  return (
                    <span
                      key={unit.id}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: done
                          ? 'var(--text-accent)'
                          : unlocked
                          ? 'var(--text-tertiary)'
                          : 'var(--border-subtle)',
                        opacity: done ? 1 : unlocked ? 0.5 : 0.3
                      }}
                      title={unit.title}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
