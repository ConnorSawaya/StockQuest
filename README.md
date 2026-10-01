# StockQuest

A browser demo for learning stock market basics with sample lessons and simulated prices.

## Hosted demo

The public showcase at [connors.dev/stockquest](https://connors.dev/stockquest) builds only the React client. It runs with in-memory sample data and resets when the page reloads. It does not create accounts, send data to the backend, provide live quotes, or place real trades. The parent dashboard and demo tools are previews, not security or parental controls. Do not enter personal or financial information. The app is for learning and is not financial advice.

Every push to `master` builds and publishes the client to GitHub Pages. The backend is not deployed by that workflow.

### Update the hosted demo

- Install and run the frontend from `client/` with `npm ci` and `npm run dev`.
- Edit landing-page copy in `client/src/pages/Landing.jsx`; add or change screens in `client/src/pages/` and register their paths in `client/src/App.jsx`.
- Run `npm run build` from `client/` before pushing. GitHub Actions also runs `npm audit` and builds the static client.
- Push changes to `master` to publish. The Pages workflow deploys only `client/`; backend edits do not change the hosted demo.
- The browser demo needs no API keys or secrets. Do not add credentials to the frontend.

## Quick Start

### Prerequisites
- Node.js 22.12+
- npm

### Frontend (React + Vite + Tailwind)

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend (Node.js + Express + SQLite)

```bash
cd server
cp .env.example .env
npm install
npm run seed   # Seeds the database with modules, lessons, badges, stocks
npm run dev
```

API runs at [http://localhost:4000](http://localhost:4000)

## Project Structure

```
├── BLUEPRINT.md              # Complete product blueprint & specification
├── client/                   # React demo frontend (hosted)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx        # Sidebar + mobile navigation
│   │   │   ├── Gamification.jsx  # Hearts, XP bar, badges, stats
│   │   │   ├── Charts.jsx        # Stock charts, sparklines, portfolio charts
│   │   │   └── Feedback.jsx      # Animations: correct/wrong, badge unlock, lesson complete
│   │   ├── data/
│   │   │   └── lessons.js        # Full curriculum data (5 modules, 17 lessons)
│   │   ├── lib/
│   │   │   └── stockEngine.js    # Fake stock price generator + market events
│   │   ├── pages/
│   │   │   ├── Landing.jsx           # Local demo start screen
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   ├── LessonsPage.jsx       # Module/lesson overview
│   │   │   ├── LessonScreen.jsx      # Interactive lesson player
│   │   │   ├── TradingSimulator.jsx  # Stock trading simulator
│   │   │   ├── Leaderboard.jsx       # Rankings
│   │   │   ├── Profile.jsx           # User profile + badges
│   │   │   ├── SettingsPage.jsx      # Settings + difficulty
│   │   │   └── ParentalDashboard.jsx # Parent dashboard preview
│   │   ├── store/
│   │   │   └── useStore.js       # Zustand state management
│   │   ├── App.jsx               # Router + layout
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Tailwind + custom classes
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── server/                   # Node.js backend
    ├── src/
    │   ├── routes/
    │   │   ├── auth.js           # Signup, login, user profile
    │   │   ├── lessons.js        # Lesson CRUD, progress tracking
    │   │   ├── trading.js        # Stock data, buy/sell, portfolio
    │   │   └── gamification.js   # Hearts, XP, streaks, badges, leaderboard
    │   ├── db.js                 # SQLite database setup + schema
    │   ├── auth.js               # JWT token generation + middleware
    │   ├── stockEngine.js        # Server-side stock generator
    │   ├── seed.js               # Database seeder
    │   └── index.js              # Express app entry point
    ├── schema.sql                # PostgreSQL schema (production)
    ├── .env.example
    └── package.json
```

## Features

- **5 Learning Modules** with 17 lessons covering stock basics → advanced trading
- **Interactive Quizzes** with instant feedback, hearts system, and XP rewards
- **Trading Simulator** with 10 sample stocks, simulated prices, and sample market events
- **Gamification**: Hearts, XP/Levels, Streaks, 15 Badges, Leaderboard
- **Parent dashboard preview** with sample PIN gate, toggles, and progress export; it does not enforce controls
- **Responsive Design** — works on desktop and mobile
- **Clean White Flat UI** — minimalistic, kid-friendly design

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Zustand         |
| Charts     | Recharts                                       |
| Animations | Framer Motion                                  |
| Icons      | Lucide React                                   |
| Backend    | Node.js, Express                               |
| Database   | SQLite (dev) / PostgreSQL (production)          |
| Auth       | JWT + bcrypt (backend prototype; not connected to the hosted client) |
