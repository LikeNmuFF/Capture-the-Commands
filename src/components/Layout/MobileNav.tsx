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
    { id: 'terminal', label: 'Terminal', icon: '>' },
    { id: 'map', label: 'Map', icon: '≡' },
    { id: 'progress', label: 'Lv.' + level, icon: rank.icon },
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
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-lg transition-all duration-200 min-w-[60px]"
            style={{
              color: activeTab === tab.id ? 'var(--text-accent)' : 'var(--text-tertiary)',
              backgroundColor: activeTab === tab.id ? (isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)') : 'transparent'
            }}
          >
            <span className="text-sm font-mono">{tab.icon}</span>
            <span className="text-[10px] font-mono">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
