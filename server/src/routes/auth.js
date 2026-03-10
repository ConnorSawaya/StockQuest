import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import { generateToken, authMiddleware } from '../auth.js';

const router = Router();
const SALT_ROUNDS = 10;

// ── Sign Up ─────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName, role = 'student', parentEmail } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    let parentId = null;

    if (role === 'student' && parentEmail) {
      const parent = db.prepare('SELECT id FROM users WHERE email = ? AND role = ?').get(parentEmail, 'parent');
      if (parent) parentId = parent.id;
    }

    const result = db.prepare(
      'INSERT INTO users (email, password_hash, display_name, role, parent_id) VALUES (?, ?, ?, ?, ?)'
    ).run(email, passwordHash, displayName || 'Trader', role, parentId);

    const token = generateToken(result.lastInsertRowid);
    const user = db.prepare('SELECT id, email, display_name, role, xp, hearts, streak_count, cash, difficulty FROM users WHERE id = ?')
      .get(result.lastInsertRowid);

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Log In ──────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Get Current User ────────────────────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare(
    'SELECT id, email, display_name, avatar, role, xp, hearts, cash, streak_count, streak_last_date, difficulty, notifications_enabled, created_at FROM users WHERE id = ?'
  ).get(req.userId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  // Get badges
  const badges = db.prepare(
    'SELECT b.*, ub.earned_at FROM user_badges ub JOIN badges b ON b.id = ub.badge_id WHERE ub.user_id = ?'
  ).all(req.userId);

  // Get progress
  const progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').all(req.userId);

  // Get portfolio
  const portfolio = db.prepare('SELECT * FROM portfolios WHERE user_id = ?').all(req.userId);

  res.json({ user, badges, progress, portfolio });
});

// ── Update Settings ─────────────────────────────────────────────────────
router.patch('/me', authMiddleware, (req, res) => {
  const { difficulty, notifications_enabled, display_name, avatar } = req.body;
  const updates = [];
  const values = [];

  if (difficulty) { updates.push('difficulty = ?'); values.push(difficulty); }
  if (notifications_enabled !== undefined) { updates.push('notifications_enabled = ?'); values.push(notifications_enabled ? 1 : 0); }
  if (display_name) { updates.push('display_name = ?'); values.push(display_name); }
  if (avatar) { updates.push('avatar = ?'); values.push(avatar); }

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

  values.push(req.userId);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  res.json({ success: true });
});

export default router;
