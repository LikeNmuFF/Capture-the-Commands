import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { ObjectiveData } from '../types'
import { checkObjective } from '../utils/objectiveCheckers'

export function useTerminal() {
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  const terminalHistory = useGameStore(s => s.terminalHistory)

  const fillCommand = useCallback((cmd: string) => {
    setInput(cmd)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      fillCommand(customEvent.detail)
    }
    window.addEventListener('fill-command', handler)
    return () => window.removeEventListener('fill-command', handler)
  }, [fillCommand])

  const handleCommand = useCallback((cmd: string) => {
    if (!cmd.trim()) return

    const store = useGameStore.getState()
    store.executeCommand(cmd)

    setCommandHistory(prev => [...prev, cmd])
    setHistoryIndex(-1)
    setInput('')

    setTimeout(() => {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)

    // Check objectives with fresh state after command execution
    const freshState = useGameStore.getState()
    if (freshState.phase === 'mission') {
      const objs = freshState.getCurrentObjectives()
      if (objs.length > 0) {
        const allMet = objs.every(obj =>
          checkObjective(obj as ObjectiveData, freshState.env, freshState.usedCommands)
        )
        if (allMet) {
          setTimeout(() => {
            freshState.advanceStep()
          }, 300)
        }
      }
    }
  }, [])

  const challengeObjectives = useGameStore(s => s.getChallengeObjectives)
  const env = useGameStore(s => s.env)
  const usedCommands = useGameStore(s => s.usedCommands)
  const phase = useGameStore(s => s.phase)

  const challengeObjectiveStatuses = useMemo(() => {
    if (phase !== 'challenge') return []
    return challengeObjectives().map(obj => ({
      description: obj.description,
      done: checkObjective(obj as ObjectiveData, env, usedCommands),
    }))
  }, [phase, challengeObjectives, env, usedCommands])

  const allChallengeMet = challengeObjectiveStatuses.length > 0 &&
    challengeObjectiveStatuses.every(o => o.done)

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1)
      setHistoryIndex(newIndex)
      setInput(commandHistory[newIndex])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const newIndex = historyIndex + 1
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    }
  }, [input, handleCommand, historyIndex, commandHistory])

  return {
    input,
    setInput,
    inputRef,
    terminalEndRef,
    handleKeyDown,
    terminalHistory,
    historyIndex,
    commandHistory,
    fillCommand,
    challengeObjectiveStatuses,
    allChallengeMet,
  }
}
