import { useGameStore } from '../../store/gameStore'
import { getLevel, getRank } from '../../utils/levels'

interface Props {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MobileNav({ activeTab, onTabChange }: Props) {
  const xp = useGameStore(s => s.xp)
  const isAdmin = useGameStore(s => s.isAdmin)

  const level = getLevel(xp)
  const rank = getRank(level)

  const tabs = [
    { id: 'terminal', label: 'Terminal', icon: '>' },
    { id: 'map', label: 'Map', icon: '≡' },
    { id: 'arena', label: 'Arena', icon: '⚑' },
    { id: 'progress', label: 'Lv.' + level, icon: rank.icon },
  ]
  if (isAdmin) {
    tabs.push({ id: 'admin', label: 'Admin', icon: '⚙' })
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-light/95 backdrop-blur-xl border-t border-glass-border safe-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'text-crt-green'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            <span className="text-sm font-mono">{tab.icon}</span>
            <span className="text-[10px] font-mono">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
