import { useEffect } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  disabled?: boolean
}

export default function CommandInput({ value, onChange, onKeyDown, inputRef, disabled }: Props) {
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [disabled, inputRef])

  return (
    <div className="flex items-center gap-0 font-mono terminal-text">
      <span className="text-crt-green shrink-0 animate-pulse-glow">
        user@bash-bootcamp:~$
      </span>
      <span className="text-white/30 mx-1">$</span>
      <input
        ref={inputRef}
        type="text"
        value={disabled ? '(locked)' : value}
        onChange={e => !disabled && onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className="flex-1 bg-transparent text-crt-green outline-none border-none caret-crt-green font-mono terminal-text min-w-0"
        spellCheck={false}
        autoComplete="off"
        autoFocus
      />
    </div>
  )
}
