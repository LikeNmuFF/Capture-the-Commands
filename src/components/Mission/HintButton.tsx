import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export default function HintButton() {
  const [showHint, setShowHint] = useState(false)
  const getCurrentStepHint = useGameStore(s => s.getCurrentStepHint)
  const hint = getCurrentStepHint()

  return (
    <div className="mt-3">
      <button
        onClick={() => setShowHint(!showHint)}
        className="text-xs text-white/40 hover:text-white/60 transition-colors font-mono"
      >
        {showHint ? '[-] Hide hint' : '[?] Need a hint?'}
      </button>
      {showHint && hint && (
        <p className="mt-1.5 text-xs text-amber-400/80 bg-amber-400/5 rounded p-2 leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  )
}
