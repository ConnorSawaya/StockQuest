import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LessonsPage = lazy(() => import('./pages/LessonsPage'));
const LessonScreen = lazy(() => import('./pages/LessonScreen'));
const TradingSimulator = lazy(() => import('./pages/TradingSimulator'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Profile = lazy(() => import('./pages/Profile'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ParentalDashboard = lazy(() => import('./pages/ParentalDashboard'));

function PageLoading() {
  return (
    <div className="mx-auto max-w-3xl py-16 text-center text-sm text-slate-600" role="status" aria-live="polite">
      Loading this demo page…
    </div>
  );
}

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Main content area – offset for sidebar on desktop, top bar on mobile */}
      <main className="md:ml-64 pt-16 md:pt-0 pb-20 md:pb-8 px-4 md:px-8 py-6">
        <div className="mb-5 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm leading-relaxed text-orange-950" role="note">
          Demo only: prices and progress are sample data. There are no accounts, live trades, or real parental controls; progress resets when you refresh. This is not financial advice.
        </div>
        <Suspense fallback={<PageLoading />}>{children}</Suspense>
      </main>
      <Suspense fallback={null}><AdminPanel /></Suspense>
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
            <strong>Demo tools override active</strong> — this feature normally requires{' '}
            <strong>Level {minLevel}</strong>. This preview temporarily bypasses that level gate.
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

  // Show the landing page until the visitor starts a local demo session.
  if (!user && location.pathname !== '/welcome') {
    return (
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <AppLayout>
      <Suspense fallback={<PageLoading />}>
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
      </Suspense>
    </AppLayout>
  );
}
