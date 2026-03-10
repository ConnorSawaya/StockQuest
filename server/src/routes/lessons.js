import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../auth.js';

const router = Router();

// ── Get all modules & lessons ───────────────────────────────────────────
router.get('/modules', (req, res) => {
  const modules = db.prepare('SELECT * FROM modules ORDER BY order_index').all();
  const lessons = db.prepare('SELECT * FROM lessons ORDER BY order_index').all();

  const result = modules.map((mod) => ({
    ...mod,
    lessons: lessons.filter((l) => l.module_id === mod.id).map((l) => ({
      ...l,
      content: JSON.parse(l.content_json),
    })),
  }));

  res.json(result);
});

// ── Get single lesson ───────────────────────────────────────────────────
router.get('/lessons/:id', (req, res) => {
  const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json({ ...lesson, content: JSON.parse(lesson.content_json) });
});

// ── Complete a lesson ───────────────────────────────────────────────────
router.post('/lessons/:id/complete', authMiddleware, (req, res) => {
  const { score } = req.body;
  const lessonId = req.params.id;

  const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  // Upsert progress
  db.prepare(
    `INSERT INTO user_progress (user_id, lesson_id, score) VALUES (?, ?, ?)
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET score = MAX(score, ?), completed_at = datetime('now')`
  ).run(req.userId, lessonId, score || 0, score || 0);

  // Award XP
  const user = db.prepare('SELECT xp FROM users WHERE id = ?').get(req.userId);
  const newXP = (user?.xp || 0) + lesson.xp_reward;
  db.prepare('UPDATE users SET xp = ? WHERE id = ?').run(newXP, req.userId);

  // Update streak
  const now = new Date().toISOString().split('T')[0];
  const userData = db.prepare('SELECT streak_count, streak_last_date FROM users WHERE id = ?').get(req.userId);
  let newStreak = userData.streak_count;
  if (userData.streak_last_date !== now) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    newStreak = userData.streak_last_date === yesterday ? newStreak + 1 : 1;
    db.prepare('UPDATE users SET streak_count = ?, streak_last_date = ? WHERE id = ?').run(newStreak, now, req.userId);
  }

  // Check badge criteria
  const progressCount = db.prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ?').get(req.userId).count;
  if (progressCount === 1) {
    awardBadge(req.userId, 'first-steps');
  }

  // Module completion badges
  const moduleMatch = lessonId.match(/^module-(\d+)-quiz$/);
  if (moduleMatch && score >= 80) {
    awardBadge(req.userId, `module-${moduleMatch[1]}`);
  }

  // XP badges
  if (newXP >= 500) awardBadge(req.userId, 'xp-500');
  if (newXP >= 2000) awardBadge(req.userId, 'xp-2000');

  // Streak badges
  if (newStreak >= 3) awardBadge(req.userId, 'streak-3');
  if (newStreak >= 7) awardBadge(req.userId, 'streak-7');
  if (newStreak >= 30) awardBadge(req.userId, 'streak-30');

  res.json({ xp: newXP, streak: newStreak, xpEarned: lesson.xp_reward });
});

// ── Get user progress ───────────────────────────────────────────────────
router.get('/progress', authMiddleware, (req, res) => {
  const progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').all(req.userId);
  res.json(progress);
});

function awardBadge(userId, badgeId) {
  const existing = db.prepare('SELECT 1 FROM user_badges WHERE user_id = ? AND badge_id = ?').get(userId, badgeId);
  if (!existing) {
    try {
      db.prepare('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)').run(userId, badgeId);
    } catch {
      // Badge might not exist in DB yet, silently skip
    }
  }
}

export default router;
