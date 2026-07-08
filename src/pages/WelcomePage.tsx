import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { content } from '../content'
import Badge from '../components/ui/Badge'
import Scanline from '../components/ui/Scanline'

interface Props {
  onStart: () => void
}

const bootLines = [
  '[  OK  ] Initializing kernel modules...',
  '[  OK  ] Mounting virtual filesystem (VirtualFS v2.1)...',
  '[  OK  ] Loading bash shell environment...',
  '[  OK  ] Initializing command parser...',
  '[  OK  ] Compiling mission objectives...',
  '[  OK  ] Starting XP subsystem...',
  '[  OK  ] Connecting to mission control...',
  '[  OK  ] Loading tier data (3 tiers, 16 units)...',
  '[  OK  ] Initializing terminal emulator...',
  '[  OK  ] Calibrating CRT display...',
  '[  OK  ] System ready.',
  '=== Bash Bootcamp v1.0.0 ===',
  '3 Tiers · 16 Units · CTF Arena Ready',
]

const beltColors: Record<string, string> = {
  white: '#d1d5db',
  yellow: '#facc15',
  orange: '#fb923c',
  green: '#22c55e',
  blue: '#3b82f6',
  red: '#ef4444',
  black: '#374151',
}

export default function WelcomePage({ onStart }: Props) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [bootComplete, setBootComplete] = useState(false)
  const [activeTier, setActiveTier] = useState(0)
  const totalLines = bootLines.length

  useEffect(() => {
    let mounted = true
    let index = 0
    let timer: ReturnType<typeof setTimeout>

    const showNext = () => {
      if (!mounted) return
      index++
      setVisibleLines(index)

      if (index < bootLines.length) {
        timer = setTimeout(showNext, 180)
      } else {
        setBootComplete(true)
      }
    }

    timer = setTimeout(showNext, 400)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!bootComplete) return

    const handler = (e: KeyboardEvent | MouseEvent) => {
      e.preventDefault()
      onStart()
    }

    window.addEventListener('keydown', handler)
    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      window.removeEventListener('click', handler)
    }
  }, [bootComplete, onStart])

  const tierCycle = useCallback(() => {
    setActiveTier(prev => (prev + 1) % content.tiers.length)
  }, [])

  useEffect(() => {
    if (!bootComplete) return
    const id = setInterval(tierCycle, 3000)
    return () => clearInterval(id)
  }, [bootComplete, tierCycle])

  const progress = Math.min(100, Math.round((visibleLines / totalLines) * 100))
  const currentTier = content.tiers[activeTier]

  return (
    <div
      className="h-screen w-screen flex items-center justify-center overflow-hidden crt-overlay relative"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="absolute inset-0 bg-grid opacity-[0.15]" aria-hidden />
      <Scanline />

      <div className="w-full max-w-2xl px-6 sm:px-8 relative z-10">
        {/* Progress bar */}
        <div
          className="w-full h-1 rounded-full mb-8 overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%`, backgroundColor: 'var(--text-accent)' }}
          />
        </div>

        {/* Boot lines */}
        <div className="font-mono text-sm space-y-1">
          {bootLines.slice(0, visibleLines).map((line, i) => {
            const isOK = line.startsWith('[  OK  ]')
            const isBanner = line.startsWith('===') || line.startsWith('3 Tiers')
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ color: 'var(--text-secondary)' }}
              >
                {isOK ? (
                  <>
                    <span style={{ color: 'var(--success)' }}>[  OK  ]</span>
                    <span>{line.slice(9)}</span>
                  </>
                ) : isBanner ? (
                  <span style={{ color: 'var(--text-primary)' }}>{line}</span>
                ) : (
                  <span>{line}</span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Tier carousel + prompt after boot */}
        {bootComplete && (
          <div className="mt-10 space-y-8 animate-fade-in">
            {/* Tier preview carousel */}
            <div className="flex flex-col items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTier.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-2"
                >
                  <Badge color={beltColors[currentTier.belt] || 'var(--text-accent)'}>
                    {currentTier.belt.toUpperCase()}
                  </Badge>
                  <span className="font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
                    {currentTier.name}
                  </span>
                  <span className="font-mono text-[11px] max-w-xs text-center" style={{ color: 'var(--text-tertiary)' }}>
                    {currentTier.focus}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Tier dots */}
              <div className="flex gap-1.5 mt-3">
                {content.tiers.map((t, i) => (
                  <div
                    key={t.id}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i === activeTier ? 'var(--text-accent)' : 'var(--text-tertiary)',
                      opacity: i === activeTier ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Press any key prompt */}
            <div className="text-center">
              <div className="font-mono text-lg animate-pulse-glow mb-2" style={{ color: 'var(--text-accent)' }}>
                PRESS ANY KEY TO ENTER
              </div>
              <div className="text-[10px] font-mono mt-6" style={{ color: 'var(--text-tertiary)' }}>
                [ CLICK OR PRESS ANY KEY TO START ]
              </div>
              <div className="mt-8 text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                <span style={{ color: 'var(--text-accent)', opacity: 0.7 }}>user</span>
                @
                <span style={{ color: 'var(--text-accent)', opacity: 0.7 }}>bash-bootcamp</span>
                <span style={{ color: 'var(--text-primary)', opacity: 0.2 }}>:</span>
                <span style={{ color: 'var(--info)', opacity: 0.4 }}>~</span>$ _
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom status indicator */}
      {bootComplete && (
        <div className="fixed bottom-8 left-0 right-0 text-center">
          <div className="inline-flex gap-3 text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
            <span className="animate-pulse" style={{ color: 'var(--text-accent)', opacity: 0.3 }}>◉</span>
            <span style={{ opacity: 0.5 }}>BOOT SEQUENCE COMPLETE</span>
            <span className="animate-pulse" style={{ color: 'var(--text-accent)', opacity: 0.3 }}>◉</span>
          </div>
        </div>
      )}
    </div>
  )
}
