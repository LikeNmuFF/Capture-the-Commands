import { useState, useEffect } from 'react'
import { searchUsers, LeaderboardEntry } from '../../firebase/firestore'
import { useTheme } from '../../contexts/ThemeContext'

interface Props {
  currentUid: string
  following: string[]
  onFollow: (uid: string) => void
  onUnfollow: (uid: string) => void
}

export default function FriendSearch({ currentUid, following, onFollow, onUnfollow }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const { isDark } = useTheme()

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      const res = await searchUsers(query)
      setResults(res.filter(r => r.uid !== currentUid))
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--text-tertiary)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded-xl pl-10 pr-4 py-3 text-sm font-mono outline-none transition-colors"
          style={{
            backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.03)',
            borderColor: 'var(--border-primary)',
            borderWidth: '1px',
            color: 'var(--text-primary)'
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--text-accent)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)' }}
        />
      </div>
      {query.length >= 2 && (
        <div className="mt-2 space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
          {loading ? (
            <p className="text-xs font-mono text-center py-4" style={{ color: 'var(--text-tertiary)' }}>Searching...</p>
          ) : results.length === 0 ? (
            <p className="text-xs font-mono text-center py-4" style={{ color: 'var(--text-tertiary)' }}>No users found</p>
          ) : (
            results.map(r => (
              <div
                key={r.uid}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <img
                  src={r.photoURL}
                  alt=""
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                />
                <span className="flex-1 text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{r.username}</span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{r.xp} XP</span>
                <button
                  onClick={() => following.includes(r.uid) ? onUnfollow(r.uid) : onFollow(r.uid)}
                  className="text-xs px-2 py-1 rounded font-mono transition-colors"
                  style={{
                    borderColor: 'var(--border-primary)',
                    borderWidth: '1px',
                    backgroundColor: following.includes(r.uid) ? 'transparent' : (isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)'),
                    color: following.includes(r.uid) ? 'var(--text-tertiary)' : 'var(--text-accent)'
                  }}
                >
                  {following.includes(r.uid) ? '✓' : '+ Follow'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
