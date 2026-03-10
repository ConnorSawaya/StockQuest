import { useStore } from '../store/useStore';
import { ALL_BADGES, MODULES, getModuleProgress } from '../data/lessons';
import { BadgeCard, XPBar, StatCard } from '../components/Gamification';
import { PortfolioChart } from '../components/Charts';
import { motion } from 'framer-motion';
import { Award, BookOpen, TrendingUp, Flame, Target } from 'lucide-react';

export default function Profile() {
  const {
    xp, streakCount, hearts, earnedBadges, completedLessons,
    cash, holdings, transactions,
  } = useStore();
  const level = Math.floor(xp / 100) + 1;
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);

  // Generate mock portfolio history
  const portfolioHistory = Array.from({ length: 30 }, (_, i) => ({
    label: `Day ${i + 1}`,
    value: 10000 + Math.random() * 500 * Math.sin(i * 0.3) + i * 20,
  }));

  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile header */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
            🧑‍💼
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900">Stock Trader</h1>
            <div className="text-sm text-gray-500 mb-2">Level {level}</div>
            <XPBar xp={xp} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="⭐" label="Total XP" value={xp} color="primary" />
        <StatCard icon="🔥" label="Streak" value={`${streakCount}d`} color="warning" />
        <StatCard icon="📚" label="Lessons" value={`${completedLessons.length}/${totalLessons}`} color="success" />
        <StatCard icon="💰" label="Trades" value={transactions.length} color="primary" />
      </div>

      {/* Portfolio chart */}
      <div className="card mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Portfolio Performance
        </h2>
        <PortfolioChart data={portfolioHistory} />
      </div>

      {/* Badges */}
      <div className="card mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-warning-500" />
          Badges ({earnedBadges.length}/{ALL_BADGES.length})
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {ALL_BADGES.map((badge) => {
            const earned = earnedBadges.find((b) => b.id === badge.id);
            return <BadgeCard key={badge.id} badge={badge} earned={!!earned} />;
          })}
        </div>
      </div>

      {/* Module progress */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-500" />
          Module Progress
        </h2>
        <div className="space-y-4">
          {MODULES.map((mod) => {
            const progress = getModuleProgress(mod.id, completedLessons);
            return (
              <div key={mod.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {mod.icon} {mod.title}
                  </span>
                  <span className="text-xs text-gray-500">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      progress === 100 ? 'bg-success-500' : 'bg-orange-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
