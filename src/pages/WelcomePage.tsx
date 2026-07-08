import { useEffect, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface Props {
  onStart: () => void
}

const bootLines = [
  { text: '[  OK  ] Initializing kernel modules...', delay: 200 },
  { text: '[  OK  ] Mounting virtual filesystem...', delay: 300 },
  { text: '[  OK  ] Loading bash shell environment...', delay: 250 },
  { text: '[  OK  ] Starting command parser...', delay: 200 },
  { text: '[  OK  ] Preparing mission control...', delay: 300 },
  { text: '', delay: 100 },
  { text: '=== Bash Bootcamp v1.0.0 ===', delay: 200 },
  { text: '3 Tiers • 16 Units • CTF Arena Ready', delay: 150 },
  { text: '', delay: 100 },
  { text: 'SYSTEM READY. Press any key to enter bootcamp.', delay: 300 },
]

export default function WelcomePage({ onStart }: Props) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [showPrompt, setShowPrompt] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const { isDark } = useTheme()

  useEffect(() => {
    let mounted = true
    let lineIndex = 0
    let timer: ReturnType<typeof setTimeout>

    const showNextLine = () => {
      if (!mounted) return
      setVisibleLines(lineIndex + 1)
      setProgress(Math.min(100, Math.round(((lineIndex + 1) / bootLines.length) * 100)))

      if (lineIndex < bootLines.length - 1) {
        lineIndex++
        timer = setTimeout(showNextLine, bootLines[lineIndex].delay)
      } else {
        setBootComplete(true)
        setTimeout(() => setShowPrompt(true), 500)
      }
    }

    timer = setTimeout(showNextLine, 400)

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

  return (
    <div className="h-screen w-screen flex items-center justify-center crt-overlay" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-2xl px-6 sm:px-8">
        {/* Progress bar */}
        <div className="w-full h-1 rounded-full mb-8 overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%`, backgroundColor: 'var(--text-accent)' }}
          />
        </div>

        {/* Boot lines */}
        <div className="font-mono text-sm space-y-1">
          {bootLines.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`transition-opacity duration-200 animate-slide-up`}
              style={{
                color: line.text.includes('SYSTEM READY')
                  ? 'var(--text-accent)'
                  : 'var(--text-secondary)'
              }}
            >
              {line.text.includes('SYSTEM READY') && (
                <span className="animate-pulse-glow inline-block">{line.text}</span>
              )}
              {!line.text.includes('SYSTEM READY') && line.text}
            </div>
          ))}
        </div>

        {/* Prompt */}
        {showPrompt && (
          <div className="mt-12 text-center animate-fade-in">
            <div className="font-mono text-lg animate-pulse-glow mb-2" style={{ color: 'var(--text-accent)' }}>
              _ PRESS ANY KEY TO ENTER _
            </div>
            <div className="text-[10px] font-mono mt-8" style={{ color: 'var(--text-tertiary)' }}>
              [ CLICK OR PRESS ANY KEY TO START ]
            </div>
            <div className="mt-12 text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
              <span style={{ color: 'var(--text-accent)', opacity: 0.7 }}>user</span>
              @
              <span style={{ color: 'var(--text-accent)', opacity: 0.7 }}>bash-bootcamp</span>
              <span style={{ color: 'var(--text-primary)', opacity: 0.2 }}>:</span>
              <span style={{ color: 'var(--info)', opacity: 0.4 }}>~</span>$ _
            </div>
          </div>
        )}

        {/* Status indicator */}
        {showPrompt && (
          <div className="fixed bottom-8 left-0 right-0 text-center">
            <div className="inline-flex gap-3 text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
              <span className="animate-pulse" style={{ color: 'var(--text-accent)', opacity: 0.3 }}>◉</span>
              <span style={{ opacity: 0.5 }}>BOOT SEQUENCE COMPLETE</span>
              <span className="animate-pulse" style={{ color: 'var(--text-accent)', opacity: 0.3 }}>◉</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
