import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const TUTORIAL_KEY = 'bash-bootcamp-tutorial-seen'

interface Spotlight {
  top: number
  left: number
  width: number
  height: number
}

export function dismissTutorial() {
  localStorage.setItem(TUTORIAL_KEY, 'true')
}

export function shouldShowTutorial(): boolean {
  return !localStorage.getItem(TUTORIAL_KEY)
}

interface Props {
  onDismiss: () => void
}

const steps = [
  {
    title: 'Welcome to the Terminal!',
    description: 'You\'ll learn Linux commands by completing hands-on missions. Type real commands, explore a virtual file system, and capture flags to level up.',
    spotlight: null as Spotlight | null,
    highlight: 'terminal',
  },
  {
    title: 'Type Commands Here',
    description: 'This is the terminal. Click the input field below, type a command, and press Enter. Start with simple commands like `pwd` or `ls`!',
    spotlight: null as Spotlight | null,
    highlight: 'input',
  },
  {
    title: 'Follow Your Mission',
    description: 'Your current mission appears here. Each step tells you exactly what command to run. Check off objectives as you complete them.',
    spotlight: null as Spotlight | null,
    highlight: 'sidebar',
  },
  {
    title: 'Ready to Begin?',
    description: 'Try typing `pwd` in the terminal and press Enter. You can always get hints by clicking "Need a hint?" in the mission panel. Good luck!',
    spotlight: null as Spotlight | null,
    highlight: 'none',
  },
]

export default function FirstRunTutorial({ onDismiss }: Props) {
  const [step, setStep] = useState(0)
  const [spotlightStyle, setSpotlightStyle] = useState<Spotlight | null>(null)
  const { isDark } = useTheme()

  const calculateSpotlight = useCallback(() => {
    const current = steps[step]
    if (!current.spotlight && current.highlight !== 'none') {
      if (current.highlight === 'input') {
        const input = document.querySelector<HTMLElement>('input[type="text"]')
        if (input) {
          const rect = input.getBoundingClientRect()
          setSpotlightStyle({
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          })
          return
        }
      }
      if (current.highlight === 'sidebar') {
        const sidebar = document.querySelector<HTMLElement>('.lg\\:pl-\\[280px\\]')
        if (sidebar) {
          const rect = sidebar.getBoundingClientRect()
          setSpotlightStyle({
            top: rect.top + 60,
            left: 0,
            width: 280,
            height: rect.height - 60,
          })
          return
        }
      }
    }
    setSpotlightStyle(current.spotlight)
  }, [step])

  useEffect(() => {
    calculateSpotlight()
    const timer = setTimeout(calculateSpotlight, 300)
    return () => clearTimeout(timer)
  }, [calculateSpotlight])

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1)
    } else {
      dismissTutorial()
      onDismiss()
    }
  }

  const handleSkip = () => {
    dismissTutorial()
    onDismiss()
  }

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div className="fixed inset-0 z-[100] flex flex-col animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(2px)',
        }}
        onClick={handleSkip}
      />

      {/* Spotlight cutout */}
      {spotlightStyle && (
        <div
          className="absolute transition-all duration-500 ease-out pointer-events-none"
          style={{
            top: spotlightStyle.top,
            left: spotlightStyle.left,
            width: spotlightStyle.width,
            height: spotlightStyle.height,
            borderRadius: 12,
            boxShadow: isDark
              ? '0 0 0 4px rgba(0,255,65,0.5), 0 0 30px rgba(0,255,65,0.2)'
              : '0 0 0 4px rgba(0,119,34,0.5), 0 0 30px rgba(0,119,34,0.2)',
            zIndex: 101,
          }}
        />
      )}

      {/* Step counter */}
      <div
        className="absolute top-4 right-4 z-[102] text-[10px] font-mono"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {step + 1} / {steps.length}
      </div>

      {/* Card */}
      <div
        className="relative z-[102] mx-auto mt-auto mb-24 sm:mb-32 max-w-sm w-full mx-4 animate-scale-in"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: 16,
          boxShadow: isDark
            ? '0 25px 60px rgba(0,0,0,0.8)'
            : '0 25px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Glow accent */}
        <div
          className="absolute -top-px left-8 right-8 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, var(--text-accent), transparent)`,
          }}
        />

        <div className="p-6">
          {/* Step indicator */}
          <div className="flex gap-1.5 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: i === step
                    ? 'var(--text-accent)'
                    : i < step
                    ? isDark ? 'rgba(0,255,65,0.3)' : 'rgba(0,119,34,0.3)'
                    : 'var(--border-subtle)',
                }}
              />
            ))}
          </div>

          {/* Icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{
              backgroundColor: isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <span className="text-lg font-mono font-bold" style={{ color: 'var(--text-accent)' }}>
              {step === 0 ? '>' : step === 1 ? '$' : step === 2 ? '!' : '?'}
            </span>
          </div>

          {/* Title */}
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {current.title}
          </h2>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: 'var(--text-secondary)' }}
          >
            {current.description}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-xs font-mono transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-secondary)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
            >
              Skip tour
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl text-xs font-mono transition-all duration-200 active:scale-[0.98]"
              style={{
                backgroundColor: isDark ? 'rgba(0,255,65,0.15)' : 'rgba(0,119,34,0.15)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-accent)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(0,255,65,0.25)' : 'rgba(0,119,34,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(0,255,65,0.15)' : 'rgba(0,119,34,0.15)'
              }}
            >
              {isLast ? 'Got it! →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
