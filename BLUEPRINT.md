# StockQuest — Duolingo-Style Stock Trading Education for Kids

## Complete Product Blueprint

---

## 1. Site Map & Page Flow

```
Landing Page
├── Sign Up / Log In
│   ├── Kid Account (with parental email)
│   └── Parent Account
│
├── Dashboard (Home)
│   ├── Daily Streak Widget
│   ├── Hearts / Lives Display
│   ├── XP / Level Progress
│   ├── Continue Learning CTA
│   └── Quick Stats
│
├── Lessons (Learning Path)
│   ├── Module 1: Stock Basics
│   │   ├── Lesson 1.1: What is a Stock?
│   │   ├── Lesson 1.2: How the Market Works
│   │   ├── Lesson 1.3: Bulls & Bears
│   │   ├── Lesson 1.4: Reading a Stock Ticker
│   │   └── Quiz: Module 1
│   ├── Module 2: Your First Trade
│   │   ├── Lesson 2.1: Buying & Selling
│   │   ├── Lesson 2.2: Portfolios
│   │   ├── Lesson 2.3: Profit & Loss
│   │   └── Simulated Trade Challenge
│   ├── Module 3: Trading Strategies
│   │   ├── Lesson 3.1: Buy Low, Sell High
│   │   ├── Lesson 3.2: Diversification
│   │   ├── Lesson 3.3: Risk vs Reward
│   │   └── Strategy Challenge
│   ├── Module 4: Reading Charts
│   │   ├── Lesson 4.1: Line Charts
│   │   ├── Lesson 4.2: Candlestick Basics
│   │   ├── Lesson 4.3: Trends & Patterns
│   │   └── Chart Reading Challenge
│   └── Module 5+: Advanced (Unlockable)
│       ├── Lesson: Market Events
│       ├── Lesson: Sectors & Industries
│       └── Sandbox Trading Mode
│
├── Trading Simulator
│   ├── Market Overview
│   ├── Stock Detail / Buy-Sell
│   ├── Portfolio Tracker
│   └── Trade History
│
├── Leaderboard
│   ├── Global Rankings
│   ├── Friends / Classroom
│   └── Weekly Challenges
│
├── Profile & Badges
│   ├── Badge Collection
│   ├── Trophy Case
│   ├── Stats & Achievements
│   └── Avatar Customization
│
├── Settings
│   ├── Account Settings
│   ├── Notification Preferences
│   ├── Difficulty Toggle
│   └── Theme Toggle (Light/Dark)
│
└── Parental Dashboard (Parent Accounts)
    ├── Child Progress Overview
    ├── Feature Restrictions
    ├── Export Reports
    └── Notification Settings
```

---

## 2. UI/UX Design Outline

### Design System

| Token             | Value                                    |
|-------------------|------------------------------------------|
| Primary Color     | `#4F46E5` (Indigo)                       |
| Success           | `#10B981` (Green)                        |
| Danger            | `#EF4444` (Red)                          |
| Warning           | `#F59E0B` (Amber)                        |
| Background        | `#FFFFFF` (White)                        |
| Surface           | `#F9FAFB` (Light gray)                   |
| Text Primary      | `#111827`                                |
| Text Secondary    | `#6B7280`                                |
| Border            | `#E5E7EB`                                |
| Border Radius     | `12px` (cards), `8px` (buttons/inputs)   |
| Font              | Inter / system-ui                        |
| Shadows           | Flat design — minimal or none            |

### Key Screens

**Dashboard:** Clean card layout. Top row: streak fire icon + count, hearts (❤️×5), XP bar. Main area: lesson path (vertical node tree like Duolingo). Sidebar: mini leaderboard, daily challenge.

**Lesson Screen:** Full-width white card. Progress bar at top. Question/content in center. Answer options as large tappable cards. Bottom: hearts display, skip button.

**Trading Simulator:** Split layout. Left: stock list with mini sparklines. Right: selected stock chart (line chart), buy/sell controls, portfolio summary card below.

**Leaderboard:** Simple table with rank, avatar, name, XP. Tabs for Global / Friends / Classroom. Current user highlighted.

**Profile:** Avatar at top, stats grid (lessons, XP, streaks, badges), scrollable badge grid below.

---

## 3. Gamification Rules Table

| Mechanic          | Rule                                                       |
|-------------------|------------------------------------------------------------|
| Hearts            | Start with 5. Lose 1 per wrong answer. Refill +1/hour (max 5). Full refill at midnight. |
| XP                | +10 per correct answer. +25 per lesson complete. +50 per module complete. +5 per profitable trade. |
| Streaks           | +1 day for completing ≥1 lesson. Reset to 0 if a day is missed. Streak freeze (1 per week) preserves streak. |
| Streak Rewards    | 3-day: +20 XP. 7-day: +50 XP + badge. 30-day: +200 XP + gold badge. |
| Level Unlock      | Must score ≥80% on module quiz to unlock next module.      |
| Badges            | First Trade, First Profit, 7-Day Streak, Chart Reader, Diversifier, Risk Manager, etc. |
| Leaderboard       | Ranked by weekly XP. Resets every Monday.                  |
| Daily Challenge    | 1 bonus challenge per day. +30 XP if completed.           |
| Difficulty Scaling | Beginner: guided hints, simpler charts. Intermediate: fewer hints. Advanced: real-time simulation, complex charts. |

---

## 4. Sample Fake Stock Generator Logic

```
function generateStockPrice(basePrice, volatility, trend, days):
    prices = [basePrice]
    for i in 1..days:
        change = randomNormal(0, volatility)    // gaussian noise
        trendBias = trend * 0.01                // slight upward/downward bias
        eventChance = random(0, 1)
        eventMultiplier = 1.0
        if eventChance > 0.95:                  // 5% chance of market event
            eventMultiplier = random(0.9, 1.1)  // ±10% spike
        newPrice = prices[i-1] * (1 + change + trendBias) * eventMultiplier
        newPrice = max(newPrice, 0.01)          // can't go below $0.01
        prices.append(round(newPrice, 2))
    return prices

// Example stocks
FUNCO  = generateStockPrice(25.00, 0.03, +0.5,  365)  // steady grower
WIPEY  = generateStockPrice(10.00, 0.08, -0.2,  365)  // volatile decliner
SAFEX  = generateStockPrice(50.00, 0.01, +0.1,  365)  // stable blue chip
ROCKYT = generateStockPrice(5.00,  0.12, +1.0,  365)  // high-risk high-reward
```

---

## 5. Database Schema

See `/server/schema.sql` for full SQL schema.

### Core Tables
- **users** — id, email, password_hash, display_name, avatar, role, difficulty, parent_id, hearts, xp, streak_count, streak_last_date, created_at
- **lessons** — id, module_id, title, description, order_index, content_json, type
- **modules** — id, title, description, order_index, required_score
- **user_progress** — user_id, lesson_id, completed, score, completed_at
- **badges** — id, name, description, icon, criteria_type, criteria_value
- **user_badges** — user_id, badge_id, earned_at
- **stocks** — id, symbol, name, sector, base_price, volatility, trend
- **stock_prices** — stock_id, date, open, close, high, low, volume
- **portfolios** — user_id, stock_id, shares, avg_buy_price
- **transactions** — id, user_id, stock_id, type (buy/sell), shares, price, timestamp
- **leaderboard** — user_id, weekly_xp, week_start
- **parental_controls** — parent_id, child_id, trading_enabled, max_daily_minutes, restricted_modules

---

## 6. Roadmap for Real Data Integration

| Phase | Description |
|-------|-------------|
| Phase 1 (Current) | Fully simulated stocks with generated patterns |
| Phase 2 | Delayed real market data (15-min delay) via free APIs (Alpha Vantage, Yahoo Finance) |
| Phase 3 | Paper trading with real-time data via sandbox APIs (Alpaca Paper Trading) |
| Phase 4 | Custodial brokerage integration (with full parental controls) |

### Recommended APIs
- **Alpha Vantage** — Free tier, 5 calls/min, good for delayed data
- **Alpaca Markets** — Paper trading API, free, REST + WebSocket
- **Polygon.io** — Real-time data, education tier available
- **IEX Cloud** — Sandbox mode for testing

---

## 7. Deployment Recommendations

| Component   | Recommendation                          |
|-------------|-----------------------------------------|
| Frontend    | Vercel or Netlify (React SPA)           |
| Backend     | Railway, Render, or AWS ECS             |
| Database    | Supabase (PostgreSQL) or PlanetScale    |
| Auth        | Built-in JWT + bcrypt                   |
| CI/CD       | GitHub Actions → auto-deploy on push    |
| CDN         | Cloudflare (free tier)                  |
| Monitoring  | Sentry (errors), Plausible (analytics)  |
| Storage     | S3 or Supabase Storage (avatars)        |

---

## 8. Lesson Content Examples

### Lesson 1.1: What is a Stock?

**Content:**
> Imagine you love a pizza shop. What if you could OWN a tiny piece of it? That's what a stock is! When you buy a stock, you own a small piece of a company.

**Quiz Questions:**
1. A stock represents... → ✅ A small piece of a company
2. If a company does well, what usually happens to its stock price? → ✅ It goes up
3. True or False: You need millions of dollars to buy stocks. → ✅ False

**Badge Earned:** 🎓 "First Steps" — Complete your first lesson.

### Trading Exercise: Module 2

**Scenario:**
> FUNCO stock is at $25. You have $100 to invest. The company just released good news!

**Challenge:** Buy stocks, watch the price over 5 simulated days, decide when to sell.

**Success Criteria:** Make any profit → +25 XP, "First Trade" badge.

---

*This blueprint serves as the complete specification. All code is in the project directories.*
