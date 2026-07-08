import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  Unsubscribe,
  where,
} from 'firebase/firestore'
import { db } from './config'

export interface ArenaChallenge {
  id: string
  title: string
  category: 'forensics' | 'file_puzzle' | 'pipeline' | 'mixed'
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  xp: number
  brief: string
  hint: string
  flag: string
  createdBy: string
  createdAt: number
  setup: {
    directories: string[]
    files: { path: string; content: string }[]
  }
}

export interface ArenaChallengeInput {
  id: string
  title: string
  category: 'forensics' | 'file_puzzle' | 'pipeline' | 'mixed'
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  xp: number
  brief: string
  hint: string
  flag: string
  createdBy: string
  setup: {
    directories: string[]
    files: { path: string; content: string }[]
  }
}

const COLLECTION = 'arenaChallenges'

export async function createChallenge(challenge: ArenaChallengeInput): Promise<void> {
  const ref = doc(db, COLLECTION, challenge.id)
  await setDoc(ref, { ...challenge, createdAt: Date.now() })
}

export async function updateChallenge(challenge: ArenaChallenge): Promise<void> {
  const ref = doc(db, COLLECTION, challenge.id)
  await setDoc(ref, challenge)
}

export async function deleteChallenge(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id)
  await deleteDoc(ref)
}

export async function getChallenge(id: string): Promise<ArenaChallenge | null> {
  const ref = doc(db, COLLECTION, id)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as ArenaChallenge) : null
}

export function subscribeChallenges(callback: (challenges: ArenaChallenge[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'asc'))
  return onSnapshot(q, snapshot => {
    const list = snapshot.docs.map(d => d.data() as ArenaChallenge)
    callback(list)
  })
}

export async function seedChallengesIfEmpty(seedData: ArenaChallengeInput[]): Promise<void> {
  const q = query(collection(db, COLLECTION), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) {
    for (const c of seedData) {
      const ref = doc(db, COLLECTION, c.id)
      await setDoc(ref, { ...c, createdAt: Date.now() })
    }
  }
}
