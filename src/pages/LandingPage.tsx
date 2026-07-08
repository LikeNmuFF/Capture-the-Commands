import { useState } from 'react'

interface Props {
  onStart: () => void
  onSignIn: () => void
  signedIn: boolean
}

export default function LandingPage({ onStart, onSignIn, signedIn }: Props) {
  const [hoverBtn, setHoverBtn] = useState(false)

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-crt-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-surface-light/80 backdrop-blur-2xl rounded-2xl border border-glass-border p-8 sm:p-10 shadow-2xl text-center">
          {/* Terminal icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-crt-green/10 border border-crt-green/20 flex items-center justify-center">
              <span className="text-3xl font-mono text-crt-green font-bold">_</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            <span className="text-crt-green">C</span>apture the{' '}
            <span className="text-crt-green">C</span>ommand
          </h1>

          {/* Tagline */}
          <p className="text-sm text-white/40 font-mono mt-3 leading-relaxed">
            Learn Linux commands through interactive missions.<br />
            Capture flags. Level up. Become the Grandmaster.
          </p>

          {/* Stats bar */}
          <div className="flex justify-center gap-6 mt-6 text-[10px] text-white/20 font-mono">
            <span>3 Tiers</span>
            <span className="text-white/10">|</span>
            <span>16 Units</span>
            <span className="text-white/10">|</span>
            <span>6 Ranks</span>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-glass-border/50" />

          {/* Sign in button */}
          <button
            onClick={onSignIn}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 transition-all duration-150 text-white font-medium text-sm group"
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
              className="text-[11px] text-white/20 hover:text-crt-green/60 font-mono transition-colors cursor-pointer"
            >
              Continue as Guest →
            </button>
          </div>

          {/* Signed in indicator */}
          {signedIn && (
            <div className="mt-4 text-[11px] text-crt-green/50 font-mono">
              ✓ Signed in — progress auto-saves
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-[9px] text-white/10 font-mono">
            <span className="text-crt-green/30">$</span> bash-bootcamp v1.0.0
          </div>
        </div>
      </div>
    </div>
  )
}
