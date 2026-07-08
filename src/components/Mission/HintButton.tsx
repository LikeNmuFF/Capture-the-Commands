import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useTheme } from '../../contexts/ThemeContext'

export default function HintButton() {
  const [showHint, setShowHint] = useState(false)
  const getCurrentStepHint = useGameStore(s => s.getCurrentStepHint)
  const hint = getCurrentStepHint()
  const { isDark } = useTheme()

  return (
    <div className="mt-3">
      <button
        onClick={() => setShowHint(!showHint)}
        className="text-xs font-mono transition-colors"
        style={{ color: 'var(--text-tertiary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
      >
        {showHint ? (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
            Hide hint
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Need a hint?
          </span>
        )}
      </button>
      {showHint && hint && (
        <p
          className="mt-1.5 text-xs rounded p-2 leading-relaxed animate-fade-in"
          style={{
            color: 'var(--warning)',
            backgroundColor: isDark ? 'rgba(255,176,0,0.05)' : 'rgba(154,103,0,0.05)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {hint}
        </p>
      )}
    </div>
  )
}
