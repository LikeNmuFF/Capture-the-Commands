export const RANKS = [
  { minLevel: 1, title: 'Novice', icon: '🌱' },
  { minLevel: 4, title: 'Apprentice', icon: '🔧' },
  { minLevel: 7, title: 'Specialist', icon: '⚡' },
  { minLevel: 10, title: 'Expert', icon: '🏆' },
  { minLevel: 13, title: 'Master', icon: '👑' },
  { minLevel: 16, title: 'Grandmaster', icon: '🌟' },
]

export const XP_PER_LEVEL = 100

export function getLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function getRank(level: number): (typeof RANKS)[0] {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (level >= r.minLevel) rank = r
  }
  return rank
}

export function getXpProgress(xp: number): { current: number; needed: number } {
  const current = xp % XP_PER_LEVEL
  return { current, needed: XP_PER_LEVEL }
}

export function getTotalXpForLevel(level: number): number {
  return (level - 1) * XP_PER_LEVEL
}
