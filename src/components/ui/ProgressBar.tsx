import { motion } from 'framer-motion'

interface Props {
  value: number
  max?: number
  gradient?: string
  height?: number
}

export default function ProgressBar({ value, max = 100, gradient = 'linear-gradient(90deg, var(--text-accent), var(--accent-cyan))', height = 6 }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: 'rgba(120,160,200,0.12)' }}>
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        style={{ background: gradient, boxShadow: '0 0 10px rgba(57,255,20,0.4)' }}
      />
    </div>
  )
}
