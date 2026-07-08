import { useGameStore } from '../../store/gameStore'
import { content } from '../../content'
import { getLevel, getRank } from '../../utils/levels'
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

export default function VisualUnitMap() {
  const xp = useGameStore(s => s.xp)
  const completedUnits = useGameStore(s => s.completedUnits)
  const unlockedUnits = useGameStore(s => s.unlockedUnits)
  const currentTierId = useGameStore(s => s.currentTierId)
  const startUnit = useGameStore(s => s.startUnit)
  const phase = useGameStore(s => s.phase)
  const { isDark } = useTheme()

  const level = getLevel(xp)
  const rank = getRank(level)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest font-mono" style={{ color: 'var(--text-tertiary)' }}>
          Progression Map
        </h3>
        <span className="text-[9px] font-mono" style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>
          {rank.icon} Lv.{level} {rank.title}
        </span>
      </div>

      <div className="space-y-1.5">
        {content.tiers.map(tier => {
          const isActiveTier = tier.id === currentTierId
          const allCompleted = tier.units.every(u => completedUnits.includes(u.id))
          const belt = beltColors[tier.belt] || beltColors.white

          return (
            <div
              key={tier.id}
              className="group rounded-lg p-2.5 transition-all duration-200"
              style={{
                backgroundColor: isActiveTier
                  ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')
                  : allCompleted
                  ? (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)')
                  : 'transparent',
                border: isActiveTier
                  ? '1px solid var(--border-primary)'
                  : '1px solid transparent',
                opacity: allCompleted ? 0.8 : isActiveTier ? 1 : 0.5
              }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: belt.bg,
                    color: belt.text,
                    border: `1px solid ${belt.border}`
                  }}
                >
                  {tier.belt.toUpperCase()}
                </span>
                <span className="text-xs font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>{tier.name}</span>
                {allCompleted && (
                  <span className="text-[9px] ml-auto font-mono" style={{ color: 'var(--text-accent)' }}>✓</span>
                )}
                {isActiveTier && !allCompleted && (
                  <span className="text-[9px] ml-auto font-mono animate-pulse-glow" style={{ color: 'var(--text-accent)' }}>●</span>
                )}
              </div>

              {/* Unit nodes */}
              <div className="flex items-center gap-1 pl-0.5">
                {tier.units.map((unit, ui) => {
                  const done = completedUnits.includes(unit.id)
                  const unlocked = unlockedUnits.includes(unit.id)
                  const storeState = useGameStore.getState()
                  const isCurrent = isActiveTier && ui === storeState.currentUnitIndex

                  let nodeStyle: React.CSSProperties = {
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                    cursor: done ? 'default' : unlocked ? 'pointer' : 'not-allowed'
                  }

                  if (done) {
                    nodeStyle = {
                      ...nodeStyle,
                      backgroundColor: isDark ? 'rgba(0,255,65,0.15)' : 'rgba(0,119,34,0.15)',
                      borderColor: 'var(--text-accent)',
                      color: 'var(--text-accent)'
                    }
                  } else if (isCurrent) {
                    nodeStyle = {
                      ...nodeStyle,
                      backgroundColor: isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)',
                      borderColor: 'var(--text-accent)',
                      color: 'var(--text-accent)',
                      boxShadow: isDark ? '0 0 8px rgba(0,255,65,0.2)' : '0 0 8px rgba(0,119,34,0.2)'
                    }
                  } else if (unlocked) {
                    nodeStyle = {
                      ...nodeStyle,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-tertiary)'
                    }
                  } else {
                    nodeStyle = {
                      ...nodeStyle,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-tertiary)',
                      opacity: 0.5
                    }
                  }

                  return (
                    <div key={unit.id} className="flex items-center gap-0.5">
                      {ui > 0 && (
                        <div
                          className="w-1.5 h-px"
                          style={{
                            backgroundColor: done ? 'var(--text-accent)' : 'var(--border-subtle)',
                            opacity: done ? 0.4 : 0.3
                          }}
                        />
                      )}
                      <button
                        onClick={() => unlocked && !done && phase !== 'challenge' && startUnit(tier.id, ui)}
                        disabled={!unlocked || done || phase === 'challenge'}
                        style={nodeStyle}
                        title={done ? `✓ ${unit.title}` : unlocked ? unit.title : 'Locked'}
                      >
                        {done ? '✓' : ui + 1}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Unit labels */}
              <div className="flex gap-1 mt-1 pl-0.5">
                {tier.units.map(unit => (
                  <span
                    key={unit.id}
                    className="text-[7px] font-mono truncate"
                    style={{
                      maxWidth: unit.id === 't1u1' ? '64px' : '48px',
                      color: completedUnits.includes(unit.id)
                        ? 'var(--text-tertiary)'
                        : unlockedUnits.includes(unit.id)
                        ? 'var(--text-tertiary)'
                        : 'var(--text-tertiary)',
                      opacity: completedUnits.includes(unit.id) ? 0.5 : unlockedUnits.includes(unit.id) ? 0.4 : 0.3
                    }}
                  >
                    {unit.title.length > 8 ? unit.title.slice(0, 7) + '…' : unit.title}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
