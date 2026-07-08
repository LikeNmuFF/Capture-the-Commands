import { Environment, FileNode } from '../types'
import { createDefaultFS, resolvePath, getNode } from './VirtualFS'

export function createEnvironment(): Environment {
  return {
    fs: createDefaultFS(),
    cwd: '/home/user',
    home: '/home/user',
    user: 'user',
  }
}

export function setCwd(env: Environment, path: string): boolean {
  const resolved = resolvePath(env.cwd, path)
  const node = getNode(env.fs, resolved)
  if (node && node.type === 'directory') {
    env.cwd = resolved
    return true
  }
  return false
}

export function cloneEnvironment(env: Environment): Environment {
  return {
    fs: structuredClone(env.fs),
    cwd: env.cwd,
    home: env.home,
    user: env.user,
  }
}
