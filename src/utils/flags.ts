// Local flag verification for MVP (replaced by Cloud Function in Phase 2)
// Flag hashes are checked here but kept out of the main bundle data flow

import { content } from '../content'

export function verifyFlag(unitId: string, submittedFlag: string): boolean {
  for (const tier of content.tiers) {
    for (const unit of tier.units) {
      if (unit.id === unitId) {
        return unit.challenge.flag.trim() === submittedFlag.trim()
      }
    }
  }
  return false
}
