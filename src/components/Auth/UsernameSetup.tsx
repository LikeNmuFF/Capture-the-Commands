import { useState, useEffect } from 'react'
import { checkUsernameAvailable, claimUsername, validateUsername } from '../../firebase/usernames'
import { createUserProfile } from '../../firebase/firestore'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-light rounded-2xl border border-glass-border p-8 shadow-2xl max-w-sm w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🎮</div>
          <h2 className="text-lg font-semibold text-white">Choose Your Username</h2>
          <p className="text-sm text-white/40 mt-1">This will be your leaderboard name</p>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')); setIsAvailable(null); setError('') }}
              placeholder="username"
              maxLength={15}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-crt-green/40 transition-colors placeholder:text-white/15"
              autoFocus
            />
            {username && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checking ? (
                  <span className="text-white/30 text-xs animate-pulse">...</span>
                ) : isAvailable === true ? (
                  <span className="text-crt-green text-sm">✓</span>
                ) : isAvailable === false ? (
                  <span className="text-red-400 text-sm">✗</span>
                ) : null}
              </div>
            )}
          </div>

          {validationError && (
            <p className="text-xs text-red-400/80 font-mono">{validationError}</p>
          )}
          {isAvailable === false && (
            <p className="text-xs text-red-400/80 font-mono">Username is taken</p>
          )}
          {isAvailable === true && (
            <p className="text-xs text-crt-green/80 font-mono">Username available!</p>
          )}
          {error && (
            <p className="text-xs text-red-400/80 font-mono">{error}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!username || !isAvailable || !!validationError || claiming}
          className="w-full mt-5 py-3 rounded-xl bg-crt-green/15 border border-crt-green/25 text-crt-green font-mono text-sm hover:bg-crt-green/25 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {claiming ? 'Setting up...' : 'Start Bootcamp →'}
        </button>
      </div>
    </div>
  )
}
