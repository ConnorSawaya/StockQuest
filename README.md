\# StockQuest

A Duolingo-style gamified website for teaching kids how to trade stocks.

## Quick Start

### Prerequisites
- Node.js 18+
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
├── client/                   # React frontend
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
│   │   │   ├── Landing.jsx           # Landing page with auth
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   ├── LessonsPage.jsx       # Module/lesson overview
│   │   │   ├── LessonScreen.jsx      # Interactive lesson player
│   │   │   ├── TradingSimulator.jsx  # Stock trading simulator
│   │   │   ├── Leaderboard.jsx       # Rankings
│   │   │   ├── Profile.jsx           # User profile + badges
│   │   │   ├── SettingsPage.jsx      # Settings + difficulty
│   │   │   └── ParentalDashboard.jsx # Parental controls
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
- **Trading Simulator** with 10 fake stocks, realistic price generation, and market events
- **Gamification**: Hearts, XP/Levels, Streaks, 15 Badges, Leaderboard
- **Parental Controls** with PIN gate, feature restrictions, time limits, and reports
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
| Auth       | JWT + bcrypt                                   |
