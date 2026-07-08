import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import FlagInput from './FlagInput'
import { useTheme } from '../../contexts/ThemeContext'

export default function ChallengePanel() {
  const [showHint, setShowHint] = useState(false)
  const phase = useGameStore(s => s.phase)
  const getCurrentUnit = useGameStore(s => s.getCurrentUnit)
  const { isDark } = useTheme()

  const unit = getCurrentUnit()

  if (phase !== 'challenge' || !unit) return null

  return (
    <div
      className="flex flex-col backdrop-blur-xl rounded-xl shadow-lg"
      style={{
        backgroundColor: 'var(--bg-glass)',
        border: '1px solid var(--warning)',
        boxShadow: isDark ? '0 4px 12px rgba(255,176,0,0.05)' : '0 4px 12px rgba(154,103,0,0.05)'
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 p-4 pb-3"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: isDark ? 'rgba(255,176,0,0.15)' : 'rgba(154,103,0,0.15)',
            border: '1px solid var(--border-primary)'
          }}
        >
          <svg className="w-4 h-4" style={{ color: 'var(--warning)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Challenge Mode</h3>
          <p className="text-[10px] font-mono" style={{ color: 'var(--warning)', opacity: 0.6 }}>Find the flag to complete this unit</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div
          className="rounded-lg p-3"
          style={{
            backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <p className="text-xs leading-relaxed whitespace-pre-wrap font-mono" style={{ color: 'var(--text-primary)', opacity: 0.75 }}>
            {unit.challenge.brief}
          </p>
        </div>

        {showHint && (
          <div
            className="rounded-lg p-3 animate-fade-in"
            style={{
              backgroundColor: isDark ? 'rgba(255,176,0,0.05)' : 'rgba(154,103,0,0.05)',
              border: '1px solid var(--border-primary)'
            }}
          >
            <p className="text-xs leading-relaxed" style={{ color: 'var(--warning)', opacity: 0.7 }}>
              {unit.challenge.hint}
            </p>
          </div>
        )}

        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs font-mono flex items-center gap-1 transition-colors"
          style={{ color: 'var(--warning)', opacity: 0.5 }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5' }}
        >
          <svg
            className="w-2 h-2 transition-transform duration-200"
            style={{ transform: showHint ? 'rotate(90deg)' : 'rotate(0deg)' }}
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <path d="M2 0l4 4-4 4z" />
          </svg>
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
