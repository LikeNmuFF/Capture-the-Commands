import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { content } from '../../content'
import { getLevel, getRank } from '../../utils/levels'
import Badge from '../ui/Badge'
import { fadeUp, stagger } from '../../lib/motion'

const beltColorHex: Record<string, string> = {
  white: '#d1d5db',
  yellow: '#facc15',
  orange: '#fb923c',
  green: '#22c55e',
  blue: '#3b82f6',
  red: '#ef4444',
  black: '#374151',
}

export default function VisualUnitMap() {
  const xp = useGameStore(s => s.xp)
  const completedUnits = useGameStore(s => s.completedUnits)
  const unlockedUnits = useGameStore(s => s.unlockedUnits)
  const currentTierId = useGameStore(s => s.currentTierId)
  const startUnit = useGameStore(s => s.startUnit)
  const phase = useGameStore(s => s.phase)

  const level = getLevel(xp)
  const rank = getRank(level)

  return (
    <div className="flex flex-col gap-0 w-full max-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h3
          className="text-[10px] font-semibold uppercase tracking-widest font-mono"
          style={{ color: 'var(--text-tertiary)' }}
        >
          PROGRESSION MAP
        </h3>
        <span
          className="text-[9px] font-mono"
          style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}
        >
          {rank.icon} Lv.{level} {rank.title}
        </span>
      </div>

      {/* Constellation */}
      <motion.div
        className="flex flex-col"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {content.tiers.map(tier => {
          const isActiveTier = tier.id === currentTierId
          const allCompleted = tier.units.every(u => completedUnits.includes(u.id))
          const beltHex = beltColorHex[tier.belt] || beltColorHex.white

          return (
            <motion.div
              key={tier.id}
              className="flex flex-col"
              variants={fadeUp}
            >
              {/* Belt accent line */}
              <div
                className="w-full h-[2px] rounded-full"
                style={{ backgroundColor: beltHex, opacity: isActiveTier ? 1 : allCompleted ? 0.6 : 0.25 }}
              />

              {/* Tier label row */}
              <div className="flex items-center gap-1.5 mt-1.5 mb-1 px-1">
                <Badge color={beltHex}>
                  {tier.belt.toUpperCase()}
                </Badge>
                <span
                  className="text-[11px] font-medium tracking-tight truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {tier.name}
                </span>
                {allCompleted && (
                  <span
                    className="text-[9px] ml-auto font-mono"
                    style={{ color: 'var(--text-accent)' }}
                  >
                    ✓
                  </span>
                )}
                {isActiveTier && !allCompleted && (
                  <span
                    className="text-[9px] ml-auto font-mono animate-pulse-glow"
                    style={{ color: 'var(--text-accent)' }}
                  >
                    ●
                  </span>
                )}
              </div>

              {/* Nodes row */}
              <div className="flex items-center pl-1 mb-0.5">
                {tier.units.map((unit, ui) => {
                  const done = completedUnits.includes(unit.id)
                  const unlocked = unlockedUnits.includes(unit.id)
                  const storeState = useGameStore.getState()
                  const isCurrent = isActiveTier && ui === storeState.currentUnitIndex

                  const canClick = unlocked && !done && phase !== 'challenge'

                  let nodeBg = 'var(--bg-tertiary)'
                  let nodeBorderColor = 'var(--border-subtle)'
                  let nodeOpacity = 0.5
                  let nodeBoxShadow = 'none'
                  let nodeLabel: React.ReactNode = ui + 1

                  if (done) {
                    nodeBg = 'color-mix(in srgb, var(--text-accent) 15%, transparent)'
                    nodeBorderColor = 'var(--text-accent)'
                    nodeOpacity = 1
                    nodeLabel = '✓'
                  } else if (isCurrent) {
                    nodeBorderColor = 'var(--text-accent)'
                    nodeOpacity = 1
                    nodeBoxShadow = '0 0 8px var(--text-accent)'
                    nodeLabel = '▸'
                  } else if (unlocked) {
                    nodeBorderColor = 'var(--border-primary)'
                    nodeOpacity = 1
                  }

                  return (
                    <div key={unit.id} className="flex items-center">
                      {/* Connecting line */}
                      {ui > 0 && (
                        <div
                          className="h-px"
                          style={{
                            width: '10px',
                            backgroundColor: done ? 'var(--text-accent)' : 'var(--border-subtle)',
                            opacity: done ? 0.5 : 0.25,
                          }}
                        />
                      )}

                      {/* Node */}
                      <button
                        onClick={() => canClick && startUnit(tier.id, ui)}
                        disabled={!canClick}
                        className="relative flex items-center justify-center rounded-full transition-all duration-200 shrink-0"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          borderColor: nodeBorderColor,
                          backgroundColor: nodeBg,
                          opacity: nodeOpacity,
                          boxShadow: nodeBoxShadow,
                          cursor: canClick ? 'pointer' : 'default',
                          animation: isCurrent && !done ? 'pulse-glow 2s ease-in-out infinite' : undefined,
                        }}
                        title={done ? `✓ ${unit.title}` : unlocked ? unit.title : 'Locked'}
                      >
                        <span
                          className="text-[10px] font-bold font-mono"
                          style={{
                            color: done ? 'var(--text-accent)' : isCurrent ? 'var(--text-accent)' : 'var(--text-tertiary)',
                          }}
                        >
                          {nodeLabel}
                        </span>

                        {/* Glow ring for done nodes */}
                        {done && (
                          <span
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                              boxShadow: '0 0 6px var(--text-accent)',
                              opacity: 0.2,
                            }}
                          />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Unit labels row */}
              <div className="flex items-start pl-1 mb-2">
                {tier.units.map(unit => (
                  <div
                    key={unit.id}
                    className="flex flex-col items-center shrink-0"
                    style={{ width: '32px' }}
                  >
                    <span
                      className="text-[7px] font-mono leading-tight text-center truncate w-full px-0.5"
                      style={{
                        color: 'var(--text-tertiary)',
                        opacity: completedUnits.includes(unit.id)
                          ? 0.5
                          : unlockedUnits.includes(unit.id)
                          ? 0.4
                          : 0.3,
                      }}
                    >
                      {unit.title.length > 6 ? unit.title.slice(0, 5) + '…' : unit.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
