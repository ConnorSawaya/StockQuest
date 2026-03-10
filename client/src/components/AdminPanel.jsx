import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Terminal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPanel() {
  const {
    adminMode, toggleAdminMode,
    adminAddXP, adminResetXP, adminFillHearts, adminAddCash, adminResetAll,
    xp, hearts, cash,
  } = useStore();
  const [open, setOpen] = useState(false);
  const level = Math.floor(xp / 100) + 1;

  if (!adminMode) return null;

  const commands = [
    {
      label: '+100 XP',
      note: 'Simulates completing a lesson',
      action: () => adminAddXP(100),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: '+500 XP',
      note: 'Skips several levels at once',
      action: () => adminAddXP(500),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'Reset XP',
      note: 'Normally you earn this through lessons',
      action: adminResetXP,
      color: 'bg-gray-500 hover:bg-gray-600',
    },
    {
      label: 'Fill Hearts',
      note: 'Hearts normally refill slowly over time',
      action: adminFillHearts,
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      label: '+$5,000 Cash',
      note: 'Normally you only start with $10k virtual cash',
      action: () => adminAddCash(5000),
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'Unlock All (Lv 10)',
      note: 'Bypasses all level gates — normally you must earn this',
      action: () => adminAddXP(900),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      label: 'Reset Everything',
      note: 'Wipe all progress back to day 1',
      action: adminResetAll,
      color: 'bg-rose-600 hover:bg-rose-700',
    },
  ];

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-2 w-80 bg-gray-950 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-mono text-sm font-bold">Admin Console</span>
              </div>
              <button onClick={() => setOpen(false)}>
                <X className="w-4 h-4 text-gray-500 hover:text-white" />
              </button>
            </div>

            {/* Status */}
            <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 font-mono text-xs text-gray-400 flex gap-4">
              <span>Lv <span className="text-yellow-400">{level}</span></span>
              <span>XP <span className="text-blue-400">{xp}</span></span>
              <span>HP <span className="text-red-400">{hearts}</span></span>
              <span>$ <span className="text-green-400">{cash.toLocaleString()}</span></span>
            </div>

            {/* Commands */}
            <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
              {commands.map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={cmd.action}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-white text-sm transition-colors ${cmd.color}`}
                >
                  <div className="font-semibold">{cmd.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{cmd.note}</div>
                </button>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-gray-800 bg-gray-900">
              <button
                onClick={toggleAdminMode}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Exit admin mode
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-gray-950 border border-green-500 text-green-400 font-mono text-xs px-3 py-2 rounded-xl shadow-lg hover:bg-gray-900 transition-colors"
      >
        <Terminal className="w-3.5 h-3.5" />
        Admin
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
      </button>
    </div>
  );
}
