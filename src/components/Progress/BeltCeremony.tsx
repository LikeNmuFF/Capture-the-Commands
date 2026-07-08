import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { content } from '../../content'
import { getLevel, getRank } from '../../utils/levels'
import { useTheme } from '../../contexts/ThemeContext'
import { spring, scaleIn, fadeUp, stagger } from '../../lib/motion'

const beltColors: Record<string, string> = {
  white: '#d1d5db',
  yellow: '#facc15',
  orange: '#fb923c',
  green: '#22c55e',
  blue: '#3b82f6',
  red: '#ef4444',
  black: '#374151',
}

const beltNames: Record<string, string> = {
  white: 'White',
  yellow: 'Yellow',
  orange: 'Orange',
  green: 'Green',
  blue: 'Blue',
  red: 'Red',
  black: 'Black',
}

function useTypingEffect(text: string, speed = 40, startDelay = 600) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setStarted(false)
    const delay = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(delay)
  }, [text, startDelay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) return
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(timer)
  }, [started, displayed, text, speed])

  return displayed
}

export default function BeltCeremony() {
  const tierJustCompleted = useGameStore(s => s.tierJustCompleted)
  const xp = useGameStore(s => s.xp)
  const clearTierComplete = useGameStore(s => s.clearTierComplete)
  const advanceToNextUnit = useGameStore(s => s.advanceToNextUnit)
  const { isDark } = useTheme()

  const [show, setShow] = useState(false)

  useEffect(() => {
    if (tierJustCompleted !== null) {
      const t = setTimeout(() => setShow(true), 50)
      return () => clearTimeout(t)
    } else {
      setShow(false)
    }
  }, [tierJustCompleted])

  if (tierJustCompleted === null || !show) return null

  const tier = content.tiers.find(t => t.id === tierJustCompleted)
  if (!tier) return null

  const level = getLevel(xp)
  const rank = getRank(level)
  const beltColor = beltColors[tier.belt] || '#d1d5db'
  const name = beltNames[tier.belt] || tier.belt

  const typedName = useTypingEffect(`${name} Belt Earned!`)

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
        style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.7)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="text-center px-6 max-w-lg"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Belt icon materializes */}
          <motion.div
            className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
            style={{
              border: `3px solid ${beltColor}`,
              boxShadow: `0 0 40px ${beltColor}50, 0 0 80px ${beltColor}20, inset 0 0 20px ${beltColor}15`,
              background: isDark ? `radial-gradient(circle, ${beltColor}15 0%, transparent 70%)` : `radial-gradient(circle, ${beltColor}20 0%, transparent 70%)`,
            }}
            variants={scaleIn}
            transition={spring}
          >
            <svg
              className="w-12 h-12"
              style={{ color: beltColor, filter: `drop-shadow(0 0 8px ${beltColor})` }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </motion.div>

          {/* Belt name types out */}
          <motion.h1
            className="text-3xl sm:text-4xl font-bold mb-3 font-mono"
            style={{
              color: 'var(--text-primary)',
              textShadow: `0 0 20px ${beltColor}40`,
            }}
            variants={fadeUp}
          >
            {typedName}
            {typedName.length < `${name} Belt Earned!`.length && (
              <span
                className="inline-block w-[3px] h-[1em] ml-1 align-middle animate-pulse"
                style={{ backgroundColor: beltColor }}
              />
            )}
          </motion.h1>

          {/* Tier name */}
          <motion.p
            className="text-lg mb-2"
            style={{ color: 'var(--text-secondary)' }}
            variants={fadeUp}
          >
            {tier.name} — Complete
          </motion.p>

          {/* Units list fades in */}
          <motion.div className="flex flex-wrap justify-center gap-2 my-5" variants={stagger}>
            {tier.units.map((unit, i) => (
              <motion.span
                key={unit.id}
                className="text-xs px-3 py-1.5 rounded-full font-mono flex items-center gap-1.5"
                style={{
                  backgroundColor: isDark ? 'rgba(0,255,65,0.08)' : 'rgba(0,119,34,0.08)',
                  borderColor: 'var(--border-primary)',
                  borderWidth: '1px',
                  color: 'var(--text-accent)',
                }}
                variants={fadeUp}
              >
                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {unit.title}
              </motion.span>
            ))}
          </motion.div>

          {/* Current rank info */}
          <motion.p
            className="text-sm mb-8 font-mono"
            style={{ color: 'var(--text-tertiary)' }}
            variants={fadeUp}
          >
            {rank.icon} Level {level} {rank.title}
          </motion.p>

          {/* Continue button */}
          <motion.div variants={fadeUp}>
            <button
              onClick={() => {
                clearTierComplete()
                advanceToNextUnit()
              }}
              className="px-8 py-3 rounded-xl font-mono text-sm transition-all animate-pulse-glow active:scale-[0.98] hover:brightness-110"
              style={{
                backgroundColor: isDark ? `${beltColor}25` : `${beltColor}30`,
                borderColor: beltColor,
                borderWidth: '1px',
                color: beltColor,
                boxShadow: `0 0 20px ${beltColor}30`,
              }}
            >
              Continue to Next Belt →
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
