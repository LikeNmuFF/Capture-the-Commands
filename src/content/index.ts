import tier1Raw from './tier1.json'
import tier2Raw from './tier2.json'
import tier3Raw from './tier3.json'
import { Tier, Content, Unit } from '../types'

const tier1 = tier1Raw as unknown as Tier
const tier2 = tier2Raw as unknown as Tier
const tier3 = tier3Raw as unknown as Tier

export const content: Content = {
  tiers: [tier1, tier2, tier3],
}

export function getTier(tierId: number): Tier | undefined {
  return content.tiers.find(t => t.id === tierId)
}

export function getUnit(tierId: number, unitIndex: number): Unit | undefined {
  const tier = getTier(tierId)
  return tier?.units[unitIndex]
}

export function getAllCommands(): string[] {
  const cmds = new Set<string>()
  for (const tier of content.tiers) {
    for (const unit of tier.units) {
      for (const cmd of unit.commands) {
        cmds.add(cmd)
      }
    }
  }
  return Array.from(cmds)
}
