import { Environment } from '../types'
import * as VirtualFS from '../engine/VirtualFS'

interface SetupFile {
  path: string
  content: string
}

export interface ChallengeSetup {
  directories: string[]
  files: SetupFile[]
}

export function applyArenaSetup(env: Environment, challengeId: string, setup: ChallengeSetup) {
  for (const dir of setup.directories) {
    const resolved = VirtualFS.resolvePath(env.cwd, dir)
    const parent = VirtualFS.getParentPath(resolved)
    if (!VirtualFS.pathExists(env.fs, parent)) {
      VirtualFS.mkdir(env.fs, parent)
    }
    if (!VirtualFS.pathExists(env.fs, resolved)) {
      VirtualFS.mkdir(env.fs, resolved)
    }
  }

  for (const file of setup.files) {
    const resolved = VirtualFS.resolvePath(env.cwd, file.path)
    const parent = VirtualFS.getParentPath(resolved)
    if (!VirtualFS.pathExists(env.fs, parent)) {
      VirtualFS.mkdir(env.fs, parent)
    }
    VirtualFS.touch(env.fs, resolved)
    const content = file.content === '__generated__'
      ? generateChallengeContent(challengeId)
      : file.content
    VirtualFS.writeFile(env.fs, resolved, content)
  }
}

function generateChallengeContent(challengeId: string): string {
  switch (challengeId) {
    case 'arena_log_breach': {
      const ips = ['192.168.1.100', '192.168.1.101', '192.168.1.105', '10.0.0.1', '10.0.0.2']
      const lines: string[] = []
      for (let i = 0; i < 100; i++) {
        const ip = ips[i % ips.length]
        if (i === 42) {
          lines.push('Apr 15 03:14:22 server sshd[1234]: Failed password for root from 192.168.1.105 port 22 ssh2')
          lines.push('Apr 15 03:14:23 server sshd[1235]: Accepted password for root from 192.168.1.105 port 22 ssh2 FLAG=flag{192_168_1_105_bruteforce}')
        } else {
          const h = String(Math.floor(Math.random() * 24)).padStart(2, '0')
          const m = String(Math.floor(Math.random() * 60)).padStart(2, '0')
          const s = String(Math.floor(Math.random() * 60)).padStart(2, '0')
          const action = i % 3 === 0 ? 'Failed password' : 'Accepted password'
          const user = i % 2 === 0 ? 'root' : 'admin'
          lines.push(`Apr 15 ${h}:${m}:${s} server sshd[${1000 + i}]: ${action} for ${user} from ${ip} port 22 ssh2`)
        }
      }
      return lines.slice(0, 100).join('\n')
    }

    case 'arena_filtered_flag': {
      const lines: string[] = []
      for (let i = 0; i < 200; i++) {
        if (i === 157) {
          lines.push('2024-05-12 14:22:33 ERROR main: flag{gr3p_4nd_cut_4r3_p0w3rful}')
        } else {
          const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG']
          const msgs = ['Connection established', 'Request processed', 'Timeout', 'Cache hit', 'Auth failed', 'Data loaded']
          const h = String(Math.floor(Math.random() * 24)).padStart(2, '0')
          const m = String(Math.floor(Math.random() * 60)).padStart(2, '0')
          const s = String(Math.floor(Math.random() * 60)).padStart(2, '0')
          lines.push(`2024-05-12 ${h}:${m}:${s} ${levels[i % levels.length]} service: ${msgs[i % msgs.length]} [#${i}]`)
        }
      }
      return lines.join('\n')
    }

    case 'arena_stats_report': {
      const products = ['Widget-A', 'Widget-B', 'Widget-C', 'Gadget-X', 'Gadget-Y']
      const lines = ['product,units,revenue,date']
      for (let i = 0; i < 200; i++) {
        const units = Math.floor(Math.random() * 500) + 10
        const rev = (units * (Math.random() * 50 + 5)).toFixed(2)
        if (i === 142) {
          lines.push(`Widget-A,482,flag{s0rt_4nd_h34d_f0r_w1n},2024-05-15`)
        } else {
          const d = String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')
          lines.push(`${products[i % products.length]},${units},${rev},2024-05-${d}`)
        }
      }
      return lines.join('\n')
    }

    default:
      return ''
  }
}
