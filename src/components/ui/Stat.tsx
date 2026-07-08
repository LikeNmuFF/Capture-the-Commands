import { ReactNode } from 'react'

interface Props {
  label: string
  value: ReactNode
  sub?: string
}

export default function Stat({ label, value, sub }: Props) {
  return (
    <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(120,160,200,0.06)', border: '1px solid var(--border-subtle)' }}>
      <div className="text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
      <div className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{value}</div>
      {sub && <div className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>{sub}</div>}
    </div>
  )
}
