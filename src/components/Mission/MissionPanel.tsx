import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMission } from '../../hooks/useMission'
import { useGameStore } from '../../store/gameStore'
import { useTheme } from '../../contexts/ThemeContext'
import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'
import { fadeUp } from '../../lib/motion'

const CMD_DESCRIPTIONS: Record<string, string> = {
  pwd: 'print working directory',
  ls: 'list files',
  cd: 'change directory',
  mkdir: 'make directory',
  touch: 'create empty file',
  cat: 'read file',
  echo: 'print text',
  rm: 'remove file/dir',
  cp: 'copy files',
  mv: 'move/rename files',
  grep: 'search text',
  find: 'find files',
  head: 'show first lines',
  tail: 'show last lines',
  chmod: 'change permissions',
  whoami: 'show current user',
  clear: 'clear terminal',
  help: 'show help',
}

function fillInput(cmd: string) {
  const event = new CustomEvent('fill-command', { detail: cmd })
  window.dispatchEvent(event)
}

function renderInstruction(text: string, onClick: (cmd: string) => void) {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const cmd = part.slice(1, -1)
      return (
        <code
          key={i}
          onClick={() => onClick(cmd)}
          className="cursor-pointer transition-all duration-200 rounded px-1.5 py-0.5"
          style={{
            backgroundColor: 'var(--text-accent)',
            color: '#04140a',
            fontSize: 'inherit',
            fontWeight: 600,
          }}
          title={`Click to type "${cmd}"`}
        >
          {cmd}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

type Tab = 'briefing' | 'hints' | 'reference'

export default function MissionPanel() {
  const { objectives, allComplete, hasObjectives } = useMission()
  const phase = useGameStore(s => s.phase)
  const getCurrentStepDescription = useGameStore(s => s.getCurrentStepDescription)
  const getCurrentStepHint = useGameStore(s => s.getCurrentStepHint)
  const getCurrentUnit = useGameStore(s => s.getCurrentUnit)
  const currentStepIndex = useGameStore(s => s.currentStepIndex)
  const currentTierId = useGameStore(s => s.currentTierId)
  const currentUnitIndex = useGameStore(s => s.currentUnitIndex)
  const xp = useGameStore(s => s.xp)
  const { isDark } = useTheme()

  const [activeTab, setActiveTab] = useState<Tab>('briefing')

  const unit = getCurrentUnit()
  const totalSteps = unit?.missionSteps.length || 0
  const hint = getCurrentStepHint()

  if (phase === 'completed') {
    return (
      <Card className="p-5" hover={false}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="flex flex-col items-center text-center gap-3 py-2"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: isDark ? 'rgba(0,255,65,0.15)' : 'rgba(10,156,46,0.15)',
              border: '2px solid var(--text-accent)',
              boxShadow: isDark ? '0 0 20px rgba(0,255,65,0.2)' : '0 0 12px rgba(10,156,46,0.15)',
            }}
          >
            <svg className="w-7 h-7" style={{ color: 'var(--text-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Unit Complete!</h2>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-accent)' }}>+100 XP earned</p>
          </div>
          <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: 'var(--text-tertiary)' }}>
            Click "Continue to Next Unit" to proceed.
          </p>
        </motion.div>
      </Card>
    )
  }

  const doneCount = objectives.filter(o => o.done).length

  const tabs: { key: Tab; label: string }[] = [
    { key: 'briefing', label: 'Briefing' },
    { key: 'hints', label: 'Hints' },
    { key: 'reference', label: 'Reference' },
  ]

  const phaseRef = phase as string

  return (
    <Card hover={false}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-tertiary)' }}>
            Tier {currentTierId} · Unit {currentUnitIndex + 1}
          </span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-accent)' }}>
            {xp} XP
          </span>
        </div>
        <h2 className="text-sm font-bold truncate tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {unit?.title || 'Loading...'}
        </h2>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-3 pt-3 pb-0">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex-1 text-[10px] px-2 py-1.5 rounded-lg font-mono transition-all duration-200"
            style={{
              backgroundColor: activeTab === t.key
                ? (isDark ? 'rgba(57,255,20,0.12)' : 'rgba(10,156,46,0.12)')
                : 'transparent',
              color: activeTab === t.key ? 'var(--text-accent)' : 'var(--text-tertiary)',
              boxShadow: activeTab === t.key
                ? (isDark ? '0 0 10px rgba(57,255,20,0.12), inset 0 0 8px rgba(57,255,20,0.04)' : '0 0 6px rgba(10,156,46,0.08)')
                : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-4 py-3 min-h-[160px]">
        <AnimatePresence mode="wait">
          {activeTab === 'briefing' && phase === 'mission' && (
            <motion.div
              key="briefing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Step progress */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                    Step {currentStepIndex + 1} of {totalSteps}
                  </span>
                </div>
                <ProgressBar value={currentStepIndex} max={totalSteps} height={4} />
              </div>

              {/* Step card */}
              <div
                className="rounded-lg p-3"
                style={{
                  backgroundColor: isDark ? 'rgba(0,255,65,0.04)' : 'rgba(10,156,46,0.04)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div className="text-[10px] uppercase tracking-wider mb-1.5 font-mono font-bold" style={{ color: 'var(--text-accent)' }}>
                  Step {currentStepIndex + 1}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {renderInstruction(getCurrentStepDescription(), fillInput)}
                </p>
              </div>

              {/* Objectives */}
              <div>
                <div className="text-[10px] uppercase tracking-wider mb-2 font-mono flex items-center justify-between" style={{ color: 'var(--text-tertiary)' }}>
                  <span>Objectives</span>
                  {hasObjectives && (
                    <span style={{ opacity: 0.6 }}>
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
                          backgroundColor: obj.done ? (isDark ? 'rgba(0,255,65,0.05)' : 'rgba(10,156,46,0.05)') : 'transparent',
                          border: obj.done ? '1px solid var(--border-primary)' : '1px solid transparent',
                        }}
                      >
                        <div
                          className="mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-[9px] font-bold transition-all duration-300 shrink-0"
                          style={{
                            backgroundColor: obj.done ? 'var(--text-accent)' : 'transparent',
                            borderColor: obj.done ? 'var(--text-accent)' : 'var(--border-primary)',
                            color: obj.done ? '#04140a' : 'transparent',
                          }}
                        >
                          {obj.done ? '✓' : ''}
                        </div>
                        <span
                          className="text-xs leading-relaxed transition-all duration-300"
                          style={{
                            color: obj.done ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                            textDecoration: obj.done ? 'line-through' : 'none',
                          }}
                        >
                          {obj.description}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>
                      Complete the mission step above
                    </p>
                  )}
                </div>
              </div>

              {allComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-mono flex items-center gap-2 rounded-lg p-2.5"
                  style={{
                    backgroundColor: isDark ? 'rgba(0,255,65,0.06)' : 'rgba(10,156,46,0.06)',
                    border: '1px solid var(--text-accent)',
                    color: 'var(--text-accent)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--text-accent)' }} />
                  All objectives met! Advancing...
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'briefing' && phaseRef === 'quiz' && (
            <motion.div
              key="briefing-quiz"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center text-center gap-3 py-4"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: isDark ? 'rgba(88,166,255,0.1)' : 'rgba(9,105,218,0.1)',
                  border: '1px solid var(--info)',
                }}
              >
                <svg className="w-6 h-6" style={{ color: 'var(--info)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-mono font-semibold" style={{ color: 'var(--info)' }}>Quiz Time</p>
              <p className="text-[11px] leading-relaxed max-w-[180px]" style={{ color: 'var(--text-tertiary)' }}>
                Answer the quiz to continue
              </p>
            </motion.div>
          )}

          {activeTab === 'briefing' && phaseRef === 'challenge' && (
            <motion.div
              key="briefing-challenge"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center text-center gap-3 py-4"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: isDark ? 'rgba(255,176,0,0.1)' : 'rgba(154,103,0,0.1)',
                  border: '1px solid var(--warning)',
                }}
              >
                <svg className="w-6 h-6" style={{ color: 'var(--warning)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <p className="text-xs font-mono font-semibold" style={{ color: 'var(--warning)' }}>Challenge Active</p>
              <p className="text-[11px] leading-relaxed max-w-[180px]" style={{ color: 'var(--text-tertiary)' }}>
                Find the flag using your terminal
              </p>
            </motion.div>
          )}

          {activeTab === 'briefing' && phaseRef === 'completed' && (
            <motion.div
              key="briefing-completed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center text-center gap-3 py-4"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: isDark ? 'rgba(0,255,65,0.1)' : 'rgba(10,156,46,0.1)',
                  border: '1px solid var(--text-accent)',
                }}
              >
                <svg className="w-6 h-6" style={{ color: 'var(--text-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xs font-mono font-semibold" style={{ color: 'var(--text-accent)' }}>Unit Complete!</p>
            </motion.div>
          )}

          {activeTab === 'hints' && (
            <motion.div
              key="hints"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {phase === 'mission' && hint ? (
                <div
                  className="rounded-lg p-3"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,176,0,0.05)' : 'rgba(154,103,0,0.05)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg className="w-3 h-3" style={{ color: 'var(--warning)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--warning)' }}>
                      Hint
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--warning)', opacity: 0.85 }}>
                    {hint}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <svg className="w-5 h-5 mb-2" style={{ color: 'var(--text-tertiary)', opacity: 0.4 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    No hints available for this step.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reference' && (
            <motion.div
              key="reference"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {unit && unit.commands.length > 0 ? (
                <div className="space-y-1.5">
                  {unit.commands.map(cmd => (
                    <div
                      key={cmd}
                      className="flex items-center gap-2.5 p-2 rounded-lg transition-all"
                      style={{
                        backgroundColor: isDark ? 'rgba(0,255,65,0.03)' : 'rgba(10,156,46,0.03)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <code
                        className="text-[11px] font-mono font-bold px-2 py-0.5 rounded shrink-0"
                        style={{
                          backgroundColor: 'var(--text-accent)',
                          color: '#04140a',
                        }}
                      >
                        {cmd}
                      </code>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                        {CMD_DESCRIPTIONS[cmd] || 'command'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    No commands to reference.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
