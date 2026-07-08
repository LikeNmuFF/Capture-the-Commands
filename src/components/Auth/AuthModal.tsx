import { useState } from 'react'
import { loginWithGoogle } from '../../firebase/auth'

interface Props {
  onLogin: (uid: string, displayName: string, photoURL: string, email: string, isNew: boolean) => void
  onClose: () => void
}

export default function AuthModal({ onLogin, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      const user = await loginWithGoogle()
      const isNew = user.metadata.creationTime === user.metadata.lastSignInTime
      onLogin(user.uid, user.displayName || 'User', user.photoURL || '', user.email || '', isNew)
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled.')
      } else {
        setError('Failed to sign in. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-light rounded-2xl border border-glass-border p-8 shadow-2xl max-w-sm w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🐚</div>
          <h2 className="text-lg font-semibold text-white">Welcome to Bash Bootcamp</h2>
          <p className="text-sm text-white/40 mt-1">Sign in to save your progress</p>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 transition-all duration-150 disabled:opacity-50 text-white font-medium text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {error && (
          <p className="text-red-400/80 text-xs text-center mt-3 font-mono">{error}</p>
        )}

        <button
          onClick={onClose}
          className="w-full text-xs text-white/30 hover:text-white/50 mt-4 transition-colors"
        >
          Maybe later — play locally
        </button>
      </div>
    </div>
  )
}
