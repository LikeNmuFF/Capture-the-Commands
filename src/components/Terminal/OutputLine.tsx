import { TerminalLine } from '../../types'

interface Props {
  line: TerminalLine
}

export default function OutputLine({ line }: Props) {
  const baseClass = 'font-mono terminal-text whitespace-pre-wrap break-all'

  if (line.type === 'input') {
    return (
      <div className={`${baseClass} text-crt-green`}>
        <span className="text-white/60">user@bash-bootcamp:~$ </span>
        {line.text}
      </div>
    )
  }

  if (line.type === 'error') {
    return (
      <div className={`${baseClass} text-red-400`}>
        {line.text}
      </div>
    )
  }

  if (line.type === 'system') {
    return (
      <div className={`${baseClass} text-blue-300/80 italic`}>
        {line.text}
      </div>
    )
  }

  return (
    <div className={`${baseClass} text-gray-200`}>
      {line.text}
    </div>
  )
}
