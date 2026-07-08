import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { getUnit } from '../../content'
import { useTheme } from '../../contexts/ThemeContext'
import ProgressBar from '../ui/ProgressBar'

export default function QuizPanel() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentTierId = useGameStore(s => s.currentTierId)
  const currentUnitIndex = useGameStore(s => s.currentUnitIndex)
  const completeQuiz = useGameStore(s => s.completeQuiz)
  const { isDark } = useTheme()

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

  const optionLabels = ['A', 'B', 'C', 'D']

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: 'var(--overlay)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px var(--border-primary)'
            : '0 25px 50px -12px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: isDark ? 'rgba(88,166,255,0.12)' : 'rgba(9,105,218,0.1)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <svg className="w-4 h-4" style={{ color: 'var(--info)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Assessment</h3>
            </div>
            <span className="text-[11px] font-mono font-bold" style={{ color: 'var(--text-accent)' }}>
              Q{currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <ProgressBar
            value={currentQuestion + 1}
            max={questions.length}
            height={4}
            gradient="linear-gradient(90deg, var(--info), var(--text-accent))"
          />
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm mb-4 leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
                {question.question}
              </p>

              <div className="space-y-2">
                {question.options.map((option, i) => {
                  let borderColor = 'var(--border-primary)'
                  let bgColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
                  let textColor = 'var(--text-secondary)'
                  let labelBg = 'transparent'
                  let labelBorder = 'var(--border-primary)'
                  let labelColor = 'var(--text-tertiary)'

                  if (submitted) {
                    if (i === question.correctIndex) {
                      borderColor = 'var(--success)'
                      bgColor = isDark ? 'rgba(40,200,64,0.08)' : 'rgba(26,127,55,0.06)'
                      textColor = 'var(--success)'
                      labelBg = 'var(--success)'
                      labelBorder = 'var(--success)'
                      labelColor = '#fff'
                    } else if (i === selected && i !== question.correctIndex) {
                      borderColor = 'var(--error)'
                      bgColor = isDark ? 'rgba(255,95,87,0.06)' : 'rgba(209,36,47,0.06)'
                      textColor = 'var(--error)'
                      labelBg = 'var(--error)'
                      labelBorder = 'var(--error)'
                      labelColor = '#fff'
                    } else {
                      borderColor = 'var(--border-subtle)'
                      bgColor = 'transparent'
                      textColor = 'var(--text-tertiary)'
                    }
                  } else if (i === selected) {
                    borderColor = 'var(--text-accent)'
                    bgColor = isDark ? 'rgba(0,255,65,0.06)' : 'rgba(10,156,46,0.06)'
                    textColor = 'var(--text-accent)'
                    labelBg = 'var(--text-accent)'
                    labelBorder = 'var(--text-accent)'
                    labelColor = '#04140a'
                  }

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleSelect(i)}
                      whileHover={submitted ? undefined : { scale: 1.01 }}
                      whileTap={submitted ? undefined : { scale: 0.99 }}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3"
                      style={{
                        borderColor,
                        borderWidth: '1px',
                        backgroundColor: bgColor,
                        color: textColor,
                      }}
                    >
                      <span
                        className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-all duration-200"
                        style={{
                          backgroundColor: labelBg,
                          borderColor: labelBorder,
                          borderWidth: '1px',
                          color: labelColor,
                        }}
                      >
                        {submitted && i === question.correctIndex
                          ? '✓'
                          : submitted && i === selected && i !== question.correctIndex
                            ? '✗'
                            : optionLabels[i]}
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          {!submitted ? (
            <motion.button
              onClick={handleSubmit}
              disabled={selected === undefined}
              whileHover={selected === undefined ? undefined : { scale: 1.01 }}
              whileTap={selected === undefined ? undefined : { scale: 0.99 }}
              className="w-full py-2.5 rounded-xl font-mono text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isDark ? 'rgba(88,166,255,0.12)' : 'rgba(9,105,218,0.08)',
                borderColor: 'var(--info)',
                borderWidth: '1px',
                color: 'var(--info)',
              }}
            >
              Submit Answer
            </motion.button>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-mono flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: selected === question.correctIndex
                      ? (isDark ? 'rgba(40,200,64,0.08)' : 'rgba(26,127,55,0.06)')
                      : (isDark ? 'rgba(255,95,87,0.06)' : 'rgba(209,36,47,0.06)'),
                    color: selected === question.correctIndex ? 'var(--success)' : 'var(--error)',
                    border: `1px solid ${selected === question.correctIndex ? 'var(--success)' : 'var(--error)'}`,
                  }}
                >
                  <span className="text-sm font-bold">{selected === question.correctIndex ? '✓' : '✗'}</span>
                  {selected === question.correctIndex
                    ? 'Correct! Well done.'
                    : `Incorrect. The answer was: ${question.options[question.correctIndex]}`
                  }
                </motion.div>
              </AnimatePresence>
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-2.5 rounded-xl font-mono text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: isDark ? 'rgba(88,166,255,0.12)' : 'rgba(9,105,218,0.08)',
                  borderColor: 'var(--info)',
                  borderWidth: '1px',
                  color: 'var(--info)',
                }}
              >
                {currentQuestion + 1 < questions.length ? 'Next Question →' : 'See Results'}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
