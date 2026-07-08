import { useState, useEffect } from 'react'
import { subscribeChallenges, createChallenge, updateChallenge, deleteChallenge, ArenaChallenge, ArenaChallengeInput } from '../firebase/arenaChallenges'
import { useGameStore } from '../store/gameStore'
import ChallengeForm from '../components/Admin/ChallengeForm'

type View = 'list' | 'create' | 'edit'

export default function AdminPanel() {
  const [challenges, setChallenges] = useState<ArenaChallenge[]>([])
  const [view, setView] = useState<View>('list')
  const [editing, setEditing] = useState<ArenaChallenge | null>(null)
  const userId = useGameStore(s => s.userId)
  const isAdmin = useGameStore(s => s.isAdmin)

  useEffect(() => {
    const unsub = subscribeChallenges(list => setChallenges(list))
    return unsub
  }, [])

  const handleCreate = async (data: ArenaChallengeInput) => {
    await createChallenge({ ...data, createdBy: userId || '' })
    setView('list')
  }

  const handleUpdate = async (data: ArenaChallengeInput) => {
    await updateChallenge({ ...data, createdAt: editing?.createdAt || Date.now() })
    setView('list')
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    await deleteChallenge(id)
  }

  if (!isAdmin) {
    return <div className="p-6 text-center"><p className="text-xs text-red-400/60 font-mono">Access denied. Admin only.</p></div>
  }

  if (view === 'create') {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-sm font-semibold text-white mb-4">Create Challenge</h2>
        <ChallengeForm onSave={handleCreate} onCancel={() => setView('list')} />
      </div>
    )
  }

  if (view === 'edit' && editing) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-sm font-semibold text-white mb-4">Edit Challenge</h2>
        <ChallengeForm initial={editing} onSave={handleUpdate} onCancel={() => { setView('list'); setEditing(null) }} />
      </div>
    )
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Admin Panel</h2>
          <p className="text-[10px] text-white/30 font-mono mt-0.5">{challenges.length} challenges</p>
        </div>
        <button
          onClick={() => setView('create')}
          className="text-[10px] px-3 py-1.5 rounded-lg bg-crt-green/15 border border-crt-green/30 text-crt-green font-mono hover:bg-crt-green/25 transition-colors"
        >
          + New
        </button>
      </div>

      <div className="space-y-2">
        {challenges.map(c => (
          <div key={c.id} className="flex items-center gap-3 bg-surface-light rounded-xl border border-glass-border p-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{c.title}</span>
                <span className={`text-[10px] font-mono ${
                  c.difficulty === 'easy' ? 'text-crt-green' : c.difficulty === 'medium' ? 'text-yellow-500' : c.difficulty === 'hard' ? 'text-orange-500' : 'text-red-500'
                }`}>
                  {c.difficulty}
                </span>
              </div>
              <p className="text-[10px] text-white/30 font-mono mt-0.5">{c.category.replace('_', ' ')} · {c.xp} XP</p>
            </div>
            <button
              onClick={() => { setEditing(c); setView('edit') }}
              className="text-[10px] text-white/30 hover:text-white/60 font-mono px-2 py-1 border border-white/10 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-[10px] text-red-400/50 hover:text-red-400 font-mono px-2 py-1 border border-red-400/20 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
        {challenges.length === 0 && (
          <p className="text-[10px] text-white/20 font-mono text-center py-8">No challenges yet. Create one!</p>
        )}
      </div>
    </div>
  )
}
