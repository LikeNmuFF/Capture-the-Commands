import { useGameStore } from '../../store/gameStore'
import { content } from '../../content'
import { useTheme } from '../../contexts/ThemeContext'

export default function ProgressBar() {
  const xp = useGameStore(s => s.xp)
  const completedUnits = useGameStore(s => s.completedUnits)
  const { isDark } = useTheme()

  const totalUnits = content.tiers.reduce((acc, t) => acc + t.units.length, 0)
  const completedCount = completedUnits.length
  const progressPct = Math.min(100, Math.round((completedCount / Math.max(totalUnits, 1)) * 100))

  const nextLevelXp = 500
  const currentProgress = Math.min(100, Math.round((xp / nextLevelXp) * 100))

  return (
    <div
      className="w-full backdrop-blur-xl px-6 py-3"
      style={{
        backgroundColor: 'var(--bg-glass)',
        borderTop: '1px solid var(--border-subtle)'
      }}
    >
      <div className="flex items-center gap-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>XP</div>
          <div className="text-sm font-mono font-bold" style={{ color: 'var(--text-accent)' }}>{xp}</div>
        </div>

        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${currentProgress}%`,
              background: 'linear-gradient(90deg, var(--text-accent), var(--text-accent))'
            }}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>Progress</div>
          <div className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{completedCount}/{totalUnits}</div>
        </div>

        <div className="flex-1 h-2 rounded-full overflow-hidden hidden sm:block" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, var(--info), #60a5fa)'
            }}
          />
        </div>
      </div>
    </div>
  )
}
