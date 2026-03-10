import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../auth.js';
import { generatePriceHistory, generateOHLC, STOCK_DEFS, MARKET_EVENTS } from '../stockEngine.js';

const router = Router();

// ── Get all stocks with current prices ──────────────────────────────────
router.get('/stocks', (req, res) => {
  const stocks = db.prepare('SELECT * FROM stocks').all();

  const result = stocks.map((stock) => {
    const priceHistory = generatePriceHistory(stock.base_price, stock.volatility, stock.trend, 90);
    const price = priceHistory[priceHistory.length - 1];
    const prevPrice = priceHistory[priceHistory.length - 2];
    const change = price - prevPrice;

    return {
      id: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector,
      price,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round((change / prevPrice) * 10000) / 100,
      priceHistory,
      ohlc: generateOHLC(priceHistory),
    };
  });

  res.json(result);
});

// ── Buy stock ───────────────────────────────────────────────────────────
router.post('/trade/buy', authMiddleware, (req, res) => {
  const { stockId, shares, price } = req.body;
  if (!stockId || !shares || shares < 1 || !price) {
    return res.status(400).json({ error: 'stockId, shares, and price are required' });
  }

  const user = db.prepare('SELECT cash FROM users WHERE id = ?').get(req.userId);
  const cost = price * shares;
  if (cost > user.cash) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }

  const stock = db.prepare('SELECT * FROM stocks WHERE id = ?').get(stockId);
  if (!stock) return res.status(404).json({ error: 'Stock not found' });

  // Update cash
  db.prepare('UPDATE users SET cash = cash - ? WHERE id = ?').run(cost, req.userId);

  // Upsert portfolio
  const existing = db.prepare('SELECT * FROM portfolios WHERE user_id = ? AND stock_id = ?').get(req.userId, stockId);
  if (existing) {
    const totalShares = existing.shares + shares;
    const avgPrice = (existing.avg_buy_price * existing.shares + price * shares) / totalShares;
    db.prepare('UPDATE portfolios SET shares = ?, avg_buy_price = ? WHERE user_id = ? AND stock_id = ?')
      .run(totalShares, avgPrice, req.userId, stockId);
  } else {
    db.prepare('INSERT INTO portfolios (user_id, stock_id, shares, avg_buy_price) VALUES (?, ?, ?, ?)')
      .run(req.userId, stockId, shares, price);
  }

  // Record transaction
  db.prepare('INSERT INTO transactions (user_id, stock_id, type, shares, price) VALUES (?, ?, ?, ?, ?)')
    .run(req.userId, stockId, 'buy', shares, price);

  // Award XP for trading
  db.prepare('UPDATE users SET xp = xp + 5 WHERE id = ?').run(req.userId);

  // Check first-trade badge
  const tradeCount = db.prepare('SELECT COUNT(*) as count FROM transactions WHERE user_id = ?').get(req.userId).count;
  if (tradeCount === 1) {
    try {
      db.prepare('INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)').run(req.userId, 'first-trade');
    } catch { /* badge may not exist */ }
  }

  // Check diversifier badge
  const uniqueStocks = db.prepare('SELECT COUNT(DISTINCT stock_id) as count FROM portfolios WHERE user_id = ? AND shares > 0').get(req.userId).count;
  if (uniqueStocks >= 5) {
    try {
      db.prepare('INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)').run(req.userId, 'diversifier');
    } catch { /* badge may not exist */ }
  }

  const updatedUser = db.prepare('SELECT cash, xp FROM users WHERE id = ?').get(req.userId);
  res.json({ success: true, cash: updatedUser.cash, xp: updatedUser.xp });
});

// ── Sell stock ──────────────────────────────────────────────────────────
router.post('/trade/sell', authMiddleware, (req, res) => {
  const { stockId, shares, price } = req.body;
  if (!stockId || !shares || shares < 1 || !price) {
    return res.status(400).json({ error: 'stockId, shares, and price are required' });
  }

  const holding = db.prepare('SELECT * FROM portfolios WHERE user_id = ? AND stock_id = ?').get(req.userId, stockId);
  if (!holding || holding.shares < shares) {
    return res.status(400).json({ error: 'Insufficient shares' });
  }

  const revenue = price * shares;
  const profit = (price - holding.avg_buy_price) * shares;

  // Update cash
  db.prepare('UPDATE users SET cash = cash + ? WHERE id = ?').run(revenue, req.userId);

  // Update portfolio
  const remaining = holding.shares - shares;
  if (remaining > 0) {
    db.prepare('UPDATE portfolios SET shares = ? WHERE user_id = ? AND stock_id = ?')
      .run(remaining, req.userId, stockId);
  } else {
    db.prepare('DELETE FROM portfolios WHERE user_id = ? AND stock_id = ?')
      .run(req.userId, stockId);
  }

  // Record transaction
  db.prepare('INSERT INTO transactions (user_id, stock_id, type, shares, price) VALUES (?, ?, ?, ?, ?)')
    .run(req.userId, stockId, 'sell', shares, price);

  // XP for profitable trade
  if (profit > 0) {
    db.prepare('UPDATE users SET xp = xp + 5 WHERE id = ?').run(req.userId);

    // First profit badge
    try {
      db.prepare('INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)').run(req.userId, 'first-profit');
    } catch { /* badge may not exist */ }
  }

  const updatedUser = db.prepare('SELECT cash, xp FROM users WHERE id = ?').get(req.userId);
  res.json({ success: true, cash: updatedUser.cash, xp: updatedUser.xp, profit });
});

// ── Get portfolio ───────────────────────────────────────────────────────
router.get('/portfolio', authMiddleware, (req, res) => {
  const holdings = db.prepare(
    `SELECT p.*, s.symbol, s.name, s.sector
     FROM portfolios p JOIN stocks s ON s.id = p.stock_id
     WHERE p.user_id = ? AND p.shares > 0`
  ).all(req.userId);

  const user = db.prepare('SELECT cash FROM users WHERE id = ?').get(req.userId);
  res.json({ cash: user.cash, holdings });
});

// ── Get transactions ────────────────────────────────────────────────────
router.get('/transactions', authMiddleware, (req, res) => {
  const txns = db.prepare(
    `SELECT t.*, s.symbol, s.name
     FROM transactions t JOIN stocks s ON s.id = t.stock_id
     WHERE t.user_id = ? ORDER BY t.created_at DESC LIMIT 100`
  ).all(req.userId);
  res.json(txns);
});

// ── Get random market event ─────────────────────────────────────────────
router.get('/market-event', (req, res) => {
  const event = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
  res.json(event);
});

export default router;
