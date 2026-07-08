import { useGameStore } from '../../store/gameStore'
import { content } from '../../content'

export default function ProgressBar() {
  const xp = useGameStore(s => s.xp)
  const completedUnits = useGameStore(s => s.completedUnits)

  const totalUnits = content.tiers.reduce((acc, t) => acc + t.units.length, 0)
  const completedCount = completedUnits.length
  const progressPct = Math.min(100, Math.round((completedCount / Math.max(totalUnits, 1)) * 100))

  const nextLevelXp = 500
  const currentProgress = Math.min(100, Math.round((xp / nextLevelXp) * 100))

  return (
    <div className="w-full bg-glass backdrop-blur-xl border-t border-glass-border px-6 py-3">
      <div className="flex items-center gap-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-xs text-white/40 font-mono">XP</div>
          <div className="text-sm text-crt-green font-mono font-bold">{xp}</div>
        </div>

        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-crt-green to-crt-green/60 rounded-full transition-all duration-700"
            style={{ width: `${currentProgress}%` }}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-xs text-white/40 font-mono">Progress</div>
          <div className="text-sm text-white font-mono">{completedCount}/{totalUnits}</div>
        </div>

        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden hidden sm:block">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
