import { CommandResult, Environment, FileNode } from '../types'
import * as VirtualFS from './VirtualFS'
import * as Redirect from './commands/redirect'

type CommandFn = (args: string[], env: Environment) => CommandResult

const commandRegistry: Record<string, CommandFn> = {}

export function registerCommand(name: string, fn: CommandFn) {
  commandRegistry[name] = fn
}

export function parseAndExecute(input: string, env: Environment): CommandResult {
  const trimmed = input.trim()

  if (!trimmed) {
    return { stdout: '', stderr: '', exitCode: 0 }
  }

  const pipeSegments = splitPipes(trimmed)

  let currentEnv = env
  let finalResult: CommandResult = { stdout: '', stderr: '', exitCode: 0 }

  for (const segment of pipeSegments) {
    const { redirectOp, redirectTarget, redirectAppend } = parseRedirect(segment)

    const cmdLine = redirectOp
      ? segment.substring(0, segment.indexOf(redirectOp === '>>' ? '>>' : '>')).trim()
      : segment

    const { cmd, args } = parseCommand(cmdLine)

    const handler = commandRegistry[cmd]
    if (!handler) {
      finalResult = {
        stdout: '',
        stderr: `bash: ${cmd}: command not found`,
        exitCode: 127,
      }
      continue
    }

    if (pipeSegments.length > 1 && finalResult.stdout) {
      args.push(finalResult.stdout)
    }

    finalResult = handler(args, currentEnv)

    if (redirectOp && finalResult.exitCode === 0) {
      const resolvedPath = VirtualFS.resolvePath(currentEnv.cwd, redirectTarget)
      const node = VirtualFS.getNode(currentEnv.fs, resolvedPath)
      if (!node) {
        VirtualFS.touch(currentEnv.fs, resolvedPath)
      }
      if (redirectAppend) {
        VirtualFS.appendFile(currentEnv.fs, resolvedPath, finalResult.stdout)
      } else {
        VirtualFS.writeFile(currentEnv.fs, resolvedPath, finalResult.stdout)
      }
      finalResult.stdout = ''
    }

    if (pipeSegments.length === 1) {
      return finalResult
    }
  }

  return finalResult
}

function splitPipes(input: string): string[] {
  const segments: string[] = []
  let current = ''
  let inQuote = false

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (ch === '"' || ch === "'") {
      inQuote = !inQuote
      current += ch
    } else if (ch === '|' && !inQuote) {
      segments.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }

  if (current.trim()) {
    segments.push(current.trim())
  }

  return segments
}

function parseRedirect(input: string): {
  redirectOp: string | null
  redirectTarget: string
  redirectAppend: boolean
} {
  const appendMatch = input.match(/>>\s*(\S+)$/)
  if (appendMatch) {
    return { redirectOp: '>>', redirectTarget: appendMatch[1], redirectAppend: true }
  }

  const writeMatch = input.match(/(?<![>])>\s*(\S+)$/)
  if (writeMatch) {
    return { redirectOp: '>', redirectTarget: writeMatch[1], redirectAppend: false }
  }

  return { redirectOp: null, redirectTarget: '', redirectAppend: false }
}

function parseCommand(input: string): { cmd: string; args: string[] } {
  const tokens: string[] = []
  let current = ''
  let inQuote = false
  let quoteChar = ''

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if ((ch === '"' || ch === "'") && !inQuote) {
      inQuote = true
      quoteChar = ch
    } else if (ch === quoteChar && inQuote) {
      inQuote = false
    } else if (ch === ' ' && !inQuote) {
      if (current) {
        tokens.push(current)
        current = ''
      }
    } else {
      current += ch
    }
  }

  if (current) tokens.push(current)

  const cmd = tokens[0]?.toLowerCase() || ''
  const args = tokens.slice(1)
  return { cmd, args }
}

export function registerBuiltins() {
  const pwd: CommandFn = (_args, env) => ({
    stdout: env.cwd + '\n',
    stderr: '',
    exitCode: 0,
  })

  const ls: CommandFn = (args, env) => {
    let showAll = false
    let longFormat = false
    let target = '.'

    for (const a of args) {
      if (a === '-la' || a === '-al') { showAll = true; longFormat = true }
      else if (a === '-l') { longFormat = true }
      else if (a === '-a') { showAll = true }
      else if (!a.startsWith('-')) { target = a }
    }

    const resolved = VirtualFS.resolvePath(env.cwd, target)
    const node = VirtualFS.getNode(env.fs, resolved)

    if (!node) {
      return { stdout: '', stderr: `ls: cannot access '${target}': No such file or directory`, exitCode: 2 }
    }

    if (node.type === 'file') {
      return { stdout: node.name + '\n', stderr: '', exitCode: 0 }
    }

    const entries = VirtualFS.listDirectoryDetailed(env.fs, resolved)
    if (!entries) {
      return { stdout: '', stderr: `ls: cannot access '${target}': No such file or directory`, exitCode: 2 }
    }

    const filtered = showAll ? entries : entries.filter(e => !e.name.startsWith('.'))
    let output: string

    if (longFormat) {
      output = filtered.map(e =>
        `${e.permissions} ${e.owner} ${e.name}`
      ).join('\n') + '\n'
    } else {
      output = filtered.map(e => e.name).join('  ') + '\n'
    }

    return { stdout: output, stderr: '', exitCode: 0 }
  }

  const cd: CommandFn = (args, env) => {
    const target = args[0] || env.home
    const resolved = VirtualFS.resolvePath(env.cwd, target)
    const node = VirtualFS.getNode(env.fs, resolved)

    if (!node) {
      return { stdout: '', stderr: `bash: cd: ${target}: No such file or directory`, exitCode: 1 }
    }

    if (node.type !== 'directory') {
      return { stdout: '', stderr: `bash: cd: ${target}: Not a directory`, exitCode: 1 }
    }

    env.cwd = resolved
    return { stdout: '', stderr: '', exitCode: 0 }
  }

  const mkdirCmd: CommandFn = (args, env) => {
    if (args.length === 0) {
      return { stdout: '', stderr: 'mkdir: missing operand', exitCode: 1 }
    }

    for (const target of args) {
      const resolved = VirtualFS.resolvePath(env.cwd, target)
      if (VirtualFS.pathExists(env.fs, resolved)) {
        return { stdout: '', stderr: `mkdir: cannot create directory '${target}': File exists`, exitCode: 1 }
      }
      if (!VirtualFS.mkdir(env.fs, resolved)) {
        return { stdout: '', stderr: `mkdir: cannot create directory '${target}': Permission denied`, exitCode: 1 }
      }
    }

    return { stdout: '', stderr: '', exitCode: 0 }
  }

  const touchCmd: CommandFn = (args, env) => {
    if (args.length === 0) {
      return { stdout: '', stderr: 'touch: missing operand', exitCode: 1 }
    }

    for (const target of args) {
      const resolved = VirtualFS.resolvePath(env.cwd, target)
      VirtualFS.touch(env.fs, resolved)
    }

    return { stdout: '', stderr: '', exitCode: 0 }
  }

  const catCmd: CommandFn = (args, env) => {
    if (args.length === 0) {
      return { stdout: '', stderr: '', exitCode: 0 }
    }

    let output = ''
    for (const target of args) {
      const resolved = VirtualFS.resolvePath(env.cwd, target)
      const content = VirtualFS.readFile(env.fs, resolved)
      if (content === null) {
        return { stdout: output, stderr: `cat: ${target}: No such file or directory`, exitCode: 1 }
      }
      output += content
    }

    return { stdout: output, stderr: '', exitCode: 0 }
  }

  const echoCmd: CommandFn = (args, _env) => {
    const output = args.join(' ') + '\n'
    return { stdout: output, stderr: '', exitCode: 0 }
  }

  const rmCmd: CommandFn = (args, env) => {
    let recursive = false
    let force = false
    const targets: string[] = []

    for (const a of args) {
      if (a === '-r' || a === '-rf' || a === '-fr') recursive = true
      if (a === '-f' || a === '-rf' || a === '-fr') force = true
      else if (!a.startsWith('-')) targets.push(a)
    }

    if (targets.length === 0) {
      return { stdout: '', stderr: 'rm: missing operand', exitCode: 1 }
    }

    for (const target of targets) {
      const resolved = VirtualFS.resolvePath(env.cwd, target)
      const node = VirtualFS.getNode(env.fs, resolved)
      if (!node) {
        if (force) continue
        return { stdout: '', stderr: `rm: cannot remove '${target}': No such file or directory`, exitCode: 1 }
      }
      if (node.type === 'directory' && !recursive) {
        return { stdout: '', stderr: `rm: cannot remove '${target}': Is a directory`, exitCode: 1 }
      }
      VirtualFS.removeNode(env.fs, resolved)
    }

    return { stdout: '', stderr: '', exitCode: 0 }
  }

  const cpCmd: CommandFn = (args, env) => {
    if (args.length < 2) {
      return { stdout: '', stderr: 'cp: missing file operand', exitCode: 1 }
    }

    const src = args[0]
    const dest = args[1]
    const srcPath = VirtualFS.resolvePath(env.cwd, src)
    const destPath = VirtualFS.resolvePath(env.cwd, dest)

    if (!VirtualFS.pathExists(env.fs, srcPath)) {
      return { stdout: '', stderr: `cp: cannot stat '${src}': No such file or directory`, exitCode: 1 }
    }

    if (!VirtualFS.copyNode(env.fs, srcPath, destPath)) {
      return { stdout: '', stderr: `cp: cannot copy '${src}' to '${dest}'`, exitCode: 1 }
    }

    return { stdout: '', stderr: '', exitCode: 0 }
  }

  const mvCmd: CommandFn = (args, env) => {
    if (args.length < 2) {
      return { stdout: '', stderr: 'mv: missing file operand', exitCode: 1 }
    }

    const src = args[0]
    const dest = args[1]
    const srcPath = VirtualFS.resolvePath(env.cwd, src)
    const destPath = VirtualFS.resolvePath(env.cwd, dest)

    if (!VirtualFS.pathExists(env.fs, srcPath)) {
      return { stdout: '', stderr: `mv: cannot stat '${src}': No such file or directory`, exitCode: 1 }
    }

    if (!VirtualFS.moveNode(env.fs, srcPath, destPath)) {
      return { stdout: '', stderr: `mv: cannot move '${src}' to '${dest}'`, exitCode: 1 }
    }

    return { stdout: '', stderr: '', exitCode: 0 }
  }

  const grepCmd: CommandFn = (args, env) => {
    if (args.length < 1) {
      return { stdout: '', stderr: 'grep: missing pattern', exitCode: 1 }
    }

    const pattern = args[0]
    const files = args.slice(1)
    let output = ''

    if (files.length === 0) {
      return { stdout: '', stderr: 'grep: missing file operand', exitCode: 1 }
    }

    for (const file of files) {
      const resolved = VirtualFS.resolvePath(env.cwd, file)
      const content = VirtualFS.readFile(env.fs, resolved)
      if (content === null) {
        return { stdout: output, stderr: `grep: ${file}: No such file or directory`, exitCode: 2 }
      }
      const lines = content.split('\n')
      for (const line of lines) {
        if (line.includes(pattern)) {
          output += `${file}:${line}\n`
        }
      }
    }

    if (!output) {
      return { stdout: '', stderr: '', exitCode: 1 }
    }

    return { stdout: output, stderr: '', exitCode: 0 }
  }

  const findCmd: CommandFn = (args, env) => {
    let target = '.'
    let namePattern = ''

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-name' && i + 1 < args.length) {
        namePattern = args[i + 1]
        i++
      } else if (!args[i].startsWith('-')) {
        target = args[i]
      }
    }

    const resolved = VirtualFS.resolvePath(env.cwd, target)
    const node = VirtualFS.getNode(env.fs, resolved)
    if (!node) {
      return { stdout: '', stderr: `find: '${target}': No such file or directory`, exitCode: 1 }
    }

    let results: string[]
    if (namePattern) {
      results = VirtualFS.findFiles(env.fs, namePattern.replace(/\*/g, ''))
    } else {
      results = VirtualFS.findFiles(env.fs, '')
    }

    return { stdout: results.join('\n') + '\n', stderr: '', exitCode: 0 }
  }

  const headCmd: CommandFn = (args, env) => {
    let lines = 10
    const targets: string[] = []

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-n' && i + 1 < args.length) {
        lines = parseInt(args[i + 1], 10) || 10
        i++
      } else if (!args[i].startsWith('-')) {
        targets.push(args[i])
      }
    }

    if (targets.length === 0) {
      return { stdout: '', stderr: '', exitCode: 0 }
    }

    let output = ''
    for (const target of targets) {
      const resolved = VirtualFS.resolvePath(env.cwd, target)
      const content = VirtualFS.readFile(env.fs, resolved)
      if (content === null) {
        return { stdout: output, stderr: `head: ${target}: No such file or directory`, exitCode: 1 }
      }
      const fileLines = content.split('\n')
      output += fileLines.slice(0, lines).join('\n') + '\n'
    }

    return { stdout: output, stderr: '', exitCode: 0 }
  }

  const tailCmd: CommandFn = (args, env) => {
    let lines = 10
    const targets: string[] = []

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-n' && i + 1 < args.length) {
        lines = parseInt(args[i + 1], 10) || 10
        i++
      } else if (!args[i].startsWith('-')) {
        targets.push(args[i])
      }
    }

    if (targets.length === 0) {
      return { stdout: '', stderr: '', exitCode: 0 }
    }

    let output = ''
    for (const target of targets) {
      const resolved = VirtualFS.resolvePath(env.cwd, target)
      const content = VirtualFS.readFile(env.fs, resolved)
      if (content === null) {
        return { stdout: output, stderr: `tail: ${target}: No such file or directory`, exitCode: 1 }
      }
      const fileLines = content.split('\n')
      output += fileLines.slice(-lines).join('\n') + '\n'
    }

    return { stdout: output, stderr: '', exitCode: 0 }
  }

  const chmodCmd: CommandFn = (_args, _env) => {
    // Simplified: acknowledge the command but don't enforce permissions in MVP
    return { stdout: '', stderr: '', exitCode: 0 }
  }

  const whoamiCmd: CommandFn = (_args, env) => ({
    stdout: env.user + '\n',
    stderr: '',
    exitCode: 0,
  })

  const clearCmd: CommandFn = () => ({
    stdout: '',
    stderr: '',
    exitCode: 0,
  })

  const helpCmd: CommandFn = () => {
    const commands = [
      'pwd     - print working directory',
      'ls      - list directory contents',
      'cd      - change directory',
      'mkdir   - create directory',
      'touch   - create empty file',
      'cat     - display file contents',
      'echo    - print text',
      'rm      - remove files',
      'cp      - copy files',
      'mv      - move/rename files',
      'grep    - search file contents',
      'find    - find files by name',
      'head    - display first lines of file',
      'tail    - display last lines of file',
      'chmod   - change file permissions',
      'whoami  - print current user',
      'clear   - clear terminal',
      'help    - show this message',
    ]
    return { stdout: commands.join('\n') + '\n', stderr: '', exitCode: 0 }
  }

  registerCommand('pwd', pwd)
  registerCommand('ls', ls)
  registerCommand('cd', cd)
  registerCommand('mkdir', mkdirCmd)
  registerCommand('touch', touchCmd)
  registerCommand('cat', catCmd)
  registerCommand('echo', echoCmd)
  registerCommand('rm', rmCmd)
  registerCommand('cp', cpCmd)
  registerCommand('mv', mvCmd)
  registerCommand('grep', grepCmd)
  registerCommand('find', findCmd)
  registerCommand('head', headCmd)
  registerCommand('tail', tailCmd)
  registerCommand('chmod', chmodCmd)
  registerCommand('whoami', whoamiCmd)
  registerCommand('clear', clearCmd)
  registerCommand('help', helpCmd)
}
