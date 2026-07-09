import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Environment, TerminalLine, Unit } from '../types'
import { createEnvironment } from '../engine/Environment'
import { parseAndExecute, registerBuiltins } from '../engine/CommandParser'
import { content, getUnit } from '../content'
import { ObjectiveData } from '../types'
import { verifyFlag } from '../utils/flags'
import { getLevel } from '../utils/levels'
import * as VirtualFS from '../engine/VirtualFS'
import { ToastItem } from '../components/common/XPToast'
import { applyArenaSetup, ChallengeSetup } from '../utils/arenaSetup'

registerBuiltins()

export type Phase = 'mission' | 'quiz' | 'challenge' | 'completed'

export interface GameState {
  xp: number
  currentTierId: number
  currentUnitIndex: number
  currentStepIndex: number
  phase: Phase
  completedUnits: string[]
  unlockedUnits: string[]
  terminalHistory: TerminalLine[]
  env: Environment
  usedCommands: string[]
  quizScore: number | null
  unitJustCompleted: boolean
  tierJustCompleted: number | null
  xpToasts: ToastItem[]
  toastIdCounter: number
  userId: string | null
  isAdmin: boolean
  arenaSolved: string[]
  arenaXp: number
  activeArenaChallengeId: string | null
}

export interface GameActions {
  executeCommand: (input: string) => TerminalLine[]
  completeQuiz: (correct: number, total: number) => void
  submitFlag: (flag: string) => boolean
  advanceToNextUnit: () => void
  advanceStep: () => void
  reset: () => void
  startUnit: (tierId: number, unitIndex: number) => void
  clearToasts: () => void
  clearTierComplete: () => void
  getCurrentUnit: () => Unit | undefined
  getCurrentObjectives: () => ObjectiveData[]
  getChallengeObjectives: () => ObjectiveData[]
  getCurrentStepDescription: () => string
  getCurrentStepHint: () => string
  setUserId: (uid: string | null) => void
  hydrateState: (partial: Partial<Pick<GameState, 'xp' | 'currentTierId' | 'currentUnitIndex' | 'currentStepIndex' | 'phase' | 'completedUnits' | 'unlockedUnits'>>) => void
  setAdmin: (admin: boolean) => void
  solveArenaChallenge: (challengeId: string, xp: number) => void
  launchArenaChallenge: (challengeId: string, setup: ChallengeSetup) => void
  exitArenaChallenge: () => void
}

function createInitialEnv(): Environment {
  return createEnvironment()
}

function setupUnitFS(env: Environment, unitId: string) {
  if (unitId === 't1u1') {
    const docsPath = VirtualFS.resolvePath(env.cwd, 'Documents')
    const flagPath = docsPath + '/.secret'
    const node = VirtualFS.getNode(env.fs, VirtualFS.getParentPath(flagPath))
    if (node) {
      VirtualFS.touch(env.fs, flagPath)
      VirtualFS.writeFile(env.fs, flagPath, 'flag{n1c3_n4v1g4t10n}\n')
    }
  }
  if (unitId === 't1u2') {
    const mainSh = VirtualFS.resolvePath(env.cwd, 'project/src/main.sh')
    VirtualFS.mkdir(env.fs, VirtualFS.resolvePath(env.cwd, 'project'))
    VirtualFS.mkdir(env.fs, VirtualFS.resolvePath(env.cwd, 'project/src'))
    VirtualFS.touch(env.fs, mainSh)
    VirtualFS.writeFile(env.fs, mainSh, '#!/bin/bash\necho "flag{m4k3r_0f_th1ngs}"\n')
  }
  if (unitId === 't2u4') {
    const secretLog = VirtualFS.resolvePath(env.cwd, 'secret_log.txt')
    const node = VirtualFS.getNode(env.fs, VirtualFS.getParentPath(secretLog))
    if (node) {
      const lines = Array.from({ length: 100 }, (_, i) =>
        i === 41 ? 'flag{h34d_t41l_ch41n}' : `Line ${i + 1}`
      )
      VirtualFS.touch(env.fs, secretLog)
      VirtualFS.writeFile(env.fs, secretLog, lines.join('\n'))
    }
  }
  if (unitId === 't2u3') {
    const downPath = VirtualFS.resolvePath(env.cwd, 'Downloads')
    if (!VirtualFS.pathExists(env.fs, downPath)) {
      VirtualFS.mkdir(env.fs, downPath)
    }
    const junkFiles = ['junk1.txt', 'junk2.txt', 'note.txt', 'old_project']
    for (const f of junkFiles) {
      const fp = downPath + '/' + f
      if (f === 'old_project') {
        VirtualFS.mkdir(env.fs, fp)
        VirtualFS.touch(env.fs, fp + '/old_file.txt')
      } else {
        VirtualFS.touch(env.fs, fp)
      }
    }
  }
  if (unitId === 't1u4') {
    const mazePath = VirtualFS.resolvePath(env.cwd, '/maze/room1/room2/room3')
    VirtualFS.mkdir(env.fs, VirtualFS.resolvePath(env.cwd, '/maze'))
    VirtualFS.mkdir(env.fs, VirtualFS.resolvePath(env.cwd, '/maze/room1'))
    VirtualFS.mkdir(env.fs, VirtualFS.resolvePath(env.cwd, '/maze/room1/room2'))
    VirtualFS.mkdir(env.fs, mazePath)
    const flagFile = mazePath + '/.flag'
    VirtualFS.touch(env.fs, flagFile)
    VirtualFS.writeFile(env.fs, flagFile, 'flag{p4th_tr4v3rs3r}\n')
  }
  if (unitId === 't1u5') {
    const docs = VirtualFS.resolvePath(env.cwd, 'Documents')
    const a = docs + '/part_a.txt'
    const b = docs + '/part_b.txt'
    VirtualFS.touch(env.fs, a)
    VirtualFS.writeFile(env.fs, a, 'flag{f1l3_\n')
    VirtualFS.touch(env.fs, b)
    VirtualFS.writeFile(env.fs, b, 'd3t3ct1v3}\n')
  }
  if (unitId === 't2u6') {
    const downPath = VirtualFS.resolvePath(env.cwd, 'Downloads')
    if (!VirtualFS.pathExists(env.fs, downPath)) {
      VirtualFS.mkdir(env.fs, downPath)
    }
    const files = ['photo.jpg', 'report.pdf', 'video.mp4', 'temp.tmp', 'sunset.jpg', 'invoice.pdf', 'movie.mp4', 'cache.tmp', 'logo.jpg', 'readme.pdf']
    for (const f of files) {
      VirtualFS.touch(env.fs, downPath + '/' + f)
    }
  }
  if (unitId === 't3u1') {
    const logFile = VirtualFS.resolvePath(env.cwd, 'access.log')
    const lines = Array.from({ length: 50 }, (_, i) => {
      const entries = [
        `192.168.1.${i % 10} - GET /index.html 200`,
        `10.0.0.${i % 5} - POST /login.php 302`,
        `172.16.0.${i % 8} - GET /images/logo.png 304`,
        `192.168.1.${(i + 3) % 10} - ERROR /api/data 500`,
        `10.0.0.${(i + 7) % 5} - GET /about.html 200`,
      ]
      return entries[i % entries.length]
    })
    lines[23] = '192.168.1.5 - GET /flag.html 200 FLAG=flag{gr3p_1s_y0ur_fr13nd}'
    VirtualFS.touch(env.fs, logFile)
    VirtualFS.writeFile(env.fs, logFile, lines.join('\n'))
  }
  if (unitId === 't3u2') {
    const deepDir = VirtualFS.resolvePath(env.cwd, 'deep/hidden/trove')
    VirtualFS.mkdir(env.fs, VirtualFS.resolvePath(env.cwd, 'deep'))
    VirtualFS.mkdir(env.fs, VirtualFS.resolvePath(env.cwd, 'deep/hidden'))
    VirtualFS.mkdir(env.fs, deepDir)
    VirtualFS.touch(env.fs, deepDir + '/flag.txt')
    VirtualFS.writeFile(env.fs, deepDir + '/flag.txt', 'flag{f1nd_4nd_y3_sh4ll_r3c31v3}\n')
    for (let i = 0; i < 20; i++) {
      VirtualFS.touch(env.fs, deepDir + `/filler${i}.txt`)
    }
  }
  if (unitId === 't3u3') {
    const dataFile = VirtualFS.resolvePath(env.cwd, 'data.txt')
    const lines: string[] = []
    for (let i = 0; i < 1000; i++) {
      lines.push(String(Math.floor(Math.random() * 100000)))
    }
    lines[572] = 'flag{c0unt_0n_y0urs3lf}'
    VirtualFS.touch(env.fs, dataFile)
    VirtualFS.writeFile(env.fs, dataFile, lines.join('\n'))
  }
  if (unitId === 't3u4') {
    const surveyFile = VirtualFS.resolvePath(env.cwd, 'survey.txt')
    const responses = [
      'apple', 'banana', 'apple', 'cherry', 'banana',
      'apple', 'date', 'cherry', 'apple', 'elderberry',
      'banana', 'apple', 'fig', 'cherry', 'banana',
      'apple', 'flag{s0rt3d_uniq_f1lt3r}', 'banana', 'apple', 'cherry',
      'banana', 'apple', 'date', 'cherry', 'apple',
      'fig', 'banana', 'apple', 'cherry', 'banana',
    ]
    VirtualFS.touch(env.fs, surveyFile)
    VirtualFS.writeFile(env.fs, surveyFile, responses.join('\n'))
  }
  if (unitId === 't3u5') {
    const puzzleFile = VirtualFS.resolvePath(env.cwd, 'puzzle.log')
    const lines: string[] = []
    for (let i = 0; i < 100; i++) {
      lines.push(`entry_${i}: ${Math.random().toString(36).slice(2, 10)}`)
    }
    lines[43] = 'entry_43: secret_code=flag{p1p3s_m4k3_p0w3r}'
    lines[67] = 'entry_67: secret_code=flag{p1p3s_m4k3_p0w3r}'
    VirtualFS.touch(env.fs, puzzleFile)
    VirtualFS.writeFile(env.fs, puzzleFile, lines.join('\n'))
  }
}

function pushToast(set: any, get: any, toast: Omit<ToastItem, 'id'>) {
  const id = `toast-${get().toastIdCounter}`
  set({
    xpToasts: [...get().xpToasts, { ...toast, id }],
    toastIdCounter: get().toastIdCounter + 1,
  })
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      xp: 0,
      currentTierId: 1,
      currentUnitIndex: 0,
      currentStepIndex: 0,
      phase: 'mission',
      completedUnits: [],
      unlockedUnits: ['t1u1'],
      terminalHistory: [],
      env: createInitialEnv(),
      usedCommands: [],
      quizScore: null,
      unitJustCompleted: false,
      tierJustCompleted: null,
      userId: null,
      isAdmin: false,
      arenaSolved: [],
      arenaXp: 0,
      activeArenaChallengeId: null,
      xpToasts: [],
      toastIdCounter: 0,

      setUserId: (uid: string | null) => set({ userId: uid }),
      setAdmin: (admin: boolean) => set({ isAdmin: admin }),

      solveArenaChallenge: (challengeId: string, xp: number) => {
        const state = get()
        if (state.arenaSolved.includes(challengeId)) return
        set({
          arenaSolved: [...state.arenaSolved, challengeId],
          arenaXp: state.arenaXp + xp,
          xp: state.xp + xp,
        })
        pushToast(set, get, { amount: xp, type: 'xp', message: `Arena: +${xp} XP (challenge solved!)` })
      },

      launchArenaChallenge: (challengeId: string, setup: ChallengeSetup) => {
        const env = createEnvironment()
        applyArenaSetup(env, challengeId, setup)
        set({ activeArenaChallengeId: challengeId, env, terminalHistory: [], usedCommands: [] })
      },

      exitArenaChallenge: () => {
        const env = createEnvironment()
        set({ activeArenaChallengeId: null, env, terminalHistory: [], usedCommands: [] })
      },

      hydrateState: (partial) => {
        const newEnv = createInitialEnv()
        if (partial.phase === 'challenge') {
          const unit = getUnit(partial.currentTierId!, partial.currentUnitIndex!)
          if (unit) setupUnitFS(newEnv, unit.id)
        }
        set({ ...partial, terminalHistory: [], env: newEnv, usedCommands: [], xpToasts: [], quizScore: null, unitJustCompleted: false, tierJustCompleted: null })
      },

      clearToasts: () => set({ xpToasts: [] }),
      clearTierComplete: () => set({ tierJustCompleted: null }),

      getCurrentUnit: () => {
        return getUnit(get().currentTierId, get().currentUnitIndex)
      },

      getCurrentObjectives: () => {
        const state = get()
        const unit = getUnit(state.currentTierId, state.currentUnitIndex)
        if (!unit) return []
        const step = unit.missionSteps[state.currentStepIndex]
        if (!step) return []
        return step.objectives
      },

      getCurrentStepDescription: () => {
        const state = get()
        const unit = getUnit(state.currentTierId, state.currentUnitIndex)
        if (!unit) return ''
        const step = unit.missionSteps[state.currentStepIndex]
        return step?.instruction || ''
      },

      getCurrentStepHint: () => {
        const state = get()
        const unit = getUnit(state.currentTierId, state.currentUnitIndex)
        if (!unit) return ''
        const step = unit.missionSteps[state.currentStepIndex]
        return step?.hint || ''
      },

      getChallengeObjectives: () => {
        const state = get()
        const unit = getUnit(state.currentTierId, state.currentUnitIndex)
        if (!unit || !unit.challenge.objectives) return []
        return unit.challenge.objectives
      },

      executeCommand: (input: string) => {
        const state = get()
        const result = parseAndExecute(input, state.env)

        const newHistory: TerminalLine[] = [
          { type: 'input', text: input },
        ]

        if (result.stdout) {
          newHistory.push({ type: 'output', text: result.stdout })
        }
        if (result.stderr) {
          newHistory.push({ type: 'error', text: result.stderr })
        }

        const cmdName = input.trim().split(/\s+/)[0]?.toLowerCase()
        const newUsedCommands = [...state.usedCommands]
        if (cmdName) {
          const knownCmds = ['pwd','ls','cd','mkdir','touch','cat','echo','rm','cp','mv','grep','find','head','tail','chmod','whoami','clear','help']
          if (knownCmds.includes(cmdName) && !newUsedCommands.includes(cmdName)) {
            newUsedCommands.push(cmdName)
          }
        }

        if (cmdName === 'clear') {
          set({ terminalHistory: [], usedCommands: newUsedCommands })
          return []
        }

        set({
          terminalHistory: [...state.terminalHistory, ...newHistory],
          usedCommands: newUsedCommands,
        })

        return newHistory
      },

      completeQuiz: (correct: number, total: number) => {
        const state = get()
        const xpGained = Math.round((correct / total) * 50)
        const unit = getUnit(state.currentTierId, state.currentUnitIndex)
        if (!unit) return

        const newEnv = createInitialEnv()
        setupUnitFS(newEnv, unit.id)

        const oldLevel = getLevel(state.xp)
        const newLevel = getLevel(state.xp + xpGained)

        set({
          phase: 'challenge',
          env: newEnv,
          quizScore: correct,
          xp: state.xp + xpGained,
          terminalHistory: [
            ...state.terminalHistory,
            { type: 'system', text: `Quiz complete! ${correct}/${total} correct. +${xpGained} XP` },
            { type: 'system', text: '--- CHALLENGE MODE ---' },
            { type: 'system', text: unit.challenge.brief },
          ],
        })

        pushToast(set, get, {
          amount: xpGained,
          type: 'quiz',
          message: `Quiz: +${xpGained} XP (${correct}/${total})`,
        })

        if (newLevel > oldLevel) {
          pushToast(set, get, {
            amount: 0,
            type: 'levelup',
            message: `Level Up! You're now Level ${newLevel}`,
          })
        }
      },

      submitFlag: (flag: string) => {
        const state = get()
        const unit = getUnit(state.currentTierId, state.currentUnitIndex)
        if (!unit) return false

        const valid = verifyFlag(unit.id, flag)
        if (valid) {
          const tier = content.tiers.find(t => t.id === state.currentTierId)
          const isLastUnit = tier ? state.currentUnitIndex >= tier.units.length - 1 : true
          const isLastTier = state.currentTierId >= content.tiers.length
          const xpGained = isLastUnit && !isLastTier ? 200 : isLastUnit ? 300 : 100

          const oldLevel = getLevel(state.xp)
          const newLevel = getLevel(state.xp + xpGained)

          const newCompleted = [...state.completedUnits, unit.id]
          const newUnlocked = [...state.unlockedUnits]
          let tierCompleted: number | null = null

          if (isLastUnit) {
            tierCompleted = state.currentTierId
            const nextTierId = state.currentTierId + 1
            if (nextTierId <= content.tiers.length) {
              const nextTier = content.tiers.find(t => t.id === nextTierId)
              if (nextTier && nextTier.units.length > 0) {
                newUnlocked.push(nextTier.units[0].id)
              }
            }
          } else {
            if (tier && tier.units[state.currentUnitIndex + 1]) {
              newUnlocked.push(tier.units[state.currentUnitIndex + 1].id)
            }
          }

          const congrats = [
            'Amazing work!',
            'You crushed it!',
            'Flag captured!',
            'Outstanding!',
            'Brilliant!',
            'You\'re on fire!',
          ]
          const cheer = congrats[Math.floor(Math.random() * congrats.length)]

          set({
            xp: state.xp + xpGained,
            completedUnits: newCompleted,
            unlockedUnits: newUnlocked,
            unitJustCompleted: true,
            tierJustCompleted: tierCompleted,
            phase: 'completed',
            terminalHistory: [
              ...state.terminalHistory,
              { type: 'system', text: `\n🎉 ${cheer}` },
              { type: 'system', text: `Flag verified: ${flag}` },
              { type: 'system', text: `+${xpGained} XP earned!` },
            ],
          })

          pushToast(set, get, {
            amount: xpGained,
            type: 'xp',
            message: `Flag solved: +${xpGained} XP`,
          })

          if (newLevel > oldLevel) {
            pushToast(set, get, {
              amount: 0,
              type: 'levelup',
              message: `Level Up! You're now Level ${newLevel}`,
            })
          }

          return true
        } else {
          set({
            terminalHistory: [
              ...state.terminalHistory,
              { type: 'error', text: `Incorrect flag: ${flag} is not the right answer. Try again!` },
            ],
          })
          return false
        }
      },

      advanceToNextUnit: () => {
        const state = get()
        const tier = content.tiers.find(t => t.id === state.currentTierId)
        if (!tier) return

        const nextIndex = state.currentUnitIndex + 1
        if (nextIndex < tier.units.length) {
          const newEnv = createInitialEnv()
          setupUnitFS(newEnv, tier.units[nextIndex].id)
          set({
            currentUnitIndex: nextIndex,
            currentStepIndex: 0,
            phase: 'mission',
            terminalHistory: [],
            env: newEnv,
            usedCommands: [],
            quizScore: null,
            unitJustCompleted: false,
            tierJustCompleted: null,
          })
        } else {
          const nextTierId = state.currentTierId + 1
          const nextTier = content.tiers.find(t => t.id === nextTierId)
          if (nextTier && nextTier.units.length > 0) {
            const newEnv = createInitialEnv()
            set({
              currentTierId: nextTierId,
              currentUnitIndex: 0,
              currentStepIndex: 0,
              phase: 'mission',
              terminalHistory: [],
              env: newEnv,
              usedCommands: [],
              quizScore: null,
              unitJustCompleted: false,
              tierJustCompleted: null,
            })
          }
        }
      },

      advanceStep: () => {
        const state = get()
        const unit = getUnit(state.currentTierId, state.currentUnitIndex)
        if (!unit) return

        const nextStepIndex = state.currentStepIndex + 1

        const encouragement = [
          'Great work!',
          'Nice one!',
          'You got it!',
          'Well done!',
          'Keep going!',
          'Awesome!',
          'Perfect!',
          'Excellent!',
          'Moving right along!',
          'Nailed it!',
        ]
        const msg = encouragement[Math.floor(Math.random() * encouragement.length)]

        if (nextStepIndex >= unit.missionSteps.length) {
          set({
            phase: 'quiz',
            currentStepIndex: nextStepIndex,
            terminalHistory: [
              ...state.terminalHistory,
              { type: 'system', text: `\n✓ ${msg} Mission objectives complete!` },
              { type: 'system', text: '--- Time for a quick quiz! ---' },
            ],
          })
        } else {
          set({
            currentStepIndex: nextStepIndex,
            usedCommands: [],
            terminalHistory: [
              ...state.terminalHistory,
              { type: 'system', text: `\n✓ ${msg}` },
              { type: 'system', text: `Step ${nextStepIndex + 1}: ${unit.missionSteps[nextStepIndex].instruction}` },
            ],
          })
        }
      },

      startUnit: (tierId: number, unitIndex: number) => {
        const env = createInitialEnv()
        const unit = getUnit(tierId, unitIndex)
        if (unit) setupUnitFS(env, unit.id)

        const unitInfo = getUnit(tierId, unitIndex)
        const isFirstUnit = tierId === 1 && unitIndex === 0
        const introLines: TerminalLine[] = []
        if (unitInfo) {
          if (isFirstUnit) {
            introLines.push(
              { type: 'system', text: `\n========================================` },
              { type: 'system', text: `  Welcome to your first mission! 🚀` },
              { type: 'system', text: `========================================` },
              { type: 'system', text: '' },
              { type: 'system', text: `This is a terminal. You type commands and press Enter.` },
              { type: 'system', text: `Your first command will be: \`pwd\` (print working directory).` },
              { type: 'system', text: `Look at the mission panel on the left for instructions.` },
              { type: 'system', text: `You can also click any \`command\` in the instructions to auto-type it!` },
              { type: 'system', text: '' },
            )
          }
          introLines.push(
            { type: 'system', text: `=== ${unitInfo.title} ===` },
            { type: 'system', text: `Commands: ${unitInfo.commands.join(', ')}` },
            { type: 'system', text: '' },
            { type: 'system', text: unitInfo.missionSteps[0]?.instruction || '' },
          )
        }

        set({
          currentTierId: tierId,
          currentUnitIndex: unitIndex,
          currentStepIndex: 0,
          phase: 'mission',
          terminalHistory: introLines,
          env,
          usedCommands: [],
          quizScore: null,
          unitJustCompleted: false,
          tierJustCompleted: null,
          xpToasts: [],
        })
      },

      reset: () => {
        set({
          xp: 0,
          currentTierId: 1,
          currentUnitIndex: 0,
          currentStepIndex: 0,
          phase: 'mission',
          completedUnits: [],
          unlockedUnits: ['t1u1'],
          userId: null,
          isAdmin: false,
          arenaSolved: [],
          arenaXp: 0,
          activeArenaChallengeId: null,
          terminalHistory: [],
          env: createInitialEnv(),
          usedCommands: [],
          quizScore: null,
          unitJustCompleted: false,
          tierJustCompleted: null,
          xpToasts: [],
          toastIdCounter: 0,
        })
      },
    }),
    {
      name: 'bash-bootcamp-save',
      partialize: (state) => ({
        xp: state.xp,
        currentTierId: state.currentTierId,
        currentUnitIndex: state.currentUnitIndex,
        currentStepIndex: state.currentStepIndex,
        phase: state.phase,
        completedUnits: state.completedUnits,
        unlockedUnits: state.unlockedUnits,
        quizScore: state.quizScore,
        unitJustCompleted: state.unitJustCompleted,
        tierJustCompleted: state.tierJustCompleted,
        arenaSolved: state.arenaSolved,
        arenaXp: state.arenaXp,
      }),
    }
  )
)
