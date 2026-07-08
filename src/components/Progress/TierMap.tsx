import { useGameStore } from '../../store/gameStore'
import { content } from '../../content'

const beltColors: Record<string, string> = {
  white: 'bg-gray-100 text-gray-800',
  yellow: 'bg-yellow-400 text-yellow-900',
  orange: 'bg-orange-400 text-orange-900',
  green: 'bg-green-500 text-green-900',
  blue: 'bg-blue-500 text-blue-900',
  red: 'bg-red-500 text-red-900',
  black: 'bg-gray-800 text-white',
}

export default function TierMap() {
  const currentTierId = useGameStore(s => s.currentTierId)
  const completedUnits = useGameStore(s => s.completedUnits)
  const unlockedUnits = useGameStore(s => s.unlockedUnits)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-white/80">Tier Progression</h3>
      <div className="space-y-2">
        {content.tiers.map(tier => {
          const isActive = tier.id === currentTierId
          const completed = tier.units.every(u => completedUnits.includes(u.id))
          const belt = beltColors[tier.belt] || 'bg-gray-500 text-white'

          return (
            <div
              key={tier.id}
              className={`rounded-xl p-3 transition-all ${
                isActive
                  ? 'bg-crt-green/10 border border-crt-green/30'
                  : completed
                  ? 'bg-white/5 border border-white/10 opacity-60'
                  : 'bg-white/5 border border-white/5 opacity-40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${belt}`}>
                  {tier.belt.toUpperCase()}
                </span>
                <span className="text-sm text-white font-semibold">{tier.name}</span>
                {completed && <span className="text-xs text-crt-green ml-auto">✓</span>}
                {isActive && <span className="text-xs text-crt-green ml-auto animate-pulse-glow">▶ ACTIVE</span>}
              </div>
              <p className="text-[11px] text-white/40">{tier.focus}</p>
              <div className="flex gap-1 mt-1.5">
                {tier.units.map(unit => {
                  const done = completedUnits.includes(unit.id)
                  const unlocked = unlockedUnits.includes(unit.id)
                  return (
                    <span
                      key={unit.id}
                      className={`w-2 h-2 rounded-full ${
                        done ? 'bg-crt-green' : unlocked ? 'bg-white/30' : 'bg-white/10'
                      }`}
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
