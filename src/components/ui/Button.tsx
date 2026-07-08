import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { spring } from '../../lib/motion'

type Variant = 'primary' | 'ghost' | 'terminal' | 'danger'

interface Props {
  children: ReactNode
  onClick?: () => void
  variant?: Variant
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

const styles: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--text-accent)', color: '#04140a', border: '1px solid var(--text-accent)', fontWeight: 700 },
  ghost: { background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' },
  terminal: { background: 'rgba(57,255,20,0.08)', color: 'var(--text-accent)', border: '1px solid var(--border-primary)', fontFamily: 'var(--font-display)' },
  danger: { background: 'transparent', color: 'var(--error)', border: '1px solid rgba(255,77,109,0.4)' },
}

export default function Button({ children, onClick, variant = 'primary', className = '', disabled, type = 'button' }: Props) {
  return (
    <motion.button
      type={type}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={spring}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={styles[variant]}
    >
      {children}
    </motion.button>
  )
}
