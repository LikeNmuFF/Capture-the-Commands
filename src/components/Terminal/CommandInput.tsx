import { useEffect, useState, useCallback } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const KNOWN_COMMANDS = [
  'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'echo',
  'rm', 'cp', 'mv', 'grep', 'find', 'head', 'tail',
  'chmod', 'whoami', 'clear', 'help',
]

interface Props {
  value: string
  onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  disabled?: boolean
  suggestion?: string
  onSuggestionClick?: () => void
}

export default function CommandInput({
  value,
  onChange,
  onKeyDown,
  inputRef,
  disabled,
  suggestion,
  onSuggestionClick,
}: Props) {
  const { isDark } = useTheme()
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [disabled, inputRef])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && !disabled) {
        e.preventDefault()
        const trimmed = value.trim().toLowerCase()
        if (!trimmed) return

        const match = KNOWN_COMMANDS.find(cmd => cmd.startsWith(trimmed) && cmd !== trimmed)
        if (match) {
          onChange(match + ' ')
          setShowAutocomplete(true)
          setTimeout(() => setShowAutocomplete(false), 1200)
          return
        }
      }

      onKeyDown(e)
    },
    [value, onChange, onKeyDown, disabled]
  )

  return (
    <div className="flex items-center gap-0 font-mono terminal-text">
      <span className="shrink-0 animate-pulse-glow" style={{ color: 'var(--text-accent)' }}>
        user@bash-bootcamp
      </span>
      <span className="shrink-0" style={{ color: 'var(--text-tertiary)' }}>:~$ </span>
      <div className="relative flex-1 min-w-0">
        <input
          ref={inputRef}
          type="text"
          value={disabled ? '(locked)' : value}
          onChange={e => !disabled && onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="relative z-10 w-full bg-transparent outline-none border-none font-mono terminal-text min-w-0"
          style={{
            color: 'var(--text-accent)',
            caretColor: 'var(--text-accent)',
          }}
          spellCheck={false}
          autoComplete="off"
          autoFocus
        />
        {!value && !disabled && (
          <span
            className="absolute inset-0 z-0 flex items-center pointer-events-none text-xs animate-pulse select-none"
            style={{ color: isDark ? 'rgba(57,255,20,0.25)' : 'rgba(0,119,34,0.25)' }}
          >
            type `help` for commands
          </span>
        )}
        {showAutocomplete && (
          <span
            className="absolute inset-0 z-0 flex items-center pointer-events-none text-xs select-none"
            style={{ color: 'var(--info)', opacity: 0.6 }}
          >
            Tab completed
          </span>
        )}
      </div>
      {suggestion && !disabled && (
        <button
          onClick={onSuggestionClick}
          className="ml-2 shrink-0 text-[10px] px-2 py-0.5 rounded font-mono transition-all duration-200 animate-fade-in"
          style={{
            backgroundColor: isDark ? 'rgba(57,255,20,0.1)' : 'rgba(0,119,34,0.1)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-accent)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = isDark
              ? 'rgba(57,255,20,0.2)'
              : 'rgba(0,119,34,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = isDark
              ? 'rgba(57,255,20,0.1)'
              : 'rgba(0,119,34,0.1)'
          }}
        >
          Try: {suggestion}
        </button>
      )}
    </div>
  )
}
