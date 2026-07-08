import { useGameStore } from '../../store/gameStore'
import { content } from '../../content'
import { getLevel, getRank } from '../../utils/levels'

const beltColors: Record<string, string> = {
  white: 'border-gray-300 bg-gray-100 text-gray-800',
  yellow: 'border-yellow-400 bg-yellow-400 text-yellow-900',
  orange: 'border-orange-400 bg-orange-400 text-orange-900',
  green: 'border-green-500 bg-green-500 text-green-900',
  blue: 'border-blue-500 bg-blue-500 text-blue-900',
  red: 'border-red-500 bg-red-500 text-red-900',
  black: 'border-gray-700 bg-gray-800 text-white',
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest font-mono">
          Progression Map
        </h3>
        <span className="text-[9px] text-white/30 font-mono">
          {rank.icon} Lv.{level} {rank.title}
        </span>
      </div>

      <div className="space-y-1.5">
        {content.tiers.map(tier => {
          const isActiveTier = tier.id === currentTierId
          const allCompleted = tier.units.every(u => completedUnits.includes(u.id))
          const belt = beltColors[tier.belt] || 'border-gray-500 bg-gray-500 text-white'

          return (
            <div
              key={tier.id}
              className={`group rounded-lg p-2.5 transition-all duration-200 ${
                isActiveTier
                  ? 'bg-white/[0.06] border border-crt-green/15 shadow-sm'
                  : allCompleted
                  ? 'bg-white/[0.03] border border-white/5 opacity-60 hover:opacity-80'
                  : 'bg-white/[0.02] border border-transparent opacity-30'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${belt}`}>
                  {tier.belt.toUpperCase()}
                </span>
                <span className="text-xs text-white font-medium tracking-tight">{tier.name}</span>
                {allCompleted && (
                  <span className="text-[9px] text-crt-green ml-auto font-mono">✓</span>
                )}
                {isActiveTier && !allCompleted && (
                  <span className="text-[9px] text-crt-green ml-auto font-mono animate-pulse-glow">●</span>
                )}
              </div>

              {/* Unit nodes */}
              <div className="flex items-center gap-1 pl-0.5">
                {tier.units.map((unit, ui) => {
                  const done = completedUnits.includes(unit.id)
                  const unlocked = unlockedUnits.includes(unit.id)
                  const storeState = useGameStore.getState()
                  const isCurrent = isActiveTier && ui === storeState.currentUnitIndex

                  let nodeClass = 'relative w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-200 select-none'
                  if (done) {
                    nodeClass += ' bg-crt-green/15 border-crt-green/60 text-crt-green cursor-default'
                  } else if (isCurrent) {
                    nodeClass += ' bg-crt-green/10 border-crt-green text-crt-green animate-pulse-glow shadow-sm shadow-crt-green/20'
                  } else if (unlocked) {
                    nodeClass += ' bg-white/8 border-white/25 text-white/50 hover:bg-white/15 hover:border-white/40 hover:text-white/70 hover:shadow-sm cursor-pointer'
                  } else {
                    nodeClass += ' bg-white/5 border-white/10 text-white/20 cursor-not-allowed'
                  }

                  return (
                    <div key={unit.id} className="flex items-center gap-0.5">
                      {ui > 0 && (
                        <div className={`w-1.5 h-px ${done ? 'bg-crt-green/40' : 'bg-white/10'}`} />
                      )}
                      <button
                        onClick={() => unlocked && !done && phase !== 'challenge' && startUnit(tier.id, ui)}
                        disabled={!unlocked || done || phase === 'challenge'}
                        className={nodeClass}
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
                    className={`text-[7px] font-mono truncate ${
                      unit.id === 't1u1' ? 'max-w-16' : 'max-w-12'
                    } ${
                      completedUnits.includes(unit.id) ? 'text-white/35' : unlockedUnits.includes(unit.id) ? 'text-white/25' : 'text-white/10'
                    }`}
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
