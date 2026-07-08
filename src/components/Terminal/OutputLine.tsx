import { useState, useCallback } from 'react'
import { TerminalLine } from '../../types'

interface Props {
  line: TerminalLine
}

export default function OutputLine({ line }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(line.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    })
  }, [line.text])

  const baseClass = 'font-mono terminal-text whitespace-pre-wrap break-all group relative'

  if (line.type === 'input') {
    return (
      <div className={baseClass}>
        <span style={{ color: 'var(--text-accent)' }}>$ </span>
        <span style={{ color: 'var(--text-accent)' }}>{line.text}</span>
        <button
          onClick={handleCopy}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center align-middle"
          style={{ color: 'var(--text-tertiary)' }}
          title="Copy"
        >
          {copied ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  if (line.type === 'error') {
    return (
      <div className={`${baseClass}`} style={{ color: 'var(--error)' }}>
        {line.text}
        <button
          onClick={handleCopy}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center align-middle"
          style={{ color: 'var(--text-tertiary)' }}
          title="Copy"
        >
          {copied ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  if (line.type === 'system') {
    return (
      <div className={`${baseClass}`} style={{ color: 'var(--info)' }}>
        <span style={{ opacity: 0.6 }}>:: </span>
        {line.text}
        <button
          onClick={handleCopy}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center align-middle"
          style={{ color: 'var(--text-tertiary)' }}
          title="Copy"
        >
          {copied ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className={`${baseClass}`} style={{ color: 'var(--text-secondary)' }}>
      {line.text}
      <button
        onClick={handleCopy}
        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center align-middle"
        style={{ color: 'var(--text-tertiary)' }}
        title="Copy"
      >
        {copied ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  )
}
