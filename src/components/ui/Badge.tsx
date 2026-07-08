import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  color?: string
  className?: string
}

export default function Badge({ children, color = 'var(--text-accent)', className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${className}`}
      style={{ color, border: `1px solid ${color}`, background: `${color}1a` }}
    >
      {children}
    </span>
  )
}
