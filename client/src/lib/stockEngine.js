// ── Fake Stock Generator ─────────────────────────────────────────────────
// Generates realistic-looking stock price history using random walk with
// drift, occasional market events, and sector-based correlation.

function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

export function generatePriceHistory(basePrice, volatility, trend, days = 90) {
  const prices = [basePrice];
  for (let i = 1; i <= days; i++) {
    const noise = gaussianRandom(0, volatility);
    const trendBias = trend * 0.001;
    let eventMultiplier = 1.0;
    if (Math.random() > 0.95) {
      eventMultiplier = 1 + gaussianRandom(0, 0.05); // ±5% event
    }
    const prev = prices[i - 1];
    let next = prev * (1 + noise + trendBias) * eventMultiplier;
    next = Math.max(next, 0.01);
    prices.push(Math.round(next * 100) / 100);
  }
  return prices;
}

export function generateOHLC(prices) {
  return prices.map((close, i) => {
    const open = i > 0 ? prices[i - 1] : close;
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = Math.floor(100000 + Math.random() * 900000);
    return {
      day: i,
      open: Math.round(open * 100) / 100,
      close: Math.round(close * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume,
    };
  });
}

// ── Predefined fake stocks ───────────────────────────────────────────────
const STOCK_DEFS = [
  { id: 1, symbol: 'FUNCO', name: 'FunCo Entertainment', sector: 'Entertainment', base: 25, vol: 0.03, trend: 0.5 },
  { id: 2, symbol: 'SNKBX', name: 'SnackBox Foods', sector: 'Consumer Goods', base: 42, vol: 0.02, trend: 0.3 },
  { id: 3, symbol: 'TECHX', name: 'TechX Innovations', sector: 'Technology', base: 78, vol: 0.05, trend: 0.8 },
  { id: 4, symbol: 'GRENN', name: 'GreenN Energy', sector: 'Energy', base: 35, vol: 0.04, trend: 0.2 },
  { id: 5, symbol: 'PETPL', name: 'PetPal Services', sector: 'Services', base: 18, vol: 0.06, trend: -0.1 },
  { id: 6, symbol: 'SAFEX', name: 'SafeX Financial', sector: 'Finance', base: 55, vol: 0.015, trend: 0.15 },
  { id: 7, symbol: 'RKETY', name: 'Rockety Space', sector: 'Aerospace', base: 12, vol: 0.10, trend: 1.2 },
  { id: 8, symbol: 'GAMEZ', name: 'GameZone Studios', sector: 'Gaming', base: 30, vol: 0.07, trend: 0.6 },
  { id: 9, symbol: 'HLTHY', name: 'HealthyLife Corp', sector: 'Healthcare', base: 65, vol: 0.025, trend: 0.4 },
  { id: 10, symbol: 'EDUFY', name: 'Edufy Learning', sector: 'Education', base: 22, vol: 0.035, trend: 0.3 },
];

export function generateMarket(days = 90) {
  return STOCK_DEFS.map((def) => {
    const priceHistory = generatePriceHistory(def.base, def.vol, def.trend, days);
    const price = priceHistory[priceHistory.length - 1];
    const prevPrice = priceHistory[priceHistory.length - 2];
    const change = price - prevPrice;
    const changePercent = (change / prevPrice) * 100;
    return {
      id: def.id,
      symbol: def.symbol,
      name: def.name,
      sector: def.sector,
      price,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      priceHistory,
      ohlc: generateOHLC(priceHistory),
    };
  });
}

// ── Market Events (for mini-challenges) ──────────────────────────────────
export const MARKET_EVENTS = [
  { id: 1, title: 'Earnings Beat!', description: 'A company reported better-than-expected earnings. Stock surges!', effect: 'up', magnitude: 0.08 },
  { id: 2, title: 'Product Recall', description: 'A major product was recalled. Stock drops.', effect: 'down', magnitude: 0.06 },
  { id: 3, title: 'New Partnership', description: 'Two companies announced a partnership!', effect: 'up', magnitude: 0.04 },
  { id: 4, title: 'Market Correction', description: 'The whole market is pulling back today.', effect: 'down', magnitude: 0.03 },
  { id: 5, title: 'Viral Product', description: 'A product went viral on social media!', effect: 'up', magnitude: 0.10 },
  { id: 6, title: 'CEO Resigns', description: 'The CEO unexpectedly resigned. Uncertainty rises.', effect: 'down', magnitude: 0.07 },
  { id: 7, title: 'Government Grant', description: 'The company received a large government grant.', effect: 'up', magnitude: 0.05 },
  { id: 8, title: 'Supply Shortage', description: 'Supply chain issues are affecting production.', effect: 'down', magnitude: 0.04 },
];

export function getRandomEvent() {
  return MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
}

export function applyEvent(stock, event) {
  const multiplier = event.effect === 'up' ? 1 + event.magnitude : 1 - event.magnitude;
  return {
    ...stock,
    price: Math.round(stock.price * multiplier * 100) / 100,
    change: Math.round(stock.price * (multiplier - 1) * 100) / 100,
    changePercent: Math.round((multiplier - 1) * 10000) / 100,
  };
}
