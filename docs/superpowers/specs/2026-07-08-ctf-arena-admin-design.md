# CTF Arena + Admin Challenge System — Design Spec

## Overview
A standalone CTF Arena mode with 15+ real-world scenario challenges, plus an admin panel for creating new challenges via Firestore.

## Architecture

### Data Flow
```
Admin creates challenge via ChallengeForm
  → saved to Firestore collection arenaChallenges/{id}
  → ArenaPage reads via onSnapshot (real-time)
  → Player selects challenge → arenaSetup applies files/dirs to VirtualFS
  → Player solves → flag verified → XP awarded → marked solved
```

### Files Modified/Created
| File | Purpose |
|------|---------|
| `src/firebase/arenaChallenges.ts` | Firestore CRUD (createChallenge, listChallenges, deleteChallenge) |
| `src/utils/arenaSetup.ts` | Applies `{ dirs: string[], files: {path, content}[] }` to VirtualFS |
| `src/pages/AdminPanel.tsx` | Admin page with challenge list + create/edit UI |
| `src/components/Admin/ChallengeForm.tsx` | Form: title, category, difficulty, brief, hint, flag, dirs, files |
| `src/pages/ArenaPage.tsx` | Rewrite: reads Firestore, filterable grid, select-launch flow |
| `src/store/gameStore.ts` | Add `isAdmin: boolean`, `arenaSolved: string[]`, `arenaXp: number` |
| `src/content/arena.json` | 15 seed challenges (loaded if Firestore empty) |
| `src/components/Layout/AppShell.tsx` | Add "Admin Panel" tab in sidebar (when isAdmin) |
| `src/components/Layout/MobileNav.tsx` | Add Arena tab + Admin tab (if admin) |

### Challenge Schema (Firestore)
```ts
interface ArenaChallenge {
  id: string
  title: string
  category: 'forensics' | 'file_puzzle' | 'pipeline' | 'mixed'
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  brief: string
  hint: string
  flag: string
  xp: number  // auto: 50/100/200/300
  createdBy: string  // admin uid
  createdAt: number
  setup: {
    directories: string[]
    files: { path: string; content: string }[]
  }
}
```

### 15 Seed Challenges

**Forensics (4)**
1. Easy — Log Breach: Find suspicious IP in auth.log
2. Medium — The Deleted File: Recover flag from remnants
3. Hard — Timeline Reconstruction: Multi-log forensics
4. Expert — The Persistent Threat: Complex breach investigation

**File Puzzles (4)**
5. Easy — Needle in Haystack: Find flag in messy directory
6. Medium — Hidden in Plain Sight: Misleading filenames
7. Medium — The Split Secret: Piece fragments from multiple files
8. Hard — The Encoded Message: Decode base64/hex hidden flag

**Pipeline (4)**
9. Easy — Top Talkers: Most frequent IP via pipeline
10. Medium — The Filtered Flag: grep/cut/sort/uniq chain
11. Medium — Data Transformation: Parse structured data
12. Hard — The Statistics Report: Complex pipeline

**Mixed (3)**
13. Easy — The First Clue: Navigation + cat + grep
14. Medium — The Underground: Maze + file + pipeline
15. Hard — The Gauntlet: Multi-stage all-commands

### Admin Identification
- Firestore `users/{uid}` document has optional `role: 'admin'` field
- Checked on login → stored in gameStore `isAdmin`
- Only admins see "Admin Panel" in sidebar

### Admin Panel
- Shows list of all arena challenges (title, category, difficulty, status)
- Create button → ChallengeForm
- Edit/delete buttons per challenge
- Form fields: title, category dropdown, difficulty dropdown, brief textarea, hint textarea, flag input, directories dynamic list (path text input), files dynamic list (path + content textarea)

### Arena UI
- Filter chips: All / Forensics / File Puzzle / Pipeline / Mixed
- Difficulty badges: Easy (green), Medium (yellow), Hard (orange), Expert (red)
- Challenge cards with: title, category, difficulty badge, brief excerpt, solved checkmark
- Click → launches terminal with scenario files + brief panel + hint button + flag input
- Solved: green check, date, XP earned displayed
- Stats header: X/15 solved, total arena XP

### XP & State
- XP per difficulty: Easy=50, Medium=100, Hard=200, Expert=300
- Store: `arenaSolved: string[]` (challenge IDs), `arenaXp: number` (cumulative)
- Solved challenges persist to Firestore user profile
- Arena XP is separate from bootcamp XP (displayed separately)

### VirtualFS Setup
`arenaSetup(challenge)` iterates:
1. Create all directories in `setup.directories`
2. Create all files in `setup.files` with their content
3. Sets cwd to `/home/user` (same as bootcamp)

## Implementation Order
1. Create `arena.json` with 15 seed challenges
2. Create `arenaSetup.ts` utility
3. Create `arenaChallenges.ts` Firestore CRUD
4. Update `gameStore.ts` (isAdmin, arenaSolved, arenaXp)
5. Rewrite `ArenaPage.tsx` (Firestore-connected grid)
6. Create `ChallengeForm.tsx`
7. Create `AdminPanel.tsx`
8. Update `AppShell.tsx` (Admin tab)
9. Wire up MobileNav tabs
