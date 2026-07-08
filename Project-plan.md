# Bash Bootcamp → CTF Arena
### Project Plan v1.0

A gamified Linux/bash learning platform that teaches command-line skills through simulated-terminal missions and quizzes, then graduates learners into real CTF-style challenges — built entirely on free-tier infrastructure.

---

## 1. Core Concept

```
LEARN  →  QUIZ  →  CHALLENGE  →  FLAG  →  next unit (harder)
                                            ...
                              Tier 6 complete → CTF ARENA
```

Every unit repeats the same loop:

1. **Teach** — guided simulated-terminal mission (step-by-step, hints available)
2. **Quiz** — 3–5 quick questions, no terminal, checks conceptual understanding
3. **Challenge** — open-ended puzzle using only that unit's commands, no hand-holding
4. **Flag** — solving the challenge outputs a `flag{...}` the user submits to unlock the next unit

Units are grouped into **tiers (belts)**. The last tier deliberately mirrors real CTF challenge format (same flag syntax, same submission UI) so the jump to the arena is not a new mental model — just a harder, more open box.

---

## 2. Architecture

### 2.1 High-level diagram (conceptual)

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                       │
│  ┌───────────────┐ ┌───────────────┐ ┌────────────────────┐ │
│  │ Terminal Sim   │ │ Quiz Engine   │ │ Progress/XP UI      │ │
│  │ (virtual FS,   │ │ (static JSON  │ │ (mission log, tiers,│ │
│  │ command parser)│ │ or Firestore) │ │ badges, XP bar)      │ │
│  └───────┬───────┘ └───────┬───────┘ └──────────┬──────────┘ │
└──────────┼─────────────────┼────────────────────┼────────────┘
           │                 │                     │
           ▼                 ▼                     ▼
   ┌────────────────────────────────────────────────────────┐
   │              Firebase Auth (login/session)              │
   └────────────────────────────────────────────────────────┘
           │                 │                     │
           ▼                 ▼                     ▼
   ┌────────────────────────────────────────────────────────┐
   │  Firestore: users, quizzes, challenges, submissions      │
   └────────────────────────────────────────────────────────┘
           │
           ▼
   ┌────────────────────────────────────────────────────────┐
   │  Cloud Functions: verifyFlag(), grantXP(), unlockTier()  │
   │  (flag hashes never shipped to client)                  │
   └────────────────────────────────────────────────────────┘

   ── later phase ──
   ┌────────────────────────────────────────────────────────┐
   │  CTFd (self-hosted, Oracle Cloud Always-Free VM)         │
   │  Real containerized challenges, shared login via SSO/    │
   │  shared user id, imports XP from Firestore                │
   └────────────────────────────────────────────────────────┘
```

### 2.2 Why this shape

- **Everything above the dotted line is 100% static/serverless** — no always-on cost, scales on Vercel + Firebase free tiers.
- **Flag verification never happens client-side.** The correct flag (or its hash) lives only in a Cloud Function / Firestore rule the client can't read directly — otherwise anyone can open devtools and read the answer out of the React bundle.
- **The CTF arena is architecturally separate** from the bootcamp. This lets you ship the entire bootcamp (Tiers 1–6) as a finished, free product first, and only take on server costs when you're ready for real live challenge boxes.

---

## 3. Tech Stack (all free-tier)

| Layer | Tool | Free-tier notes |
|---|---|---|
| Frontend framework | React (Vite) + Tailwind CSS | No cost, you already know this combo |
| Hosting | Vercel | Free tier is generous for this scale |
| Terminal simulation | Client-side JS (virtual filesystem + command parser) | Zero infra — runs entirely in-browser |
| Auth | Firebase Authentication | Free up to very high limits for a small community |
| Database | Firestore | Free tier: ~50k reads / 20k writes per day — plenty here |
| Quiz content | Firestore collection OR static JSON bundled with app | JSON is simpler if content is fixed; Firestore if you want to edit without redeploying |
| Flag verification | Firebase Cloud Functions | Free tier: 2M invocations/month; keeps answers server-side |
| CTF arena (later phase) | CTFd (open source) | Free software; needs a small always-on VM |
| CTF arena hosting (later phase) | Oracle Cloud "Always Free" VM | Unlike Render/Fly/Railway free tiers (which sleep or expire), this stays free and always-on |

**Total cost through Phase 3 (full bootcamp, no live CTF containers): ₱0.**
Cost only enters the picture in Phase 4, and even then it's a free VM tier, not a paid one.

---

## 4. Features

### 4.1 Bootcamp (Phases 1–3)

- Simulated bash terminal with a realistic virtual filesystem per user session
- Command parser supporting: `pwd, ls, cd, mkdir, touch, cat, echo, rm, cp, mv, grep, find, chmod, whoami, ps, clear, help`
- Guided missions with objective-checking (validates real command output/state, not just string matching)
- Hint system (on-demand, doesn't block progress)
- Quiz engine — short conceptual checks between teach and challenge stages
- Open-ended challenge mode — no hints, no step list, just a brief and a flag to find
- XP + leveling system, mission log UI, tier/badge progression
- Flag submission with server-side verification (Cloud Function)
- User accounts with persistent progress (Firebase Auth + Firestore)

### 4.2 CTF Arena hand-off (Phase 4+)

- Shared identity between bootcamp and arena (same account, XP carries over)
- First real challenge unlocks automatically once Tier 6 is complete
- CTFd-hosted challenges: static-file puzzles first (downloadable files, hosted vulnerable static pages, hash/crypto puzzles) before attempting live containerized boxes
- Scoreboard / leaderboard (CTFd has this built in)

### 4.3 Content structure (tiers)

| Tier | Focus | Core commands |
|---|---|---|
| 1 | Navigation | `pwd, ls, cd, mkdir, touch, cat` |
| 2 | Files & text | `echo, redirection (>, >>), cp, mv, rm, head, tail` |
| 3 | Search & pipes | `grep, find, wc, sort, \|` |
| 4 | Permissions & users | `chmod, chown, whoami, sudo` |
| 5 | Processes & networking | `ps, kill, curl, ping, netstat` |
| 6 | Archives & remote (CTF bridge) | `tar, zip, ssh, scp` |

---

## 5. Phases

### Phase 1 — Core Terminal + Tier 1–2 (MVP)
- Build the virtual filesystem + command parser (already prototyped)
- Implement Tiers 1–2 missions with objective-checking
- Basic XP/mission-log UI, no accounts yet (local state only)
- **Goal:** a playable, shippable demo

### Phase 2 — Accounts, Persistence, Quizzes
- Integrate Firebase Auth (login/signup)
- Move progress into Firestore (per-user XP, completed units, tier unlocks)
- Add the quiz engine between teach and challenge stages
- Add Cloud Function for flag verification (server-side, hashed)

### Phase 3 — Full Curriculum + Challenge Mode
- Build out Tiers 3–6 content (missions, quizzes, challenges)
- Add open-ended "challenge" stage per unit (no hints, realistic brief)
- Polish progression UI: badges, tier completion screens, leaderboard (in-app, Firestore-based)
- **Goal:** complete, self-contained bootcamp product — no server costs yet

### Phase 4 — CTF Arena Hand-off
- Stand up CTFd on an Oracle Cloud Always-Free VM
- Design first set of arena challenges as static-file / hosted-page puzzles (no live containers yet)
- Wire up shared identity: Tier-6 completion in Firestore unlocks first CTFd challenge
- **Goal:** real CTF experience, still free

### Phase 5 — Live Challenge Boxes (stretch goal)
- Introduce containerized, interactive vulnerable challenges (e.g. via CTFd's Docker challenge support)
- Only take this on once Phase 4 is stable — this is the first point where infra complexity (and potentially cost, if traffic grows past free-VM capacity) becomes real

---

## 6. Data Model (Firestore)

```
users/{uid}
  xp: number
  currentTier: number
  completedUnits: string[]
  badges: string[]

quizzes/{tierId}
  questions: [{ q, options, correctIndex }]

challenges/{tierId}
  brief: string
  flagHash: string        // never sent to client in plaintext

submissions/{uid}_{challengeId}
  solved: boolean
  timestamp: number
```

---

## 7. Open Decisions to Revisit

- Whether quiz/challenge content lives in Firestore (editable without redeploy) or static JSON (simpler, redeploy to update)
- Whether Tier 6 needs `ssh`/`scp` simulated locally, or should be the first thing that points to a real (but simple) remote target
- How aggressive to be about anti-cheating on client-side terminal state (a determined user could inspect the JS) — acceptable for a learning tool, but worth flagging before this becomes a scored competition with prizes
