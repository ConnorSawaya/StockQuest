import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Shield, Eye, Clock, Lock, Download,
  ChevronRight, BarChart3, BookOpen, TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ParentalDashboard() {
  const { xp, completedLessons, streakCount, earnedBadges } = useStore();
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [tradingEnabled, setTradingEnabled] = useState(true);
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(true);
  const [advancedEnabled, setAdvancedEnabled] = useState(true);
  const [maxMinutes, setMaxMinutes] = useState(60);

  const passedLessons = completedLessons.filter((l) => l.score >= 80).length;

  // Simple PIN gate (in production, this would be a real auth flow)
  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Parental Controls</h1>
        <p className="text-gray-500 mb-6 text-sm">Enter your 4-digit PIN to access</p>
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center text-xl font-bold ${
                pin.length > i ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}
            >
              {pin[i] ? '•' : ''}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((key) => {
            if (key === null) return <div key="empty" />;
            return (
              <button
                key={key}
                onClick={() => {
                  if (key === 'del') {
                    setPin((p) => p.slice(0, -1));
                  } else if (pin.length < 4) {
                    const newPin = pin + key;
                    setPin(newPin);
                    if (newPin.length === 4) {
                      // Accept any 4-digit PIN for demo
                      setTimeout(() => setAuthenticated(true), 300);
                    }
                  }
                }}
                className="w-14 h-14 bg-orange-50 rounded-xl text-lg font-semibold hover:bg-orange-100 transition-colors mx-auto flex items-center justify-center border border-orange-200"
              >
                {key === 'del' ? '←' : key}
              </button>
            );
          })}}
        </div>
        <p className="text-xs text-gray-400">Enter any 4 digits for this demo</p>
      </div>
    );
  }

  const Toggle = ({ label, description, value, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {description && <div className="text-xs text-gray-500">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? 'bg-orange-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            value ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parental Dashboard</h1>
          <p className="text-gray-500 text-sm">Monitor and manage your child's learning</p>
        </div>
      </div>

      {/* Child overview */}
      <div className="card mb-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-orange-500" />
          Child's Progress
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{passedLessons}</div>
            <div className="text-xs text-gray-500">Lessons Passed</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{xp}</div>
            <div className="text-xs text-gray-500">Total XP</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{streakCount}d</div>
            <div className="text-xs text-gray-500">Streak</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{earnedBadges.length}</div>
            <div className="text-xs text-gray-500">Badges</div>
          </div>
        </div>
      </div>

      {/* Feature restrictions */}
      <div className="card mb-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-orange-500" />
          Feature Controls
        </h2>
        <Toggle
          label="Trading Simulator"
          description="Allow access to the virtual trading simulator"
          value={tradingEnabled}
          onChange={setTradingEnabled}
        />
        <Toggle
          label="Leaderboard"
          description="Show leaderboard and rankings"
          value={leaderboardEnabled}
          onChange={setLeaderboardEnabled}
        />
        <Toggle
          label="Advanced Modules"
          description="Allow access to modules 4 and 5"
          value={advancedEnabled}
          onChange={setAdvancedEnabled}
        />

        <div className="py-3">
          <div className="text-sm font-medium text-gray-900 mb-2">Daily Time Limit</div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-orange-400" />
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={maxMinutes}
              onChange={(e) => setMaxMinutes(Number(e.target.value))}
              className="flex-1 accent-orange-500"
            />
            <span className="text-sm font-semibold text-gray-700 w-20 text-right">
              {maxMinutes} min
            </span>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="card mb-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-orange-500" />
          Export Reports
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Download a summary of your child's progress, lessons completed, and trading performance.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              alert(`PDF Report:\n\nLessons Passed: ${passedLessons}\nTotal XP: ${xp}\nStreak: ${streakCount} days\nBadges: ${earnedBadges.length}\n\nThis would download a PDF in production.`);
            }}
            className="btn-primary text-sm"
          >
            Download PDF Report
          </button>
          <button
            onClick={() => {
              const csv = `Metric,Value\nLessons Passed,${passedLessons}\nTotal XP,${xp}\nStreak,${streakCount}\nBadges,${earnedBadges.length}`;
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'child-progress.csv';
              a.click();
            }}
            className="btn-secondary text-sm"
          >
            Download CSV Data
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-4">Quick Links</h2>
        {[
          { icon: BookOpen, label: "View Child's Lessons", path: '/lessons' },
          { icon: TrendingUp, label: "View Trading History", path: '/trade' },
          { icon: BarChart3, label: "View Performance", path: '/profile' },
        ].map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-orange-50 rounded-lg px-2 transition-colors"
          >
            <Icon className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-medium text-gray-700 flex-1">{label}</span>
            <ChevronRight className="w-4 h-4 text-orange-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
