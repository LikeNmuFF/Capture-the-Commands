import { useState, useEffect, useCallback } from 'react'
import { onAuthChange, getCurrentUser } from './firebase/auth'
import { getUserData, updateUserProgress } from './firebase/firestore'
import { useGameStore } from './store/gameStore'
import LandingPage from './pages/LandingPage'
import WelcomePage from './pages/WelcomePage'
import BootcampPage from './pages/BootcampPage'
import AuthModal from './components/Auth/AuthModal'
import UsernameSetup from './components/Auth/UsernameSetup'

type Screen = 'landing' | 'boot' | 'game'

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [showAuth, setShowAuth] = useState(false)
  const [needsUsername, setNeedsUsername] = useState(false)
  const [pendingUser, setPendingUser] = useState<{ uid: string; displayName: string; photoURL: string; email: string } | null>(null)
  const [authLoaded, setAuthLoaded] = useState(false)

  const setUserId = useGameStore(s => s.setUserId)
  const hydrateState = useGameStore(s => s.hydrateState)

  const syncToFirebase = useCallback(() => {
    const unsub = useGameStore.subscribe((state) => {
      if (!state.userId) return
      updateUserProgress(state.userId, {
        xp: state.xp,
        currentTierId: state.currentTierId,
        currentUnitIndex: state.currentUnitIndex,
        currentStepIndex: state.currentStepIndex,
        phase: state.phase,
        completedUnits: state.completedUnits,
        unlockedUnits: state.unlockedUnits,
      })
    })
    return unsub
  }, [])

  useEffect(() => {
    let fired = false
    const unsub = onAuthChange(async (user) => {
      if (!fired) {
        fired = true
        setAuthLoaded(true)
      }
      if (user) {
        const data = await getUserData(user.uid)
        if (data) {
          hydrateState({
            xp: data.xp,
            currentTierId: data.currentTierId,
            currentUnitIndex: data.currentUnitIndex,
            currentStepIndex: data.currentStepIndex,
            phase: data.phase as any,
            completedUnits: data.completedUnits,
            unlockedUnits: data.unlockedUnits,
          })
          setUserId(user.uid)
          if ((data as any).role === 'admin') {
            useGameStore.getState().setAdmin(true)
          }
          setScreen('game')
        }
      } else {
        setUserId(null)
        useGameStore.getState().setAdmin(false)
      }
    })

    const unsubSync = syncToFirebase()

    return () => {
      unsub()
      unsubSync()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGuestStart = () => {
    setScreen('boot')
  }

  const handleSignIn = () => {
    setShowAuth(true)
  }

  const handleLoginComplete = async (uid: string, displayName: string, photoURL: string, email: string, isNew: boolean) => {
    setShowAuth(false)
    if (isNew) {
      setPendingUser({ uid, displayName, photoURL, email })
      setNeedsUsername(true)
    } else {
      const data = await getUserData(uid)
      if (data) {
        hydrateState({
          xp: data.xp,
          currentTierId: data.currentTierId,
          currentUnitIndex: data.currentUnitIndex,
          currentStepIndex: data.currentStepIndex,
          phase: data.phase as any,
          completedUnits: data.completedUnits,
          unlockedUnits: data.unlockedUnits,
        })
        setUserId(uid)
        setScreen('game')
      }
    }
  }

  const handleUsernameComplete = () => {
    setNeedsUsername(false)
    if (pendingUser) {
      setUserId(pendingUser.uid)
      setPendingUser(null)
    }
    setScreen('boot')
  }

  const handleBootComplete = () => {
    setScreen('game')
  }

  if (!authLoaded) {
    return <div className="h-screen w-screen bg-[#0a0a0a]" />
  }

  return (
    <>
      {screen === 'landing' && (
        <LandingPage
          onStart={handleGuestStart}
          onSignIn={handleSignIn}
          signedIn={!!getCurrentUser()}
        />
      )}
      {screen === 'boot' && (
        <WelcomePage onStart={handleBootComplete} />
      )}
      {screen === 'game' && <BootcampPage />}

      {showAuth && (
        <AuthModal
          onLogin={handleLoginComplete}
          onClose={() => setShowAuth(false)}
        />
      )}

      {needsUsername && pendingUser && (
        <UsernameSetup
          uid={pendingUser.uid}
          displayName={pendingUser.displayName}
          photoURL={pendingUser.photoURL}
          email={pendingUser.email}
          onComplete={handleUsernameComplete}
        />
      )}
    </>
  )
}

export default App
