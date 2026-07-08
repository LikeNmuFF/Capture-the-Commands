export default function ArenaPage() {
  return (
    <div className="h-screen w-screen bg-surface flex items-center justify-center crt-overlay">
      <div className="text-center max-w-md px-6">
        <div className="text-6xl mb-6 opacity-30 font-mono">
          {'{ }'}
        </div>
        <h1 className="text-2xl font-bold text-white mb-3 font-mono">CTF Arena</h1>
        <div className="text-sm text-white/40 font-mono leading-relaxed mb-6">
          <p className="mb-2">[ COMING SOON ]</p>
          <p className="text-xs text-white/20">
            Master all 6 bootcamp tiers first.<br />
            The arena awaits those who complete the training.<br /><br />
            Future tools: nmap, netcat, Wireshark,<br />
            reverse engineering, and live challenge boxes.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-crt-green/50 font-mono">
          <span className="animate-pulse">◉</span>
          {`${6 - 0} tiers remaining until unlock`}
          <span className="animate-pulse">◉</span>
        </div>
      </div>
    </div>
  )
}
