import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { subscribeChallenges, ArenaChallenge, ArenaChallengeInput, seedChallengesIfEmpty } from '../firebase/arenaChallenges'
import seedData from '../content/arena.json'

export default function ArenaPage() {
  const seedChallenges = seedData.challenges.map(c => ({ ...c, createdBy: '', createdAt: 0 })) as ArenaChallengeInput[]
  const [challenges, setChallenges] = useState<ArenaChallenge[]>(seedChallenges as ArenaChallenge[])
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState<ArenaChallenge | null>(null)
  const [flagInput, setFlagInput] = useState('')
  const [flagError, setFlagError] = useState('')
  const [flagSuccess, setFlagSuccess] = useState(false)
  const [firestoreError, setFirestoreError] = useState(false)

  const arenaSolved = useGameStore(s => s.arenaSolved)
  const arenaXp = useGameStore(s => s.arenaXp)
  const launchArenaChallenge = useGameStore(s => s.launchArenaChallenge)
  const solveArenaChallenge = useGameStore(s => s.solveArenaChallenge)
  const exitArenaChallenge = useGameStore(s => s.exitArenaChallenge)

  useEffect(() => {
    seedChallengesIfEmpty(seedChallenges).catch(() => {})
    try {
      const unsub = subscribeChallenges(list => {
        if (list.length > 0) setChallenges(list)
      })
      return unsub
    } catch {
      setFirestoreError(true)
    }
  }, [])

  const handleLaunch = (c: ArenaChallenge) => {
    if (arenaSolved.includes(c.id)) return
    setActive(c)
    setFlagInput('')
    setFlagError('')
    setFlagSuccess(false)
    launchArenaChallenge(c.id, c.setup)
  }

  const handleExit = () => {
    setActive(null)
    exitArenaChallenge()
  }

  const handleSubmitFlag = () => {
    if (!active) return
    const normalized = flagInput.trim().toLowerCase()
    const expected = active.flag.toLowerCase()
    if (normalized === expected) {
      setFlagSuccess(true)
      setFlagError('')
      solveArenaChallenge(active.id, active.xp)
    } else {
      setFlagError('Incorrect flag. Try again.')
    }
  }

  const difficultyBadge = (d: string) => {
    const colors: Record<string, string> = {
      easy: 'border-crt-green/30 text-crt-green',
      medium: 'border-yellow-500/30 text-yellow-500',
      hard: 'border-orange-500/30 text-orange-500',
      expert: 'border-red-500/30 text-red-500',
    }
    return <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${colors[d] || ''}`}>{d}</span>
  }

  // Active challenge view
  if (active) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">{active.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono text-white/30">{active.category.replace('_', ' ')}</span>
              {difficultyBadge(active.difficulty)}
              <span className="text-[10px] font-mono text-white/20">{active.xp} XP</span>
            </div>
          </div>
          <button onClick={handleExit} className="text-[10px] text-white/30 hover:text-white/60 font-mono border border-white/10 px-3 py-1.5 rounded-lg transition-colors">
            Exit
          </button>
        </div>

        <div className="bg-black/20 rounded-xl border border-white/5 p-4">
          <p className="text-xs text-white/70 font-mono leading-relaxed whitespace-pre-line">{active.brief}</p>
        </div>

        {active.hint && (
          <details className="group">
            <summary className="text-[10px] text-crt-green/50 hover:text-crt-green/80 font-mono cursor-pointer transition-colors">
              Show hint
            </summary>
            <p className="text-[10px] text-white/30 font-mono mt-2 leading-relaxed">{active.hint}</p>
          </details>
        )}

        {!flagSuccess ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                value={flagInput}
                onChange={e => { setFlagInput(e.target.value); setFlagError('') }}
                onKeyDown={e => e.key === 'Enter' && handleSubmitFlag()}
                placeholder="Enter flag..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-crt-green/40 placeholder:text-white/15"
              />
              <button onClick={handleSubmitFlag} className="px-4 py-3 rounded-xl bg-crt-green/15 border border-crt-green/25 text-crt-green text-sm font-mono hover:bg-crt-green/25 transition-colors">
                Submit
              </button>
            </div>
            {flagError && <p className="text-[10px] text-red-400/80 font-mono">{flagError}</p>}
          </div>
        ) : (
          <div className="bg-crt-green/10 border border-crt-green/20 rounded-xl p-4 text-center">
            <p className="text-crt-green font-mono text-sm">✓ Challenge solved!</p>
            <p className="text-[10px] text-crt-green/50 font-mono mt-1">+{active.xp} XP earned</p>
          </div>
        )}
      </div>
    )
  }

  // Challenge grid view
  const filtered = filter === 'all' ? challenges : challenges.filter(c => c.category === filter)
  const filters = ['all', 'forensics', 'file_puzzle', 'pipeline', 'mixed']

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">CTF Arena</h2>
        <p className="text-[10px] font-mono text-white/30 mt-0.5">
          {arenaSolved.length} solved · {arenaXp} arena XP
        </p>
      </div>

      {firestoreError && (
        <div className="mb-3 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-[10px] text-yellow-500/70 font-mono">
            Firestore blocked (ad blocker?) — showing bundled challenges only. Progress won't sync.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-mono transition-colors ${
              filter === f ? 'bg-crt-green/15 border-crt-green/30 text-crt-green' : 'border-white/10 text-white/30 hover:text-white/50'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(c => {
          const solved = arenaSolved.includes(c.id)
          return (
            <button
              key={c.id}
              onClick={() => handleLaunch(c)}
              className={`w-full text-left bg-surface-light rounded-xl border p-4 transition-all duration-150 hover:border-white/20 ${
                solved ? 'border-crt-green/15 opacity-60' : 'border-glass-border'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                  {c.category.replace('_', ' ')}
                </span>
                {difficultyBadge(c.difficulty)}
              </div>
              <h3 className="text-sm font-medium text-white mb-1">{c.title}</h3>
              <p className="text-[10px] text-white/30 font-mono line-clamp-2 leading-relaxed">
                {c.brief.split('\n')[0]}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-white/20 font-mono">{c.xp} XP</span>
                {solved && <span className="text-[10px] text-crt-green font-mono">✓ Solved</span>}
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-[10px] text-white/20 font-mono text-center py-8">No challenges in this category</p>
        )}
      </div>
    </div>
  )
}
