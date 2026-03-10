import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  BookOpen, BarChart3, Trophy, User, Settings, Home,
  TrendingUp, Shield, Lock, Terminal, Heart, Flame, Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home, minLevel: 1 },
  { path: '/lessons', label: 'Learn', icon: BookOpen, minLevel: 1 },
  { path: '/trade', label: 'Trade', icon: TrendingUp, minLevel: 2 },
  { path: '/leaderboard', label: 'Ranks', icon: Trophy, minLevel: 3 },
  { path: '/profile', label: 'Profile', icon: User, minLevel: 1 },
  { path: '/settings', label: 'Settings', icon: Settings, minLevel: 1 },
];

function StatBadge({ emoji, value, tooltip, anchor = 'center' }) {
  return (
    <div className="relative group cursor-default">
      <span className="flex items-center gap-1">{emoji} <span className="font-bold text-gray-700">{value}</span></span>
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 max-w-[13rem] w-max bg-gray-900 text-white text-xs rounded-xl px-3 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-50 text-left leading-relaxed shadow-lg whitespace-normal md:left-full md:translate-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:mb-0 md:ml-2">
        {tooltip}
        <div className="absolute border-4 border-transparent border-t-gray-900 top-full left-1/2 -translate-x-1/2 md:hidden" />
        <div className="hidden md:block absolute border-4 border-transparent border-r-gray-900 right-full top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}

export default function Navbar() {
  const { hearts, xp, streakCount, adminMode, toggleAdminMode } = useStore();
  const location = useLocation();
  const level = Math.floor(xp / 100) + 1;

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40">
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">StockQuest</span>
          </Link>
        </div>

        <div className="flex items-center gap-5 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm">
          <StatBadge emoji={<Heart className={`w-4 h-4 ${hearts > 0 ? 'text-red-500' : 'text-gray-300'}`} fill={hearts > 0 ? 'currentColor' : 'none'} />} value={hearts} anchor="left" tooltip="Hearts: you start with 5. Lose one for each wrong answer. They refill every 15 min!" />
          <StatBadge emoji={<Flame className="w-4 h-4 text-orange-500" />} value={streakCount} anchor="right" tooltip="Streak: learn every day to keep it going. Miss a day and it resets!" />
          <StatBadge emoji={<Zap className="w-4 h-4 text-yellow-500" />} value={xp} anchor="center" tooltip="XP: earned by completing lessons and profitable trades. 100 XP = Level Up!" />
          <span className="ml-auto text-xs font-black bg-yellow-400 text-white px-2.5 py-1 rounded-full">{level}</span>
        </div>

        <div className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon, minLevel }) => {
            const active = location.pathname === path;
            const locked = level < minLevel;
            if (locked && !adminMode) {
              return (
                <div
                  key={path}
                  className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-red-300 bg-red-50 cursor-not-allowed"
                  title={`Reach Level ${minLevel} to unlock`}
                >
                  <Lock className="w-4 h-4 text-red-300" />
                  <span>{label}</span>
                  <span className="ml-auto text-[10px] bg-red-100 text-red-400 px-1.5 py-0.5 rounded-full">Lv {minLevel}</span>
                </div>
              );
            }
            if (locked && adminMode) {
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'text-orange-600 bg-orange-50 border-r-2 border-orange-400'
                      : 'text-orange-400 hover:bg-orange-50'
                  }`}
                  title={`Admin bypass — normally requires Level ${minLevel}`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>{label}</span>
                  <span className="ml-auto text-[10px] bg-orange-100 text-orange-500 px-1.5 py-0.5 rounded-full">ADM</span>
                </Link>
              );
            }
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'text-orange-600 bg-orange-50 border-r-2 border-orange-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            to="/parental"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <Shield className="w-4 h-4" />
            Parental Controls
          </Link>
          <button
            onClick={toggleAdminMode}
            className={`flex items-center gap-2 text-sm w-full px-2 py-1.5 rounded-lg transition-colors ${
              adminMode
                ? 'bg-orange-100 text-orange-700 font-semibold'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            {adminMode ? 'Admin Mode ON' : 'Admin Mode'}
          </button>
        </div>
      </nav>

      {/* Mobile top bar — just logo + stats, no hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold">StockQuest</span>
          </Link>
          <div className="flex items-center gap-3 text-xs font-bold">
            <StatBadge emoji={<Heart className={`w-3.5 h-3.5 ${hearts > 0 ? 'text-red-500' : 'text-gray-300'}`} fill={hearts > 0 ? 'currentColor' : 'none'} />} value={hearts} tooltip="Lose a heart for each wrong answer. They refill every 15 min!" />
            <StatBadge emoji={<Flame className="w-3.5 h-3.5 text-orange-500" />} value={streakCount} anchor="right" tooltip="Learn every day to grow your streak!" />
            <StatBadge emoji={<Zap className="w-3.5 h-3.5 text-yellow-500" />} value={xp} tooltip="Earn XP from lessons. 100 XP = Level Up!" />
          </div>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {NAV_ITEMS.slice(0, 5).map(({ path, label, icon: Icon, minLevel }) => {
            const active = location.pathname === path;
            const locked = level < minLevel;
            if (locked && !adminMode) {
              return (
                <div
                  key={path}
                  className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium text-red-300"
                >
                  <Lock className="w-4 h-4 text-red-300" />
                  <span>Lv {minLevel}</span>
                </div>
              );
            }
            if (locked && adminMode) {
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium ${
                    active ? 'text-orange-500' : 'text-orange-300'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>ADM</span>
                </Link>
              );
            }
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium ${
                  active ? 'text-orange-600' : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
