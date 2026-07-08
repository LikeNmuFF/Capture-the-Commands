import { useGameStore } from '../../store/gameStore'

export default function XPDisplay() {
  const xp = useGameStore(s => s.xp)

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-white/40 font-mono">XP</span>
      <span className="text-sm text-crt-green font-mono font-bold">{xp}</span>
    </div>
  )
}
