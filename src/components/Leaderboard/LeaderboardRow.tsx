import { LeaderboardEntry } from '../../firebase/firestore'
import { getLevel, getRank } from '../../utils/levels'
import { useTheme } from '../../contexts/ThemeContext'

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
  const levelNum = getLevel(entry.xp)
  const rankInfo = getRank(levelNum)
  const { isDark } = useTheme()

  const getRankColor = () => {
    if (rank === 1) return '#fbbf24'
    if (rank === 2) return '#d1d5db'
    if (rank === 3) return '#d97706'
    return 'var(--text-tertiary)'
  }

  const getRankIcon = () => {
    if (rank <= 3) {
      return (
        <svg className="w-5 h-5" style={{ color: getRankColor() }} fill="currentColor" viewBox="0 0 24 24">
          {rank === 1 && <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />}
          {rank === 2 && <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />}
          {rank === 3 && <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />}
        </svg>
      )
    }
    return <span className="text-xs font-bold font-mono" style={{ color: 'var(--text-tertiary)' }}>#{rank}</span>
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
      style={{
        backgroundColor: isMe ? (isDark ? 'rgba(0,255,65,0.08)' : 'rgba(0,119,34,0.08)') : 'transparent',
        border: isMe ? '1px solid var(--border-primary)' : '1px solid transparent'
      }}
      onMouseEnter={(e) => {
        if (!isMe) e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
      }}
      onMouseLeave={(e) => {
        if (!isMe) e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <span className="w-8 flex items-center justify-center">
        {getRankIcon()}
      </span>

      <img
        src={entry.photoURL}
        alt=""
        className="w-8 h-8 rounded-full"
        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {entry.username}
          </span>
          {isMe && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
              style={{
                backgroundColor: isDark ? 'rgba(0,255,65,0.15)' : 'rgba(0,119,34,0.15)',
                color: 'var(--text-accent)'
              }}
            >
              you
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
          <span>Lv.{levelNum}</span>
          <span>•</span>
          <span>{rankInfo.title}</span>
          <span>•</span>
          <span>{entry.xp} XP</span>
        </div>
      </div>

      {!isMe && currentUid && (
        <button
          onClick={() => isFollowing ? onUnfollow(entry.uid) : onFollow(entry.uid)}
          className="text-xs px-3 py-1.5 rounded-lg font-mono transition-all duration-200"
          style={{
            borderColor: isFollowing ? 'var(--border-primary)' : 'var(--text-accent)',
            borderWidth: '1px',
            backgroundColor: isFollowing ? 'transparent' : (isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)'),
            color: isFollowing ? 'var(--text-tertiary)' : 'var(--text-accent)'
          }}
          onMouseEnter={(e) => {
            if (isFollowing) {
              e.currentTarget.style.borderColor = 'var(--error)'
              e.currentTarget.style.color = 'var(--error)'
            } else {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(0,255,65,0.15)' : 'rgba(0,119,34,0.15)'
            }
          }}
          onMouseLeave={(e) => {
            if (isFollowing) {
              e.currentTarget.style.borderColor = 'var(--border-primary)'
              e.currentTarget.style.color = 'var(--text-tertiary)'
            } else {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)'
            }
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  )
}
