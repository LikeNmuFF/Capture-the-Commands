import { useTerminal } from '../../hooks/useTerminal'
import { useGameStore } from '../../store/gameStore'
import OutputLine from './OutputLine'
import CommandInput from './CommandInput'

export default function Terminal() {
  const {
    input,
    setInput,
    inputRef,
    terminalEndRef,
    handleKeyDown,
    terminalHistory,
  } = useTerminal()

  const phase = useGameStore(s => s.phase)
  const inputEnabled = phase === 'mission' || phase === 'challenge'
  const isInputLocked = phase === 'quiz' || phase === 'completed'

  return (
    <div className="flex flex-col h-full bg-[#0d1117] rounded-xl overflow-hidden border border-[#30363d]/50 shadow-2xl shadow-black/40 crt-overlay">
      {/* macOS traffic light title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]/50 select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-apple-red shadow-sm shadow-red-500/20" />
          <div className="w-3 h-3 rounded-full bg-apple-yellow shadow-sm shadow-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-apple-green shadow-sm shadow-green-500/20" />
        </div>
        <span className="ml-3 text-[11px] text-white/30 font-mono tracking-wide">
          bash-bootcamp — Terminal
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-crt-green/40 animate-pulse" />
          <span className="text-[9px] text-white/20 font-mono hidden sm:inline">CONNECTED</span>
        </div>
      </div>

      {/* Terminal output */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-0.5 custom-scrollbar">
        {terminalHistory.length === 0 && (
          <div className="text-xs text-white/20 font-mono animate-pulse">
            {'_'}
          </div>
        )}
        {terminalHistory.map((line, i) => (
          <OutputLine key={i} line={line} />
        ))}

        {inputEnabled && (
          <CommandInput
            value={input}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            inputRef={inputRef}
          />
        )}

        {isInputLocked && (
          <div className="font-mono terminal-text text-white/60">
            <span className="text-crt-green/70">user@bash-bootcamp:~$ </span>
            <span className="text-white/20 italic">
              {phase === 'quiz'
                ? '(Answer the quiz to continue)'
                : '(Continue to next unit)'}
            </span>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center gap-3 px-4 py-1.5 bg-[#161b22] border-t border-[#30363d]/50">
        <span className="text-[10px] text-white/20 font-mono">NORMAL</span>
        <span className="text-[10px] text-white/15">·</span>
        <span className="text-[10px] text-white/20 font-mono">
          {phase.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
