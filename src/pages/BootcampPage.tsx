import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import AppShell from '../components/Layout/AppShell'
import Terminal from '../components/Terminal/Terminal'
import QuizPanel from '../components/Quiz/QuizPanel'

export default function BootcampPage() {
  const startUnit = useGameStore(s => s.startUnit)
  const currentUnitIndex = useGameStore(s => s.currentUnitIndex)
  const completedUnits = useGameStore(s => s.completedUnits)
  const phase = useGameStore(s => s.phase)
  const advanceToNextUnit = useGameStore(s => s.advanceToNextUnit)
  const unitJustCompleted = useGameStore(s => s.unitJustCompleted)
  const tierJustCompleted = useGameStore(s => s.tierJustCompleted)

  useEffect(() => {
    if (currentUnitIndex === 0 && completedUnits.length === 0) {
      startUnit(1, 0)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <AppShell
        terminal={<Terminal />}
        quizPanel={phase === 'quiz' ? <QuizPanel /> : null}
      />

      {/* Unit complete overlay (not tier completion — that's handled by BeltCeremony) */}
      {phase === 'completed' && unitJustCompleted && tierJustCompleted === null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-light rounded-2xl border border-glass-border p-8 shadow-2xl max-w-sm w-full mx-4 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-white text-lg font-semibold mb-2">Unit Complete!</h2>
            <p className="text-sm text-white/60 mb-6">You earned XP and unlocked the next challenge.</p>
            <button
              onClick={advanceToNextUnit}
              className="w-full py-3 rounded-xl bg-crt-green/20 border border-crt-green/30 text-crt-green font-mono text-sm hover:bg-crt-green/30 transition-colors animate-pulse-glow"
            >
              Continue to Next Unit →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
