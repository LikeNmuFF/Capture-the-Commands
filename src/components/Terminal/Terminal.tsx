import { useMemo } from 'react'
import { useTerminal } from '../../hooks/useTerminal'
import { useGameStore } from '../../store/gameStore'
import { content } from '../../content'
import OutputLine from './OutputLine'
import CommandInput from './CommandInput'
import { useTheme } from '../../contexts/ThemeContext'

export default function Terminal() {
  const {
    input,
    setInput,
    inputRef,
    terminalEndRef,
    handleKeyDown,
    terminalHistory,
    fillCommand,
  } = useTerminal()

  const phase = useGameStore(s => s.phase)
  const currentUnitIndex = useGameStore(s => s.currentUnitIndex)
  const currentTierId = useGameStore(s => s.currentTierId)
  const currentStepIndex = useGameStore(s => s.currentStepIndex)
  const inputEnabled = phase === 'mission' || phase === 'challenge'
  const isInputLocked = phase === 'quiz' || phase === 'completed'
  const { isDark } = useTheme()

  const suggestion = useMemo(() => {
    if (phase !== 'mission' || input) return undefined
    const unit = content.tiers
      .find(t => t.id === currentTierId)
      ?.units[currentUnitIndex]
    if (!unit) return undefined
    const step = unit.missionSteps[currentStepIndex]
    if (!step) return undefined
    const match = step.instruction.match(/`(\w+\s*-?\w*)`/)
    return match ? match[1] : undefined
  }, [phase, currentTierId, currentUnitIndex, currentStepIndex, input])

  const handleSuggestionClick = () => {
    if (suggestion) {
      fillCommand(suggestion)
    }
  }

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden shadow-2xl crt-overlay"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)',
        boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
      }}
    >
      {/* macOS traffic light title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 select-none"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-apple-red shadow-sm" style={{ boxShadow: isDark ? '0 1px 2px rgba(255,95,87,0.2)' : 'none' }} />
          <div className="w-3 h-3 rounded-full bg-apple-yellow shadow-sm" style={{ boxShadow: isDark ? '0 1px 2px rgba254,188,46,0.2)' : 'none' }} />
          <div className="w-3 h-3 rounded-full bg-apple-green shadow-sm" style={{ boxShadow: isDark ? '0 1px 2px rgba(40,200,64,0.2)' : 'none' }} />
        </div>
        <span className="ml-3 text-[11px] font-mono tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
          bash-bootcamp — Terminal
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--success)' }} />
          <span className="text-[9px] font-mono hidden sm:inline" style={{ color: 'var(--text-tertiary)' }}>CONNECTED</span>
        </div>
      </div>

      {/* Terminal output */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-0.5 custom-scrollbar">
        {terminalHistory.length === 0 && (
          <div className="space-y-2 animate-fade-in">
            <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              Welcome to <span style={{ color: 'var(--text-accent)' }}>Capture the Command</span>!
            </div>
            <div className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
              Type commands below and press Enter to execute them.
            </div>
            <div className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
              Try <span className="text-info">help</span> to see available commands at any time.
            </div>
          </div>
        )}
        {terminalHistory.map((line, i) => (
          <OutputLine key={i} line={line} />
        ))}

        {inputEnabled && (
          <CommandInput
            value={input}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            inputRef={inputRef}
            suggestion={suggestion}
            onSuggestionClick={handleSuggestionClick}
          />
        )}

        {isInputLocked && (
          <div className="font-mono terminal-text" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--text-accent)', opacity: 0.7 }}>user@bash-bootcamp:~$ </span>
            <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
              {phase === 'quiz'
                ? '(Answer the quiz to continue)'
                : '(Continue to next unit)'}
            </span>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Bottom status bar */}
      <div
        className="flex items-center gap-3 px-4 py-1.5"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
          {phase === 'mission' ? 'MISSION' : phase === 'challenge' ? 'CHALLENGE' : phase.toUpperCase()}
        </span>
        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)', opacity: 0.3 }}>·</span>
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
          Type <span className="text-info">help</span> for commands
        </span>
        {suggestion && !input && (
          <>
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)', opacity: 0.3 }}>·</span>
            <span
              className="text-[10px] font-mono cursor-pointer transition-colors"
              style={{ color: 'var(--text-accent)' }}
              onClick={handleSuggestionClick}
            >
              Click or type <span className="underline">{suggestion}</span>
            </span>
          </>
        )}
      </div>
    </div>
  )
}
