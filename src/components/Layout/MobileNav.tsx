import { useGameStore } from '../../store/gameStore'
import { getLevel, getRank } from '../../utils/levels'
import { useTheme } from '../../contexts/ThemeContext'

interface Props {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MobileNav({ activeTab, onTabChange }: Props) {
  const xp = useGameStore(s => s.xp)
  const level = getLevel(xp)
  const rank = getRank(level)
  const { isDark } = useTheme()

  const tabs = [
    {
      id: 'terminal',
      label: 'Terminal',
      icon: (
        <img src="/src/logo/logo.svg" alt="" className="w-5 h-5" />
      ),
    },
    {
      id: 'map',
      label: 'Map',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      id: 'progress',
      label: 'Lv.' + level,
      icon: <span className="text-sm leading-none">{rank.icon}</span>,
    },
    {
      id: 'leaderboard',
      label: 'Board',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      id: 'arena',
      label: 'Arena',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl safe-bottom"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)'
      }}
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]"
              style={{
                color: isActive ? 'var(--text-accent)' : 'var(--text-tertiary)',
                backgroundColor: isActive
                  ? (isDark ? 'rgba(57,255,20,0.1)' : 'rgba(10,156,46,0.1)')
                  : 'transparent',
                boxShadow: isActive
                  ? (isDark ? '0 0 12px rgba(57,255,20,0.15), inset 0 0 12px rgba(57,255,20,0.05)' : '0 0 8px rgba(10,156,46,0.08)')
                  : 'none'
              }}
            >
              <div className="flex items-center justify-center h-5">
                {tab.icon}
              </div>
              <span className="text-[9px] font-mono leading-none">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
