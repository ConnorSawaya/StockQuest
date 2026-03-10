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
              <span className={up ? 'text-emerald-600 font-semibold' : 'text-rose-500 font-semibold'}>
                ${price.toFixed(2)}
              </span>
              {up
                ? <TrendingUp className="w-3 h-3 text-emerald-500" />
                : <TrendingDown className="w-3 h-3 text-rose-400" />}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─── Sparkline chart ──────────────────────────────────────────────────────────
const CHART_PTS = [44, 42, 47, 45, 50, 48, 54, 52, 57, 55, 60, 58, 63, 61, 67, 65, 70];

function Sparkline({ color = '#10b981', fillColor = 'rgba(16,185,129,0.10)' }) {
  const W = 240, H = 72;
  const min = Math.min(...CHART_PTS);
  const max = Math.max(...CHART_PTS);
  const xs = CHART_PTS.map((_, i) => (i / (CHART_PTS.length - 1)) * W);
  const ys = CHART_PTS.map((p) => H - ((p - min) / (max - min)) * (H * 0.72) - H * 0.1);
  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${W},${H} L0,${H}Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <motion.path d={areaPath} fill={fillColor} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
      <motion.path
        d={linePath} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.1, ease: 'easeOut' }}
      />
      <motion.circle cx={xs.at(-1)} cy={ys.at(-1)} r="4" fill={color}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4, type: 'spring' }} />
    </svg>
  );
}

// ─── App preview card ─────────────────────────────────────────────────────────
function AppPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.15 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

        {/* App top bar */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
          <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-slate-700 tracking-tight">StockQuest</span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              Level 2
            </span>
          </div>
        </div>

        {/* Portfolio panel */}
        <div className="px-4 pt-4 pb-2">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Portfolio value</div>
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-2xl font-extrabold text-slate-800 tracking-tight">$10,847</span>
            <span className="text-xs font-semibold text-emerald-600">+8.47%</span>
          </div>
          <div className="h-16 mt-2">
            <Sparkline />
          </div>
        </div>

        {/* Holdings list */}
        <div className="px-4 pb-3">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Holdings</div>
          <div className="space-y-1.5">
            {[
              { sym: 'AAPL', name: 'Apple Inc.', change: '+2.1%', up: true },
              { sym: 'NVDA', name: 'NVIDIA Corp.', change: '+5.4%', up: true },
              { sym: 'TSLA', name: 'Tesla Inc.', change: '-1.8%', up: false },
            ].map(({ sym, name, change, up }) => (
              <div key={sym} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center">
                    <span className="text-[8px] font-extrabold text-slate-500">{sym[0]}</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-700">{sym}</div>
                    <div className="text-[9px] text-slate-400">{name}</div>
                  </div>
                </div>
                <span className={`text-xs font-bold font-mono ${up ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lesson progress */}
        <div className="border-t border-slate-100 px-4 py-3 bg-blue-50/50">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Current lesson</div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700">Understanding P/E Ratios</span>
            <span className="text-[10px] text-slate-400 font-medium">3 / 5</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
            />
          </div>
          <div className="flex gap-1.5 mt-2">
            {['Basics', 'Stocks', 'Ratios'].map((t, i) => (
              <span key={t} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${i < 2 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
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
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.055) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-lg"
      >
        <div className="mb-7">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-800">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">StockQuest</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <label className="block">
              <span className="block text-sm font-semibold text-slate-600 mb-1.5">Name</span>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all"
                placeholder="Your name" required
              />
            </label>
          )}
          <label className="block">
            <span className="block text-sm font-semibold text-slate-600 mb-1.5">Email</span>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all"
              placeholder="you@example.com" required
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-slate-600 mb-1.5">Password</span>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all"
              placeholder="6+ characters" required minLength={6}
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors text-sm"
          >
            {mode === 'login' ? 'Log in' : 'Create account'}
          </motion.button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-5">
          {mode === 'login' ? (
            <>New here?{' '}<button onClick={() => onSwitch('signup')} className="text-emerald-600 font-semibold hover:underline">Sign up</button></>
          ) : (
            <>Have an account?{' '}<button onClick={() => onSwitch('login')} className="text-emerald-600 font-semibold hover:underline">Log in</button></>
          )}
        </p>
        <button onClick={onBack} className="block mx-auto mt-3 text-xs text-slate-300 hover:text-slate-500 transition-colors">
          ← Back
        </button>
      </motion.div>
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
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.055) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
      }}
    >
      <Ticker />

      {/* Nav */}
      <nav className="relative z-10 max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold text-base text-slate-800 tracking-tight">StockQuest</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode('login')}
            className="text-sm text-slate-400 hover:text-slate-700 transition-colors font-medium"
          >
            Log in
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setMode('signup')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Get started
          </motion.button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-[2.75rem] md:text-5xl font-black leading-[1.1] tracking-tight text-slate-900 mb-5">
              Learn investing the way{' '}
              <span className="text-emerald-500">kids actually enjoy.</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-[420px]">
              StockQuest teaches stock market basics through short lessons and a
              virtual trading simulator. No real money, no jargon — just a clear,
              hands-on way to understand how investing works.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                onClick={handleQuickStart}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-md shadow-emerald-500/20 transition-colors"
              >
                <Zap className="w-4 h-4" />
                Start playing free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setMode('signup')}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-7 py-3.5 rounded-xl transition-colors"
              >
                Create account
                <ArrowRight className="w-4 h-4 opacity-50" />
              </motion.button>
            </div>
            <p className="text-xs text-slate-400">
              Free to use. No account required to try it.
            </p>
          </motion.div>

          {/* Right — app preview */}
          <div className="hidden lg:block">
            <AppPreview />
          </div>
        </div>
      </section>

      {/* ── What it is (inline facts, no icon overload) ───────────────────── */}
      <section className="relative z-10 border-y border-slate-200/70 bg-white/50">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap gap-x-8 gap-y-2 items-center justify-center text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> No real money</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Designed for ages 8–18</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Short lessons, not lectures</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Works on any device</span>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">How it works</h2>
        <p className="text-slate-400 mb-12 max-w-sm">Three things. In order. That's it.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              num: '01',
              icon: <BookOpen className="w-5 h-5" />,
              title: 'Pick a lesson',
              body: 'Each lesson covers one idea — what a stock is, how supply and demand moves prices, what a P/E ratio means. Tap through, answer a question, move on.',
              accent: 'border-blue-200 bg-blue-50/60',
              iconColor: 'text-blue-500 bg-blue-100',
            },
            {
              num: '02',
              icon: <TrendingUp className="w-5 h-5" />,
              title: 'Open the simulator',
              body: 'Trade with $10,000 in virtual cash using real ticker symbols. Watch positions go up and down. Understand why before you ever risk real money.',
              accent: 'border-emerald-200 bg-emerald-50/60',
              iconColor: 'text-emerald-600 bg-emerald-100',
            },
            {
              num: '03',
              icon: <Trophy className="w-5 h-5" />,
              title: 'Level up',
              body: 'Earn XP for completed lessons. Unlock new topics as you progress. The leaderboard is optional — but you\'ll probably check it.',
              accent: 'border-amber-200 bg-amber-50/60',
              iconColor: 'text-amber-600 bg-amber-100',
            },
          ].map(({ num, icon, title, body, accent, iconColor }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`rounded-2xl border-2 p-6 ${accent}`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
                  {icon}
                </div>
                <span className="text-[11px] font-bold tracking-widest text-slate-400">{num}</span>
              </div>
              <h3 className="font-extrabold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">What's inside</h2>
        <p className="text-slate-400 mb-12 max-w-sm">The actual features, not marketing language.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              icon: <BookOpen className="w-5 h-5 text-blue-500" />,
              bg: 'bg-blue-50 border-blue-200',
              title: 'Short, focused lessons',
              body: 'Each lesson is one concept, one quiz question, under 5 minutes. Topics range from "What is a stock?" to reading financial statements.',
              detail: 'Covers: stocks, bonds, ETFs, P/E ratios, diversification, market cycles',
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
              bg: 'bg-emerald-50 border-emerald-200',
              title: 'Virtual trading simulator',
              body: 'Search real tickers, place buy and sell orders, and track your portfolio over time. Prices update regularly so it feels like the real thing.',
              detail: 'Uses real ticker symbols with simulated price movement',
            },
            {
              icon: <Trophy className="w-5 h-5 text-amber-600" />,
              bg: 'bg-amber-50 border-amber-200',
              title: 'XP and progression',
              body: 'Earn XP for every lesson you complete. Level up to unlock more advanced topics. Progress is saved automatically.',
              detail: 'New content unlocks as your level increases',
            },
            {
              icon: <Shield className="w-5 h-5 text-violet-600" />,
              bg: 'bg-violet-50 border-violet-200',
              title: 'No real money, ever',
              body: 'The simulator uses virtual cash only. Nothing is connected to a real brokerage, bank account, or payment of any kind.',
              detail: 'Safe for kids. No financial risk.',
            },
          ].map(({ icon, bg, title, body, detail }) => (
            <motion.div
              key={title}
              whileHover={{ y: -2 }}
              className={`bg-white border-2 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${bg.split(' ')[1]}`}
            >
              <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mb-4 ${bg}`}>
                {icon}
              </div>
              <h3 className="font-extrabold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">{body}</p>
              <p className="text-[11px] text-slate-400 font-medium">{detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-emerald-500 rounded-2xl px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)',
              backgroundSize: '22px 22px',
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-white mb-1">Give it a try. It's free.</h2>
            <p className="text-emerald-100 text-sm max-w-sm">
              No account required to start. Jump in and see if it clicks.
            </p>
          </div>
          <div className="relative z-10 flex gap-3 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={handleQuickStart}
              className="bg-white text-emerald-700 font-bold px-7 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow inline-flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" /> Start playing
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setMode('signup')}
              className="bg-emerald-600 hover:bg-emerald-700 border border-emerald-400/30 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Create account
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/40">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-emerald-500 rounded-md flex items-center justify-center">
              <BarChart3 className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-slate-500">StockQuest</span>
            <span>&copy; 2026</span>
          </div>
          <span>Not financial advice. Built for learning.</span>
        </div>
      </footer>
    </div>
  );
}
