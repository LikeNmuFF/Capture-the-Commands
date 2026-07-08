import { useState } from 'react'
import { ArenaChallenge, ArenaChallengeInput } from '../../firebase/arenaChallenges'

interface Props {
  initial?: ArenaChallenge | null
  onSave: (challenge: ArenaChallengeInput) => void
  onCancel: () => void
}

export default function ChallengeForm({ initial, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title || '')
  const [category, setCategory] = useState(initial?.category || 'forensics')
  const [difficulty, setDifficulty] = useState(initial?.difficulty || 'easy')
  const [brief, setBrief] = useState(initial?.brief || '')
  const [hint, setHint] = useState(initial?.hint || '')
  const [flag, setFlag] = useState(initial?.flag || '')
  const [directories, setDirectories] = useState<string[]>(initial?.setup?.directories || [])
  const [files, setFiles] = useState<{ path: string; content: string }[]>(initial?.setup?.files || [])

  const xpMap = { easy: 50, medium: 100, hard: 200, expert: 300 }

  const handleSave = () => {
    if (!title.trim() || !brief.trim() || !flag.trim()) return
    const id = initial?.id || `arena_${Date.now()}`
    onSave({
      id,
      title: title.trim(),
      category: category as any,
      difficulty: difficulty as any,
      xp: xpMap[difficulty as keyof typeof xpMap],
      brief: brief.trim(),
      hint: hint.trim(),
      flag: flag.trim(),
      createdBy: '',
      setup: { directories, files },
    })
  }

  const addDir = () => setDirectories([...directories, ''])
  const updateDir = (i: number, v: string) => {
    const d = [...directories]; d[i] = v; setDirectories(d)
  }
  const removeDir = (i: number) => setDirectories(directories.filter((_, j) => j !== i))

  const addFile = () => setFiles([...files, { path: '', content: '' }])
  const updateFile = (i: number, f: { path?: string; content?: string }) => {
    const fl = [...files]; fl[i] = { ...fl[i], ...f }; setFiles(fl)
  }
  const removeFile = (i: number) => setFiles(files.filter((_, j) => j !== i))

  return (
    <div className="space-y-4">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Challenge title"
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-crt-green/40 placeholder:text-white/15"
      />

      <div className="flex gap-3">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-crt-green/40"
        >
          <option value="forensics">Forensics</option>
          <option value="file_puzzle">File Puzzle</option>
          <option value="pipeline">Pipeline</option>
          <option value="mixed">Mixed</option>
        </select>
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-crt-green/40"
        >
          <option value="easy">Easy (50 XP)</option>
          <option value="medium">Medium (100 XP)</option>
          <option value="hard">Hard (200 XP)</option>
          <option value="expert">Expert (300 XP)</option>
        </select>
      </div>

      <textarea
        value={brief}
        onChange={e => setBrief(e.target.value)}
        placeholder="Brief (scenario description shown to player)"
        rows={4}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-crt-green/40 resize-y placeholder:text-white/15"
      />

      <textarea
        value={hint}
        onChange={e => setHint(e.target.value)}
        placeholder="Hint (optional — shown when player clicks 'Show hint')"
        rows={2}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-crt-green/40 resize-y placeholder:text-white/15"
      />

      <input
        value={flag}
        onChange={e => setFlag(e.target.value)}
        placeholder="Flag (e.g. flag{...})"
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-crt-green/40 placeholder:text-white/15"
      />

      {/* Directories */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-white/40 font-mono">Directories to create</span>
          <button onClick={addDir} className="text-[10px] text-crt-green/60 hover:text-crt-green font-mono transition-colors">+ Add</button>
        </div>
        {directories.map((d, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <input
              value={d}
              onChange={e => updateDir(i, e.target.value)}
              placeholder="/path/to/directory"
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-crt-green/40 placeholder:text-white/15"
            />
            <button onClick={() => removeDir(i)} className="text-[10px] text-red-400/50 hover:text-red-400 font-mono transition-colors">✕</button>
          </div>
        ))}
      </div>

      {/* Files */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-white/40 font-mono">Files to create</span>
          <button onClick={addFile} className="text-[10px] text-crt-green/60 hover:text-crt-green font-mono transition-colors">+ Add</button>
        </div>
        {files.map((f, i) => (
          <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-3 mb-2 space-y-2">
            <div className="flex gap-2 items-center">
              <input
                value={f.path}
                onChange={e => updateFile(i, { path: e.target.value })}
                placeholder="/path/to/file.txt"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-crt-green/40 placeholder:text-white/15"
              />
              <button onClick={() => removeFile(i)} className="text-[10px] text-red-400/50 hover:text-red-400 font-mono transition-colors">✕</button>
            </div>
            <textarea
              value={f.content}
              onChange={e => updateFile(i, { content: e.target.value })}
              placeholder="File content (use '__generated__' for programmatic content)"
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-crt-green/40 resize-y placeholder:text-white/15"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          className="flex-1 py-3 rounded-xl bg-crt-green/15 border border-crt-green/25 text-crt-green font-mono text-sm hover:bg-crt-green/25 transition-colors"
        >
          {initial ? 'Update Challenge' : 'Create Challenge'}
        </button>
        <button
          onClick={onCancel}
          className="py-3 px-5 rounded-xl border border-white/10 text-white/40 font-mono text-sm hover:text-white/60 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
