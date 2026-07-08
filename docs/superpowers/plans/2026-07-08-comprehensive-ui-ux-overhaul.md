# Comprehensive UI/UX Overhaul — "Terminal OS" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Bash Bootcamp from a functional terminal-trainer into a cohesive, immersive "Retro-Futuristic Terminal OS" learning platform with a full motion system, distinctive typography, rich progression visualization, and delightful micro-interactions.

**Architecture:** A shared design-token + motion foundation (CSS variables in `index.css`, a `motion.ts` helper layer on top of `framer-motion`, and a small set of UI primitives in `src/components/ui/`) feeds every screen. Each existing page/component is redesigned in place to consume the new tokens and motion primitives, keeping all existing business logic (Zustand store, Firebase, content JSON) intact.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS v4 (CSS-first `@theme`), Zustand 5, Firebase 12, **framer-motion 12** (animations/transitions/layout), Google Fonts (Space Mono + Plus Jakarta Sans).

**Design Direction — "Retro-Futuristic Terminal OS" (Tron / cyberpunk):**
- **Display/terminal font:** `Space Mono` (monospace, characterful). **Body/UI font:** `Plus Jakarta Sans` (geometric, readable). Loaded via Google Fonts `<link>` in `index.html`.
- **Palette:** deep-space base (`#060a12` dark / `#eef2f7` light), glass surfaces, neon accents. Primary accent = **neon green `#39ff14`**; secondary = **Tron cyan `#00f0ff`**; tertiary = **magenta `#ff2e88`** for "arena/alert". Belt tiers each get a neon hue.
- **Motion language:** staggered entrance reveals, spring-based interactions, CRT scanline sweep on route change, boot/post sequences, particle/confetti on rewards. Full motion, respects `prefers-reduced-motion`.
- **Chrome metaphor:** every screen is a "window" in one OS — macOS-style title bars on terminal, system-status sidebars, OS-style boot & notifications.

---

## File Structure

**Foundation (new):**
- `src/index.css` — rewritten design tokens, fonts, CRT/scanline, animation keyframes (augments existing).
- `src/lib/motion.ts` — framer-motion variants/transitions reused everywhere (stagger, spring, page-sweep, glow).
- `src/lib/useReducedMotion.ts` — wrapper hook (re-export framer-motion's, with SSR-safe default).
- `src/components/ui/Button.tsx` — primary/ghost/terminal button variants.
- `src/components/ui/Card.tsx` — glass "window" card with optional title bar.
- `src/components/ui/Badge.tsx` — neon-outline badge.
- `src/components/ui/ProgressBar.tsx` — animated gradient progress (replaces inline divs).
- `src/components/ui/Scanline.tsx` — CRT overlay component (replaces `.crt-overlay` CSS class usage).
- `src/components/ui/Stat.tsx` — small stat readout.

**Landing + Auth/Boot:**
- `src/pages/LandingPage.tsx` — full hero + live demo terminal + tier/belt showcase + leaderboard teaser.
- `src/components/Auth/AuthModal.tsx` — OS login window, slide-in, profile-creation progress.
- `src/pages/WelcomePage.tsx` — expanded BIOS→kernel→login boot sequence + tier preview.

**AppShell / Layout:**
- `src/components/Layout/AppShell.tsx` — "System Navigator" sidebar + window title bar + mobile dock.
- `src/components/Layout/MobileNav.tsx` — bottom dock with slide-up sheets.
- `src/components/common/ThemeToggle.tsx` — keep, refine styling to neon.

**Terminal (hero):**
- `src/components/Terminal/Terminal.tsx` — larger hero, command-history rail, enhanced title bar, page-sweep entrance.
- `src/components/Terminal/OutputLine.tsx` — syntax-aware coloring (prompt/input/output/error/system), copy button.
- `src/components/Terminal/CommandInput.tsx` — autocomplete dropdown, history `↑/↓`, hint of `⌘K`.

**Progression / VisualUnitMap:**
- `src/components/Progress/VisualUnitMap.tsx` — interactive constellation map (nodes + orbital tier rings).
- `src/components/Progress/TierMap.tsx` — full tier roadmap card set.
- `src/components/Progress/XPDisplay.tsx` — animated XP pill (if used; verify import).

**Mission / Challenge / Quiz:**
- `src/components/Mission/MissionPanel.tsx` — Briefing / Hints / Reference tabs + progress ring.
- `src/components/Challenge/ChallengePanel.tsx` — "mission dossier" with progressive hints + validated flag input.
- `src/components/Quiz/QuizPanel.tsx` — full-screen assessment mode, instant feedback + explanation, streak.

**Rewards:**
- `src/components/Progress/BeltCeremony.tsx` — cinematic belt tie + particle burst + rank type-out.
- `src/components/common/XPToast.tsx` — verify it supports level-up + arena toasts (already does); refine visuals.
- `src/components/Progress/LevelUpBurst.tsx` (new) — full-screen level-up celebration.

**Config:**
- `index.html` — add Google Fonts links, update title/meta.
- `package.json` — add `framer-motion@^12.0.0`.
- `vite.config.ts` — unchanged (Tailwind plugin already present).

---

## Task 1: Install dependencies & fonts

**Files:**
- Modify: `package.json`
- Modify: `index.html`

- [ ] **Step 1: Add framer-motion dependency**

In `package.json` `dependencies`, add:
```json
"framer-motion": "^12.0.0"
```
Then run `npm install`.

- [ ] **Step 2: Add Google Fonts to index.html**

Replace `index.html` with:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#060a12" />
    <meta name="description" content="Bash Bootcamp — learn Linux commands through an immersive terminal OS. Capture flags. Level up. Become Grandmaster." />
    <title>Bash Bootcamp — Terminal OS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Verify install & build baseline**

Run: `npm run build`
Expected: build succeeds (current code compiles). If pre-existing modified files break build, note and proceed; we will fix in later tasks.

- [ ] **Step 4: Commit**

```bash
git add package.json index.html
git commit -m "chore: add framer-motion and Google Fonts for UI overhaul"
```

---

## Task 2: Design tokens & global CSS foundation

**Files:**
- Modify: `src/index.css`

Replace the `@theme` block and `:root`/theme blocks with the new token system. Keep all animation keyframes but add OS-specific ones. Full new `src/index.css` content:

```css
@import "tailwindcss";

@theme {
  --color-bg: #060a12;
  --color-bg-2: #0a1018;
  --color-surface: #0f1620;
  --color-surface-2: #141d29;
  --color-glass: rgba(15, 22, 32, 0.72);
  --color-border: rgba(57, 255, 20, 0.18);
  --color-border-soft: rgba(120, 160, 200, 0.12);
  --color-text: #e6f0ff;
  --color-text-2: #9fb3c8;
  --color-text-3: #5b7088;
  --color-accent: #39ff14;
  --color-accent-cyan: #00f0ff;
  --color-accent-magenta: #ff2e88;
  --color-warning: #ffb000;
  --color-error: #ff4d6d;
  --color-success: #39ff14;
  --font-display: 'Space Mono', 'JetBrains Mono', monospace;
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
}

:root {
  --sat: env(safe-area-inset-top, 0px);
  --sar: env(safe-area-inset-right, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
  --sal: env(safe-area-inset-left, 0px);
  --grid: rgba(57, 255, 20, 0.06);
}

/* Dark theme (default) */
.dark {
  --bg-primary: #060a12;
  --bg-secondary: #0a1018;
  --bg-tertiary: #141d29;
  --bg-surface: rgba(15, 22, 32, 0.95);
  --bg-glass: rgba(15, 22, 32, 0.72);
  --border-primary: rgba(57, 255, 20, 0.18);
  --border-subtle: rgba(120, 160, 200, 0.12);
  --text-primary: #e6f0ff;
  --text-secondary: #9fb3c8;
  --text-tertiary: #5b7088;
  --text-accent: #39ff14;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.55);
  --shadow-lg: 0 24px 64px rgba(0, 0, 0, 0.6);
  --overlay: rgba(2, 6, 12, 0.78);
  --input-bg: #0a1018;
  --input-border: rgba(120, 160, 200, 0.22);
  --success: #39ff14;
  --warning: #ffb000;
  --error: #ff4d6d;
  --info: #00f0ff;
  --neon-glow: 0 0 12px rgba(57, 255, 20, 0.35);
  --cyan-glow: 0 0 12px rgba(0, 240, 255, 0.35);
}

/* Light theme — "paper terminal" */
.light {
  --bg-primary: #eef2f7;
  --bg-secondary: #f7fafc;
  --bg-tertiary: #e2e8f0;
  --bg-surface: rgba(255, 255, 255, 0.92);
  --bg-glass: rgba(255, 255, 255, 0.78);
  --border-primary: rgba(0, 119, 34, 0.22);
  --border-subtle: rgba(30, 50, 80, 0.12);
  --text-primary: #0c1a2b;
  --text-secondary: #3d526b;
  --text-tertiary: #7c8 da0;
  --text-accent: #0a9c2e;
  --shadow-sm: 0 1px 2px rgba(10, 20, 40, 0.08);
  --shadow-md: 0 8px 24px rgba(10, 20, 40, 0.1);
  --shadow-lg: 0 24px 64px rgba(10, 20, 40, 0.14);
  --overlay: rgba(20, 30, 45, 0.45);
  --input-bg: #ffffff;
  --input-border: rgba(30, 50, 80, 0.2);
  --success: #0a9c2e;
  --warning: #9a6700;
  --error: #d1242f;
  --info: #0a7da0;
  --neon-glow: 0 0 10px rgba(10, 156, 46, 0.25);
  --cyan-glow: 0 0 10px rgba(10, 125, 160, 0.25);
}

@layer base {
  body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }
  * { scrollbar-width: thin; scrollbar-color: var(--border-primary) transparent; }
}

/* Grid + glow background helper */
.bg-grid {
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 48px 48px;
}
.bg-radial-glow {
  background:
    radial-gradient(60% 50% at 50% 0%, rgba(57,255,20,0.10), transparent 70%),
    radial-gradient(40% 40% at 100% 100%, rgba(0,240,255,0.08), transparent 70%);
}

.safe-bottom { padding-bottom: max(env(safe-area-inset-bottom, 0px), 0px); }
.safe-top { padding-top: max(env(safe-area-inset-top, 0px), 0px); }

.text-responsive { font-size: clamp(0.75rem, 2vw, 0.875rem); }
.terminal-text { font-family: var(--font-display); font-size: clamp(0.7rem, 1.8vw, 0.875rem); line-height: 1.55; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-primary); border-radius: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }

/* CRT scanlines */
.crt::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 20;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.10) 2px, rgba(0,0,0,0.10) 4px);
}
.crt::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 20;
  background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%);
}

/* Keep existing keyframes below (blink, pulse-glow, flicker, shimmer, boot-progress,
   fade-in, slide-up, scale-in, slide-in-right, typewriter, bounce-subtle, spin-slow)
   plus add: */
@keyframes grid-pan { from { background-position: 0 0; } to { background-position: 48px 48px; } }
@keyframes scan-sweep { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
@keyframes neon-breathe { 0%,100% { opacity: 0.85; } 50% { opacity: 1; } }
@keyframes float-y { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

.animate-grid-pan { animation: grid-pan 8s linear infinite; }
.animate-scan-sweep { animation: scan-sweep 3.2s ease-in-out infinite; }
.animate-neon-breathe { animation: neon-breathe 2.4s ease-in-out infinite; }
.animate-float-y { animation: float-y 4s ease-in-out infinite; }

/* keep all existing .animate-* utility classes from prior file */

@media (prefers-reduced-motion: reduce) {
  .animate-blink, .animate-pulse-glow, .animate-flicker, .animate-shimmer,
  .animate-bounce-subtle, .animate-spin-slow, .animate-grid-pan,
  .animate-scan-sweep, .animate-neon-breathe, .animate-float-y { animation: none; }
  .animate-fade-in, .animate-slide-up, .animate-scale-in, .animate-slide-in-right { animation-duration: 0.01ms; }
}

*:focus-visible { outline: 2px solid var(--text-accent); outline-offset: 2px; border-radius: 4px; }
button, [role="button"], a, input, select, textarea { min-height: 44px; }
a { color: var(--text-accent); text-decoration: none; transition: opacity 0.15s ease; }
a:hover { opacity: 0.85; }
::selection { background-color: var(--text-accent); color: var(--bg-primary); }
```

- [ ] **Step 4: Verify CSS compiles**

Run: `npm run build` (or start dev server). Expected: no CSS/PostCSS errors.

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "feat: new design tokens, fonts, CRT/scanline + OS motion foundation"
```

---

## Task 3: Motion library & UI primitives

**Files:**
- Create: `src/lib/motion.ts`
- Create: `src/lib/useReducedMotion.ts`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/ProgressBar.tsx`
- Create: `src/components/ui/Scanline.tsx`
- Create: `src/components/ui/Stat.tsx`

- [ ] **Step 1: Create motion helpers**

`src/lib/motion.ts`:
```ts
import { Variants, Transition } from 'framer-motion'

export const spring: Transition = { type: 'spring', stiffness: 320, damping: 30 }
export const softSpring: Transition = { type: 'spring', stiffness: 180, damping: 24 }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: softSpring },
}

export const pageSweep: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
  show: { opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const glow = (color = 'var(--text-accent)'): React.CSSProperties => ({
  boxShadow: `0 0 0 1px ${color}, 0 0 18px ${color}`,
})
```

`src/lib/useReducedMotion.ts`:
```ts
export { useReducedMotion } from 'framer-motion'
```

- [ ] **Step 2: Create UI primitives**

`src/components/ui/Button.tsx`:
```tsx
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { spring } from '../../lib/motion'

type Variant = 'primary' | 'ghost' | 'terminal' | 'danger'
interface Props {
  children: ReactNode
  onClick?: () => void
  variant?: Variant
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}
const styles: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--text-accent)', color: '#04140a', border: '1px solid var(--text-accent)', fontWeight: 700 },
  ghost: { background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' },
  terminal: { background: 'rgba(57,255,20,0.08)', color: 'var(--text-accent)', border: '1px solid var(--border-primary)', fontFamily: 'var(--font-display)' },
  danger: { background: 'transparent', color: 'var(--error)', border: '1px solid rgba(255,77,109,0.4)' },
}
export default function Button({ children, onClick, variant = 'primary', className = '', disabled, type = 'button' }: Props) {
  return (
    <motion.button
      type={type}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={spring}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={styles[variant]}
    >
      {children}
    </motion.button>
  )
}
```

`src/components/ui/Card.tsx`:
```tsx
import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'
import { fadeUp } from '../../lib/motion'

interface Props {
  children: ReactNode
  title?: string
  icon?: ReactNode
  className?: string
  variants?: Variants
  hover?: boolean
}
export default function Card({ children, title, icon, className = '', variants = fadeUp, hover = true }: Props) {
  return (
    <motion.div
      variants={variants}
      whileHover={hover ? { y: -3 } : undefined}
      className={`relative rounded-2xl backdrop-blur-xl overflow-hidden ${className}`}
      style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-md)' }}
    >
      {title && (
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          {icon}
          <span className="text-[11px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-tertiary)' }}>{title}</span>
        </div>
      )}
      {children}
    </motion.div>
  )
}
```

`src/components/ui/Badge.tsx`:
```tsx
import { ReactNode } from 'react'
interface Props { children: ReactNode; color?: string; className?: string }
export default function Badge({ children, color = 'var(--text-accent)', className = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${className}`}
      style={{ color, border: `1px solid ${color}`, background: `${color}1a` }}>
      {children}
    </span>
  )
}
```

`src/components/ui/ProgressBar.tsx`:
```tsx
import { motion } from 'framer-motion'
interface Props { value: number; max?: number; gradient?: string; height?: number }
export default function ProgressBar({ value, max = 100, gradient = 'linear-gradient(90deg, var(--text-accent), var(--accent-cyan))', height = 6 }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: 'rgba(120,160,200,0.12)' }}>
      <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        style={{ background: gradient, boxShadow: '0 0 10px rgba(57,255,20,0.4)' }} />
    </div>
  )
}
```

`src/components/ui/Scanline.tsx`:
```tsx
export default function Scanline({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-x-0 h-24 animate-scan-sweep"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(57,255,20,0.08), transparent)' }} />
    </div>
  )
}
```

`src/components/ui/Stat.tsx`:
```tsx
import { ReactNode } from 'react'
interface Props { label: string; value: ReactNode; sub?: string }
export default function Stat({ label, value, sub }: Props) {
  return (
    <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(120,160,200,0.06)', border: '1px solid var(--border-subtle)' }}>
      <div className="text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
      <div className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{value}</div>
      {sub && <div className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>{sub}</div>}
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`. Expected: compiles, no TS errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib src/components/ui
git commit -m "feat: motion helpers + UI primitive components (Button/Card/Badge/ProgressBar/Scanline/Stat)"
```

---

## Task 4: Landing page — hero + live demo + tier showcase

**Files:**
- Modify: `src/pages/LandingPage.tsx`

Redesign `LandingPage` as a full-screen immersive hero with: animated grid background, neon title with type-out, a **live mini-terminal demo** (non-auth, cycles sample commands), tier/belt showcase cards (using `content` tiers + belt colors), a leaderboard teaser, and the existing auth/guest CTAs styled with `Button`.

Key structure:
- Wrap hero in `motion.div` with `stagger`/`fadeUp` children.
- Live demo: a small `useEffect` that types `pwd`, `ls -a`, `cat readme.txt` into a faux terminal output array on a loop.
- Tier showcase: map `content.tiers`, each a `Card` with belt badge + focus text, `whileHover` lift.
- Keep props `onStart`, `onSignIn`, `signedIn`.

Implement full component (retain the existing prop signature and Google sign-in SVG). Use `useTheme` for `isDark`. Use `Scanline` overlay on the demo terminal. Add `bg-grid bg-radial-glow` background.

- [ ] **Step 1: Rewrite LandingPage.tsx** (full new code, ~180 lines, using primitives + motion + content tiers).

- [ ] **Step 2: Verify dev server renders** `npm run dev`, open `/`, confirm no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/LandingPage.tsx
git commit -m "feat: immersive landing page with live terminal demo + tier showcase"
```

---

## Task 5: Auth modal — OS login window

**Files:**
- Modify: `src/components/Auth/AuthModal.tsx`

Redesign as an OS "login window": `Card` with title bar "bash-bootcamp // auth", `motion` slide+scale entrance (`pageSweep`/`scaleIn`), keep Google SVG button via `Button variant="ghost"`, add "profile creation" micro-progress when `loading`. Keep `onLogin`/`onClose` props and error states.

- [ ] **Step 1: Rewrite AuthModal.tsx** using `Card`, `Button`, `motion`.
- [ ] **Step 2: `npm run dev`** → trigger sign-in modal, confirm animation + styling.
- [ ] **Step 3: Commit** `git commit -m "feat: OS-style auth modal with motion"`

---

## Task 6: Welcome/boot sequence expansion

**Files:**
- Modify: `src/pages/WelcomePage.tsx`

Expand boot lines into a realistic POST sequence (BIOS → kernel modules → mounting VFS → command parser → mission control → login prompt), each line typed with stagger via `motion`. Add a **tier preview carousel** below the prompt that auto-cycles the 3 tiers (belt + name + focus) with `AnimatePresence`. Keep `onStart` (any key/click) behavior. Add `bg-grid` + `Scanline`.

- [ ] **Step 1: Rewrite WelcomePage.tsx** with expanded sequence + tier carousel + motion.
- [ ] **Step 2: `npm run dev`** → confirm boot animation + carousel.
- [ ] **Step 3: Commit** `git commit -m "feat: expanded boot sequence + tier preview carousel"`

---

## Task 7: AppShell — System Navigator + window chrome + mobile dock

**Files:**
- Modify: `src/components/Layout/AppShell.tsx`
- Modify: `src/components/Layout/MobileNav.tsx`
- Modify: `src/components/common/ThemeToggle.tsx` (refine to neon; optional)

Redesign `AppShell`:
- Sidebar becomes "System Navigator": collapsible rail (icon-only when collapsed) with sections Mission/Challenge, Leaderboard, Arena, Profile; animated width via `motion`. Top "window title bar" shows app glyph, breadcrumb (Tier · Unit), `ProgressBar` XP, rank badge, `ThemeToggle`, sign-out.
- Desktop terminal area keeps `terminal` + adds page-sweep entrance.
- `MobileNav` becomes a bottom **dock** (terminal/map/progress/leaderboard/arena) with `motion` spring; panels open as slide-up sheets (`AnimatePresence`).
- Keep all store wiring (`phase`, `xp`, `rank`, `level`, `sidebarTab`, `mobileTab`).

- [ ] **Step 1: Rewrite AppShell.tsx** with navigator sidebar + title bar + dock integration.
- [ ] **Step 2: Rewrite MobileNav.tsx** as dock + slide-up sheets.
- [ ] **Step 3: `npm run dev`** → test desktop sidebar collapse + mobile dock.
- [ ] **Step 4: Commit** `git commit -m "feat: System Navigator sidebar + window chrome + mobile dock"`

---

## Task 8: Terminal hero component

**Files:**
- Modify: `src/components/Terminal/Terminal.tsx`
- Modify: `src/components/Terminal/OutputLine.tsx`
- Modify: `src/components/Terminal/CommandInput.tsx`

- **Terminal.tsx**: larger hero with `Scanline` overlay, enhanced macOS title bar (traffic lights + "bash-bootcamp — tty1" + connection LED), page-sweep entrance via `motion`. Add a thin **command-history rail** toggle (right side) listing recent commands.
- **OutputLine.tsx**: color by `line.type` (input = accent prompt, output = text-2, error = error red, system = cyan), add per-line copy button on hover.
- **CommandInput.tsx**: `↑/↓` history navigation (read from store `terminalHistory` inputs), a lightweight autocomplete dropdown of known commands on `Tab`, show `⌘K` hint.

Keep `useTerminal` hook usage; enhance `CommandInput` to accept history + autocomplete list.

- [ ] **Step 1: Rewrite Terminal.tsx** (hero + scanline + history rail).
- [ ] **Step 2: Rewrite OutputLine.tsx** (type coloring + copy).
- [ ] **Step 3: Rewrite CommandInput.tsx** (history + autocomplete + ⌘K hint).
- [ ] **Step 4: `npm run dev`** → run commands, confirm coloring/copy/history.
- [ ] **Step 5: Commit** `git commit -m "feat: terminal hero — scanlines, history rail, colored output, autocomplete"`

---

## Task 9: VisualUnitMap — constellation progression

**Files:**
- Modify: `src/components/Progress/VisualUnitMap.tsx`
- Modify: `src/components/Progress/TierMap.tsx`

- **VisualUnitMap.tsx**: interactive **constellation**: each tier = an orbital ring; units = nodes connected by glowing paths; completed nodes glow + check, current node pulses (`animate-pulse-glow`), locked nodes dim. Click unlocked node → `startUnit`. Use `motion` for node hover scale + path draw. Add tier label + belt badge.
- **TierMap.tsx**: roadmap cards per tier with belt swatch, focus, unit dots, completed/active state, `whileHover` lift.

Keep all store selectors (`currentTierId`, `completedUnits`, `unlockedUnits`, `phase`, `startUnit`).

- [ ] **Step 1: Rewrite VisualUnitMap.tsx** (constellation).
- [ ] **Step 2: Rewrite TierMap.tsx** (roadmap cards).
- [ ] **Step 3: `npm run dev`** → click nodes, confirm navigation.
- [ ] **Step 4: Commit** `git commit -m "feat: constellation unit map + tier roadmap cards"`

---

## Task 10: Mission / Challenge / Quiz panels

**Files:**
- Modify: `src/components/Mission/MissionPanel.tsx`
- Modify: `src/components/Challenge/ChallengePanel.tsx`
- Modify: `src/components/Quiz/QuizPanel.tsx`
- Modify: `src/components/Mission/HintButton.tsx` (verify exists; refine)

- **MissionPanel.tsx**: tabs **Briefing / Hints / Reference**. Briefing = step progress ring (`ProgressBar`) + instruction card + objectives checklist. Hints = collapsible earned hints. Reference = cheatsheet of `unit.commands` with one-line descriptions. Use `Card` + `motion` tab transitions (`AnimatePresence`).
- **ChallengePanel.tsx**: "mission dossier" — briefing box, progressive hint reveal (button per hint depth), flag input with live validation feedback (valid → green pulse, invalid → shake via `motion`), submit animation.
- **QuizPanel.tsx**: full-screen **assessment mode** — one question at a time, instant correct/incorrect with explanation text, streak counter, confetti on finish (CSS particles or simple `motion` burst), `ProgressBar` for question progress.

Keep store wiring (`useMission`, `getCurrentUnit`, `completeQuiz`, `submitFlag`, `phase`).

- [ ] **Step 1: Rewrite MissionPanel.tsx** (tabs + ring + reference).
- [ ] **Step 2: Rewrite ChallengePanel.tsx** (dossier + progressive hints + validated input).
- [ ] **Step 3: Rewrite QuizPanel.tsx** (assessment mode + streak + feedback).
- [ ] **Step 4: `npm run dev`** → walk a unit end-to-end.
- [ ] **Step 5: Commit** `git commit -m "feat: mission dossier tabs, challenge dossier, assessment-mode quiz"`

---

## Task 11: Belt ceremony & level-up celebration

**Files:**
- Modify: `src/components/Progress/BeltCeremony.tsx`
- Create: `src/components/Progress/LevelUpBurst.tsx`

- **BeltCeremony.tsx**: cinematic — belt materializes (scale/rotate `motion`), units orbit, rank title types out (`animate` via `motion` text), particle burst (small `motion` dots), XP recap. Keep `tierJustCompleted`, `clearTierComplete`, `advanceToNextUnit` wiring.
- **LevelUpBurst.tsx**: full-screen celebration triggered on level up (consume `xpToasts` type `levelup` or a store flag). Radial particle burst + "LEVEL UP" + new rank. Auto-dismiss.

- [ ] **Step 1: Rewrite BeltCeremony.tsx** (cinematic).
- [ ] **Step 2: Create LevelUpBurst.tsx** + wire into `AppShell` (render when a `levelup` toast present).
- [ ] **Step 3: `npm run dev`** → complete a unit, confirm ceremony + level-up burst.
- [ ] **Step 4: Commit** `git commit -m "feat: cinematic belt ceremony + level-up burst"`

---

## Task 12: Final polish, responsive & a11y pass

**Files:**
- Modify: `src/App.tsx` (loading screen + route transitions with `AnimatePresence`)
- Modify: `src/components/common/XPToast.tsx` (verify/hone visuals)
- Modify: `src/components/common/ThemeToggle.tsx` (neon refinement)

- [ ] **Step 1: Wrap screen switches in App.tsx** with `motion` `AnimatePresence` + `pageSweep`.
- [ ] **Step 2: Hone XPToast** styling to neon glass.
- [ ] **Step 3: Responsive audit** at 375 / 768 / 1024 / 1440 px — fix overflow, dock visibility, sidebar collapse.
- [ ] **Step 4: Reduced-motion audit** — toggle OS reduced motion, confirm animations disabled.
- [ ] **Step 5: Final `npm run build`** clean.
- [ ] **Step 6: Commit** `git commit -m "feat: route transitions, toast polish, responsive + a11y pass"`

---

## Self-Review

1. **Spec coverage:** Aesthetic (Task 2-3 tokens/fonts/CRT), full motion (Task 3 + every screen), landing+boot (4-6), terminal (8), appshell (7), unitmap (9), mission/challenge/quiz (10), belt/rewards (11), polish (12). All 6 priority areas covered.
2. **Placeholder scan:** Each task has concrete files + code for foundation; screen tasks specify structure + store wiring to retain. No "TBD".
3. **Type consistency:** `Button`/`Card`/`Badge`/`ProgressBar`/`Scanline`/`Stat` props stable across tasks; `motion.ts` exports (`fadeUp`, `stagger`, `scaleIn`, `pageSweep`, `spring`) referenced consistently. `useGameStore` selectors unchanged.

**Plan complete and saved to `docs/superpowers/plans/2026-07-08-comprehensive-ui-ux-overhaul.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Best for this large surface area.

**2. Inline Execution** — I execute tasks in this session using executing-plans, batching with checkpoints for your review.

Which approach?
