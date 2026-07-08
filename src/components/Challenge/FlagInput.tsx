import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useTheme } from '../../contexts/ThemeContext'

interface Props {
  unitId: string
}

export default function FlagInput({ unitId }: Props) {
  const [flag, setFlag] = useState('')
  const [error, setError] = useState('')
  const submitFlag = useGameStore(s => s.submitFlag)
  const phase = useGameStore(s => s.phase)
  const { isDark } = useTheme()

  if (phase !== 'challenge') return null

  const handleSubmit = () => {
    if (!flag.trim()) {
      setError('Enter a flag first')
      return
    }
    setError('')
    const valid = submitFlag(flag.trim())
    if (!valid) {
      setError('Incorrect flag. Try again!')
    }
  }

  return (
    <div>
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={flag}
            onChange={e => setFlag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="flag{...}"
            className="w-full rounded-lg px-3 py-2 text-xs font-mono outline-none transition-all duration-200"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.03)',
              borderColor: 'var(--border-primary)',
              borderWidth: '1px',
              color: 'var(--text-primary)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--warning)'
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.05)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-primary)'
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.03)'
            }}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg font-mono text-xs transition-all duration-200 active:scale-[0.98]"
          style={{
            backgroundColor: isDark ? 'rgba(255,176,0,0.15)' : 'rgba(154,103,0,0.15)',
            borderColor: 'var(--warning)',
            borderWidth: '1px',
            color: 'var(--warning)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,176,0,0.25)' : 'rgba(154,103,0,0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,176,0,0.15)' : 'rgba(154,103,0,0.15)'
          }}
        >
          Submit
        </button>
      </div>
      {error && (
        <p className="text-[10px] mt-1.5 font-mono flex items-center gap-1 animate-fade-in" style={{ color: 'var(--error)' }}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
