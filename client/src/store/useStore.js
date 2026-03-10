import { create } from 'zustand';

const INITIAL_HEARTS = 5;
const MAX_HEARTS = 5;
const HEART_REFILL_MS = 15 * 60 * 1000; // 15 minutes

export const useStore = create((set, get) => ({
  // ── Auth ────────────────────────────────────────────
  user: null,
  token: localStorage.getItem('sq_token'),

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) localStorage.setItem('sq_token', token);
    else localStorage.removeItem('sq_token');
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('sq_token');
    set({ user: null, token: null });
  },

  // ── Hearts ──────────────────────────────────────────
  hearts: INITIAL_HEARTS,
  lastHeartLoss: null,

  loseHeart: () => {
    const { hearts } = get();
    if (hearts > 0) {
      set({ hearts: hearts - 1, lastHeartLoss: Date.now() });
    }
  },
  refillHearts: () => set({ hearts: MAX_HEARTS, lastHeartLoss: null }),
  addHeart: () => {
    const { hearts } = get();
    if (hearts < MAX_HEARTS) set({ hearts: hearts + 1 });
  },
  hasHearts: () => get().hearts > 0,

  // Check & auto-refill one heart if enough time has passed
  tickHeartRefill: () => {
    const { hearts, lastHeartLoss } = get();
    if (hearts >= MAX_HEARTS || !lastHeartLoss) return;
    if (Date.now() - lastHeartLoss >= HEART_REFILL_MS) {
      const newHearts = hearts + 1;
      set({
        hearts: newHearts,
        lastHeartLoss: newHearts < MAX_HEARTS ? Date.now() : null,
      });
    }
  },
  getNextHeartIn: () => {
    const { hearts, lastHeartLoss } = get();
    if (hearts >= MAX_HEARTS || !lastHeartLoss) return null;
    const elapsed = Date.now() - lastHeartLoss;
    return Math.max(0, HEART_REFILL_MS - elapsed);
  },

  // ── XP & Level ──────────────────────────────────────
  xp: 0,
  addXP: (amount) => set((s) => ({ xp: s.xp + amount })),
  getLevel: () => {
    const { xp } = get();
    return Math.floor(xp / 100) + 1;
  },
  getLevelProgress: () => {
    const { xp } = get();
    return (xp % 100) / 100;
  },

  // ── Streak ──────────────────────────────────────────
  streakCount: 0,
  streakLastDate: null,
  streakFreezeAvailable: true,

  recordStreak: () => {
    const today = new Date().toDateString();
    const { streakLastDate, streakCount } = get();
    if (streakLastDate === today) return; // already recorded today
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (streakLastDate === yesterday) {
      set({ streakCount: streakCount + 1, streakLastDate: today });
    } else {
      set({ streakCount: 1, streakLastDate: today });
    }
  },

  // ── Badges ──────────────────────────────────────────
  earnedBadges: [],
  earnBadge: (badge) =>
    set((s) => {
      if (s.earnedBadges.find((b) => b.id === badge.id)) return s;
      return { earnedBadges: [...s.earnedBadges, { ...badge, earnedAt: Date.now() }] };
    }),

  // ── Portfolio ───────────────────────────────────────
  cash: 10000,
  holdings: [], // [{ stockId, symbol, shares, avgPrice }]
  transactions: [],

  buyStock: (stock, shares) => {
    const { cash, holdings, transactions } = get();
    const cost = stock.price * shares;
    if (cost > cash) return false;
    const existing = holdings.find((h) => h.stockId === stock.id);
    let newHoldings;
    if (existing) {
      const totalShares = existing.shares + shares;
      const avgPrice =
        (existing.avgPrice * existing.shares + stock.price * shares) / totalShares;
      newHoldings = holdings.map((h) =>
        h.stockId === stock.id ? { ...h, shares: totalShares, avgPrice } : h
      );
    } else {
      newHoldings = [
        ...holdings,
        { stockId: stock.id, symbol: stock.symbol, shares, avgPrice: stock.price },
      ];
    }
    set({
      cash: cash - cost,
      holdings: newHoldings,
      transactions: [
        ...transactions,
        { stockId: stock.id, symbol: stock.symbol, type: 'buy', shares, price: stock.price, timestamp: Date.now() },
      ],
    });
    return true;
  },

  sellStock: (stock, shares) => {
    const { cash, holdings, transactions } = get();
    const existing = holdings.find((h) => h.stockId === stock.id);
    if (!existing || existing.shares < shares) return false;
    const revenue = stock.price * shares;
    const remaining = existing.shares - shares;
    const newHoldings = remaining > 0
      ? holdings.map((h) => (h.stockId === stock.id ? { ...h, shares: remaining } : h))
      : holdings.filter((h) => h.stockId !== stock.id);
    set({
      cash: cash + revenue,
      holdings: newHoldings,
      transactions: [
        ...transactions,
        { stockId: stock.id, symbol: stock.symbol, type: 'sell', shares, price: stock.price, timestamp: Date.now() },
      ],
    });
    return true;
  },

  // ── Lessons Progress ────────────────────────────────
  completedLessons: [],
  currentModule: 1,

  completeLesson: (lessonId, score) =>
    set((s) => ({
      completedLessons: [
        ...s.completedLessons.filter((l) => l.lessonId !== lessonId),
        { lessonId, score, completedAt: Date.now() },
      ],
    })),

  isModuleUnlocked: (moduleIndex) => {
    const { completedLessons } = get();
    if (moduleIndex <= 1) return true;
    // Check if previous module's quiz scored ≥80%
    const prevQuiz = completedLessons.find(
      (l) => l.lessonId === `module-${moduleIndex - 1}-quiz`
    );
    return prevQuiz && prevQuiz.score >= 80;
  },

  // ── Settings ────────────────────────────────────────
  difficulty: 'beginner',
  setDifficulty: (d) => set({ difficulty: d }),
  notifications: true,
  setNotifications: (n) => set({ notifications: n }),

  // ── Admin ────────────────────────────────────────────
  adminMode: false,
  toggleAdminMode: () => set((s) => ({ adminMode: !s.adminMode })),
  adminAddXP: (amount) => set((s) => ({ xp: s.xp + amount })),
  adminResetXP: () => set({ xp: 0 }),
  adminFillHearts: () => set({ hearts: 5 }),
  adminAddCash: (amount) => set((s) => ({ cash: s.cash + amount })),
  adminResetAll: () => set({
    xp: 0, hearts: 5, streakCount: 0, earnedBadges: [],
    completedLessons: [], cash: 10000, holdings: [], transactions: [],
  }),
}));
