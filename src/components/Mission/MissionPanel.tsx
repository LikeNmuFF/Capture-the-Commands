import { useMission } from '../../hooks/useMission'
import { useGameStore } from '../../store/gameStore'
import HintButton from './HintButton'

export default function MissionPanel() {
  const { objectives, allComplete, hasObjectives } = useMission()
  const phase = useGameStore(s => s.phase)
  const getCurrentStepDescription = useGameStore(s => s.getCurrentStepDescription)
  const getCurrentUnit = useGameStore(s => s.getCurrentUnit)
  const currentStepIndex = useGameStore(s => s.currentStepIndex)
  const unitJustCompleted = useGameStore(s => s.unitJustCompleted)
  const currentTierId = useGameStore(s => s.currentTierId)
  const currentUnitIndex = useGameStore(s => s.currentUnitIndex)
  const xp = useGameStore(s => s.xp)

  const unit = getCurrentUnit()
  const totalSteps = unit?.missionSteps.length || 0

  if (phase === 'completed') {
    return (
      <div className="flex flex-col bg-glass backdrop-blur-xl rounded-xl border border-glass-border p-5 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-crt-green/20 flex items-center justify-center text-lg">
            ✓
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Unit Complete!</h2>
            <p className="text-xs text-crt-green/80 font-mono">+100 XP earned</p>
          </div>
        </div>
        <p className="text-xs text-white/50 leading-relaxed">Great work! Click "Continue to Next Unit" to proceed.</p>
      </div>
    )
  }

  const doneCount = objectives.filter(o => o.done).length

  return (
    <div className="flex flex-col bg-glass backdrop-blur-xl rounded-xl border border-glass-border shadow-lg">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-glass-border/50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
            Tier {currentTierId} · Unit {currentUnitIndex + 1}
          </span>
          <span className="text-[10px] text-white/30 font-mono">
            {xp} XP
          </span>
        </div>
        <h2 className="text-base font-semibold text-white truncate tracking-tight">
          {unit?.title || 'Loading...'}
        </h2>
        {unit && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {unit.commands.map(cmd => (
              <span
                key={cmd}
                className="text-[10px] font-mono bg-crt-green-dark/60 text-crt-green/90 px-2 py-0.5 rounded-md border border-crt-green/20"
              >
                {cmd}
              </span>
            ))}
          </div>
        )}
      </div>

      {phase === 'mission' && (
        <div className="p-4 space-y-3">
          {/* Step progress */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-crt-green to-crt-green-dim rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(currentStepIndex / Math.max(totalSteps, 1)) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-white/30 font-mono shrink-0">
              Step {currentStepIndex + 1}/{totalSteps}
            </span>
          </div>

          {/* Current instruction card */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/8">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 font-mono">Mission</div>
            <p className="text-xs text-white/85 leading-relaxed">
              {getCurrentStepDescription()}
            </p>
          </div>

          {/* Objectives */}
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
              <span>Objectives</span>
              {hasObjectives && (
                <span className="text-white/30">
                  {doneCount}/{objectives.length}
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              {hasObjectives ? (
                objectives.map((obj, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 p-2 rounded-lg transition-all duration-300 ${
                      obj.done
                        ? 'bg-crt-green/5 border border-crt-green/15'
                        : 'bg-white/3 border border-transparent'
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-all duration-300 shrink-0 ${
                        obj.done
                          ? 'bg-crt-green border-crt-green text-surface'
                          : 'border-white/20 text-transparent'
                      }`}
                    >
                      {obj.done ? '✓' : ''}
                    </div>
                    <span
                      className={`text-xs leading-relaxed transition-all duration-300 ${
                        obj.done
                          ? 'text-white/50 line-through'
                          : 'text-white/70'
                      }`}
                    >
                      {obj.description}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/30 italic">Complete the mission step above</p>
              )}
            </div>
          </div>

          {allComplete && (
            <div className="text-xs text-crt-green font-mono flex items-center gap-2 bg-crt-green/5 rounded-lg p-2.5 border border-crt-green/15 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-crt-green animate-pulse" />
              All objectives met! Advancing...
            </div>
          )}
        </div>
      )}

      {phase === 'quiz' && (
        <div className="p-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
            ?
          </div>
          <p className="text-xs text-white/50 leading-relaxed max-w-[180px]">
            Quick quiz time! Test your understanding before the challenge.
          </p>
        </div>
      )}

      {phase === 'challenge' && (
        <div className="p-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
            ⚔
          </div>
          <p className="text-xs text-white/50 leading-relaxed max-w-[180px]">
            Challenge mode active. Find the flag using your terminal below.
          </p>
        </div>
      )}

      <div className="px-4 pb-4">
        <HintButton />
      </div>
    </div>
  )
}
