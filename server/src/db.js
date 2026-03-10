import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const DB_PATH = process.env.DB_PATH || './data/stockquest.db';

// Ensure data directory exists
mkdirSync(dirname(DB_PATH), { recursive: true });

// --- Initialize sql.js and load/create DB ---
const SQL = await initSqlJs();

let rawDb;
if (existsSync(DB_PATH)) {
  const buffer = readFileSync(DB_PATH);
  rawDb = new SQL.Database(buffer);
} else {
  rawDb = new SQL.Database();
}

// Save helper – writes current DB state to disk
function saveToDisk() {
  const data = rawDb.export();
  writeFileSync(DB_PATH, Buffer.from(data));
}

// Auto-save every 5 seconds so data isn't only in memory
const saveInterval = setInterval(saveToDisk, 5000);
process.on('exit', () => { clearInterval(saveInterval); saveToDisk(); });
process.on('SIGINT', () => { saveToDisk(); process.exit(); });
process.on('SIGTERM', () => { saveToDisk(); process.exit(); });

// --- Compatibility wrapper ---
// Provides the same API as better-sqlite3: db.prepare(sql).get/all/run, db.exec, db.pragma
function colsToObj(stmt) {
  const cols = stmt.getColumnNames();
  return (values) => {
    const obj = {};
    for (let i = 0; i < cols.length; i++) obj[cols[i]] = values[i];
    return obj;
  };
}

const db = {
  exec(sql) {
    rawDb.run(sql);
    saveToDisk();
  },

  pragma(str) {
    const [key, val] = str.split('=').map((s) => s.trim());
    if (val !== undefined) {
      rawDb.run(`PRAGMA ${key} = ${val}`);
    } else {
      const stmt = rawDb.prepare(`PRAGMA ${key}`);
      const result = stmt.step() ? stmt.get() : undefined;
      stmt.free();
      return result;
    }
  },

  prepare(sql) {
    return {
      get(...params) {
        const stmt = rawDb.prepare(sql);
        stmt.bind(params);
        let row = undefined;
        if (stmt.step()) {
          const toObj = colsToObj(stmt);
          row = toObj(stmt.get());
        }
        stmt.free();
        return row;
      },
      all(...params) {
        const stmt = rawDb.prepare(sql);
        stmt.bind(params);
        const rows = [];
        const toObj = colsToObj(stmt);
        while (stmt.step()) {
          rows.push(toObj(stmt.get()));
        }
        stmt.free();
        return rows;
      },
      run(...params) {
        rawDb.run(sql, params);
        const lastInsertRowid = rawDb.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] ?? 0;
        const changes = rawDb.getRowsModified();
        saveToDisk();
        return { lastInsertRowid, changes };
      },
    };
  },
};

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL DEFAULT 'Trader',
    avatar TEXT DEFAULT '🧑‍💼',
    role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('student', 'parent')),
    difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),
    parent_id INTEGER REFERENCES users(id),
    hearts INTEGER NOT NULL DEFAULT 5,
    xp INTEGER NOT NULL DEFAULT 0,
    cash REAL NOT NULL DEFAULT 10000.00,
    streak_count INTEGER NOT NULL DEFAULT 0,
    streak_last_date TEXT,
    streak_freeze_available INTEGER NOT NULL DEFAULT 1,
    notifications_enabled INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    required_score INTEGER NOT NULL DEFAULT 80
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES modules(id),
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'lesson' CHECK(type IN ('lesson', 'quiz', 'challenge')),
    order_index INTEGER NOT NULL DEFAULT 0,
    xp_reward INTEGER NOT NULL DEFAULT 25,
    content_json TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES lessons(id),
    score INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, lesson_id)
  );

  CREATE TABLE IF NOT EXISTS badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    criteria_type TEXT NOT NULL,
    criteria_value INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS user_badges (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL REFERENCES badges(id),
    earned_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, badge_id)
  );

  CREATE TABLE IF NOT EXISTS stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    sector TEXT,
    base_price REAL NOT NULL,
    volatility REAL NOT NULL DEFAULT 0.03,
    trend REAL NOT NULL DEFAULT 0.0
  );

  CREATE TABLE IF NOT EXISTS stock_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stock_id INTEGER NOT NULL REFERENCES stocks(id),
    day_index INTEGER NOT NULL,
    open_price REAL NOT NULL,
    close_price REAL NOT NULL,
    high_price REAL NOT NULL,
    low_price REAL NOT NULL,
    volume INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS portfolios (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id INTEGER NOT NULL REFERENCES stocks(id),
    shares INTEGER NOT NULL DEFAULT 0,
    avg_buy_price REAL NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, stock_id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id INTEGER NOT NULL REFERENCES stocks(id),
    type TEXT NOT NULL CHECK(type IN ('buy', 'sell')),
    shares INTEGER NOT NULL,
    price REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS leaderboard (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    weekly_xp INTEGER NOT NULL DEFAULT 0,
    week_start TEXT NOT NULL,
    PRIMARY KEY (user_id, week_start)
  );

  CREATE TABLE IF NOT EXISTS parental_controls (
    parent_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trading_enabled INTEGER NOT NULL DEFAULT 1,
    leaderboard_enabled INTEGER NOT NULL DEFAULT 1,
    max_daily_minutes INTEGER NOT NULL DEFAULT 60,
    restricted_modules TEXT DEFAULT '[]',
    pin_hash TEXT,
    PRIMARY KEY (parent_id, child_id)
  );

  CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
  CREATE INDEX IF NOT EXISTS idx_stock_prices_stock ON stock_prices(stock_id);
  CREATE INDEX IF NOT EXISTS idx_leaderboard_week ON leaderboard(week_start);
`);

export default db;
