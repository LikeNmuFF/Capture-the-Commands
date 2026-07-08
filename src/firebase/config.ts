import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDTKVMaaiK2G8Yp6elAN5z96j1KakQ8jX4',
  authDomain: 'capture-the-command.firebaseapp.com',
  projectId: 'capture-the-command',
  storageBucket: 'capture-the-command.firebasestorage.app',
  messagingSenderId: '535693922309',
  appId: '1:535693922309:web:57c7023d2b6307feb9cc6c',
  measurementId: 'G-72P9YFTTB8',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
