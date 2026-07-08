import { useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { checkObjective } from '../utils/objectiveCheckers'
import { ObjectiveData } from '../types'

export function useMission() {
  const env = useGameStore(s => s.env)
  const usedCommands = useGameStore(s => s.usedCommands)
  const currentStepIndex = useGameStore(s => s.currentStepIndex)
  const phase = useGameStore(s => s.phase)
  const getCurrentObjectives = useGameStore(s => s.getCurrentObjectives)

  const objectives = useMemo(() => {
    if (phase !== 'mission') return []
    return getCurrentObjectives()
  }, [phase, getCurrentObjectives, currentStepIndex, env, usedCommands])

  const objectiveStatuses = useMemo(() => {
    return objectives.map(obj => ({
      description: obj.description,
      done: checkObjective(obj as ObjectiveData, env, usedCommands),
    }))
  }, [objectives, env, usedCommands])

  const allComplete = useMemo(() => {
    return objectiveStatuses.length > 0 && objectiveStatuses.every(o => o.done)
  }, [objectiveStatuses])

  return {
    objectives: objectiveStatuses,
    allComplete,
    hasObjectives: objectiveStatuses.length > 0,
  }
}
