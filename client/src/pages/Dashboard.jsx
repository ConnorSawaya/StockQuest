import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MODULES, getModuleProgress } from '../data/lessons';
import { XPBar } from '../components/Gamification';
import { DashboardSkeleton } from '../components/Skeleton';
import { BookOpen, TrendingUp, ChevronRight, CheckCircle, Lock, Heart, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);
  const { hearts, xp, streakCount, completedLessons, cash, holdings, earnedBadges } = useStore();
  const level = Math.floor(xp / 100) + 1;

  // Find the next incomplete lesson
  let nextLesson = null;
  for (const mod of MODULES) {
    for (const lesson of mod.lessons) {
      if (!completedLessons.find((cl) => cl.lessonId === lesson.id)) {
        nextLesson = { ...lesson, moduleName: mod.title, moduleIcon: mod.icon };
        break;
      }
    }
    if (nextLesson) break;
  }

  // Module progress data
  const moduleData = MODULES.map((mod) => {
    const progress = getModuleProgress(mod.id, completedLessons);
    const unlocked =
      mod.id === 1 ||
      completedLessons.some(
        (cl) => cl.lessonId === `module-${mod.id - 1}-quiz` && cl.score >= 80
      );
    return { ...mod, progress, unlocked, isComplete: progress === 100, isCurrent: unlocked && progress < 100 };
  });

  const totalProgress = Math.round(
    moduleData.reduce((sum, m) => sum + m.progress, 0) / moduleData.length
  );
  const totalPortfolioValue = cash + holdings.reduce((sum, h) => sum + h.avgPrice * h.shares, 0);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stats strip */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Heart className={`w-5 h-5 ${hearts > 0 ? 'text-red-500' : 'text-gray-300'}`} fill={hearts > 0 ? 'currentColor' : 'none'} />
          <span className={`text-sm font-bold ${hearts > 0 ? 'text-red-500' : 'text-gray-300'}`}>{hearts}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-bold text-orange-500">{streakCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-bold text-yellow-500">{earnedBadges.length}</span>
        </div>
        <div className="flex-1 min-w-[140px]">
          <XPBar xp={xp} />
        </div>
      </div>

      {/* Continue Learning — Hero */}
      {nextLesson ? (
        <Link to={`/lessons/${nextLesson.id}`}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="card-hover bg-orange-50 border-orange-200 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                  Continue Your Journey
                </div>
                <div className="text-lg font-bold text-gray-900 truncate">{nextLesson.title}</div>
                <div className="text-sm text-gray-500">{nextLesson.moduleName}</div>
              </div>
              <ChevronRight className="w-6 h-6 text-orange-400 flex-shrink-0" />
            </div>
          </motion.div>
        </Link>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 mb-6 text-center py-6"
        >
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-lg font-bold text-yellow-700">Journey Complete!</div>
          <p className="text-sm text-yellow-600 mt-1">You&apos;ve mastered all lessons</p>
        </motion.div>
      )}

      {/* Journey Map */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Journey</h2>
            <p className="text-sm text-gray-400">{totalProgress}% complete</p>
          </div>
          <Link to="/lessons" className="text-sm text-orange-500 font-medium hover:text-orange-600">
            View path →
          </Link>
        </div>

        {/* Horizontal module path */}
        <div className="relative flex items-start justify-between px-2">
          {/* Track line */}
          <div className="absolute top-6 left-8 right-8 h-1 bg-gray-100 rounded-full" />
          <div
            className="absolute top-6 left-8 h-1 bg-green-400 rounded-full transition-all duration-700"
            style={{ width: `${totalProgress}%` }}
          />

          {moduleData.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10 flex flex-col items-center flex-1"
            >
              <Link to={mod.unlocked ? '/lessons' : '#'} className={mod.unlocked ? '' : 'pointer-events-none'}>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all ${
                    mod.isComplete
                      ? 'bg-green-500 shadow-md shadow-green-200/50'
                      : mod.isCurrent
                      ? 'bg-orange-500 shadow-md shadow-orange-200/50 ring-4 ring-orange-100'
                      : mod.unlocked
                      ? 'bg-white border-2 border-gray-200'
                      : 'bg-gray-100'
                  }`}
                >
                  {mod.isComplete ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : mod.unlocked ? (
                    <span>{mod.icon}</span>
                  ) : (
                    <Lock className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              </Link>
              <span
                className={`text-[11px] font-medium mt-2 text-center leading-tight ${
                  mod.isComplete ? 'text-green-600' : mod.isCurrent ? 'text-orange-600' : mod.unlocked ? 'text-gray-500' : 'text-gray-300'
                }`}
              >
                {mod.title}
              </span>
              <span
                className={`text-[10px] mt-0.5 font-medium ${
                  mod.isComplete ? 'text-green-500' : mod.unlocked ? 'text-gray-400' : 'text-gray-300'
                }`}
              >
                {mod.unlocked ? `${mod.progress}%` : '🔒'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trading Simulator — level 2+ */}
      {level >= 2 && (
        <Link to="/trade">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="card-hover bg-success-50 border-success-200 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-success-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-success-600 uppercase tracking-wide">
                  Trading Simulator
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-500">
                  {holdings.length > 0
                    ? `${holdings.length} stock${holdings.length !== 1 ? 's' : ''} owned`
                    : 'Start trading with $10,000 virtual cash'}
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-success-400 flex-shrink-0" />
            </div>
          </motion.div>
        </Link>
      )}
    </div>
  );
}
