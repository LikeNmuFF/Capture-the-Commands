import { useState, useEffect } from 'react'
import { searchUsers, LeaderboardEntry } from '../../firebase/firestore'

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
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-crt-green/40 transition-colors placeholder:text-white/15"
      />
      {query.length >= 2 && (
        <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
          {loading ? (
            <p className="text-xs text-white/30 font-mono text-center py-4">Searching...</p>
          ) : results.length === 0 ? (
            <p className="text-xs text-white/20 font-mono text-center py-4">No users found</p>
          ) : (
            results.map(r => (
              <div key={r.uid} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5">
                <img src={r.photoURL} alt="" className="w-6 h-6 rounded-full bg-white/10" />
                <span className="flex-1 text-sm text-white/70 font-mono">{r.username}</span>
                <span className="text-xs text-white/30 font-mono">{r.xp} XP</span>
                <button
                  onClick={() => following.includes(r.uid) ? onUnfollow(r.uid) : onFollow(r.uid)}
                  className={`text-xs px-2 py-1 rounded border transition-colors font-mono ${
                    following.includes(r.uid)
                      ? 'border-white/10 text-white/40'
                      : 'border-crt-green/30 text-crt-green/70'
                  }`}
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
