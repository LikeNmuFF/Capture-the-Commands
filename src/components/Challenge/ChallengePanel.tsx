import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { useTheme } from '../../contexts/ThemeContext'
import { checkObjective } from '../../utils/objectiveCheckers'
import { ObjectiveData } from '../../types'
import FlagInput from './FlagInput'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function ChallengePanel() {
  const [showHint, setShowHint] = useState(false)
  const phase = useGameStore(s => s.phase)
  const getCurrentUnit = useGameStore(s => s.getCurrentUnit)
  const env = useGameStore(s => s.env)
  const usedCommands = useGameStore(s => s.usedCommands)
  const { isDark } = useTheme()

  const unit = getCurrentUnit()

  const challengeObjectives = unit?.challenge.objectives || []

  const objectiveStatuses = useMemo(() => {
    return challengeObjectives.map(obj => ({
      description: obj.description,
      done: checkObjective(obj as ObjectiveData, env, usedCommands),
    }))
  }, [challengeObjectives, env, usedCommands])

  const allMet = objectiveStatuses.length > 0 && objectiveStatuses.every(o => o.done)
  const doneCount = objectiveStatuses.filter(o => o.done).length

  if (phase !== 'challenge' || !unit) return null

  return (
    <Card hover={false} className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Badge color="var(--warning)">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Challenge Mode
            </Badge>
          </div>
          <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {unit.title}
          </h3>
          <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--warning)', opacity: 0.7 }}>
            Complete the objectives and find the flag
          </p>
        </div>

        {/* Briefing */}
        <div className="px-4 pt-3 pb-0">
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.03)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--warning)' }}>
                Dossier
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
            </div>
            <p
              className="text-xs leading-relaxed whitespace-pre-wrap font-mono"
              style={{ color: 'var(--text-primary)', opacity: 0.8 }}
            >
              {unit.challenge.brief}
            </p>
          </div>
        </div>

        {/* Objectives checklist */}
        {objectiveStatuses.length > 0 && (
          <div className="px-4 pt-3 pb-0">
            <div
              className="rounded-lg p-3"
              style={{
                backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  Progress
                </span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                  {doneCount}/{objectiveStatuses.length}
                </span>
              </div>
              <div className="w-full h-1 rounded-full mb-2 overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(doneCount / Math.max(objectiveStatuses.length, 1)) * 100}%`,
                    background: 'linear-gradient(90deg, var(--warning), #ff8c00)',
                  }}
                />
              </div>
              <div className="space-y-1">
                {objectiveStatuses.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-1.5 rounded transition-all duration-300"
                    style={{
                      backgroundColor: obj.done ? (isDark ? 'rgba(255,176,0,0.05)' : 'rgba(154,103,0,0.05)') : 'transparent',
                    }}
                  >
                    <div
                      className="mt-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[7px] font-bold transition-all duration-300 shrink-0"
                      style={{
                        backgroundColor: obj.done ? 'var(--warning)' : 'transparent',
                        borderColor: obj.done ? 'var(--warning)' : 'var(--border-primary)',
                        color: obj.done ? 'var(--bg-primary)' : 'transparent',
                      }}
                    >
                      {obj.done ? '✓' : ''}
                    </div>
                    <span
                      className="text-[11px] leading-relaxed transition-all duration-300"
                      style={{
                        color: obj.done ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                        textDecoration: obj.done ? 'line-through' : 'none',
                      }}
                    >
                      {obj.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ready message when all objectives met */}
        {allMet && (
          <div className="px-4 pt-2 pb-0">
            <div
              className="text-[10px] font-mono flex items-center gap-1.5 rounded-lg p-2 animate-fade-in"
              style={{
                backgroundColor: isDark ? 'rgba(255,176,0,0.08)' : 'rgba(154,103,0,0.08)',
                border: '1px solid var(--warning)',
                color: 'var(--warning)',
              }}
            >
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              All objectives complete! Submit the flag above.
            </div>
          </div>
        )}

        {/* Hint toggle */}
        <div className="px-4 pt-3 pb-0 space-y-2">
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className="rounded-lg p-3"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,176,0,0.05)' : 'rgba(154,103,0,0.05)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <svg className="w-3 h-3" style={{ color: 'var(--warning)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--warning)' }}>
                      Hint
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--warning)', opacity: 0.85 }}>
                    {unit.challenge.hint}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowHint(!showHint)}
            className="text-[10px] font-mono flex items-center gap-1.5 transition-all duration-200 group"
            style={{ color: 'var(--warning)', opacity: 0.6 }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}
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
        <div className="px-4 pb-4 pt-3">
          <FlagInput unitId={unit.id} />
        </div>
      </motion.div>
    </Card>
  )
}
