import { useState, useEffect } from 'react'
import {
  subscribeLeaderboard,
  getFollowing,
  addFollow,
  removeFollow,
  LeaderboardEntry,
} from '../../firebase/firestore'
import LeaderboardRow from './LeaderboardRow'
import FriendSearch from './FriendSearch'

interface Props {
  currentUid: string | null
}

export default function LeaderboardPage({ currentUid }: Props) {
  const [tab, setTab] = useState<'global' | 'friends'>('global')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [following, setFollowing] = useState<string[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const unsub = subscribeLeaderboard(100, data => {
      setEntries(data)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!currentUid) { setFollowing([]); return }
    getFollowing(currentUid).then(setFollowing)
  }, [currentUid, refreshKey])

  const handleFollow = async (uid: string) => {
    if (!currentUid) return
    await addFollow(currentUid, uid)
    setRefreshKey(k => k + 1)
  }

  const handleUnfollow = async (uid: string) => {
    if (!currentUid) return
    await removeFollow(currentUid, uid)
    setRefreshKey(k => k + 1)
  }

  const myEntry = entries.find(e => e.uid === currentUid)
  const friendsEntries = entries.filter(e => following.includes(e.uid) || e.uid === currentUid)

  const displayEntries = tab === 'global' ? entries : friendsEntries

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-1">Leaderboard</h2>
        <p className="text-xs text-white/30">Top learners ranked by XP</p>
      </div>

      {currentUid && (
        <div className="mb-4">
          <FriendSearch
            currentUid={currentUid}
            following={following}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
          />
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('global')}
          className={`text-xs px-4 py-2 rounded-lg border transition-colors font-mono ${
            tab === 'global'
              ? 'bg-crt-green/15 border-crt-green/30 text-crt-green'
              : 'border-white/10 text-white/40 hover:text-white/60'
          }`}
        >
          Global
        </button>
        {currentUid && (
          <button
            onClick={() => setTab('friends')}
            className={`text-xs px-4 py-2 rounded-lg border transition-colors font-mono ${
              tab === 'friends'
                ? 'bg-crt-green/15 border-crt-green/30 text-crt-green'
                : 'border-white/10 text-white/40 hover:text-white/60'
            }`}
          >
            Friends
          </button>
        )}
      </div>

      <div className="space-y-1">
        {displayEntries.length === 0 ? (
          <p className="text-xs text-white/20 font-mono text-center py-8">
            {tab === 'friends' ? 'Follow some users to see them here' : 'No entries yet'}
          </p>
        ) : (
          displayEntries.map((entry, i) => (
            <LeaderboardRow
              key={entry.uid}
              entry={entry}
              rank={tab === 'global' ? i + 1 : entries.findIndex(e => e.uid === entry.uid) + 1}
              isMe={entry.uid === currentUid}
              isFollowing={following.includes(entry.uid)}
              currentUid={currentUid}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
            />
          ))
        )}
      </div>

      {currentUid && myEntry && (
        <div className="mt-6 pt-4 border-t border-white/5">
          <p className="text-xs text-white/20 font-mono text-center">
            Your rank: #{entries.findIndex(e => e.uid === currentUid) + 1} of {entries.length}
          </p>
        </div>
      )}

      {!currentUid && (
        <p className="text-xs text-white/20 font-mono text-center mt-6">
          Sign in to follow friends and track your rank
        </p>
      )}
    </div>
  )
}
