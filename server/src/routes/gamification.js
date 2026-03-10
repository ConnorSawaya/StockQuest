import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../auth.js';

const router = Router();

// ── Hearts ──────────────────────────────────────────────────────────────
router.post('/hearts/lose', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT hearts FROM users WHERE id = ?').get(req.userId);
  if (user.hearts > 0) {
    db.prepare('UPDATE users SET hearts = hearts - 1 WHERE id = ?').run(req.userId);
  }
  res.json({ hearts: Math.max(0, user.hearts - 1) });
});

router.post('/hearts/refill', authMiddleware, (req, res) => {
  db.prepare('UPDATE users SET hearts = 5 WHERE id = ?').run(req.userId);
  res.json({ hearts: 5 });
});

// ── XP ──────────────────────────────────────────────────────────────────
router.post('/xp/add', authMiddleware, (req, res) => {
  const { amount } = req.body;
  if (!amount || amount < 0) return res.status(400).json({ error: 'Invalid amount' });
  db.prepare('UPDATE users SET xp = xp + ? WHERE id = ?').run(amount, req.userId);
  const user = db.prepare('SELECT xp FROM users WHERE id = ?').get(req.userId);
  res.json({ xp: user.xp });
});

// ── Streak ──────────────────────────────────────────────────────────────
router.post('/streak/record', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT streak_count, streak_last_date FROM users WHERE id = ?').get(req.userId);
  const today = new Date().toISOString().split('T')[0];

  if (user.streak_last_date === today) {
    return res.json({ streak: user.streak_count, message: 'Already recorded today' });
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = user.streak_last_date === yesterday ? user.streak_count + 1 : 1;

  db.prepare('UPDATE users SET streak_count = ?, streak_last_date = ? WHERE id = ?')
    .run(newStreak, today, req.userId);

  // Bonus XP for streaks
  let bonusXP = 0;
  if (newStreak === 3) bonusXP = 20;
  else if (newStreak === 7) bonusXP = 50;
  else if (newStreak === 30) bonusXP = 200;
  else if (newStreak % 7 === 0) bonusXP = 25;

  if (bonusXP > 0) {
    db.prepare('UPDATE users SET xp = xp + ? WHERE id = ?').run(bonusXP, req.userId);
  }

  res.json({ streak: newStreak, bonusXP });
});

// ── Badges ──────────────────────────────────────────────────────────────
router.get('/badges', authMiddleware, (req, res) => {
  const allBadges = db.prepare('SELECT * FROM badges').all();
  const earned = db.prepare(
    'SELECT badge_id, earned_at FROM user_badges WHERE user_id = ?'
  ).all(req.userId);

  const result = allBadges.map((b) => {
    const e = earned.find((eb) => eb.badge_id === b.id);
    return { ...b, earned: !!e, earnedAt: e?.earned_at || null };
  });

  res.json(result);
});

// ── Leaderboard ─────────────────────────────────────────────────────────
router.get('/leaderboard', (req, res) => {
  // Get top users by XP
  const leaders = db.prepare(
    'SELECT id, display_name, avatar, xp, streak_count FROM users WHERE role = ? ORDER BY xp DESC LIMIT 50'
  ).all('student');
  res.json(leaders);
});

// ── Parental Controls ───────────────────────────────────────────────────
router.get('/parental/:childId', authMiddleware, (req, res) => {
  const control = db.prepare(
    'SELECT * FROM parental_controls WHERE parent_id = ? AND child_id = ?'
  ).get(req.userId, parseInt(req.params.childId, 10));

  if (!control) return res.status(404).json({ error: 'No parental control record found' });

  const child = db.prepare(
    'SELECT id, display_name, xp, streak_count, hearts FROM users WHERE id = ?'
  ).get(control.child_id);

  const progress = db.prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ?').get(control.child_id);
  const badges = db.prepare('SELECT COUNT(*) as count FROM user_badges WHERE user_id = ?').get(control.child_id);

  res.json({ control, child, lessonsCompleted: progress.count, badgesEarned: badges.count });
});

router.patch('/parental/:childId', authMiddleware, (req, res) => {
  const { trading_enabled, leaderboard_enabled, max_daily_minutes } = req.body;
  const childId = parseInt(req.params.childId, 10);

  const existing = db.prepare(
    'SELECT 1 FROM parental_controls WHERE parent_id = ? AND child_id = ?'
  ).get(req.userId, childId);

  if (!existing) return res.status(404).json({ error: 'No parental control record found' });

  if (trading_enabled !== undefined) {
    db.prepare('UPDATE parental_controls SET trading_enabled = ? WHERE parent_id = ? AND child_id = ?')
      .run(trading_enabled ? 1 : 0, req.userId, childId);
  }
  if (leaderboard_enabled !== undefined) {
    db.prepare('UPDATE parental_controls SET leaderboard_enabled = ? WHERE parent_id = ? AND child_id = ?')
      .run(leaderboard_enabled ? 1 : 0, req.userId, childId);
  }
  if (max_daily_minutes !== undefined) {
    db.prepare('UPDATE parental_controls SET max_daily_minutes = ? WHERE parent_id = ? AND child_id = ?')
      .run(max_daily_minutes, req.userId, childId);
  }

  res.json({ success: true });
});

export default router;
