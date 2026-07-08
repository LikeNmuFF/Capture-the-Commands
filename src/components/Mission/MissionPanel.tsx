import { useMission } from '../../hooks/useMission'
import { useGameStore } from '../../store/gameStore'
import HintButton from './HintButton'
import { useTheme } from '../../contexts/ThemeContext'

export default function MissionPanel() {
  const { objectives, allComplete, hasObjectives } = useMission()
  const phase = useGameStore(s => s.phase)
  const getCurrentStepDescription = useGameStore(s => s.getCurrentStepDescription)
  const getCurrentUnit = useGameStore(s => s.getCurrentUnit)
  const currentStepIndex = useGameStore(s => s.currentStepIndex)
  const currentTierId = useGameStore(s => s.currentTierId)
  const currentUnitIndex = useGameStore(s => s.currentUnitIndex)
  const xp = useGameStore(s => s.xp)
  const { isDark } = useTheme()

  const unit = getCurrentUnit()
  const totalSteps = unit?.missionSteps.length || 0

  if (phase === 'completed') {
    return (
      <div
        className="flex flex-col backdrop-blur-xl rounded-xl p-5 shadow-lg"
        style={{
          backgroundColor: 'var(--bg-glass)',
          border: '1px solid var(--border-primary)'
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: isDark ? 'rgba(0,255,65,0.2)' : 'rgba(0,119,34,0.2)' }}
          >
            <svg className="w-5 h-5" style={{ color: 'var(--text-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Unit Complete!</h2>
            <p className="text-xs font-mono" style={{ color: 'var(--text-accent)', opacity: 0.8 }}>+100 XP earned</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Great work! Click "Continue to Next Unit" to proceed.</p>
      </div>
    )
  }

  const doneCount = objectives.filter(o => o.done).length

  return (
    <div
      className="flex flex-col backdrop-blur-xl rounded-xl shadow-lg"
      style={{
        backgroundColor: 'var(--bg-glass)',
        border: '1px solid var(--border-primary)'
      }}
    >
      {/* Header */}
      <div className="p-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-tertiary)' }}>
            Tier {currentTierId} · Unit {currentUnitIndex + 1}
          </span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
            {xp} XP
          </span>
        </div>
        <h2 className="text-base font-semibold truncate tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {unit?.title || 'Loading...'}
        </h2>
        {unit && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {unit.commands.map(cmd => (
              <span
                key={cmd}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)',
                  color: 'var(--text-accent)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                {cmd}
              </span>
            ))}
          </div>
        )}
      </div>

      {phase === 'mission' && (
        <div className="p-4 space-y-3">
          {/* Step progress */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(currentStepIndex / Math.max(totalSteps, 1)) * 100}%`,
                  background: 'linear-gradient(90deg, var(--text-accent), var(--text-accent))'
                }}
              />
            </div>
            <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>
              Step {currentStepIndex + 1}/{totalSteps}
            </span>
          </div>

          {/* Current instruction card */}
          <div className="rounded-lg p-3" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: '1px solid var(--border-subtle)' }}>
            <div className="text-[10px] uppercase tracking-wider mb-1.5 font-mono" style={{ color: 'var(--text-tertiary)' }}>Mission</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)', opacity: 0.85 }}>
              {getCurrentStepDescription()}
            </p>
          </div>

          {/* Objectives */}
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-2 font-mono flex items-center justify-between" style={{ color: 'var(--text-tertiary)' }}>
              <span>Objectives</span>
              {hasObjectives && (
                <span style={{ opacity: 0.5 }}>
                  {doneCount}/{objectives.length}
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              {hasObjectives ? (
                objectives.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: obj.done ? (isDark ? 'rgba(0,255,65,0.05)' : 'rgba(0,119,34,0.05)') : 'transparent',
                      border: obj.done ? '1px solid var(--border-primary)' : '1px solid transparent'
                    }}
                  >
                    <div
                      className="mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-all duration-300 shrink-0"
                      style={{
                        backgroundColor: obj.done ? 'var(--text-accent)' : 'transparent',
                        borderColor: obj.done ? 'var(--text-accent)' : 'var(--border-primary)',
                        color: obj.done ? 'var(--bg-primary)' : 'transparent'
                      }}
                    >
                      {obj.done ? '✓' : ''}
                    </div>
                    <span
                      className="text-xs leading-relaxed transition-all duration-300"
                      style={{
                        color: obj.done ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                        textDecoration: obj.done ? 'line-through' : 'none'
                      }}
                    >
                      {obj.description}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>Complete the mission step above</p>
              )}
            </div>
          </div>

          {allComplete && (
            <div
              className="text-xs font-mono flex items-center gap-2 rounded-lg p-2.5 animate-fade-in"
              style={{
                backgroundColor: isDark ? 'rgba(0,255,65,0.05)' : 'rgba(0,119,34,0.05)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-accent)'
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--text-accent)' }} />
              All objectives met! Advancing...
            </div>
          )}
        </div>
      )}

      {phase === 'quiz' && (
        <div className="p-6 flex flex-col items-center justify-center text-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{
              backgroundColor: isDark ? 'rgba(88,166,255,0.1)' : 'rgba(9,105,218,0.1)',
              border: '1px solid var(--border-primary)'
            }}
          >
            <svg className="w-6 h-6" style={{ color: 'var(--info)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs leading-relaxed max-w-[180px]" style={{ color: 'var(--text-secondary)' }}>
            Quick quiz time! Test your understanding before the challenge.
          </p>
        </div>
      )}

      {phase === 'challenge' && (
        <div className="p-6 flex flex-col items-center justify-center text-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{
              backgroundColor: isDark ? 'rgba(255,176,0,0.1)' : 'rgba(154,103,0,0.1)',
              border: '1px solid var(--border-primary)'
            }}
          >
            <svg className="w-6 h-6" style={{ color: 'var(--warning)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <p className="text-xs leading-relaxed max-w-[180px]" style={{ color: 'var(--text-secondary)' }}>
            Challenge mode active. Find the flag using your terminal below.
          </p>
        </div>
      )}

      <div className="px-4 pb-4">
        <HintButton />
      </div>
    </div>
  )
}
