import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  User, Bell, Shield, Palette, ChevronRight,
  Moon, Sun, Volume2, VolumeX, Gauge,
} from 'lucide-react';

export default function SettingsPage() {
  const { difficulty, setDifficulty, notifications, setNotifications, refillHearts } = useStore();
  const [theme, setTheme] = useState('light');

  const Section = ({ title, icon: Icon, children }) => (
    <div className="card mb-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-orange-500" />
        {title}
      </h2>
      {children}
    </div>
  );

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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Account */}
      <Section title="Account" icon={User}>
        <div className="flex items-center gap-4 py-3 border-b border-gray-100">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
            🧑‍💼
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Stock Trader</div>
            <div className="text-sm text-gray-500">student@example.com</div>
          </div>
          <button className="btn-secondary text-sm py-2 px-4">Edit</button>
        </div>
      </Section>

      {/* Difficulty */}
      <Section title="Difficulty" icon={Gauge}>
        <div className="grid grid-cols-3 gap-3">
          {['beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`p-3 rounded-xl border-2 text-center transition-colors capitalize ${
                difficulty === level
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">
                {level === 'beginner' ? '🌱' : level === 'intermediate' ? '🌿' : '🌳'}
              </div>
              <div className="text-sm font-semibold">{level}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          {difficulty === 'beginner' &&
            'Guided hints, simpler charts, and step-by-step explanations.'}
          {difficulty === 'intermediate' &&
            'Fewer hints, standard charts, and some independent challenges.'}
          {difficulty === 'advanced' &&
            'No hints, complex charts, real-time simulation, and advanced challenges.'}
        </p>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <Toggle
          label="Push Notifications"
          description="Daily reminders and challenge alerts"
          value={notifications}
          onChange={setNotifications}
        />
        <Toggle
          label="Streak Reminders"
          description="Get reminded to keep your streak alive"
          value={true}
          onChange={() => {}}
        />
        <Toggle
          label="Weekly Reports"
          description="Receive weekly progress summaries"
          value={true}
          onChange={() => {}}
        />
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={Palette}>
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="text-sm font-medium text-gray-900">Theme</div>
            <div className="text-xs text-gray-500">Choose your preferred theme</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                theme === 'light'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Sun className="w-4 h-4" /> Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                theme === 'dark'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Moon className="w-4 h-4" /> Dark
            </button>
          </div>
        </div>
      </Section>

      {/* Parental Controls link */}
      <Section title="Parental Controls" icon={Shield}>
        <a href="/parental" className="btn-secondary text-sm inline-flex items-center gap-1">
          Open Parental Dashboard <ChevronRight className="w-4 h-4" />
        </a>
      </Section>

      {/* Debug / Dev */}
      <div className="card bg-gray-50 mb-4">
        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide">Developer</h3>
        <button
          onClick={refillHearts}
          className="btn-secondary text-sm mr-2 mb-2"
        >
          ❤️ Refill Hearts
        </button>
        <button
          onClick={() => useStore.getState().addXP(100)}
          className="btn-secondary text-sm mr-2 mb-2"
        >
          ⭐ +100 XP
        </button>
        <button
          onClick={() => {
            useStore.getState().recordStreak();
          }}
          className="btn-secondary text-sm mb-2"
        >
          🔥 Record Streak
        </button>
      </div>
    </div>
  );
}
