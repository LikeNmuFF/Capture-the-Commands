import { Variants, Transition } from 'framer-motion'

export const spring: Transition = { type: 'spring', stiffness: 320, damping: 30 }
export const softSpring: Transition = { type: 'spring', stiffness: 180, damping: 24 }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: softSpring },
}

export const pageSweep: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
  show: { opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const glow = (color = 'var(--text-accent)'): React.CSSProperties => ({
  boxShadow: `0 0 0 1px ${color}, 0 0 18px ${color}`,
})
