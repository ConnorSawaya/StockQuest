import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Users, Globe, BookOpen } from 'lucide-react';

// Mock leaderboard data
const MOCK_LEADERBOARD = [
  { id: 1, name: 'TradeMaster99', xp: 2450, streak: 15, avatar: '🦊' },
  { id: 2, name: 'StockKid42', xp: 2100, streak: 12, avatar: '🐻' },
  { id: 3, name: 'InvestorJr', xp: 1890, streak: 20, avatar: '🦁' },
  { id: 4, name: 'WallStWiz', xp: 1750, streak: 8, avatar: '🐯' },
  { id: 5, name: 'BullRunBoy', xp: 1600, streak: 5, avatar: '🐂' },
  { id: 6, name: 'PennyWise22', xp: 1520, streak: 11, avatar: '🦉' },
  { id: 7, name: 'ChartChamp', xp: 1400, streak: 7, avatar: '🐧' },
  { id: 8, name: 'DiviDreamer', xp: 1280, streak: 9, avatar: '🐬' },
  { id: 9, name: 'GreenTrader', xp: 1150, streak: 4, avatar: '🐸' },
  { id: 10, name: 'SafeInvestor', xp: 1050, streak: 6, avatar: '🐨' },
];

const RANK_ICONS = [
  <Trophy className="w-5 h-5 text-yellow-500" />,
  <Medal className="w-5 h-5 text-gray-400" />,
  <Medal className="w-5 h-5 text-amber-600" />,
];

export default function Leaderboard() {
  const [tab, setTab] = useState('global');

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Leaderboard</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'global', label: 'Global', icon: Globe },
          { id: 'friends', label: 'Friends', icon: Users },
          { id: 'classroom', label: 'Classroom', icon: BookOpen },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-md capitalize transition-colors ${
              tab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {[1, 0, 2].map((rank) => {
          const user = MOCK_LEADERBOARD[rank];
          const isFirst = rank === 0;
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rank * 0.1 }}
              className="text-center"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2 ${
                  isFirst ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                {user.avatar}
              </div>
              <div className="text-sm font-bold text-gray-900 truncate max-w-[100px]">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">{user.xp} XP</div>
              <div
                className={`mt-2 rounded-t-lg w-20 mx-auto flex items-center justify-center font-bold text-white text-sm ${
                  isFirst ? 'bg-yellow-400 h-20' : rank === 1 ? 'bg-gray-300 h-14' : 'bg-amber-600 h-10'
                }`}
              >
                #{rank + 1}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="card">
        <div className="space-y-1">
          {MOCK_LEADERBOARD.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                index < 3 ? 'bg-gray-50' : ''
              }`}
            >
              <div className="w-8 text-center font-bold text-sm text-gray-400">
                {index < 3 ? RANK_ICONS[index] : `#${index + 1}`}
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900 truncate">{user.name}</div>
                <div className="text-xs text-gray-500">🔥 {user.streak} day streak</div>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-orange-600">
                <Star className="w-4 h-4" />
                {user.xp}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Your position */}
      <div className="card mt-4 bg-orange-50 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="w-8 text-center font-bold text-sm text-orange-500">#42</div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">
            🧑
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-gray-900">You</div>
            <div className="text-xs text-gray-500">Keep learning to climb!</div>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-orange-600">
            <Star className="w-4 h-4" />
            0
          </div>
        </div>
      </div>
    </div>
  );
}
