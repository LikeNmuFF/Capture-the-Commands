import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { auth, googleProvider } from './config'

export type AuthCallback = (user: User | null) => void

export function loginWithGoogle(): Promise<User> {
  return signInWithPopup(auth, googleProvider).then(result => result.user)
}

export function logout(): Promise<void> {
  return signOut(auth)
}

export function onAuthChange(callback: AuthCallback): () => void {
  return onAuthStateChanged(auth, callback)
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}
