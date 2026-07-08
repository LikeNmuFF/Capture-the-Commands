import { ReactNode, useState, useEffect } from 'react'
import MissionPanel from '../Mission/MissionPanel'
import ChallengePanel from '../Challenge/ChallengePanel'
import VisualUnitMap from '../Progress/VisualUnitMap'
import XPToast from '../common/XPToast'
import BeltCeremony from '../Progress/BeltCeremony'
import LeaderboardPage from '../Leaderboard/LeaderboardPage'
import ThemeToggle from '../common/ThemeToggle'
import MobileNav from './MobileNav'
import FirstRunTutorial from '../Onboarding/FirstRunTutorial'
import { useGameStore } from '../../store/gameStore'
import { logout } from '../../firebase/auth'
import { getLevel, getRank } from '../../utils/levels'
import { useTheme } from '../../contexts/ThemeContext'

interface Props {
  terminal: ReactNode
  quizPanel: ReactNode
}

export default function AppShell({ terminal, quizPanel }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarTab, setSidebarTab] = useState<'mission' | 'leaderboard'>('mission')
  const [mobileTab, setMobileTab] = useState('terminal')
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem('bash-bootcamp-tutorial-seen'))
  const phase = useGameStore(s => s.phase)
  const xp = useGameStore(s => s.xp)
  const userId = useGameStore(s => s.userId)
  const { isDark } = useTheme()

  const level = getLevel(xp)
  const rank = getRank(level)

  useEffect(() => {
    setMobileTab('terminal')
  }, [phase])

  const sidebarContent = sidebarTab === 'leaderboard'
    ? <LeaderboardPage currentUid={userId} />
    : phase === 'challenge' ? <ChallengePanel /> : <MissionPanel />

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {showTutorial && <FirstRunTutorial onDismiss={() => setShowTutorial(false)} />}
      <XPToast />
      <BeltCeremony />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-sm lg:hidden animate-fade-in"
          style={{ backgroundColor: 'var(--overlay)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[280px] flex flex-col shadow-2xl lg:shadow-none transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)'
        }}
      >
        {/* Mobile sidebar header */}
        <div className="flex items-center justify-between p-4 lg:hidden" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <span className="text-sm font-mono" style={{ color: 'var(--text-accent)' }}>bash-bootcamp</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar tabs */}
        <div className="flex gap-1 px-3 pt-3 pb-1" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setSidebarTab('mission')}
            className="text-[11px] px-3 py-1.5 rounded-lg font-mono transition-all duration-200"
            style={{
              backgroundColor: sidebarTab === 'mission' ? (document.documentElement.classList.contains('dark') ? 'rgba(0,255,65,0.15)' : 'rgba(0,119,34,0.15)') : 'transparent',
              color: sidebarTab === 'mission' ? 'var(--text-accent)' : 'var(--text-tertiary)'
            }}
          >
            {phase === 'challenge' ? 'Challenge' : 'Mission'}
          </button>
          <button
            onClick={() => setSidebarTab('leaderboard')}
            className="text-[11px] px-3 py-1.5 rounded-lg font-mono transition-all duration-200"
            style={{
              backgroundColor: sidebarTab === 'leaderboard' ? (document.documentElement.classList.contains('dark') ? 'rgba(0,255,65,0.15)' : 'rgba(0,119,34,0.15)') : 'transparent',
              color: sidebarTab === 'leaderboard' ? 'var(--text-accent)' : 'var(--text-tertiary)'
            }}
          >
            Leaderboard
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {sidebarContent}
          {sidebarTab !== 'leaderboard' && (
            <div className="hidden lg:block">
              <VisualUnitMap />
            </div>
          )}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-0 lg:pl-[280px]">
        {/* Top bar */}
        <div
          className="flex items-center gap-3 px-4 sm:px-6 py-2.5 backdrop-blur-xl shrink-0"
          style={{
            backgroundColor: 'var(--bg-glass)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* App name and rank */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="hidden sm:inline text-sm font-mono tracking-tight" style={{ color: 'var(--text-accent)' }}>bash-bootcamp</span>
            <span className="hidden sm:inline text-[10px]" style={{ color: 'var(--text-tertiary)', opacity: 0.3 }}>|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs">{rank.icon}</span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                Lv.{level}
              </span>
              <span className="hidden sm:inline text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                {rank.title}
              </span>
            </div>
          </div>

          {/* Desktop XP bar */}
          <div className="hidden sm:flex items-center gap-2.5 ml-auto">
            <div className="w-28 lg:w-36 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${((xp % 100) / 100) * 100}%`,
                  background: 'linear-gradient(90deg, var(--text-accent), #00e050, #a855f7)'
                }}
              />
            </div>
            <span className="text-[10px] font-mono tabular-nums" style={{ color: 'var(--text-tertiary)' }}>{xp} XP</span>
          </div>

          {/* Units badge */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>Units</span>
            <span className="text-[10px] font-mono tabular-nums" style={{ color: 'var(--text-secondary)' }}>
              {useGameStore.getState().completedUnits.length}/{useGameStore.getState().unlockedUnits.length}
            </span>
          </div>

          {/* Theme toggle */}
          <div className="ml-2">
            <ThemeToggle />
          </div>

          {/* Sign out */}
          {userId && (
            <button
              onClick={() => logout()}
              className="ml-2 text-[10px] font-mono transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--error)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
              title="Sign out"
            >
              sign-out
            </button>
          )}
        </div>

        {/* Mobile tab content */}
        <div className="flex-1 min-h-0 lg:hidden">
          {mobileTab === 'terminal' && (
            <div className="h-full p-2 pt-1">{terminal}</div>
          )}
          {mobileTab === 'map' && (
            <div className="h-full overflow-y-auto p-4 custom-scrollbar">
              {sidebarContent}
              <div className="mt-4"><VisualUnitMap /></div>
            </div>
          )}
          {mobileTab === 'progress' && (
            <div className="h-full overflow-y-auto p-4 custom-scrollbar">
              <div
                className="backdrop-blur-xl rounded-xl p-5 mb-4 shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-glass)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{rank.icon}</div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{rank.title}</h2>
                    <p className="text-lg font-mono font-bold" style={{ color: 'var(--text-accent)' }}>Level {level}</p>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${((xp % 100) / 100) * 100}%`,
                      background: 'linear-gradient(90deg, var(--text-accent), #00e050, #a855f7)'
                    }}
                  />
                </div>
                <p className="text-[10px] font-mono mt-1.5" style={{ color: 'var(--text-tertiary)' }}>{xp} total XP · {xp % 100}/100 to next level</p>
              </div>
              <VisualUnitMap />
            </div>
          )}
          {mobileTab === 'leaderboard' && (
            <div className="h-full overflow-y-auto p-4 custom-scrollbar">
              <LeaderboardPage currentUid={userId} />
            </div>
          )}
        </div>

        {/* Desktop terminal area */}
        <div className="hidden lg:flex flex-1 min-h-0 p-4 sm:p-6 pt-3 max-w-[1440px] mx-auto w-full">
          <div className="flex-1 min-w-0">
            {terminal}
          </div>
        </div>
      </div>

      {quizPanel}

      <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} />
    </div>
  )
}
