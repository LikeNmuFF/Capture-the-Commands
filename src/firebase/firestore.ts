import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  where,
  Unsubscribe,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from './config'

export interface UserData {
  username: string
  displayName: string
  photoURL: string
  email: string
  xp: number
  currentTierId: number
  currentUnitIndex: number
  currentStepIndex: number
  phase: string
  completedUnits: string[]
  unlockedUnits: string[]
  createdAt: number
  lastLoginAt: number
}

export interface LeaderboardEntry {
  uid: string
  username: string
  displayName: string
  photoURL: string
  xp: number
}

const defaultUserData = (uid: string, username: string, displayName: string, photoURL: string, email: string): UserData => ({
  username,
  displayName,
  photoURL,
  email,
  xp: 0,
  currentTierId: 1,
  currentUnitIndex: 0,
  currentStepIndex: 0,
  phase: 'mission',
  completedUnits: [],
  unlockedUnits: ['t1u1'],
  createdAt: Date.now(),
  lastLoginAt: Date.now(),
})

export async function createUserProfile(
  uid: string,
  username: string,
  displayName: string,
  photoURL: string,
  email: string
): Promise<void> {
  const ref = doc(db, 'users', uid)
  const data = defaultUserData(uid, username, displayName, photoURL, email)
  await setDoc(ref, data)
}

export async function getUserData(uid: string): Promise<UserData | null> {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as UserData) : null
}

export async function updateUserProgress(
  uid: string,
  updates: Partial<UserData>
): Promise<void> {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, { ...updates, lastLoginAt: Date.now() })
}

export function subscribeLeaderboard(
  maxResults: number,
  callback: (entries: LeaderboardEntry[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'users'),
    orderBy('xp', 'desc'),
    limit(maxResults)
  )
  return onSnapshot(q, snapshot => {
    const entries: LeaderboardEntry[] = snapshot.docs.map(doc => ({
      uid: doc.id,
      username: doc.data().username || 'anonymous',
      displayName: doc.data().displayName || '',
      photoURL: doc.data().photoURL || '',
      xp: doc.data().xp || 0,
    }))
    callback(entries)
  })
}

// Friend system — one-click follow
export async function addFollow(followerUid: string, followingUid: string): Promise<void> {
  const ref = doc(db, 'follows', `${followerUid}_${followingUid}`)
  await setDoc(ref, { follower: followerUid, following: followingUid, createdAt: Date.now() })
}

export async function removeFollow(followerUid: string, followingUid: string): Promise<void> {
  const ref = doc(db, 'follows', `${followerUid}_${followingUid}`)
  await deleteDoc(ref)
}

export async function getFollowing(uid: string): Promise<string[]> {
  const q = query(collection(db, 'follows'), where('follower', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data().following)
}

export async function searchUsers(queryStr: string): Promise<LeaderboardEntry[]> {
  const q = query(
    collection(db, 'users'),
    orderBy('username'),
    limit(20)
  )
  const snap = await getDocs(q)
  return snap.docs
    .filter(d => (d.data().username || '').toLowerCase().includes(queryStr.toLowerCase()))
    .map(d => ({
      uid: d.id,
      username: d.data().username || 'anonymous',
      displayName: d.data().displayName || '',
      photoURL: d.data().photoURL || '',
      xp: d.data().xp || 0,
    }))
}
