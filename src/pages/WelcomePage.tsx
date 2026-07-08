import { useEffect, useState } from 'react'

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
  { text: '6 Tiers • 16 Units • CTF Arena Ready', delay: 150 },
  { text: '', delay: 100 },
  { text: 'SYSTEM READY. Press any key to enter bootcamp.', delay: 300 },
]

export default function WelcomePage({ onStart }: Props) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [showPrompt, setShowPrompt] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)
  const [progress, setProgress] = useState(0)

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
    <div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center crt-overlay">
      <div className="w-full max-w-2xl px-8">
        <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-crt-green rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="font-mono text-sm space-y-1">
          {bootLines.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`transition-opacity duration-200 ${
                line.text.includes('SYSTEM READY') ? 'text-crt-green animate-pulse-glow' : 'text-gray-400'
              }`}
            >
              {line.text}
            </div>
          ))}
        </div>

        {showPrompt && (
          <div className="mt-12 text-center animate-fade-in">
            <div className="font-mono text-crt-green text-lg animate-pulse-glow mb-2">
              _ PRESS ANY KEY TO ENTER _
            </div>
            <div className="text-[10px] text-gray-600 font-mono mt-8">
              {`[ CLICK OR PRESS ANY KEY TO START ]`}
            </div>
            <div className="mt-12 text-xs text-gray-700 font-mono">
              <span className="text-crt-green-dim">user</span>@<span className="text-crt-green-dim">bash-bootcamp</span>
              <span className="text-white/20">:</span><span className="text-blue-400/40">~</span>$ _
            </div>
          </div>
        )}

        {showPrompt && (
          <div className="fixed bottom-8 left-0 right-0 text-center">
            <div className="inline-flex gap-3 text-[10px] text-gray-700 font-mono">
              <span className="text-crt-green/30 animate-pulse">◉</span>
              <span className="text-white/10">BOOT SEQUENCE COMPLETE</span>
              <span className="text-crt-green/30 animate-pulse">◉</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
