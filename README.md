# FinPlay

Mobile-first gamified financial literacy PWA built with React + Vite + Tailwind CSS.

## Included

- React Router navigation
- Zustand global XP/coins/levels/badges/streak state
- localStorage persistence by default
- optional Firebase Auth/Firestore cloud persistence
- Budget Game with percentage allocation and validation
- Saving Game with goals, check-ins and streaks
- Investing simulation with weighted-ish random asset outcomes and Recharts
- Profile, badges, mock leaderboard and stats
- Framer Motion reward toast animations
- PWA manifest
- max-width 420px phone-style desktop layout

## Run

```bash
npm install
npm run dev
```

## Firebase

Copy `.env.example` to `.env` and add your Firebase Web App credentials.

Then enable the Firebase services you want to use. The current implementation will still work locally if Firebase variables are absent.

## Important production note

This is an educational simulation. Investment returns are randomized and should not be interpreted as real investment forecasts or financial advice.
