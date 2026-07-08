import { TerminalLine } from '../../types'

interface Props {
  line: TerminalLine
}

export default function OutputLine({ line }: Props) {
  const baseClass = 'font-mono terminal-text whitespace-pre-wrap break-all'

  if (line.type === 'input') {
    return (
      <div className={`${baseClass}`}>
        <span style={{ color: 'var(--text-secondary)' }}>user@bash-bootcamp:~$ </span>
        <span style={{ color: 'var(--text-accent)' }}>{line.text}</span>
      </div>
    )
  }

  if (line.type === 'error') {
    return (
      <div className={`${baseClass}`} style={{ color: 'var(--error)' }}>
        {line.text}
      </div>
    )
  }

  if (line.type === 'system') {
    return (
      <div className={`${baseClass}`} style={{ color: 'var(--info)', fontStyle: 'italic' }}>
        {line.text}
      </div>
    )
  }

  return (
    <div className={`${baseClass}`} style={{ color: 'var(--text-primary)' }}>
      {line.text}
    </div>
  )
}
