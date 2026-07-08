import { useTheme } from '../contexts/ThemeContext'

interface Props {
  onStart: () => void
  onSignIn: () => void
  signedIn: boolean
}

export default function LandingPage({ onStart, onSignIn, signedIn }: Props) {
  const { isDark } = useTheme()

  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: isDark
          ? `linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)`
          : `linear-gradient(rgba(0,119,34,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,119,34,0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl transition-colors duration-500" style={{ backgroundColor: isDark ? 'rgba(0,255,65,0.05)' : 'rgba(0,119,34,0.05)' }} />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl transition-colors duration-500" style={{ backgroundColor: isDark ? 'rgba(168,85,247,0.05)' : 'rgba(147,51,234,0.05)' }} />

      <div className="relative z-10 max-w-md w-full mx-4 animate-fade-in">
        <div className="rounded-2xl p-8 sm:p-10 shadow-2xl text-center backdrop-blur-2xl transition-colors duration-500" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-primary)', borderWidth: '1px' }}>
          {/* Terminal icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: isDark ? 'rgba(0,255,65,0.1)' : 'rgba(0,119,34,0.1)', borderColor: isDark ? 'rgba(0,255,65,0.2)' : 'rgba(0,119,34,0.2)', borderWidth: '1px' }}>
              <span className="text-3xl font-mono font-bold" style={{ color: 'var(--text-accent)' }}>&gt;_</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-mono font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--text-accent)' }}>C</span>apture the{' '}
            <span style={{ color: 'var(--text-accent)' }}>C</span>ommand
          </h1>

          {/* Tagline */}
          <p className="text-sm font-mono mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Learn Linux commands through interactive missions.<br />
            Capture flags. Level up. Become the Grandmaster.
          </p>

          {/* Stats bar */}
          <div className="flex justify-center gap-6 mt-6 text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
            <span>3 Tiers</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>16 Units</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>6 Ranks</span>
          </div>

          {/* Divider */}
          <div className="my-6 border-t" style={{ borderColor: 'var(--border-subtle)' }} />

          {/* Sign in button */}
          <button
            onClick={onSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 font-medium text-sm group active:scale-[0.98]"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderColor: 'var(--border-primary)',
              borderWidth: '1px',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
            }}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Guest link */}
          <div className="mt-4">
            <button
              onClick={onStart}
              className="text-[11px] font-mono transition-colors cursor-pointer hover:underline"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
            >
              Continue as Guest →
            </button>
          </div>

          {/* Signed in indicator */}
          {signedIn && (
            <div className="mt-4 text-[11px] font-mono animate-fade-in" style={{ color: 'var(--success)' }}>
              <svg className="w-4 h-4 inline-block mr-1 -mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Signed in — progress auto-saves
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-[9px] font-mono" style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>
            <span style={{ color: 'var(--text-accent)' }}>$</span> bash-bootcamp v1.0.0
          </div>
        </div>
      </div>
    </div>
  )
}
