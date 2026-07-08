import { LeaderboardEntry } from '../../firebase/firestore'
import { getLevel } from '../../utils/levels'

interface Props {
  entry: LeaderboardEntry
  rank: number
  isMe: boolean
  isFollowing: boolean
  currentUid: string | null
  onFollow: (uid: string) => void
  onUnfollow: (uid: string) => void
}

export default function LeaderboardRow({ entry, rank, isMe, isFollowing, currentUid, onFollow, onUnfollow }: Props) {
  const level = getLevel(entry.xp)
  const rankColors = ['', 'text-yellow-400', 'text-gray-300', 'text-amber-600']

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
      isMe ? 'bg-crt-green/8 border border-crt-green/15' : 'hover:bg-white/5'
    }`}>
      <span className={`w-8 text-center text-sm font-bold font-mono ${
        rank <= 3 ? rankColors[rank] as string : 'text-white/30'
      }`}>
        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
      </span>

      <img
        src={entry.photoURL}
        alt=""
        className="w-8 h-8 rounded-full bg-white/10"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white truncate">
            {entry.username}
          </span>
          {isMe && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-crt-green/15 text-crt-green font-mono">
              you
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30 font-mono">
          <span>Lv.{level.level}</span>
          <span>•</span>
          <span>{level.rank}</span>
          <span>•</span>
          <span>{entry.xp} XP</span>
        </div>
      </div>

      {!isMe && currentUid && (
        <button
          onClick={() => isFollowing ? onUnfollow(entry.uid) : onFollow(entry.uid)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 font-mono ${
            isFollowing
              ? 'border-white/10 text-white/40 hover:border-red-400/30 hover:text-red-400/70'
              : 'border-crt-green/30 text-crt-green/70 hover:bg-crt-green/10 hover:border-crt-green/50'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  )
}
