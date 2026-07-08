import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { content } from '../../content'
import { getLevel, getRank } from '../../utils/levels'

const beltEmojis: Record<string, string> = {
  white: '⚪',
  yellow: '🟡',
  orange: '🟠',
  green: '🟢',
  blue: '🔵',
  red: '🔴',
  black: '⚫',
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
  const emoji = beltEmojis[tier.belt] || '🎖'
  const name = beltNames[tier.belt] || tier.belt

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="text-center px-6 animate-slide-up">
        <div className="text-7xl mb-6 animate-pulse-glow" style={{ animationDuration: '1.5s' }}>
          {emoji}
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">
          {name} Belt Earned!
        </h1>

        <p className="text-lg text-white/60 mb-2">
          {tier.name} — Complete
        </p>

        <p className="text-sm text-white/40 mb-8 font-mono">
          {rank.icon} Level {level} {rank.title}
        </p>

        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {tier.units.map(unit => (
              <span key={unit.id} className="text-xs bg-crt-green/10 border border-crt-green/30 text-crt-green px-3 py-1 rounded-full font-mono">
                ✓ {unit.title}
              </span>
            ))}
          </div>

          <button
            onClick={() => {
              clearTierComplete()
              advanceToNextUnit()
            }}
            className="px-8 py-3 rounded-xl bg-crt-green/20 border border-crt-green/40 text-crt-green font-mono text-sm hover:bg-crt-green/30 transition-all animate-pulse-glow"
          >
            Continue to Next Belt →
          </button>
        </div>
      </div>
    </div>
  )
}
