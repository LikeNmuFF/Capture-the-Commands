import { ReactNode, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MissionPanel from '../Mission/MissionPanel'
import ChallengePanel from '../Challenge/ChallengePanel'
import VisualUnitMap from '../Progress/VisualUnitMap'
import XPToast from '../common/XPToast'
import BeltCeremony from '../Progress/BeltCeremony'
import LevelUpBurst from '../Progress/LevelUpBurst'
import LeaderboardPage from '../Leaderboard/LeaderboardPage'
import ThemeToggle from '../common/ThemeToggle'
import MobileNav from './MobileNav'
import FirstRunTutorial from '../Onboarding/FirstRunTutorial'
import { useGameStore } from '../../store/gameStore'
import { logout } from '../../firebase/auth'
import { getLevel, getRank } from '../../utils/levels'
import { useTheme } from '../../contexts/ThemeContext'
import { pageSweep } from '../../lib/motion'

interface Props {
  terminal: ReactNode
  quizPanel: ReactNode
}

export default function AppShell({ terminal, quizPanel }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [sidebarTab, setSidebarTab] = useState<'mission' | 'leaderboard'>('mission')
  const [mobileTab, setMobileTab] = useState('terminal')
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem('bash-bootcamp-tutorial-seen'))
  const phase = useGameStore(s => s.phase)
  const xp = useGameStore(s => s.xp)
  const userId = useGameStore(s => s.userId)
  const { isDark } = useTheme()

  const level = getLevel(xp)
  const rank = getRank(level)
  const completedUnits = useGameStore(s => s.completedUnits)
  const unlockedUnits = useGameStore(s => s.unlockedUnits)

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
      <LevelUpBurst />

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
        className={`fixed inset-y-0 left-0 z-40 flex flex-col shadow-2xl lg:shadow-none transition-all duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          width: sidebarExpanded ? 280 : 48,
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)'
        }}
      >
        {/* App identity header */}
        <div
          className="flex items-center shrink-0 overflow-hidden transition-all duration-300"
          style={{
            height: 56,
            padding: sidebarExpanded ? '0 16px' : '0',
            justifyContent: sidebarExpanded ? 'space-between' : 'center',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {sidebarExpanded ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="font-mono text-lg font-bold tracking-tighter shrink-0"
                style={{ color: 'var(--text-accent)', textShadow: '0 0 10px var(--text-accent), 0 0 20px var(--text-accent)' }}
              >
                {'>_'}
              </span>
              <span className="text-xs font-mono tracking-tight truncate" style={{ color: 'var(--text-accent)' }}>
                bash-bootcamp
              </span>
            </div>
          ) : (
            <span
              className="font-mono text-lg font-bold shrink-0"
              style={{ color: 'var(--text-accent)', textShadow: '0 0 10px var(--text-accent), 0 0 20px var(--text-accent)' }}
            >
              {'>_'}
            </span>
          )}

          {/* Desktop collapse toggle */}
          {sidebarExpanded && (
            <button
              onClick={() => setSidebarExpanded(false)}
              className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md transition-colors shrink-0"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label="Collapse sidebar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Mobile close button */}
          {!sidebarExpanded && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-7 h-7 flex items-center justify-center rounded-md transition-colors shrink-0"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label="Close menu"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Tab navigation */}
        {sidebarExpanded ? (
          <div className="flex gap-1.5 px-3 pt-3 pb-1" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setSidebarTab('mission')}
              className="flex-1 text-[11px] px-3 py-2 rounded-lg font-mono transition-all duration-200"
              style={{
                backgroundColor: sidebarTab === 'mission'
                  ? (isDark ? 'rgba(57,255,20,0.12)' : 'rgba(10,156,46,0.12)')
                  : 'transparent',
                color: sidebarTab === 'mission' ? 'var(--text-accent)' : 'var(--text-tertiary)',
                boxShadow: sidebarTab === 'mission'
                  ? (isDark ? '0 0 12px rgba(57,255,20,0.15), inset 0 0 12px rgba(57,255,20,0.05)' : '0 0 8px rgba(10,156,46,0.1)')
                  : 'none'
              }}
            >
              {phase === 'challenge' ? 'Challenge' : 'Mission'}
            </button>
            <button
              onClick={() => setSidebarTab('leaderboard')}
              className="flex-1 text-[11px] px-3 py-2 rounded-lg font-mono transition-all duration-200"
              style={{
                backgroundColor: sidebarTab === 'leaderboard'
                  ? (isDark ? 'rgba(57,255,20,0.12)' : 'rgba(10,156,46,0.12)')
                  : 'transparent',
                color: sidebarTab === 'leaderboard' ? 'var(--text-accent)' : 'var(--text-tertiary)',
                boxShadow: sidebarTab === 'leaderboard'
                  ? (isDark ? '0 0 12px rgba(57,255,20,0.15), inset 0 0 12px rgba(57,255,20,0.05)' : '0 0 8px rgba(10,156,46,0.1)')
                  : 'none'
              }}
            >
              Leaderboard
            </button>
          </div>
        ) : (
          /* Icon rail for collapsed state */
          <div className="hidden lg:flex flex-col items-center gap-2 pt-3 pb-1" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => { setSidebarTab('mission'); setSidebarExpanded(true) }}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200"
              style={{
                backgroundColor: sidebarTab === 'mission'
                  ? (isDark ? 'rgba(57,255,20,0.12)' : 'rgba(10,156,46,0.12)')
                  : 'transparent',
                color: sidebarTab === 'mission' ? 'var(--text-accent)' : 'var(--text-tertiary)',
                boxShadow: sidebarTab === 'mission'
                  ? (isDark ? '0 0 10px rgba(57,255,20,0.15)' : '0 0 6px rgba(10,156,46,0.1)')
                  : 'none'
              }}
              title={phase === 'challenge' ? 'Challenge' : 'Mission'}
            >
              <span className="font-mono text-xs font-bold">{'>_'} </span>
            </button>
            <button
              onClick={() => { setSidebarTab('leaderboard'); setSidebarExpanded(true) }}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200"
              style={{
                backgroundColor: sidebarTab === 'leaderboard'
                  ? (isDark ? 'rgba(57,255,20,0.12)' : 'rgba(10,156,46,0.12)')
                  : 'transparent',
                color: sidebarTab === 'leaderboard' ? 'var(--text-accent)' : 'var(--text-tertiary)',
                boxShadow: sidebarTab === 'leaderboard'
                  ? (isDark ? '0 0 10px rgba(57,255,20,0.15)' : '0 0 6px rgba(10,156,46,0.1)')
                  : 'none'
              }}
              title="Leaderboard"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </button>
          </div>
        )}

        {/* Sidebar content */}
        {sidebarExpanded ? (
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {sidebarContent}
            {sidebarTab !== 'leaderboard' && (
              <div className="hidden lg:block">
                <VisualUnitMap />
              </div>
            )}
          </div>
        ) : (
          <div className="hidden lg:flex flex-1" />
        )}

        {/* Footer — user + rank + sign-out */}
        {sidebarExpanded ? (
          <div
            className="shrink-0 px-3 py-3 flex items-center gap-2.5"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0"
              style={{
                backgroundColor: isDark ? 'rgba(57,255,20,0.1)' : 'rgba(10,156,46,0.1)',
                color: 'var(--text-accent)',
                border: '1px solid var(--border-primary)'
              }}
            >
              {userId ? userId.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">{rank.icon}</span>
                <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Lv.{level} {rank.title}
                </span>
              </div>
            </div>
            {userId && (
              <button
                onClick={() => logout()}
                className="w-7 h-7 flex items-center justify-center rounded-md transition-colors shrink-0"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--error)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
                title="Sign out"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div
            className="hidden lg:flex shrink-0 flex-col items-center gap-2 py-3"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold"
              style={{
                backgroundColor: isDark ? 'rgba(57,255,20,0.1)' : 'rgba(10,156,46,0.1)',
                color: 'var(--text-accent)',
                border: '1px solid var(--border-primary)'
              }}
            >
              {userId ? userId.charAt(0).toUpperCase() : '?'}
            </div>
            {userId && (
              <button
                onClick={() => logout()}
                className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--error)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
                title="Sign out"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main area */}
      <div
        className="flex-1 flex flex-col min-h-0 transition-all duration-300"
        style={{ marginLeft: sidebarExpanded ? 280 : 48 }}
      >
        {/* Window title bar */}
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

          {/* Desktop expand button when collapsed */}
          {!sidebarExpanded && (
            <button
              onClick={() => setSidebarExpanded(true)}
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label="Expand sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* App name + rank */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="hidden sm:inline text-sm font-mono tracking-tight" style={{ color: 'var(--text-accent)' }}>
              bash-bootcamp
            </span>
            <span className="hidden sm:inline text-[10px]" style={{ color: 'var(--text-tertiary)', opacity: 0.3 }}>
              {'·'}
            </span>
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

          {/* Desktop right side */}
          <div className="hidden sm:flex items-center gap-3 ml-auto">
            {/* XP progress bar */}
            <div className="flex items-center gap-2">
              <div
                className="w-28 lg:w-36 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${((xp % 100) / 100) * 100}%`,
                    background: 'linear-gradient(90deg, var(--text-accent), #00e050, #a855f7)'
                  }}
                />
              </div>
              <span className="text-[10px] font-mono tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
                {xp} XP
              </span>
            </div>

            {/* Units badge */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>
                Units
              </span>
              <span className="text-[10px] font-mono tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                {completedUnits.length}/{unlockedUnits.length}
              </span>
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Sign out */}
            {userId && (
              <button
                onClick={() => logout()}
                className="text-[10px] font-mono transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--error)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
                title="Sign out"
              >
                sign-out
              </button>
            )}
          </div>
        </div>

        {/* Mobile tab content */}
        <div className="flex-1 min-h-0 lg:hidden">
          {mobileTab === 'terminal' && (
            <motion.div
              key="terminal"
              variants={pageSweep}
              initial="hidden"
              animate="show"
              className="h-full p-2 pt-1"
            >
              {terminal}
            </motion.div>
          )}
          {mobileTab === 'map' && (
            <motion.div
              key="map"
              variants={pageSweep}
              initial="hidden"
              animate="show"
              className="h-full overflow-y-auto p-4 custom-scrollbar"
            >
              {sidebarContent}
              <div className="mt-4"><VisualUnitMap /></div>
            </motion.div>
          )}
          {mobileTab === 'progress' && (
            <motion.div
              key="progress"
              variants={pageSweep}
              initial="hidden"
              animate="show"
              className="h-full overflow-y-auto p-4 custom-scrollbar"
            >
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
            </motion.div>
          )}
          {mobileTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              variants={pageSweep}
              initial="hidden"
              animate="show"
              className="h-full overflow-y-auto p-4 custom-scrollbar"
            >
              <LeaderboardPage currentUid={userId} />
            </motion.div>
          )}
          {mobileTab === 'arena' && (
            <motion.div
              key="arena"
              variants={pageSweep}
              initial="hidden"
              animate="show"
              className="h-full overflow-y-auto p-4 custom-scrollbar"
            >
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl mb-3">⚔</div>
                  <p className="text-sm font-mono" style={{ color: 'var(--text-tertiary)' }}>
                    Arena coming soon
                  </p>
                </div>
              </div>
            </motion.div>
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
