import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from './config'

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const ref = doc(db, 'usernames', username.toLowerCase())
  const snap = await getDoc(ref)
  return !snap.exists()
}

export async function claimUsername(username: string, uid: string): Promise<boolean> {
  const available = await checkUsernameAvailable(username)
  if (!available) return false
  const ref = doc(db, 'usernames', username.toLowerCase())
  await setDoc(ref, { uid, claimedAt: Date.now() })
  return true
}

export async function releaseUsername(username: string) {
  const ref = doc(db, 'usernames', username.toLowerCase())
  await deleteDoc(ref)
}

export function validateUsername(username: string): string | null {
  if (username.length < 3) return 'Must be at least 3 characters'
  if (username.length > 15) return 'Must be 15 characters or less'
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Only letters, numbers, and underscores'
  return null
}
