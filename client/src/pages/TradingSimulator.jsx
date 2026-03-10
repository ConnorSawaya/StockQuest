import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { generateMarket, getRandomEvent, applyEvent } from '../lib/stockEngine';
import { StockLineChart, SparkLine } from '../components/Charts';
import { ALL_BADGES } from '../data/lessons';
import { BadgeUnlockModal } from '../components/Feedback';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  AlertTriangle, Zap,
} from 'lucide-react';

export default function TradingSimulator() {
  const {
    cash, holdings, buyStock, sellStock, transactions,
    addXP, earnBadge, earnedBadges,
  } = useStore();

  const [market, setMarket] = useState(() => generateMarket(90));
  const [selectedStock, setSelectedStock] = useState(null);
  const [shares, setShares] = useState(1);
  const [tradeResult, setTradeResult] = useState(null);
  const [showBadge, setShowBadge] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [tab, setTab] = useState('market');

  useEffect(() => {
    if (market.length > 0 && !selectedStock) setSelectedStock(market[0]);
  }, [market, selectedStock]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarket((prev) =>
        prev.map((stock) => {
          const noise = (Math.random() - 0.5) * stock.price * 0.02;
          const newPrice = Math.max(0.01, stock.price + noise);
          const change = newPrice - stock.price;
          return {
            ...stock,
            price: Math.round(newPrice * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round((change / stock.price) * 10000) / 100,
            priceHistory: [...stock.priceHistory.slice(-89), Math.round(newPrice * 100) / 100],
          };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Keep selectedStock in sync with latest market prices
  useEffect(() => {
    if (selectedStock) {
      const updated = market.find((s) => s.id === selectedStock.id);
      if (updated && updated.price !== selectedStock.price) setSelectedStock(updated);
    }
  }, [market]);

  const triggerEvent = () => {
    const event = getRandomEvent();
    if (!selectedStock) return;
    const updated = applyEvent(selectedStock, event);
    setMarket((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setSelectedStock(updated);
    setActiveEvent(event);
    setTimeout(() => setActiveEvent(null), 5000);
  };

  const handleBuy = () => {
    if (!selectedStock || shares < 1) return;
    const success = buyStock(selectedStock, shares);
    if (success) {
      setTradeResult({ type: 'buy', symbol: selectedStock.symbol, shares, price: selectedStock.price });
      addXP(5);
      if (transactions.length === 0) {
        const badge = ALL_BADGES.find((b) => b.id === 'first-trade');
        if (badge && !earnedBadges.find((b) => b.id === badge.id)) {
          earnBadge(badge); setShowBadge(badge);
        }
      }
      const uniqueStocks = new Set([...holdings.map((h) => h.stockId), selectedStock.id]);
      if (uniqueStocks.size >= 5) {
        const badge = ALL_BADGES.find((b) => b.id === 'diversifier');
        if (badge && !earnedBadges.find((b) => b.id === badge.id)) {
          earnBadge(badge); setShowBadge(badge);
        }
      }
      setTimeout(() => setTradeResult(null), 3000);
    }
  };

  const handleSell = () => {
    if (!selectedStock || shares < 1) return;
    const holding = holdings.find((h) => h.stockId === selectedStock.id);
    if (!holding) return;
    const success = sellStock(selectedStock, shares);
    if (success) {
      const profit = (selectedStock.price - holding.avgPrice) * shares;
      setTradeResult({ type: 'sell', symbol: selectedStock.symbol, shares, price: selectedStock.price, profit });
      if (profit > 0) addXP(5);
      if (profit > 0 && !earnedBadges.find((b) => b.id === 'first-profit')) {
        const badge = ALL_BADGES.find((b) => b.id === 'first-profit');
        if (badge) { earnBadge(badge); setShowBadge(badge); }
      }
      setTimeout(() => setTradeResult(null), 3000);
    }
  };

  const currentHolding = selectedStock ? holdings.find((h) => h.stockId === selectedStock.id) : null;
  const totalPortfolioValue = cash + holdings.reduce((sum, h) => {
    const current = market.find((s) => s.id === h.stockId);
    return sum + (current ? current.price : h.avgPrice) * h.shares;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold">${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <span className="text-xs text-gray-400">cash</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold">${totalPortfolioValue.toFixed(2)}</span>
          <span className="text-xs text-gray-400">total</span>
        </div>
        <button onClick={triggerEvent} className="ml-auto flex items-center gap-1.5 bg-warning-50 text-warning-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-warning-100 transition-colors">
          <Zap className="w-4 h-4" /> News Event
        </button>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`rounded-lg px-4 py-3 mb-3 text-sm font-medium ${activeEvent.effect === 'up' ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}>
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            {activeEvent.title} — {activeEvent.description}
          </motion.div>
        )}
        {tradeResult && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-lg px-4 py-3 mb-3 text-sm font-medium bg-orange-50 text-orange-700">
            {tradeResult.type === 'buy' ? '? Bought' : '? Sold'} {tradeResult.shares}× {tradeResult.symbol} at ${tradeResult.price.toFixed(2)}
            {tradeResult.profit !== undefined && (
              <span className={tradeResult.profit >= 0 ? ' text-success-600' : ' text-danger-600'}>
                {' '}({tradeResult.profit >= 0 ? '+' : ''}${tradeResult.profit.toFixed(2)})
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left: list */}
        <div className="lg:col-span-1">
          <div className="flex gap-1 mb-3 bg-gray-100 rounded-lg p-1">
            {['market', 'portfolio', 'history'].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'market' && (
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
              {market.map((stock) => (
                <button key={stock.id} onClick={() => { setSelectedStock(stock); setShares(1); }}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedStock?.id === stock.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">{stock.symbol}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[110px]">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">${stock.price.toFixed(2)}</div>
                      <div className={`text-xs font-medium ${stock.change >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5">
                    <SparkLine data={stock.priceHistory.slice(-30)} height={24} width="100%" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {tab === 'portfolio' && (
            <div className="space-y-1.5">
              {holdings.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  Tap a stock and hit <strong>Buy</strong> to get started
                </div>
              ) : holdings.map((h) => {
                const current = market.find((s) => s.id === h.stockId);
                const currentPrice = current ? current.price : h.avgPrice;
                const pnl = (currentPrice - h.avgPrice) * h.shares;
                return (
                  <button key={h.stockId} onClick={() => { const s = market.find((m) => m.id === h.stockId); if (s) { setSelectedStock(s); setShares(1); setTab('market'); } }}
                    className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm">{h.symbol}</div>
                        <div className="text-xs text-gray-400">{h.shares} shares</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">${(currentPrice * h.shares).toFixed(2)}</div>
                        <div className={`text-xs font-medium ${pnl >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No trades yet</div>
              ) : [...transactions].reverse().map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100">
                  <div className="flex items-center gap-2">
                    {t.type === 'buy' ? <ShoppingCart className="w-4 h-4 text-orange-500" /> : <DollarSign className="w-4 h-4 text-success-500" />}
                    <div>
                      <div className="text-sm font-medium capitalize">{t.type} {t.symbol}</div>
                      <div className="text-xs text-gray-400">{t.shares}× @ ${t.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">${(t.shares * t.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: chart + trade */}
        <div className="lg:col-span-2">
          {selectedStock ? (
            <>
              <div className="card mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold">{selectedStock.symbol}</h2>
                    <div className="text-xs text-gray-400">{selectedStock.name} Ã‚Â· {selectedStock.sector}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${selectedStock.price.toFixed(2)}</div>
                    <div className={`flex items-center gap-1 justify-end text-sm font-medium ${selectedStock.change >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                      {selectedStock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <StockLineChart data={selectedStock.priceHistory} height={240} />
              </div>

              {/* Compact trade panel */}
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-gray-600">Shares</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setShares(Math.max(1, shares - 1))}
                      className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold">Ã¢Ë†â€™</button>
                    <input type="number" value={shares} onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v >= 0) setShares(v); }}
                      className="w-16 text-center border border-gray-200 rounded-lg py-1.5 text-sm font-semibold" min="1" />
                    <button onClick={() => setShares(shares + 1)}
                      className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold">+</button>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-sm font-bold">${(selectedStock.price * shares).toFixed(2)}</div>
                    {currentHolding && <div className="text-xs text-gray-400">Own {currentHolding.shares}</div>}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleBuy} disabled={shares < 1 || selectedStock.price * shares > cash} className="btn-success flex-1">
                    Buy {shares}
                  </button>
                  <button onClick={handleSell} disabled={!currentHolding || shares < 1 || shares > (currentHolding?.shares || 0)} className="btn-danger flex-1">
                    Sell {shares}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="card text-center py-20 text-gray-400">Pick a stock to start</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showBadge && <BadgeUnlockModal badge={showBadge} onClose={() => setShowBadge(null)} />}
      </AnimatePresence>
    </div>
  );
}
