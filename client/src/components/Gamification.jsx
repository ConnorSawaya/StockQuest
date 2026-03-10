import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function HeartsDisplay({ hearts, max = 5 }) {
  const empty = hearts <= 0;
  return (
    <div className="flex items-center gap-1.5">
      <Heart
        className={`w-6 h-6 transition-colors ${empty ? 'text-gray-300' : 'text-red-500'}`}
        fill={empty ? 'none' : 'currentColor'}
        strokeWidth={2}
      />
      <span className={`text-sm font-bold tabular-nums ${empty ? 'text-gray-300' : 'text-red-500'}`}>
        {hearts}
      </span>
    </div>
  );
}

export function XPBar({ xp, className = '' }) {
  const level = Math.floor(xp / 100) + 1;
  const progress = (xp % 100) / 100;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-white text-xs font-black shadow-sm">
        {level}
      </span>
      <div className="flex-1">
        <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
      <span className="text-xs font-bold text-gray-400 tabular-nums whitespace-nowrap">
        {xp % 100} / 100
      </span>
    </div>
  );
}

export function StreakBadge({ count }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-warning-50 border border-warning-100 rounded-xl">
      <span className="text-2xl">🔥</span>
      <div>
        <div className="text-sm font-bold text-warning-600">{count} day streak</div>
        <div className="text-xs text-warning-500">Keep it going!</div>
      </div>
    </div>
  );
}

export function BadgeCard({ badge, earned = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`card text-center p-4 ${earned ? '' : 'opacity-40 grayscale'}`}
    >
      <span className="text-4xl block mb-2">{badge.icon}</span>
      <div className="font-semibold text-sm text-gray-900">{badge.name}</div>
      <div className="text-xs text-gray-500 mt-1">{badge.description}</div>
      {earned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-2 text-xs text-success-500 font-medium"
        >
          ✓ Earned
        </motion.div>
      )}
    </motion.div>
  );
}

export function StatCard({ icon, label, value, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-orange-50 text-orange-600',
    success: 'bg-success-50 text-success-500',
    danger: 'bg-danger-50 text-danger-500',
    warning: 'bg-warning-50 text-warning-500',
  };

  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

export function ProgressRing({ progress, size = 60, strokeWidth = 5, children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#F97316" strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute text-xs font-bold text-gray-700">{children}</div>
    </div>
  );
}
