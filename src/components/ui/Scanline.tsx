export default function Scanline({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute inset-x-0 h-24 animate-scan-sweep"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(57,255,20,0.08), transparent)' }}
      />
    </div>
  )
}
