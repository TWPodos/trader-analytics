export const mockTrades = [
  { id: "1", date: "2024-03-18", instrument: "NQ", direction: "LONG", entry: 18420, exit: 18485, size: 2, pnl: 1300, setup: "Breakout", session: "NY", tags: ["momentum", "trend"], note: "Clean breakout above resistance. Held full target.", screenshot: null, ruleFollowed: true },
  { id: "2", date: "2024-03-18", instrument: "ES", direction: "SHORT", entry: 5215, exit: 5205, size: 1, pnl: 500, setup: "Reversal", session: "EU", tags: ["reversal", "overbought"], note: "Faded the open gap. Quick scalp.", screenshot: null, ruleFollowed: true },
  { id: "3", date: "2024-03-17", instrument: "NQ", direction: "LONG", entry: 18350, exit: 18310, size: 2, pnl: -800, setup: "Breakout", session: "NY", tags: ["false-break"], note: "Entered too early. No confirmation.", screenshot: null, ruleFollowed: false },
  { id: "4", date: "2024-03-17", instrument: "CL", direction: "SHORT", entry: 81.20, exit: 80.85, size: 3, pnl: 1050, setup: "Supply Zone", session: "EU", tags: ["supply", "trend"], note: "Perfect supply zone rejection.", screenshot: null, ruleFollowed: true },
  { id: "5", date: "2024-03-16", instrument: "ES", direction: "LONG", entry: 5188, exit: 5210, size: 2, pnl: 2200, setup: "VWAP Bounce", session: "NY", tags: ["vwap", "bounce"], note: "Textbook VWAP reclaim.", screenshot: null, ruleFollowed: true },
  { id: "6", date: "2024-03-15", instrument: "NQ", direction: "SHORT", entry: 18180, exit: 18230, size: 1, pnl: -500, setup: "Reversal", session: "NY", tags: ["revenge"], note: "Revenge trade after morning loss. Should not have taken this.", screenshot: null, ruleFollowed: false },
  { id: "7", date: "2024-03-15", instrument: "GC", direction: "LONG", entry: 2155.5, exit: 2162.0, size: 2, pnl: 1300, setup: "Trend Follow", session: "EU", tags: ["trend", "gold"], note: "Strong trend day. Let it run.", screenshot: null, ruleFollowed: true },
  { id: "8", date: "2024-03-14", instrument: "ES", direction: "SHORT", entry: 5175, exit: 5168, size: 3, pnl: 1050, setup: "Supply Zone", session: "NY", tags: ["supply", "scalp"], note: "Quick supply zone trade.", screenshot: null, ruleFollowed: true },
];

export const mockJournals = [
  {
    id: "1",
    date: "2024-03-18",
    mood: "focused",
    preMarket: "Market looking bullish. Fed minutes later. Plan: trade NQ breakout above 18400, fade ES if it opens gap up.",
    postMarket: "Great day. Followed the plan perfectly. NQ trade worked exactly as planned. ES reversal was a bonus.",
    mistakes: "None today. Very disciplined.",
    lessons: "Patience with entries pays off. Letting the setup come to me instead of forcing trades.",
    nextDayFocus: "Watch for follow-through on NQ. CPI data tomorrow - reduce size.",
    rulesFollowed: 2,
    rulesTotal: 2,
    isPublic: false,
  },
  {
    id: "2",
    date: "2024-03-17",
    mood: "frustrated",
    preMarket: "Quiet overnight. Looking for range trade. Plan: buy dips in ES, short NQ strength.",
    postMarket: "Mixed day. Lost on NQ due to early entry. But CL trade saved the day.",
    mistakes: "Entered NQ without proper confirmation. Moved stop too tight on first NQ trade.",
    lessons: "Wait for the close above resistance before entering. Confirmation > speed.",
    nextDayFocus: "Focus on CL and ES only. No NQ until I fix entry timing.",
    rulesFollowed: 1,
    rulesTotal: 2,
    isPublic: false,
  },
];

export const mockPerformanceData = [
  { date: "Mar 1", pnl: 850, cumPnl: 850, trades: 3 },
  { date: "Mar 4", pnl: 1200, cumPnl: 2050, trades: 4 },
  { date: "Mar 5", pnl: -400, cumPnl: 1650, trades: 2 },
  { date: "Mar 6", pnl: 1800, cumPnl: 3450, trades: 5 },
  { date: "Mar 7", pnl: 600, cumPnl: 4050, trades: 3 },
  { date: "Mar 8", pnl: -200, cumPnl: 3850, trades: 2 },
  { date: "Mar 11", pnl: 950, cumPnl: 4800, trades: 4 },
  { date: "Mar 12", pnl: 1400, cumPnl: 6200, trades: 3 },
  { date: "Mar 13", pnl: -650, cumPnl: 5550, trades: 3 },
  { date: "Mar 14", pnl: 1050, cumPnl: 6600, trades: 2 },
  { date: "Mar 15", pnl: 800, cumPnl: 7400, trades: 3 },
  { date: "Mar 16", pnl: 2200, cumPnl: 9600, trades: 2 },
  { date: "Mar 17", pnl: 250, cumPnl: 9850, trades: 2 },
  { date: "Mar 18", pnl: 1800, cumPnl: 11650, trades: 2 },
];

export const mockSetupPerformance = [
  { setup: "Breakout", trades: 18, winRate: 72, avgWin: 950, avgLoss: -380, expectancy: 580 },
  { setup: "Reversal", trades: 12, winRate: 58, avgWin: 720, avgLoss: -420, expectancy: 241 },
  { setup: "VWAP Bounce", trades: 9, winRate: 78, avgWin: 1100, avgLoss: -310, expectancy: 790 },
  { setup: "Supply Zone", trades: 15, winRate: 67, avgWin: 850, avgLoss: -400, expectancy: 438 },
  { setup: "Trend Follow", trades: 11, winRate: 64, avgWin: 1200, avgLoss: -450, expectancy: 606 },
];

export const mockSessionPerformance = [
  { session: "Asia", trades: 8, winRate: 50, totalPnl: 1200 },
  { session: "EU", trades: 22, winRate: 68, totalPnl: 4850 },
  { session: "NY", trades: 35, winRate: 71, totalPnl: 6800 },
  { session: "After Hours", trades: 5, winRate: 40, totalPnl: -200 },
];

export const mockInstruments = [
  { symbol: "NQ", trades: 28, winRate: 68, totalPnl: 5200 },
  { symbol: "ES", trades: 22, winRate: 73, totalPnl: 4300 },
  { symbol: "CL", trades: 12, winRate: 67, totalPnl: 2800 },
  { symbol: "GC", trades: 8, winRate: 63, totalPnl: 1350 },
];

export const mockCommunityFeed = [
  {
    id: "1",
    user: { name: "alex_trades", avatar: "AT", verified: true },
    type: "Verified Trade Share",
    instrument: "NQ",
    direction: "LONG",
    pnl: 1850,
    setup: "Breakout Retest",
    content: "Clean breakout retest on the 15min. Waited for the close above, entered on pullback. Held for 65 ticks. The key was patience — this setup failed twice last week.",
    tags: ["nq", "breakout", "patience"],
    likes: 47,
    comments: 12,
    time: "2h ago",
    isVerified: true,
  },
  {
    id: "2",
    user: { name: "futures_pro", avatar: "FP", verified: false },
    type: "Educational Post",
    instrument: null,
    direction: null,
    pnl: null,
    setup: null,
    content: "3 things I track every single week: 1) Rule adherence % (not just PnL) 2) Average R:R on winners 3) Revenge trade count. If rule adherence is high and PnL is down — that's fine. If rule adherence is low and PnL is up — that's dangerous.",
    tags: ["discipline", "mindset", "process"],
    likes: 124,
    comments: 28,
    time: "4h ago",
    isVerified: false,
  },
  {
    id: "3",
    user: { name: "sarah_scalper", avatar: "SS", verified: true },
    type: "Verified Performance Snapshot",
    instrument: null,
    direction: null,
    pnl: 7400,
    setup: null,
    content: "March so far: 14 trading days, 68% win rate, profit factor 2.1. Best week was week 2 where I focused only on EU session. Worst day was when I overtraded after a big winner.",
    tags: ["monthly-review", "performance"],
    likes: 89,
    comments: 19,
    time: "6h ago",
    isVerified: true,
  },
];

export const mockStats = {
  totalPnl: 11650,
  winRate: 69.2,
  totalTrades: 65,
  profitFactor: 2.34,
  expectancy: 525,
  avgWin: 1085,
  avgLoss: -462,
  maxDrawdown: -1250,
  consecutiveWins: 6,
  ruleAdherence: 82,
};
