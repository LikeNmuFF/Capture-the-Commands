import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { getLevel, getRank } from '../../utils/levels'
import { useTheme } from '../../contexts/ThemeContext'
import { spring } from '../../lib/motion'

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const distance = 80 + Math.random() * 120
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.15,
    }
  })
}

export default function LevelUpBurst() {
  const xpToasts = useGameStore(s => s.xpToasts)
  const xp = useGameStore(s => s.xp)
  const clearToasts = useGameStore(s => s.clearToasts)
  const { isDark } = useTheme()

  const levelUpToast = xpToasts.find(t => t.type === 'levelup')
  const [visible, setVisible] = useState(false)

  const level = getLevel(xp)
  const rank = getRank(level)

  const particles = useMemo(() => generateParticles(16), [])

  useEffect(() => {
    if (levelUpToast) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        clearToasts()
      }, 2500)
      return () => clearTimeout(timer)
    } else {
      setVisible(false)
    }
  }, [levelUpToast, clearToasts])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Centered content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Particle burst */}
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: '#39ff14',
                  boxShadow: '0 0 6px #39ff14, 0 0 12px #39ff1460',
                  left: '50%',
                  top: '50%',
                  marginLeft: -p.size / 2,
                  marginTop: -p.size / 2,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{
                  duration: 1.2,
                  delay: p.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}

            {/* LEVEL UP text */}
            <motion.div
              className="font-mono font-bold text-5xl sm:text-6xl tracking-wider mb-4"
              style={{
                color: 'var(--text-accent)',
                textShadow: '0 0 20px var(--text-accent), 0 0 40px var(--text-accent), 0 0 80px var(--text-accent)',
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={spring}
            >
              LEVEL UP
            </motion.div>

            {/* New rank */}
            <motion.div
              className="flex items-center gap-2 font-mono text-lg"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <span className="text-2xl">{rank.icon}</span>
              <span>Level {level} {rank.title}</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
