import { useState, useEffect } from 'react'
import { checkUsernameAvailable, claimUsername, validateUsername } from '../../firebase/usernames'
import { createUserProfile } from '../../firebase/firestore'
import { useTheme } from '../../contexts/ThemeContext'

interface Props {
  uid: string
  displayName: string
  photoURL: string
  email: string
  onComplete: () => void
}

export default function UsernameSetup({ uid, displayName, photoURL, email, onComplete }: Props) {
  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const { isDark } = useTheme()

  const validationError = username ? validateUsername(username) : null

  useEffect(() => {
    if (!username || validationError) {
      setIsAvailable(null)
      return
    }
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(async () => {
      setChecking(true)
      const avail = await checkUsernameAvailable(username)
      setIsAvailable(avail)
      setChecking(false)
    }, 400)
    setDebounceTimer(timer)
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [username]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    const err = validateUsername(username)
    if (err) { setError(err); return }
    if (!isAvailable) { setError('Username is taken'); return }

    setClaiming(true)
    setError('')
    try {
      const claimed = await claimUsername(username, uid)
      if (!claimed) {
        setError('Someone just took that username!')
        setClaiming(false)
        return
      }
      await createUserProfile(uid, username, displayName, photoURL, email)
      onComplete()
    } catch (err) {
      setError('Failed to save. Try again.')
      setClaiming(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in"
      style={{ backgroundColor: 'var(--overlay)' }}
    >
      <div
        className="rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 animate-scale-in"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)'
        }}
      >
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)' }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--text-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Choose Your Username</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>This will be your leaderboard name</p>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')); setIsAvailable(null); setError('') }}
              placeholder="username"
              maxLength={15}
              className="w-full rounded-xl px-4 py-3 text-sm font-mono outline-none transition-colors"
              style={{
                backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.03)',
                borderColor: 'var(--border-primary)',
                borderWidth: '1px',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--text-accent)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)' }}
              autoFocus
            />
            {username && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checking ? (
                  <span className="text-xs animate-pulse" style={{ color: 'var(--text-tertiary)' }}>...</span>
                ) : isAvailable === true ? (
                  <svg className="w-4 h-4" style={{ color: 'var(--text-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : isAvailable === false ? (
                  <svg className="w-4 h-4" style={{ color: 'var(--error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : null}
              </div>
            )}
          </div>

          {validationError && (
            <p className="text-xs font-mono" style={{ color: 'var(--error)' }}>{validationError}</p>
          )}
          {isAvailable === false && (
            <p className="text-xs font-mono" style={{ color: 'var(--error)' }}>Username is taken</p>
          )}
          {isAvailable === true && (
            <p className="text-xs font-mono" style={{ color: 'var(--text-accent)' }}>Username available!</p>
          )}
          {error && (
            <p className="text-xs font-mono" style={{ color: 'var(--error)' }}>{error}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!username || !isAvailable || !!validationError || claiming}
          className="w-full mt-5 py-3 rounded-xl font-mono text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: isDark ? 'rgba(0,255,65,0.15)' : 'rgba(0,119,34,0.15)',
            borderColor: 'var(--text-accent)',
            borderWidth: '1px',
            color: 'var(--text-accent)'
          }}
        >
          {claiming ? 'Setting up...' : 'Start Bootcamp →'}
        </button>
      </div>
    </div>
  )
}
