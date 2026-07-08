# Capture the Command (Bash Bootcamp)

An interactive CTF-style Linux command learning platform built with React, TypeScript, and Firebase. Learn bash commands through gamified missions, quizzes, and challenges.

## Features

- **3 Tiers** (White, Yellow, Orange Belt) with **16 Units** total
- Interactive terminal with command execution
- Mission-based learning with step-by-step instructions
- Quiz system for knowledge verification
- CTF-style flag challenges
- XP progression and leveling system
- Global leaderboard with friend tracking
- Google OAuth authentication with Firebase
- Progress saving and syncing
- Responsive design (desktop + mobile)

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4
- **State:** Zustand with localStorage persistence
- **Backend:** Firebase (Auth, Firestore)
- **Build:** Vite 6
- **Deploy:** Vercel

## Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (for auth/firestore)

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd Intro_CTF_Learn

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Setup

### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** > **Google** sign-in provider
3. Create a **Firestore Database**
4. Update `src/firebase/config.ts` with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Login modal, username setup
│   ├── Challenge/      # Flag input, challenge panel
│   ├── Layout/         # App shell, mobile nav
│   ├── Leaderboard/    # Global/friends leaderboard
│   ├── Mission/        # Mission panel, hints
│   ├── Progress/       # XP display, tier map, belt ceremony
│   ├── Quiz/           # Quiz panel
│   └── Terminal/       # Terminal UI components
├── content/            # Tier/unit content (JSON)
├── engine/             # Virtual filesystem, command parser
├── firebase/           # Firebase config, auth, firestore
├── hooks/              # Custom React hooks
├── pages/              # Landing, welcome, bootcamp pages
├── store/              # Zustand game state
├── types/              # TypeScript definitions
└── utils/              # Level/rank calculations, flag verification
```

## Commands Implemented

### Tier 1 (White Belt)
`pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`, `echo`

### Tier 2 (Yellow Belt)
`cp`, `mv`, `rm`, `head`, `tail`

### Tier 3 (Orange Belt)
`grep`, `find`, `wc`, `sort`, `uniq`, pipes (`|`)

## Building for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.
