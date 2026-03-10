// ── Lesson Data ─────────────────────────────────────────────────────────
// Complete curriculum structured as modules → lessons → content steps + quizzes

export const MODULES = [
  {
    id: 1,
    title: 'Stock Basics',
    description: 'Learn what stocks are and how the market works',
    icon: '📚',
    requiredScore: 0, // first module always unlocked
    lessons: [
      {
        id: 'L1-1',
        title: 'What is a Stock?',
        type: 'lesson',
        xpReward: 25,
        content: [
          {
            type: 'info',
            text: "Imagine you love a pizza shop. What if you could **own a tiny piece** of it? That's what a stock is! When you buy a stock, you own a small piece of a company.",
            image: 'pizza-shop',
          },
          {
            type: 'info',
            text: 'Companies sell stocks to raise money. Investors buy stocks hoping the company grows and their piece becomes more valuable.',
          },
          {
            type: 'quiz',
            question: 'A stock represents...',
            options: ['A loan to a company', 'A small piece of a company', 'A type of currency', 'A savings account'],
            correctIndex: 1,
            explanation: 'When you buy stock, you become a part-owner (shareholder) of that company!',
          },
          {
            type: 'quiz',
            question: 'Why do companies sell stocks?',
            options: ['Because they have too many', 'To raise money to grow', 'To pay their employees', 'Because the government requires it'],
            correctIndex: 1,
            explanation: 'Companies sell stocks to raise capital — money they can use to expand, build new products, or hire more people.',
          },
        ],
      },
      {
        id: 'L1-2',
        title: 'How the Market Works',
        type: 'lesson',
        xpReward: 25,
        content: [
          {
            type: 'info',
            text: 'The **stock market** is like a big online store where people buy and sell pieces of companies. The two biggest markets in the US are the **NYSE** and **NASDAQ**.',
          },
          {
            type: 'info',
            text: 'Stock prices go up when more people want to BUY (demand) and go down when more people want to SELL (supply). It\'s just like trading cards — rare ones cost more!',
          },
          {
            type: 'quiz',
            question: 'What makes stock prices go UP?',
            options: ['More people selling', 'More people buying', 'The company changing its name', 'The stock market closing'],
            correctIndex: 1,
            explanation: 'When demand increases (more buyers), the price rises. More supply (sellers) makes prices fall.',
          },
          {
            type: 'quiz',
            question: 'The stock market is most similar to:',
            options: ['A library', 'A school', 'A marketplace where things are bought and sold', 'A bank vault'],
            correctIndex: 2,
            explanation: 'The stock market is a marketplace where investors buy and sell shares of companies.',
          },
        ],
      },
      {
        id: 'L1-3',
        title: 'Bulls & Bears',
        type: 'lesson',
        xpReward: 25,
        content: [
          {
            type: 'info',
            text: '🐂 A **bull market** means prices are going UP and investors are feeling confident. Think of a bull charging upward with its horns!',
          },
          {
            type: 'info',
            text: '🐻 A **bear market** means prices are going DOWN and investors are worried. Think of a bear swiping downward with its paw!',
          },
          {
            type: 'quiz',
            question: 'In a bull market, stock prices are generally:',
            options: ['Falling', 'Rising', 'Staying the same', 'Unpredictable'],
            correctIndex: 1,
            explanation: 'Bull = UP! Bull markets mean rising prices and investor confidence.',
          },
          {
            type: 'quiz',
            question: 'Which animal represents a market where prices are falling?',
            options: ['Eagle', 'Bull', 'Bear', 'Wolf'],
            correctIndex: 2,
            explanation: 'Bears represent falling markets. Remember: bear swipes DOWN.',
          },
        ],
      },
      {
        id: 'L1-4',
        title: 'Reading a Stock Ticker',
        type: 'lesson',
        xpReward: 25,
        content: [
          {
            type: 'info',
            text: 'Every stock has a **ticker symbol** — a short code like AAPL for Apple or TSLA for Tesla. It\'s like a nickname for the company on the market.',
          },
          {
            type: 'info',
            text: 'A stock ticker shows: the **symbol**, the current **price**, and the **change** (up ▲ in green or down ▼ in red). Example: FUNCO $25.40 ▲ +$0.80 (+3.2%)',
          },
          {
            type: 'quiz',
            question: 'What is a ticker symbol?',
            options: ['A secret code', 'A short code that identifies a company on the stock market', 'The company\'s phone number', 'The stock\'s serial number'],
            correctIndex: 1,
            explanation: 'Ticker symbols are short abbreviations used to identify stocks. AAPL = Apple, GOOG = Google!',
          },
          {
            type: 'quiz',
            question: 'If a stock shows ▲ +2.5%, what does that mean?',
            options: ['The stock lost 2.5%', 'The stock gained 2.5% today', 'The stock costs $2.50', 'The stock has 2.5 shares'],
            correctIndex: 1,
            explanation: 'The green arrow ▲ and + sign mean the stock price went UP by 2.5% since yesterday.',
          },
        ],
      },
      {
        id: 'module-1-quiz',
        title: 'Module 1 Quiz',
        type: 'quiz',
        xpReward: 50,
        content: [
          {
            type: 'quiz',
            question: 'A stock represents ownership in a ___.',
            options: ['Bank', 'Company', 'School', 'Country'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'Stock prices rise when there are more:',
            options: ['Sellers', 'Buyers', 'Companies', 'Markets'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'A bear market means prices are:',
            options: ['Rising quickly', 'Falling', 'Staying the same', 'Doubling'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'What does a green ▲ arrow next to a stock mean?',
            options: ['Price went down', 'Price went up', 'Stock is closed', 'Stock is new'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'AAPL is the ticker symbol for:',
            options: ['Amazon', 'Apple', 'Alphabet', 'Adobe'],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Your First Trade',
    description: 'Learn how to buy, sell, and manage a portfolio',
    icon: '💰',
    requiredScore: 80,
    lessons: [
      {
        id: 'L2-1',
        title: 'Buying & Selling',
        type: 'lesson',
        xpReward: 25,
        content: [
          {
            type: 'info',
            text: '**Buying** a stock means you\'re paying money to own shares. **Selling** means giving your shares back to the market in exchange for money.',
          },
          {
            type: 'info',
            text: 'The goal: **Buy low, sell high!** If you buy a stock at $10 and sell it at $15, you made $5 profit per share. 🎉',
          },
          {
            type: 'quiz',
            question: 'You buy a stock at $20 and sell at $30. What\'s your profit per share?',
            options: ['$20', '$30', '$10', '$50'],
            correctIndex: 2,
            explanation: '$30 (sell price) - $20 (buy price) = $10 profit per share!',
          },
          {
            type: 'quiz',
            question: 'If you buy at $50 and the price drops to $40, you have:',
            options: ['A $10 profit', 'A $10 loss', 'No change', 'A $40 profit'],
            correctIndex: 1,
            explanation: 'You paid $50 but it\'s now worth $40. That\'s a $10 loss (until you sell, it\'s an "unrealized" loss).',
          },
        ],
      },
      {
        id: 'L2-2',
        title: 'Understanding Portfolios',
        type: 'lesson',
        xpReward: 25,
        content: [
          {
            type: 'info',
            text: 'A **portfolio** is your collection of all the stocks you own. It\'s like a backpack full of all your investments!',
          },
          {
            type: 'info',
            text: 'A good portfolio is **diversified** — that means you own stocks from different types of companies. Don\'t put all your eggs in one basket! 🥚🧺',
          },
          {
            type: 'quiz',
            question: 'Diversification means:',
            options: ['Buying only one stock', 'Spreading your money across different stocks', 'Selling everything', 'Only buying expensive stocks'],
            correctIndex: 1,
            explanation: 'Diversification reduces risk by spreading investments across different companies and sectors.',
          },
        ],
      },
      {
        id: 'L2-3',
        title: 'Profit & Loss',
        type: 'lesson',
        xpReward: 25,
        content: [
          {
            type: 'info',
            text: '**Profit** is when you sell for more than you paid. **Loss** is when you sell for less. Your total profit/loss is called your **P&L**.',
          },
          {
            type: 'info',
            text: 'While you hold a stock, gains/losses are **unrealized** (on paper). Once you sell, they become **realized** (real money).',
          },
          {
            type: 'quiz',
            question: 'You bought 10 shares at $5 each and sold them all at $8 each. Total profit?',
            options: ['$30', '$50', '$80', '$3'],
            correctIndex: 0,
            explanation: 'Bought for 10 × $5 = $50. Sold for 10 × $8 = $80. Profit = $80 - $50 = $30!',
          },
        ],
      },
      {
        id: 'module-2-quiz',
        title: 'Module 2 Quiz',
        type: 'quiz',
        xpReward: 50,
        content: [
          {
            type: 'quiz',
            question: 'The basic goal of trading is to:',
            options: ['Buy high sell low', 'Buy low sell high', 'Never sell', 'Buy as much as possible'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'A portfolio is:',
            options: ['A single stock', 'Your collection of investments', 'A type of chart', 'A trading fee'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'An unrealized loss means:',
            options: ['You sold at a loss', 'Your stock is down but you haven\'t sold yet', 'You lost your phone', 'The market is closed'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'Diversification helps to:',
            options: ['Increase risk', 'Reduce risk', 'Make everything free', 'Guarantee profits'],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Trading Strategies',
    description: 'Learn smart approaches to buying and selling',
    icon: '🧠',
    requiredScore: 80,
    lessons: [
      {
        id: 'L3-1',
        title: 'Buy Low, Sell High',
        type: 'lesson',
        xpReward: 25,
        content: [
          {
            type: 'info',
            text: 'The golden rule of trading: **buy low, sell high**. But how do you know when a price is "low"? You look at the stock\'s history and patterns!',
          },
          {
            type: 'info',
            text: 'A stock that dropped 20% might be a good deal — or it might keep dropping. That\'s why we study **trends** and **patterns** before buying.',
          },
          {
            type: 'quiz',
            question: 'A stock dropped from $100 to $80. This could be:',
            options: ['Always a buying opportunity', 'Always bad news', 'A potential opportunity that needs more research', 'Impossible'],
            correctIndex: 2,
            explanation: 'Price drops can be opportunities OR warning signs. Always research WHY before buying!',
          },
        ],
      },
      {
        id: 'L3-2',
        title: 'Risk vs Reward',
        type: 'lesson',
        xpReward: 25,
        content: [
          {
            type: 'info',
            text: '**Risk** is the chance of losing money. **Reward** is the potential gain. Generally, higher potential reward = higher risk.',
          },
          {
            type: 'info',
            text: '🎯 Smart traders never risk more than they can afford to lose. A good rule: never put more than 10% of your money in a single stock.',
          },
          {
            type: 'quiz',
            question: 'A stock with very high potential returns usually has:',
            options: ['No risk', 'Low risk', 'High risk', 'Zero price'],
            correctIndex: 2,
            explanation: 'High reward usually comes with high risk. That\'s the risk-reward tradeoff!',
          },
        ],
      },
      {
        id: 'module-3-quiz',
        title: 'Module 3 Quiz',
        type: 'quiz',
        xpReward: 50,
        content: [
          {
            type: 'quiz',
            question: 'Before buying a stock that dropped in price, you should:',
            options: ['Buy immediately', 'Research why it dropped', 'Ignore it', 'Sell all your other stocks'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'A good rule is to never invest more than ___% in one stock:',
            options: ['50%', '100%', '10%', '90%'],
            correctIndex: 2,
          },
          {
            type: 'quiz',
            question: 'Higher potential reward usually means:',
            options: ['Lower risk', 'No risk', 'Higher risk', 'Free money'],
            correctIndex: 2,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Reading Charts',
    description: 'Learn to read and understand stock charts',
    icon: '📈',
    requiredScore: 80,
    lessons: [
      {
        id: 'L4-1',
        title: 'Line Charts',
        type: 'lesson',
        xpReward: 25,
        content: [
          {
            type: 'info',
            text: 'A **line chart** connects closing prices over time with a line. It\'s the simplest chart and great for seeing the big-picture trend.',
          },
          {
            type: 'info',
            text: 'If the line goes UP from left to right → **uptrend** (bullish). If it goes DOWN → **downtrend** (bearish). If it\'s flat → **sideways/consolidation**.',
          },
          {
            type: 'quiz',
            question: 'A line going up from left to right shows:',
            options: ['A downtrend', 'An uptrend', 'No trend', 'A broken chart'],
            correctIndex: 1,
            explanation: 'A rising line from left to right means prices have been increasing — that\'s an uptrend!',
          },
        ],
      },
      {
        id: 'L4-2',
        title: 'Candlestick Basics',
        type: 'lesson',
        xpReward: 25,
        content: [
          {
            type: 'info',
            text: 'A **candlestick** shows 4 prices: Open, High, Low, Close (OHLC). Green candles = price went UP during that period. Red = price went DOWN.',
          },
          {
            type: 'info',
            text: 'The thick part is the **body** (open to close). The thin lines are **wicks** (high and low). Tall wicks mean lots of back-and-forth trading!',
          },
          {
            type: 'quiz',
            question: 'A green candlestick means the price:',
            options: ['Dropped', 'Closed higher than it opened', 'Stayed the same', 'Is very expensive'],
            correctIndex: 1,
            explanation: 'Green = the closing price was higher than the opening price. The stock went up during this period!',
          },
        ],
      },
      {
        id: 'module-4-quiz',
        title: 'Module 4 Quiz',
        type: 'quiz',
        xpReward: 50,
        content: [
          {
            type: 'quiz',
            question: 'A line chart shows:',
            options: ['Only today\'s price', 'Closing prices over time', 'The stock\'s color', 'How many people bought'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'OHLC stands for:',
            options: ['Over High Low Cost', 'Open High Low Close', 'Old High Low Change', 'Only High Low Chart'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'A red candlestick means the price:',
            options: ['Went up', 'Closed lower than it opened', 'Is on sale', 'Is dangerous'],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Advanced Trading',
    description: 'Master market events, sectors, and advanced strategies',
    icon: '🚀',
    requiredScore: 80,
    lessons: [
      {
        id: 'L5-1',
        title: 'Market Events',
        type: 'lesson',
        xpReward: 30,
        content: [
          {
            type: 'info',
            text: 'Stock prices react to **news**. Earnings reports, product launches, and world events can all cause big price swings.',
          },
          {
            type: 'info',
            text: 'Smart traders try to **anticipate** events and position themselves before the news hits. But be careful — sometimes good news is already "priced in"!',
          },
          {
            type: 'quiz',
            question: '"Priced in" means:',
            options: ['The stock has a price tag', 'The market already expected the news', 'The price is fair', 'The stock is on sale'],
            correctIndex: 1,
            explanation: 'When something is "priced in", it means investors already anticipated the news, so the price doesn\'t change much when it\'s announced.',
          },
        ],
      },
      {
        id: 'L5-2',
        title: 'Technical Patterns Traders Use',
        type: 'lesson',
        xpReward: 30,
        content: [
          {
            type: 'info',
            text: '**Support** is a price level where a stock keeps bouncing back UP (buyers jump in). **Resistance** is where it bounces back DOWN (sellers take profits). Smart traders buy near support!',
          },
          {
            type: 'info',
            text: 'A **breakout** happens when a stock breaks through resistance with high volume — often leading to big price gains. Traders watch for this classic high-probability pattern.',
          },
          {
            type: 'info',
            text: 'The **head and shoulders** pattern has 3 peaks (left shoulder, head, right shoulder). When it breaks below the neckline, it\'s a strong sell signal. Opposite = inverse H&S = buy signal!',
          },
          {
            type: 'info',
            text: 'A **double bottom** looks like two dips to the same low price. When it bounces up between them, it\'s often a buying opportunity. **Double top** (opposite) is a selling signal.',
          },
          {
            type: 'info',
            text: 'The **moving average** (MA) smooths out price noise to show the real trend. 50-day MA above 200-day MA = strong uptrend (**golden cross**). Below = downtrend (**death cross**).',
          },
          {
            type: 'info',
            text: '**RSI** (Relative Strength Index) measures if a stock is overbought (too high, above 70) or oversold (too low, below 30). Oversold can be a buying opportunity!',
          },
          {
            type: 'quiz',
            question: 'Support is a price level where:',
            options: ['Sellers dominate', 'Buyers jump in to buy', 'The market closes', 'Prices always fall'],
            correctIndex: 1,
            explanation: 'Support is where buyers are ready to buy, causing the price to bounce back up. Think of it as a "floor"!',
          },
          {
            type: 'quiz',
            question: 'A breakout above resistance with high volume usually means:',
            options: ['Prepare to short', 'Potential strong price gain ahead', 'Sell everything', 'The stock is overpriced'],
            correctIndex: 1,
            explanation: 'Breakouts are high-probability trades because it shows the stock has momentum to keep rising beyond the old resistance level.',
          },
          {
            type: 'quiz',
            question: 'A golden cross is when:',
            options: ['Two moving averages cross bullishly', 'You find actual gold', 'The stock crashes', 'RSI hits 0'],
            correctIndex: 0,
            explanation: 'A golden cross (50-MA above 200-MA) signals a strong uptrend and is a classic bullish signal!',
          },
          {
            type: 'quiz',
            question: 'RSI above 70 suggests the stock is:',
            options: ['Cheap', 'Oversold', 'Overbought', 'Perfect to buy'],
            correctIndex: 2,
            explanation: 'RSI above 70 means the stock is overbought. Traders often look to sell or wait for a pullback. Below 30 = oversold = potential buy!',
          },
        ],
      },
      {
        id: 'module-5-quiz',
        title: 'Module 5 Quiz',
        type: 'quiz',
        xpReward: 50,
        content: [
          {
            type: 'quiz',
            question: 'Stock prices can be affected by:',
            options: ['Only the company\'s sales', 'News, events, and investor sentiment', 'The weather only', 'Nothing external'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'If good earnings are "priced in", the stock will likely:',
            options: ['Surge upward', 'Not move much', 'Crash', 'Split'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'Which pattern has 3 peaks (left shoulder, head, right shoulder)?',
            options: ['Double bottom', 'Head and shoulders', 'Triangle', 'Flag'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'A death cross is when:',
            options: ['50-MA crosses above 200-MA', '50-MA crosses below 200-MA', 'Someone loses money', 'The market is closed'],
            correctIndex: 1,
          },
          {
            type: 'quiz',
            question: 'When a stock is RSI oversold (below 30), traders often:',
            options: ['Panic sell', 'Look for a buying opportunity', 'Ignore it', 'Short it'],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
];

export const ALL_BADGES = [
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first lesson', icon: '🎓', criteria: 'complete_lesson', value: 1 },
  { id: 'first-trade', name: 'First Trade', description: 'Make your first stock trade', icon: '💹', criteria: 'trade_count', value: 1 },
  { id: 'first-profit', name: 'Money Maker', description: 'Make your first profit', icon: '💰', criteria: 'first_profit', value: 1 },
  { id: 'streak-3', name: 'On Fire', description: '3-day streak', icon: '🔥', criteria: 'streak', value: 3 },
  { id: 'streak-7', name: 'Unstoppable', description: '7-day streak', icon: '⚡', criteria: 'streak', value: 7 },
  { id: 'streak-30', name: 'Legend', description: '30-day streak', icon: '👑', criteria: 'streak', value: 30 },
  { id: 'module-1', name: 'Stock Scholar', description: 'Complete Module 1', icon: '📚', criteria: 'module_complete', value: 1 },
  { id: 'module-2', name: 'Trader Trainee', description: 'Complete Module 2', icon: '📊', criteria: 'module_complete', value: 2 },
  { id: 'module-3', name: 'Strategy Star', description: 'Complete Module 3', icon: '🧠', criteria: 'module_complete', value: 3 },
  { id: 'module-4', name: 'Chart Champion', description: 'Complete Module 4', icon: '📈', criteria: 'module_complete', value: 4 },
  { id: 'module-5', name: 'Market Master', description: 'Complete Module 5', icon: '🚀', criteria: 'module_complete', value: 5 },
  { id: 'diversifier', name: 'Diversifier', description: 'Own 5 different stocks', icon: '🌈', criteria: 'unique_stocks', value: 5 },
  { id: 'safe-trader', name: 'Safe Trader', description: '10 profitable trades in a row', icon: '🛡️', criteria: 'profit_streak', value: 10 },
  { id: 'xp-500', name: 'XP Hunter', description: 'Earn 500 XP', icon: '⭐', criteria: 'total_xp', value: 500 },
  { id: 'xp-2000', name: 'XP Master', description: 'Earn 2000 XP', icon: '🌟', criteria: 'total_xp', value: 2000 },
];

export function getLessonById(id) {
  for (const mod of MODULES) {
    const lesson = mod.lessons.find((l) => l.id === id);
    if (lesson) return { ...lesson, moduleId: mod.id, moduleName: mod.title };
  }
  return null;
}

export function getModuleProgress(moduleId, completedLessons) {
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) return 0;
  const completed = mod.lessons.filter((l) => {
    const lesson = completedLessons.find((cl) => cl.lessonId === l.id);
    return lesson && lesson.score >= 80;
  }).length;
  return Math.round((completed / mod.lessons.length) * 100);
}

// Flat ordered list of every lesson id across all modules
const ALL_LESSON_IDS = MODULES.flatMap((m) => m.lessons.map((l) => l.id));

// Check if a lesson is accessible (all prior lessons completed, module unlocked)
export function isLessonAccessible(lessonId, completedLessons) {
  const idx = ALL_LESSON_IDS.indexOf(lessonId);
  if (idx === -1) return false;
  if (idx === 0) return true; // first lesson always accessible
  // Every lesson before this one must be completed with passing score
  for (let i = 0; i < idx; i++) {
    const completed = completedLessons.find((cl) => cl.lessonId === ALL_LESSON_IDS[i]);
    if (!completed || completed.score < 80) return false;
  }
  return true;
}
