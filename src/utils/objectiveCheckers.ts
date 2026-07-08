import { Environment, ObjectiveData } from '../types'
import * as VirtualFS from '../engine/VirtualFS'

export function checkObjective(obj: ObjectiveData, env: Environment, usedCommands: string[]): boolean {
  switch (obj.type) {
    case 'cwd_is':
      return checkCwdIs(env, obj.path || '')

    case 'file_exists':
      return checkFileExists(env, obj.path || '')

    case 'file_not_exists':
      return checkFileNotExists(env, obj.path || '')

    case 'file_contains':
      return checkFileContains(env, obj.path || '', obj.content || '')

    case 'dir_exists':
      return checkDirExists(env, obj.path || '')

    case 'dir_not_exists':
      return checkDirNotExists(env, obj.path || '')

    case 'command_used':
      return checkCommandUsed(usedCommands, obj.command || '')

    case 'command_used_once':
      return checkCommandUsed(usedCommands, obj.command || '')

    default:
      return false
  }
}

function checkCwdIs(env: Environment, path: string): boolean {
  return env.cwd === path
}

function checkFileExists(env: Environment, path: string): boolean {
  const resolved = VirtualFS.resolvePath(env.cwd, path)
  return VirtualFS.pathExists(env.fs, resolved)
}

function checkFileNotExists(env: Environment, path: string): boolean {
  const resolved = VirtualFS.resolvePath(env.cwd, path)
  return !VirtualFS.pathExists(env.fs, resolved)
}

function checkFileContains(env: Environment, path: string, content: string): boolean {
  const resolved = VirtualFS.resolvePath(env.cwd, path)
  const fileContent = VirtualFS.readFile(env.fs, resolved)
  if (fileContent === null) return false
  return fileContent.includes(content)
}

function checkDirExists(env: Environment, path: string): boolean {
  const resolved = VirtualFS.resolvePath(env.cwd, path)
  const node = VirtualFS.getNode(env.fs, resolved)
  return node !== null && node.type === 'directory'
}

function checkDirNotExists(env: Environment, path: string): boolean {
  const resolved = VirtualFS.resolvePath(env.cwd, path)
  const node = VirtualFS.getNode(env.fs, resolved)
  return node === null || node.type !== 'directory'
}

function checkCommandUsed(usedCommands: string[], command: string): boolean {
  return usedCommands.includes(command)
}
