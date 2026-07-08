import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { getUnit } from '../../content'

export default function QuizPanel() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentTierId = useGameStore(s => s.currentTierId)
  const currentUnitIndex = useGameStore(s => s.currentUnitIndex)
  const completeQuiz = useGameStore(s => s.completeQuiz)

  const unit = getUnit(currentTierId, currentUnitIndex)
  const questions = unit?.quiz || []
  const question = questions[currentQuestion]
  const selected = selectedAnswers[currentQuestion]

  if (!questions.length || !question) {
    completeQuiz(0, 0)
    return null
  }

  const handleSelect = (index: number) => {
    if (submitted) return
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = index
    setSelectedAnswers(newAnswers)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const isCorrect = selected === question.correctIndex
    if (isCorrect) setScore(prev => prev + 1)
  }

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1)
      setSubmitted(false)
    } else {
      completeQuiz(score + (selected === question.correctIndex ? 1 : 0), questions.length)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-surface-light rounded-2xl border border-glass-border shadow-2xl shadow-black/40 overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-glass-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-xs">
                ?
              </div>
              <h3 className="text-sm font-semibold text-white">Quick Quiz</h3>
            </div>
            <span className="text-[11px] text-white/30 font-mono">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-sm text-white/90 mb-4 leading-relaxed">{question.question}</p>

          <div className="space-y-2">
            {question.options.map((option, i) => {
              let ring = 'border-white/10 hover:border-white/20 hover:bg-white/5'
              let bg = 'bg-white/[0.03]'
              let text = 'text-white/75'

              if (submitted) {
                if (i === question.correctIndex) {
                  ring = 'border-green-500/40 bg-green-500/10'
                  text = 'text-green-400'
                } else if (i === selected && i !== question.correctIndex) {
                  ring = 'border-red-500/30 bg-red-500/8'
                  text = 'text-red-400/70'
                } else {
                  ring = 'border-white/5'
                  bg = 'bg-transparent'
                  text = 'text-white/25'
                }
              } else if (i === selected) {
                ring = 'border-crt-green/40 bg-crt-green/8'
                text = 'text-crt-green/90'
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border ${ring} ${bg} ${text} text-sm transition-all duration-150 flex items-center gap-3`}
                >
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-mono shrink-0 ${
                    submitted
                      ? i === question.correctIndex
                        ? 'border-green-500/50 bg-green-500/20 text-green-400'
                        : i === selected
                          ? 'border-red-500/40 bg-red-500/15 text-red-400'
                          : 'border-white/10 text-white/20'
                      : i === selected
                        ? 'border-crt-green/50 bg-crt-green/15 text-crt-green'
                        : 'border-white/15 text-white/30'
                  }`}>
                    {submitted && i === question.correctIndex ? '✓' : submitted && i === selected ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selected === undefined}
              className="w-full py-2.5 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 font-mono text-sm hover:bg-blue-500/25 hover:border-blue-500/40 active:bg-blue-500/30 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-blue-500/15"
            >
              Submit Answer
            </button>
          ) : (
            <div className="space-y-3">
              <div className={`text-xs font-mono flex items-center gap-2 px-3 py-2 rounded-lg ${
                selected === question.correctIndex
                  ? 'bg-green-500/8 text-green-400 border border-green-500/15'
                  : 'bg-red-500/8 text-red-400/80 border border-red-500/15'
              }`}>
                <span>{selected === question.correctIndex ? '✓' : '✗'}</span>
                {selected === question.correctIndex
                  ? 'Correct! Well done.'
                  : `Incorrect. The answer was: ${question.options[question.correctIndex]}`
                }
              </div>
              <button
                onClick={handleNext}
                className="w-full py-2.5 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 font-mono text-sm hover:bg-blue-500/25 hover:border-blue-500/40 active:bg-blue-500/30 transition-all duration-150"
              >
                {currentQuestion + 1 < questions.length ? 'Next Question →' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
