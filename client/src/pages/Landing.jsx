import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const TICKER_SYMBOLS = [
  { symbol: 'AAPL', price: 189.5 },
  { symbol: 'MSFT', price: 412.3 },
  { symbol: 'NVDA', price: 875.2 },
  { symbol: 'TSLA', price: 177.4 },
  { symbol: 'AMZN', price: 185.6 },
  { symbol: 'GOOGL', price: 172.9 },
  { symbol: 'META', price: 493.1 },
  { symbol: 'SPY', price: 521.8 },
  { symbol: 'AMD', price: 158.3 },
  { symbol: 'BRK.B', price: 404.7 },
];

function useTicker() {
  const [ticks, setTicks] = useState(() =>
    TICKER_SYMBOLS.map(({ symbol, price }) => ({ symbol, price, previous: price }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTicks((previousTicks) =>
        previousTicks.map(({ symbol, price }) => {
          const change = (Math.random() - 0.48) * 2.5;
          return {
            symbol,
            price: +Math.max(1, price + change).toFixed(2),
            previous: price,
          };
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
    <div className="overflow-hidden border-b border-slate-200 bg-white/70" aria-label="Simulated sample prices">
      <motion.div
        className="flex gap-10 py-2 px-4 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 36, ease: 'linear', repeat: Infinity }}
        aria-hidden="true"
      >
        {items.map(({ symbol, price, previous }, index) => {
          const rising = price >= previous;

          return (
            <span key={`${symbol}-${index}`} className="inline-flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500">{symbol}</span>
              <span className={rising ? 'text-orange-700 font-semibold' : 'text-rose-700 font-semibold'}>
                ${price.toFixed(2)}
              </span>
              {rising
                ? <TrendingUp className="w-3 h-3 text-orange-600" />
                : <TrendingDown className="w-3 h-3 text-rose-600" />}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { setUser } = useStore();

  const startDemo = () => {
    setUser({ id: 'local-demo', name: 'Practice Trader' });
    navigate('/');
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#f7f5f0] text-slate-800"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.08) 3px, transparent 3px)',
        backgroundSize: '36px 36px',
      }}
    >
      <Ticker />

      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5" aria-label="Main navigation">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-slate-800">StockQuest</span>
        </div>
        <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800">
          Local demo
        </span>
      </nav>

      <main>
        <section className="mx-auto max-w-4xl px-6 pb-24 pt-16 text-center md:pb-32 md:pt-24">
          <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
            Learn stocks.<br />Practice with pretend money.
          </h1>
          <p className="mx-auto mb-9 max-w-xl text-lg leading-relaxed text-slate-700">
            Try short lessons and a practice trading simulator. Explore how investing works without using real money.
          </p>
          <div className="mb-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={startDemo}
              className="rounded-lg bg-orange-600 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              Start the demo
            </button>
            <a
              href="#about-the-demo"
              className="rounded-lg border-2 border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              How it works
            </a>
          </div>
          <p className="text-sm text-slate-600">No account needed. Your practice session resets when you refresh.</p>
        </section>

        <section id="about-the-demo" className="mx-auto max-w-4xl scroll-mt-8 px-6 pb-16">
          <div className="rounded-xl border border-orange-200 bg-white/90 p-6 md:p-8">
            <h2 className="mb-3 text-xl font-bold text-slate-900">A learning demo, not a brokerage</h2>
            <p className="max-w-3xl leading-relaxed text-slate-700">
              Prices are generated for practice and are not live quotes. There are no accounts, real trades, or real parental controls. Please do not enter personal or financial information. This app is for learning and is not financial advice.
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-slate-300 bg-white/70">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-orange-500">
              <BarChart3 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800">StockQuest</span>
          </div>
          <p className="max-w-2xl text-xs leading-relaxed text-slate-600">
            Sample lessons and simulated prices run in your browser. Progress is temporary and is not sent to a server.
          </p>
        </div>
      </footer>
    </div>
  );
}
