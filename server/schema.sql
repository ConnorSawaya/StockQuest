-- ═══════════════════════════════════════════════════════════════════════
-- StockQuest Database Schema (PostgreSQL version for production)
-- ═══════════════════════════════════════════════════════════════════════

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(100) NOT NULL DEFAULT 'Trader',
  avatar        VARCHAR(50)  DEFAULT '🧑‍💼',
  role          VARCHAR(20)  NOT NULL DEFAULT 'student' CHECK(role IN ('student', 'parent')),
  difficulty    VARCHAR(20)  NOT NULL DEFAULT 'beginner' CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),
  parent_id     INTEGER      REFERENCES users(id) ON DELETE SET NULL,
  hearts        INTEGER      NOT NULL DEFAULT 5,
  xp            INTEGER      NOT NULL DEFAULT 0,
  cash          DECIMAL(12,2) NOT NULL DEFAULT 10000.00,
  streak_count  INTEGER      NOT NULL DEFAULT 0,
  streak_last_date DATE,
  streak_freeze_available BOOLEAN NOT NULL DEFAULT TRUE,
  notifications_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Modules
CREATE TABLE IF NOT EXISTS modules (
  id             INTEGER PRIMARY KEY,
  title          VARCHAR(200) NOT NULL,
  description    TEXT,
  icon           VARCHAR(50),
  order_index    INTEGER NOT NULL DEFAULT 0,
  required_score INTEGER NOT NULL DEFAULT 80
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id           VARCHAR(50) PRIMARY KEY,
  module_id    INTEGER NOT NULL REFERENCES modules(id),
  title        VARCHAR(200) NOT NULL,
  type         VARCHAR(20) NOT NULL DEFAULT 'lesson' CHECK(type IN ('lesson', 'quiz', 'challenge')),
  order_index  INTEGER NOT NULL DEFAULT 0,
  xp_reward    INTEGER NOT NULL DEFAULT 25,
  content_json JSONB NOT NULL DEFAULT '[]'
);

-- User Progress
CREATE TABLE IF NOT EXISTS user_progress (
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id    VARCHAR(50) NOT NULL REFERENCES lessons(id),
  score        INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id)
);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id             VARCHAR(50) PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  description    TEXT,
  icon           VARCHAR(50),
  criteria_type  VARCHAR(50) NOT NULL,
  criteria_value INTEGER NOT NULL DEFAULT 1
);

-- User Badges
CREATE TABLE IF NOT EXISTS user_badges (
  user_id   INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id  VARCHAR(50) NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMP   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Stocks
CREATE TABLE IF NOT EXISTS stocks (
  id         SERIAL PRIMARY KEY,
  symbol     VARCHAR(10) UNIQUE NOT NULL,
  name       VARCHAR(200) NOT NULL,
  sector     VARCHAR(100),
  base_price DECIMAL(10,2) NOT NULL,
  volatility DECIMAL(6,4) NOT NULL DEFAULT 0.03,
  trend      DECIMAL(6,3) NOT NULL DEFAULT 0.0
);

-- Stock Price History
CREATE TABLE IF NOT EXISTS stock_prices (
  id          SERIAL PRIMARY KEY,
  stock_id    INTEGER NOT NULL REFERENCES stocks(id),
  day_index   INTEGER NOT NULL,
  open_price  DECIMAL(10,2) NOT NULL,
  close_price DECIMAL(10,2) NOT NULL,
  high_price  DECIMAL(10,2) NOT NULL,
  low_price   DECIMAL(10,2) NOT NULL,
  volume      INTEGER NOT NULL DEFAULT 0
);

-- Portfolio Holdings
CREATE TABLE IF NOT EXISTS portfolios (
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stock_id      INTEGER NOT NULL REFERENCES stocks(id),
  shares        INTEGER NOT NULL DEFAULT 0,
  avg_buy_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, stock_id)
);

-- Trade Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stock_id   INTEGER NOT NULL REFERENCES stocks(id),
  type       VARCHAR(10) NOT NULL CHECK(type IN ('buy', 'sell')),
  shares     INTEGER NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Leaderboard (weekly aggregation)
CREATE TABLE IF NOT EXISTS leaderboard (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weekly_xp  INTEGER NOT NULL DEFAULT 0,
  week_start DATE NOT NULL,
  PRIMARY KEY (user_id, week_start)
);

-- Parental Controls
CREATE TABLE IF NOT EXISTS parental_controls (
  parent_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id            INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trading_enabled     BOOLEAN NOT NULL DEFAULT TRUE,
  leaderboard_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  max_daily_minutes   INTEGER NOT NULL DEFAULT 60,
  restricted_modules  JSONB DEFAULT '[]',
  pin_hash            VARCHAR(255),
  PRIMARY KEY (parent_id, child_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user  ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_prices_stock ON stock_prices(stock_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_week   ON leaderboard(week_start);
CREATE INDEX IF NOT EXISTS idx_users_email        ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_parent       ON users(parent_id);
