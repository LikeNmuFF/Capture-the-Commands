import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'

interface Props {
  unitId: string
}

export default function FlagInput({ unitId }: Props) {
  const [flag, setFlag] = useState('')
  const [error, setError] = useState('')
  const submitFlag = useGameStore(s => s.submitFlag)
  const phase = useGameStore(s => s.phase)

  if (phase !== 'challenge') return null

  const handleSubmit = () => {
    if (!flag.trim()) {
      setError('Enter a flag first')
      return
    }
    setError('')
    const valid = submitFlag(flag.trim())
    if (!valid) {
      setError('Incorrect flag. Try again!')
    }
  }

  return (
    <div>
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={flag}
            onChange={e => setFlag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="flag{...}"
            className="w-full bg-black/40 border border-amber-500/20 rounded-lg px-3 py-2 text-xs text-white font-mono outline-none transition-all duration-200 placeholder:text-white/15 focus:border-amber-500/40 focus:bg-black/50"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-400 font-mono text-xs hover:bg-amber-500/25 hover:border-amber-500/40 active:bg-amber-500/30 transition-all duration-150"
        >
          Submit
        </button>
      </div>
      {error && (
        <p className="text-red-400/80 text-[10px] mt-1.5 font-mono flex items-center gap-1">
          <span>✗</span> {error}
        </p>
      )}
    </div>
  )
}
