import { useState } from 'react'
import { loginWithGoogle } from '../../firebase/auth'
import { useTheme } from '../../contexts/ThemeContext'

interface Props {
  onLogin: (uid: string, displayName: string, photoURL: string, email: string, isNew: boolean) => void
  onClose: () => void
}

export default function AuthModal({ onLogin, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isDark } = useTheme()

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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" style={{ backgroundColor: 'var(--overlay)' }}>
      <div
        className="rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 animate-scale-in"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-primary)',
          borderWidth: '1px'
        }}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)' }}>
            <svg className="w-8 h-8" style={{ color: 'var(--text-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Welcome to Bash Bootcamp</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Sign in to save your progress</p>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 font-medium text-sm active:scale-[0.98]"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderColor: 'var(--border-primary)',
            borderWidth: '1px',
            color: 'var(--text-primary)'
          }}
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
          <p className="text-xs text-center mt-3 font-mono" style={{ color: 'var(--error)' }}>{error}</p>
        )}

        <button
          onClick={onClose}
          className="w-full text-xs mt-4 transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
        >
          Maybe later — play locally
        </button>
      </div>
    </div>
  )
}
