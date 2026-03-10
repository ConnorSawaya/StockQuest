import 'dotenv/config';
import db from './db.js';
import { STOCK_DEFS } from './stockEngine.js';

console.log('Seeding StockQuest database...');

// ── Seed Modules ────────────────────────────────────────────────────────
const modules = [
  { id: 1, title: 'Stock Basics', description: 'Learn what stocks are and how the market works', icon: '📚', order_index: 1, required_score: 0 },
  { id: 2, title: 'Your First Trade', description: 'Learn how to buy, sell, and manage a portfolio', icon: '💰', order_index: 2, required_score: 80 },
  { id: 3, title: 'Trading Strategies', description: 'Learn smart approaches to buying and selling', icon: '🧠', order_index: 3, required_score: 80 },
  { id: 4, title: 'Reading Charts', description: 'Learn to read and understand stock charts', icon: '📈', order_index: 4, required_score: 80 },
  { id: 5, title: 'Advanced Trading', description: 'Master market events, sectors, and advanced strategies', icon: '🚀', order_index: 5, required_score: 80 },
];

const insertModule = db.prepare(
  'INSERT OR REPLACE INTO modules (id, title, description, icon, order_index, required_score) VALUES (?, ?, ?, ?, ?, ?)'
);

for (const m of modules) {
  insertModule.run(m.id, m.title, m.description, m.icon, m.order_index, m.required_score);
}
console.log(`  ✓ ${modules.length} modules seeded`);

// ── Seed Lessons ────────────────────────────────────────────────────────
const lessons = [
  // Module 1
  { id: 'L1-1', module_id: 1, title: 'What is a Stock?', type: 'lesson', order_index: 1, xp_reward: 25 },
  { id: 'L1-2', module_id: 1, title: 'How the Market Works', type: 'lesson', order_index: 2, xp_reward: 25 },
  { id: 'L1-3', module_id: 1, title: 'Bulls & Bears', type: 'lesson', order_index: 3, xp_reward: 25 },
  { id: 'L1-4', module_id: 1, title: 'Reading a Stock Ticker', type: 'lesson', order_index: 4, xp_reward: 25 },
  { id: 'module-1-quiz', module_id: 1, title: 'Module 1 Quiz', type: 'quiz', order_index: 5, xp_reward: 50 },
  // Module 2
  { id: 'L2-1', module_id: 2, title: 'Buying & Selling', type: 'lesson', order_index: 1, xp_reward: 25 },
  { id: 'L2-2', module_id: 2, title: 'Understanding Portfolios', type: 'lesson', order_index: 2, xp_reward: 25 },
  { id: 'L2-3', module_id: 2, title: 'Profit & Loss', type: 'lesson', order_index: 3, xp_reward: 25 },
  { id: 'module-2-quiz', module_id: 2, title: 'Module 2 Quiz', type: 'quiz', order_index: 4, xp_reward: 50 },
  // Module 3
  { id: 'L3-1', module_id: 3, title: 'Buy Low, Sell High', type: 'lesson', order_index: 1, xp_reward: 25 },
  { id: 'L3-2', module_id: 3, title: 'Risk vs Reward', type: 'lesson', order_index: 2, xp_reward: 25 },
  { id: 'module-3-quiz', module_id: 3, title: 'Module 3 Quiz', type: 'quiz', order_index: 3, xp_reward: 50 },
  // Module 4
  { id: 'L4-1', module_id: 4, title: 'Line Charts', type: 'lesson', order_index: 1, xp_reward: 25 },
  { id: 'L4-2', module_id: 4, title: 'Candlestick Basics', type: 'lesson', order_index: 2, xp_reward: 25 },
  { id: 'module-4-quiz', module_id: 4, title: 'Module 4 Quiz', type: 'quiz', order_index: 3, xp_reward: 50 },
  // Module 5
  { id: 'L5-1', module_id: 5, title: 'Market Events', type: 'lesson', order_index: 1, xp_reward: 30 },
  { id: 'module-5-quiz', module_id: 5, title: 'Module 5 Quiz', type: 'quiz', order_index: 2, xp_reward: 50 },
];

const insertLesson = db.prepare(
  'INSERT OR REPLACE INTO lessons (id, module_id, title, type, order_index, xp_reward, content_json) VALUES (?, ?, ?, ?, ?, ?, ?)'
);

for (const l of lessons) {
  insertLesson.run(l.id, l.module_id, l.title, l.type, l.order_index, l.xp_reward, '[]');
}
console.log(`  ✓ ${lessons.length} lessons seeded`);

// ── Seed Badges ─────────────────────────────────────────────────────────
const badges = [
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first lesson', icon: '🎓', criteria_type: 'complete_lesson', criteria_value: 1 },
  { id: 'first-trade', name: 'First Trade', description: 'Make your first stock trade', icon: '💹', criteria_type: 'trade_count', criteria_value: 1 },
  { id: 'first-profit', name: 'Money Maker', description: 'Make your first profit', icon: '💰', criteria_type: 'first_profit', criteria_value: 1 },
  { id: 'streak-3', name: 'On Fire', description: '3-day streak', icon: '🔥', criteria_type: 'streak', criteria_value: 3 },
  { id: 'streak-7', name: 'Unstoppable', description: '7-day streak', icon: '⚡', criteria_type: 'streak', criteria_value: 7 },
  { id: 'streak-30', name: 'Legend', description: '30-day streak', icon: '👑', criteria_type: 'streak', criteria_value: 30 },
  { id: 'module-1', name: 'Stock Scholar', description: 'Complete Module 1', icon: '📚', criteria_type: 'module_complete', criteria_value: 1 },
  { id: 'module-2', name: 'Trader Trainee', description: 'Complete Module 2', icon: '📊', criteria_type: 'module_complete', criteria_value: 2 },
  { id: 'module-3', name: 'Strategy Star', description: 'Complete Module 3', icon: '🧠', criteria_type: 'module_complete', criteria_value: 3 },
  { id: 'module-4', name: 'Chart Champion', description: 'Complete Module 4', icon: '📈', criteria_type: 'module_complete', criteria_value: 4 },
  { id: 'module-5', name: 'Market Master', description: 'Complete Module 5', icon: '🚀', criteria_type: 'module_complete', criteria_value: 5 },
  { id: 'diversifier', name: 'Diversifier', description: 'Own 5 different stocks', icon: '🌈', criteria_type: 'unique_stocks', criteria_value: 5 },
  { id: 'safe-trader', name: 'Safe Trader', description: '10 profitable trades in a row', icon: '🛡️', criteria_type: 'profit_streak', criteria_value: 10 },
  { id: 'xp-500', name: 'XP Hunter', description: 'Earn 500 XP', icon: '⭐', criteria_type: 'total_xp', criteria_value: 500 },
  { id: 'xp-2000', name: 'XP Master', description: 'Earn 2000 XP', icon: '🌟', criteria_type: 'total_xp', criteria_value: 2000 },
];

const insertBadge = db.prepare(
  'INSERT OR REPLACE INTO badges (id, name, description, icon, criteria_type, criteria_value) VALUES (?, ?, ?, ?, ?, ?)'
);

for (const b of badges) {
  insertBadge.run(b.id, b.name, b.description, b.icon, b.criteria_type, b.criteria_value);
}
console.log(`  ✓ ${badges.length} badges seeded`);

// ── Seed Stocks ─────────────────────────────────────────────────────────
const insertStock = db.prepare(
  'INSERT OR REPLACE INTO stocks (symbol, name, sector, base_price, volatility, trend) VALUES (?, ?, ?, ?, ?, ?)'
);

for (const s of STOCK_DEFS) {
  insertStock.run(s.symbol, s.name, s.sector, s.base, s.vol, s.trend);
}
console.log(`  ✓ ${STOCK_DEFS.length} stocks seeded`);

console.log('\n✅ Database seeded successfully!');
process.exit(0);
