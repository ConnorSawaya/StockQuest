import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LessonsPage from './pages/LessonsPage';
import LessonScreen from './pages/LessonScreen';
import TradingSimulator from './pages/TradingSimulator';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import SettingsPage from './pages/SettingsPage';
import ParentalDashboard from './pages/ParentalDashboard';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Main content area – offset for sidebar on desktop, top bar on mobile */}
      <main className="md:ml-64 pt-16 md:pt-0 pb-20 md:pb-8 px-4 md:px-8 py-6">
        {children}
      </main>
      <AdminPanel />
    </div>
  );
}

function LevelGate({ minLevel, children }) {
  const { xp, adminMode } = useStore();
  const level = Math.floor(xp / 100) + 1;
  if (level < minLevel && !adminMode) return <Navigate to="/" replace />;
  return (
    <>
      {adminMode && level < minLevel && (
        <div className="mb-4 flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium px-4 py-2.5 rounded-xl">
          <span className="text-base">🔓</span>
          <span>
            <strong>Admin override active</strong> — this feature normally requires{' '}
            <strong>Level {minLevel}</strong>. Regular users would be redirected away.
          </span>
        </div>
      )}
      {children}
    </>
  );
}

export default function App() {
  const { user, tickHeartRefill } = useStore();
  const location = useLocation();

  // Auto-refill hearts on a 30s interval
  useEffect(() => {
    const id = setInterval(tickHeartRefill, 30_000);
    tickHeartRefill(); // immediate check on mount
    return () => clearInterval(id);
  }, [tickHeartRefill]);

  // Show landing page for unauthenticated users (or on /welcome)
  if (!user && location.pathname !== '/welcome') {
    return (
      <Routes>
        <Route path="*" element={<Landing />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:lessonId" element={<LessonScreen />} />
        <Route path="/trade" element={<LevelGate minLevel={2}><TradingSimulator /></LevelGate>} />
        <Route path="/leaderboard" element={<LevelGate minLevel={3}><Leaderboard /></LevelGate>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/parental" element={<ParentalDashboard />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </AppLayout>
  );
}
