// ── Fake Stock Generator (server side) ──────────────────────────────────

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
      eventMultiplier = 1 + gaussianRandom(0, 0.05);
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

export const STOCK_DEFS = [
  { symbol: 'FUNCO', name: 'FunCo Entertainment', sector: 'Entertainment', base: 25, vol: 0.03, trend: 0.5 },
  { symbol: 'SNKBX', name: 'SnackBox Foods', sector: 'Consumer Goods', base: 42, vol: 0.02, trend: 0.3 },
  { symbol: 'TECHX', name: 'TechX Innovations', sector: 'Technology', base: 78, vol: 0.05, trend: 0.8 },
  { symbol: 'GRENN', name: 'GreenN Energy', sector: 'Energy', base: 35, vol: 0.04, trend: 0.2 },
  { symbol: 'PETPL', name: 'PetPal Services', sector: 'Services', base: 18, vol: 0.06, trend: -0.1 },
  { symbol: 'SAFEX', name: 'SafeX Financial', sector: 'Finance', base: 55, vol: 0.015, trend: 0.15 },
  { symbol: 'RKETY', name: 'Rockety Space', sector: 'Aerospace', base: 12, vol: 0.10, trend: 1.2 },
  { symbol: 'GAMEZ', name: 'GameZone Studios', sector: 'Gaming', base: 30, vol: 0.07, trend: 0.6 },
  { symbol: 'HLTHY', name: 'HealthyLife Corp', sector: 'Healthcare', base: 65, vol: 0.025, trend: 0.4 },
  { symbol: 'EDUFY', name: 'Edufy Learning', sector: 'Education', base: 22, vol: 0.035, trend: 0.3 },
];

export const MARKET_EVENTS = [
  { title: 'Earnings Beat!', description: 'Better-than-expected earnings!', effect: 'up', magnitude: 0.08 },
  { title: 'Product Recall', description: 'A major product was recalled.', effect: 'down', magnitude: 0.06 },
  { title: 'New Partnership', description: 'Strategic partnership announced.', effect: 'up', magnitude: 0.04 },
  { title: 'Market Correction', description: 'The market is pulling back.', effect: 'down', magnitude: 0.03 },
  { title: 'Viral Product', description: 'A product went viral!', effect: 'up', magnitude: 0.10 },
  { title: 'CEO Resigns', description: 'CEO unexpectedly resigned.', effect: 'down', magnitude: 0.07 },
  { title: 'Government Grant', description: 'Large government grant received.', effect: 'up', magnitude: 0.05 },
  { title: 'Supply Shortage', description: 'Supply chain issues.', effect: 'down', magnitude: 0.04 },
];
