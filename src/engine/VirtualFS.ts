import { FileNode, FileType } from '../types'

export function createFileNode(
  name: string,
  type: FileType,
  owner = 'user',
  content = ''
): FileNode {
  return {
    name,
    type,
    content,
    children: new Map(),
    parent: null,
    permissions: type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--',
    owner,
  }
}

export function createDefaultFS(): FileNode {
  const root = createFileNode('/', 'directory', 'root')
  const home = createFileNode('home', 'directory', 'root')
  const userHome = createFileNode('user', 'directory', 'user')
  const tmp = createFileNode('tmp', 'directory', 'root')
  const etc = createFileNode('etc', 'directory', 'root')
  const usr = createFileNode('usr', 'directory', 'root')

  const documents = createFileNode('Documents', 'directory', 'user')
  const downloads = createFileNode('Downloads', 'directory', 'user')
  const projects = createFileNode('Projects', 'directory', 'user')

  const readme = createFileNode('readme.txt', 'file', 'user', 'Welcome to Bash Bootcamp!\nType "help" to see available commands.\n')
  const notes = createFileNode('notes.txt', 'file', 'user', 'Remember to practice your bash commands daily.\n')

  linkChild(root, home)
  linkChild(root, tmp)
  linkChild(root, etc)
  linkChild(root, usr)

  linkChild(home, userHome)

  linkChild(userHome, documents)
  linkChild(userHome, downloads)
  linkChild(userHome, projects)
  linkChild(userHome, readme)
  linkChild(userHome, notes)

  return root
}

function linkChild(parent: FileNode, child: FileNode) {
  child.parent = parent
  parent.children.set(child.name, child)
}

function cloneNode(node: FileNode, parent: FileNode | null): FileNode {
  const clone = createFileNode(node.name, node.type, node.owner, node.content)
  clone.permissions = node.permissions
  clone.parent = parent
  for (const [name, child] of node.children) {
    const childClone = cloneNode(child, clone)
    clone.children.set(name, childClone)
  }
  return clone
}

export function cloneFS(root: FileNode): FileNode {
  return cloneNode(root, null)
}

function normalizePath(path: string): string {
  if (!path) return '.'
  path = path.replace(/\\/g, '/')
  const parts = path.split('/').filter(Boolean)
  const resolved: string[] = []
  for (const p of parts) {
    if (p === '.') continue
    if (p === '..') {
      resolved.pop()
    } else {
      resolved.push(p)
    }
  }
  return '/' + resolved.join('/')
}

export function resolvePath(cwd: string, path: string): string {
  if (!path) return normalizePath(cwd)
  if (path.startsWith('~')) {
    const home = '/home/user'
    if (path === '~') return home
    return normalizePath(home + '/' + path.slice(2))
  }
  if (path.startsWith('/')) return normalizePath(path)
  return normalizePath(cwd + '/' + path)
}

export function getNode(root: FileNode, absPath: string): FileNode | null {
  if (absPath === '/') return root
  const parts = absPath.split('/').filter(Boolean)
  let current: FileNode = root
  for (const part of parts) {
    if (!current.children.has(part)) return null
    current = current.children.get(part)!
  }
  return current
}

export function getParentPath(absPath: string): string {
  const parts = absPath.split('/').filter(Boolean)
  parts.pop()
  if (parts.length === 0) return '/'
  return '/' + parts.join('/')
}

export function pathExists(root: FileNode, absPath: string): boolean {
  return getNode(root, absPath) !== null
}

export function mkdir(root: FileNode, absPath: string): boolean {
  if (pathExists(root, absPath)) return false
  const parentPath = getParentPath(absPath)
  const parent = getNode(root, parentPath)
  if (!parent || parent.type !== 'directory') return false
  const name = absPath.split('/').filter(Boolean).pop()!
  const dir = createFileNode(name, 'directory')
  linkChild(parent, dir)
  return true
}

export function touch(root: FileNode, absPath: string): boolean {
  const existing = getNode(root, absPath)
  if (existing) {
    existing.content = ''
    return true
  }
  const parentPath = getParentPath(absPath)
  const parent = getNode(root, parentPath)
  if (!parent || parent.type !== 'directory') return false
  const name = absPath.split('/').filter(Boolean).pop()!
  const file = createFileNode(name, 'file')
  linkChild(parent, file)
  return true
}

export function writeFile(root: FileNode, absPath: string, content: string): boolean {
  const node = getNode(root, absPath)
  if (!node || node.type !== 'file') return false
  node.content = content
  return true
}

export function appendFile(root: FileNode, absPath: string, content: string): boolean {
  const node = getNode(root, absPath)
  if (!node || node.type !== 'file') return false
  node.content += content
  return true
}

export function readFile(root: FileNode, absPath: string): string | null {
  const node = getNode(root, absPath)
  if (!node || node.type !== 'file') return null
  return node.content
}

export function removeNode(root: FileNode, absPath: string): boolean {
  const node = getNode(root, absPath)
  if (!node || node === root || absPath === '/') return false
  const parentPath = getParentPath(absPath)
  const parent = getNode(root, parentPath)
  if (!parent) return false
  const name = absPath.split('/').filter(Boolean).pop()!
  parent.children.delete(name)
  return true
}

export function copyNode(root: FileNode, srcPath: string, destPath: string): boolean {
  const src = getNode(root, srcPath)
  if (!src) return false

  const destExists = pathExists(root, destPath)
  if (destExists) {
    const dest = getNode(root, destPath)
    if (dest && dest.type === 'directory') {
      const clone = cloneNode(src, dest)
      clone.name = src.name
      dest.children.set(clone.name, clone)
      return true
    }
    return false
  }

  const parentPath = getParentPath(destPath)
  const parent = getNode(root, parentPath)
  if (!parent || parent.type !== 'directory') return false

  const name = destPath.split('/').filter(Boolean).pop()!
  const clone = cloneNode(src, parent)
  clone.name = name
  parent.children.set(name, clone)
  return true
}

export function moveNode(root: FileNode, srcPath: string, destPath: string): boolean {
  if (!copyNode(root, srcPath, destPath)) return false
  return removeNode(root, srcPath)
}

export function listDirectory(root: FileNode, absPath: string): string[] | null {
  const node = getNode(root, absPath)
  if (!node || node.type !== 'directory') return null
  return Array.from(node.children.keys()).sort()
}

export function listDirectoryDetailed(root: FileNode, absPath: string): { name: string; type: string; permissions: string; owner: string }[] | null {
  const node = getNode(root, absPath)
  if (!node || node.type !== 'directory') return null
  return Array.from(node.children.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(child => ({
      name: child.name,
      type: child.type === 'directory' ? 'd' : '-',
      permissions: child.permissions,
      owner: child.owner,
    }))
}

export function findFiles(root: FileNode, pattern: string): string[] {
  const results: string[] = []
  function walk(node: FileNode, path: string) {
    if (node.type === 'file' && node.name.includes(pattern)) {
      results.push(path + '/' + node.name)
    }
    if (node.name.includes(pattern) && node.type === 'directory' && path !== '') {
      results.push(path + '/' + node.name)
    }
    for (const [name, child] of node.children) {
      walk(child, path + '/' + name)
    }
  }
  walk(root, '')
  return results.map(p => p.startsWith('//') ? p.slice(1) : p || '/')
}

export function getFileSize(node: FileNode): number {
  if (node.type === 'file') return node.content.length
  let size = 0
  for (const [, child] of node.children) {
    size += getFileSize(child)
  }
  return size
}
