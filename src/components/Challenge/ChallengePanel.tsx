import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import FlagInput from './FlagInput'

export default function ChallengePanel() {
  const [showHint, setShowHint] = useState(false)
  const phase = useGameStore(s => s.phase)
  const getCurrentUnit = useGameStore(s => s.getCurrentUnit)

  const unit = getCurrentUnit()

  if (phase !== 'challenge' || !unit) return null

  return (
    <div className="flex flex-col bg-glass backdrop-blur-xl rounded-xl border border-amber-500/20 shadow-lg shadow-amber-500/5">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 pb-3 border-b border-amber-500/10">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-sm">
          ⚔
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Challenge Mode</h3>
          <p className="text-[10px] text-amber-400/60 font-mono">Find the flag to complete this unit</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="bg-black/30 rounded-lg p-3 border border-amber-500/10">
          <p className="text-xs text-white/75 leading-relaxed whitespace-pre-wrap font-mono">
            {unit.challenge.brief}
          </p>
        </div>

        {showHint && (
          <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/15 animate-fade-in">
            <p className="text-xs text-amber-400/70 leading-relaxed">
              {unit.challenge.hint}
            </p>
          </div>
        )}

        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-amber-400/50 hover:text-amber-400 transition-colors font-mono flex items-center gap-1"
        >
          <span className="text-[9px]">{showHint ? '▼' : '▶'}</span>
          {showHint ? 'Hide hint' : 'Need a hint?'}
        </button>
      </div>

      {/* Flag input */}
      <div className="px-4 pb-4 pt-0">
        <FlagInput unitId={unit.id} />
      </div>
    </div>
  )
}
