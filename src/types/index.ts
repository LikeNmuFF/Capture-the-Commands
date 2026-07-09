export type FileType = 'file' | 'directory'

export interface FileNode {
  name: string
  type: FileType
  content: string
  children: Map<string, FileNode>
  parent: FileNode | null
  permissions: string
  owner: string
}

export interface Environment {
  fs: FileNode
  cwd: string
  home: string
  user: string
}

export interface CommandResult {
  stdout: string
  stderr: string
  exitCode: number
}

export type CommandHandler = (args: string[], env: Environment) => CommandResult

export interface ObjectiveData {
  type: string
  description: string
  path?: string
  command?: string
  content?: string
}

export interface MissionStep {
  instruction: string
  hint: string
  objectives: ObjectiveData[]
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

export interface Challenge {
  brief: string
  hint: string
  flag: string
  objectives?: ObjectiveData[]
}

export interface Unit {
  id: string
  tierId: number
  title: string
  commands: string[]
  missionSteps: MissionStep[]
  quiz: QuizQuestion[]
  challenge: Challenge
}

export interface Tier {
  id: number
  name: string
  belt: string
  focus: string
  units: Unit[]
}

export interface GameState {
  xp: number
  currentTierId: number
  currentUnitIndex: number
  currentStepIndex: number
  completedUnits: string[]
  unlockedUnits: string[]
  phase: 'mission' | 'quiz' | 'challenge' | 'completed'
  env: Environment
  terminalHistory: TerminalLine[]
}

export interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system'
  text: string
}

export interface Content {
  tiers: Tier[]
}
