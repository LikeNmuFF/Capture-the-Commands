import { ReactNode, useState, useEffect } from 'react'
import MissionPanel from '../Mission/MissionPanel'
import ChallengePanel from '../Challenge/ChallengePanel'
import VisualUnitMap from '../Progress/VisualUnitMap'
import XPToast from '../common/XPToast'
import BeltCeremony from '../Progress/BeltCeremony'
import LeaderboardPage from '../Leaderboard/LeaderboardPage'
import MobileNav from './MobileNav'
import { useGameStore } from '../../store/gameStore'
import { logout } from '../../firebase/auth'
import { getLevel, getRank } from '../../utils/levels'

interface Props {
  terminal: ReactNode
  quizPanel: ReactNode
}

export default function AppShell({ terminal, quizPanel }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarTab, setSidebarTab] = useState<'mission' | 'leaderboard'>('mission')
  const [mobileTab, setMobileTab] = useState('terminal')
  const phase = useGameStore(s => s.phase)
  const xp = useGameStore(s => s.xp)
  const userId = useGameStore(s => s.userId)

  const level = getLevel(xp)
  const rank = getRank(level)

  useEffect(() => {
    setMobileTab('terminal')
  }, [phase])

  const sidebarContent = sidebarTab === 'leaderboard'
    ? <LeaderboardPage currentUid={userId} />
    : phase === 'challenge' ? <ChallengePanel /> : <MissionPanel />

  return (
    <div className="h-screen w-screen flex flex-col bg-surface overflow-hidden">
      <XPToast />
      <BeltCeremony />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always fixed, drawer on mobile, visible on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-surface/95 lg:bg-surface border-r border-glass-border/50 transform transition-transform duration-300 ease-out flex flex-col shadow-2xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-glass-border/50 lg:hidden">
          <span className="text-sm font-mono text-crt-green">bash-bootcamp</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            ✕
          </button>
        </div>
        {/* Sidebar tab toggle */}
        <div className="flex gap-1 px-3 pt-3 pb-1 border-b border-glass-border/30">
          <button
            onClick={() => setSidebarTab('mission')}
            className={`text-[11px] px-3 py-1.5 rounded-lg font-mono transition-colors ${
              sidebarTab === 'mission'
                ? 'bg-crt-green/15 text-crt-green'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            {phase === 'challenge' ? 'Challenge' : 'Mission'}
          </button>
          <button
            onClick={() => setSidebarTab('leaderboard')}
            className={`text-[11px] px-3 py-1.5 rounded-lg font-mono transition-colors ${
              sidebarTab === 'leaderboard'
                ? 'bg-crt-green/15 text-crt-green'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            Leaderboard
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {sidebarContent}
          {sidebarTab !== 'leaderboard' && (
            <div className="hidden lg:block">
              <VisualUnitMap />
            </div>
          )}
        </div>
      </div>

      {/* Main area — padded left on desktop for the fixed sidebar */}
      <div className="flex-1 flex flex-col min-h-0 lg:pl-[280px]">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5 bg-surface/80 backdrop-blur-xl border-b border-glass-border/40 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/40 hover:text-white/60 text-lg leading-none transition-colors"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <span className="hidden sm:inline text-sm font-mono text-crt-green/90 tracking-tight">bash-bootcamp</span>
            <span className="hidden sm:inline text-[10px] text-white/15">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs">{rank.icon}</span>
              <span className="text-xs text-white/50 font-mono">
                Lv.{level}
              </span>
              <span className="hidden sm:inline text-xs text-white/30 font-mono">
                {rank.title}
              </span>
            </div>
          </div>

          {/* Desktop XP bar */}
          <div className="hidden sm:flex items-center gap-2.5 ml-auto">
            <div className="w-28 lg:w-36 h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-crt-green via-[#00e050] to-purple-400 rounded-full transition-all duration-700 shadow-sm shadow-crt-green/20"
                style={{ width: `${((xp % 100) / 100) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-white/25 font-mono tabular-nums">{xp} XP</span>
          </div>

          {/* Complete units badge */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            <span className="text-[10px] text-white/20 font-mono">Units</span>
            <span className="text-[10px] text-white/40 font-mono tabular-nums">
              {useGameStore.getState().completedUnits.length}/{useGameStore.getState().unlockedUnits.length}
            </span>
          </div>

          {/* Sign out */}
          {userId && (
            <button
              onClick={() => logout()}
              className="ml-3 text-[10px] text-white/15 hover:text-red-400/50 font-mono transition-colors"
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
              <div className="bg-glass backdrop-blur-xl rounded-xl border border-glass-border p-5 mb-4 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{rank.icon}</div>
                  <div>
                    <h2 className="text-base font-semibold text-white">{rank.title}</h2>
                    <p className="text-lg font-mono text-crt-green font-bold">Level {level}</p>
                  </div>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-crt-green via-[#00e050] to-purple-400 rounded-full transition-all duration-700"
                    style={{ width: `${((xp % 100) / 100) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-white/25 font-mono mt-1.5">{xp} total XP · {xp % 100}/100 to next level</p>
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
