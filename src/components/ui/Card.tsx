import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'
import { fadeUp } from '../../lib/motion'

interface Props {
  children: ReactNode
  title?: string
  icon?: ReactNode
  className?: string
  variants?: Variants
  hover?: boolean
}

export default function Card({ children, title, icon, className = '', variants = fadeUp, hover = true }: Props) {
  return (
    <motion.div
      variants={variants}
      whileHover={hover ? { y: -3 } : undefined}
      className={`relative rounded-2xl backdrop-blur-xl overflow-hidden ${className}`}
      style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-md)' }}
    >
      {title && (
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          {icon}
          <span className="text-[11px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-tertiary)' }}>{title}</span>
        </div>
      )}
      {children}
    </motion.div>
  )
}
