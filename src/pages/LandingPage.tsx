import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { content } from '../content'
import { RANKS } from '../utils/levels'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Scanline from '../components/ui/Scanline'
import Stat from '../components/ui/Stat'
import { fadeUp, stagger } from '../lib/motion'

interface Props {
  onStart: () => void
  onSignIn: () => void
  signedIn: boolean
}

const beltColors: Record<string, string> = {
  white: '#d1d5db',
  yellow: '#facc15',
  orange: '#fb923c',
  green: '#22c55e',
  blue: '#3b82f6',
  red: '#ef4444',
  black: '#374151',
}

type Line = { kind: 'prompt' | 'output'; text: string }

const terminalScript: Line[] = [
  { kind: 'prompt', text: '$ pwd' },
  { kind: 'output', text: '/home/user' },
  { kind: 'prompt', text: '$ ls -a' },
  { kind: 'output', text: '.secret  Documents  readme.txt' },
  { kind: 'prompt', text: '$ cat readme.txt' },
  { kind: 'output', text: 'Welcome to Bash Bootcamp.' },
]

const totalUnits = content.tiers.reduce((sum, t) => sum + t.units.length, 0)

export default function LandingPage({ onStart, onSignIn, signedIn }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= terminalScript.length) return 0
        return c + 1
      })
    }, 3500 / terminalScript.length)
    return () => clearInterval(interval)
  }, [])

  const visibleLines = terminalScript.slice(0, visibleCount)

  return (
    <div className="h-dvh w-dvw overflow-hidden relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Grid + neon glow backdrop */}
      <div className="absolute inset-0 bg-grid opacity-[0.15]" aria-hidden />
      <div className="absolute inset-0 bg-radial-glow" aria-hidden />
      <Scanline />

      <motion.div
        className="relative z-10 h-full w-full overflow-y-auto"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14 flex flex-col gap-12">
          {/* Hero */}
          <motion.section variants={fadeUp} className="flex flex-col items-center text-center gap-6">
            <img src="/logo.svg" alt="Capture the Command" className="w-20 h-20" />

            <h1
              className="font-mono font-bold tracking-tight leading-none"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 5rem)', color: 'var(--text-primary)' }}
            >
              <span style={{ color: 'var(--text-accent)' }}>C</span>apture the{' '}
              <span style={{ color: 'var(--text-accent)' }}>C</span>ommand
            </h1>

            <p className="max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Learn Linux through an immersive terminal OS. Capture flags. Level up. Become Grandmaster.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="terminal" onClick={onStart}>Continue as Guest →</Button>
              <Button variant="primary" onClick={onSignIn}>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
            </div>

            {signedIn && (
              <div className="text-[11px] font-mono" style={{ color: 'var(--success)' }}>
                <svg className="w-4 h-4 inline-block mr-1 -mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Signed in — progress auto-saves
              </div>
            )}
          </motion.section>

          {/* Live demo terminal */}
          <motion.div variants={fadeUp} className="mx-auto w-full max-w-2xl">
            <Card title="live // demo">
              <div className="px-4 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-apple-red" />
                  <div className="w-3 h-3 rounded-full bg-apple-yellow" />
                  <div className="w-3 h-3 rounded-full bg-apple-green" />
                </div>
                <div className="terminal-text min-h-[8rem]" style={{ color: 'var(--text-secondary)' }}>
                  {visibleLines.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-all">
                      {line.kind === 'prompt' ? (
                        <span style={{ color: 'var(--text-accent)' }}>{line.text}</span>
                      ) : (
                        <span>{line.text}</span>
                      )}
                    </div>
                  ))}
                  <span className="inline-block w-2 h-4 align-middle animate-blink" style={{ backgroundColor: 'var(--text-accent)' }} />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tier / belt showcase */}
          <motion.section variants={fadeUp} className="flex flex-col gap-5">
            <h2 className="text-center font-mono text-sm uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
              // progression
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {content.tiers.map((tier) => {
                const beltColor = beltColors[tier.belt] ?? 'var(--text-accent)'
                return (
                  <motion.div key={tier.id} variants={fadeUp} whileHover={{ y: -4 }}>
                    <Card hover={false} className="h-full">
                      <div className="px-4 py-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <Badge color={beltColor}>{tier.belt} belt</Badge>
                          <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                            {tier.units.length} units
                          </span>
                        </div>
                        <h3 className="font-mono font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{tier.name}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tier.focus}</p>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* Stats / social proof */}
          <motion.section variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto w-full">
            <Stat label="Tiers" value={content.tiers.length} />
            <Stat label="Units" value={totalUnits} />
            <Stat label="Ranks" value={RANKS.length} sub="to Grandmaster" />
            <Stat label="Flags" value="∞" sub="capture them all" />
          </motion.section>

          {/* Footer */}
          <motion.div variants={fadeUp} className="text-center text-[9px] font-mono" style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>
            <span style={{ color: 'var(--text-accent)' }}>$</span> bash-bootcamp v1.0.0
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
