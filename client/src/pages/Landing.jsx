import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER_SYMBOLS = [
  { sym: 'AAPL', base: 189.5 }, { sym: 'MSFT', base: 412.3 },
  { sym: 'NVDA', base: 875.2 }, { sym: 'TSLA', base: 177.4 },
  { sym: 'AMZN', base: 185.6 }, { sym: 'GOOGL', base: 172.9 },
  { sym: 'META', base: 493.1 }, { sym: 'SPY',  base: 521.8 },
  { sym: 'AMD',  base: 158.3 }, { sym: 'BRK.B', base: 404.7 },
];

function useTicker() {
  const [ticks, setTicks] = useState(() =>
    TICKER_SYMBOLS.map(({ sym, base }) => ({ sym, price: base, prev: base }))
  );
  useEffect(() => {
    const id = setInterval(() => {
      setTicks((prev) =>
        prev.map(({ sym, price }) => {
          const delta = (Math.random() - 0.48) * 2.5;
          return { sym, price: +Math.max(1, price + delta).toFixed(2), prev: price };
        })
      );
    }, 1400);
    return () => clearInterval(id);
  }, []);
  return ticks;
}

function Ticker() {
  const ticks = useTicker();
  const items = [...ticks, ...ticks];
  return (
    <div className="overflow-hidden border-b border-slate-200 bg-white/70">
      <motion.div
        className="flex gap-10 py-2 px-4 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 36, ease: 'linear', repeat: Infinity }}
      >
        {items.map(({ sym, price, prev }, i) => {
          const up = price >= prev;
          return (
            <span key={i} className="inline-flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400">{sym}</span>
              <span className={up ? 'text-orange-600 font-semibold' : 'text-rose-500 font-semibold'}>
                ${price.toFixed(2)}
              </span>
              {up
                ? <TrendingUp className="w-3 h-3 text-orange-500" />
                : <TrendingDown className="w-3 h-3 text-rose-400" />}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─── Auth form ────────────────────────────────────────────────────────────────
function AuthForm({ mode, onSubmit, onSwitch, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-[#f7f5f0]"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.08) 3px, transparent 3px)',
        backgroundSize: '36px 36px',
      }}
    >
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-7 shadow-lg">
        <div className="mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">StockQuest</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <label className="block">
              <span className="block text-sm font-semibold text-slate-600 mb-1">Name</span>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-400 transition-all"
                placeholder="Your name" required
              />
            </label>
          )}
          <label className="block">
            <span className="block text-sm font-semibold text-slate-600 mb-1">Email</span>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-400 transition-all"
              placeholder="you@example.com" required
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-slate-600 mb-1">Password</span>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-400 transition-all"
              placeholder="6+ characters" required minLength={6}
            />
          </label>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
          >
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-4">
          {mode === 'login' ? (
            <>New here? <button onClick={() => onSwitch('signup')} className="text-orange-600 font-semibold hover:underline">Sign up</button></>
          ) : (
            <>Have an account? <button onClick={() => onSwitch('login')} className="text-orange-600 font-semibold hover:underline">Log in</button></>
          )}
        </p>
        <button onClick={onBack} className="block mx-auto mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors">
          ← Back
        </button>
      </div>
    </div>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [mode, setMode] = useState(null);

  const handleAuth = ({ name, email }) => {
    setUser({ id: 1, name: name || 'Stock Trader', email });
    navigate('/');
  };

  const handleQuickStart = () => {
    setUser({ id: 1, name: 'Stock Trader', email: 'demo@stockquest.app' });
    navigate('/');
  };

  if (mode) {
    return <AuthForm mode={mode} onSubmit={handleAuth} onSwitch={setMode} onBack={() => setMode(null)} />;
  }

  return (
    <div
      className="min-h-screen text-slate-800 overflow-x-hidden bg-[#f7f5f0]"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.08) 3px, transparent 3px)',
        backgroundSize: '36px 36px',
      }}
    >
      <Ticker />

      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-slate-800">StockQuest</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode('login')}
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            Log in
          </button>
          <button
            onClick={() => setMode('signup')}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="opacity-100">
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-slate-900 mb-6">
            Learn stocks.<br />Make (fake) money.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl mx-auto">
            Bite-sized lessons + a practice trading simulator. Learn by doing, risk nothing.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <button
              onClick={handleQuickStart}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg transition-colors text-base"
            >
              Jump in
            </button>
            <button
              onClick={() => setMode('signup')}
              className="bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-lg transition-colors text-base"
            >
              Sign up
            </button>
          </div>
          <p className="text-sm text-slate-400">Free to use • No real money involved</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-300 bg-white/60 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-700 text-sm">Learn. Practice. Grow.</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            This app helps you understand how investing and the stock market work through fun lessons and safe practice trading. 
            Learn important money skills like saving, investing, and making smart financial decisions for your future—all with virtual money so you can explore without any risk!
          </p>
        </div>
      </footer>
    </div>
  );
}
