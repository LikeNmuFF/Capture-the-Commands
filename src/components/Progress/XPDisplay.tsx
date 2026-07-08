import { useGameStore } from '../../store/gameStore'

export default function XPDisplay() {
  const xp = useGameStore(s => s.xp)

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>XP</span>
      <span className="text-sm font-mono font-bold" style={{ color: 'var(--text-accent)' }}>{xp}</span>
    </div>
  )
}
