import type { Card } from "../types";

export const QUANT_MATH_CARDS: Card[] = [
  // === Expected Value ===
  {
    id: 200,
    category: "EV Practice",
    exerciseType: "math",
    front: "A contract costs $0.40. Your model says 55% chance YES. What is the Expected Value?",
    back: "\\(EV = (0.55 \\times 0.60) - (0.45 \\times 0.40) = 0.33 - 0.18 = +0.15\\)",
    keyPoints: [
      "Profit if YES = \\(1.00 - 0.40 = 0.60\\)",
      "Loss if NO = \\(0.40\\) (your cost)",
      "EV > 0 means this is a good trade",
    ],
    mathAnswer: 0.15,
    tolerance: 0.02,
    unit: "$",
    hints: ["Profit if YES = $1.00 − $0.40 = $0.60", "EV = (win_prob × profit) − (loss_prob × loss)"],
  },
  {
    id: 201,
    category: "EV Practice",
    exerciseType: "math",
    front: "A contract costs $0.72. Your model says 65% chance YES. What is the EV?",
    back: "\\(EV = (0.65 \\times 0.28) - (0.35 \\times 0.72) = 0.182 - 0.252 = -0.07\\)",
    keyPoints: [
      "Profit if YES = \\(1.00 - 0.72 = 0.28\\)",
      "Negative EV — do NOT enter this trade",
      "Even at 65% probability, the risk/reward ratio is bad here",
    ],
    mathAnswer: -0.07,
    tolerance: 0.02,
    unit: "$",
    hints: ["Profit if YES = $1.00 − $0.72 = $0.28"],
  },
  {
    id: 202,
    category: "EV Practice",
    exerciseType: "math",
    front: "Contract at $0.25. Your model says 40% chance YES. What is the EV?",
    back: "\\(EV = (0.40 \\times 0.75) - (0.60 \\times 0.25) = 0.30 - 0.15 = +0.15\\)",
    keyPoints: [
      "Cheap contracts can have great EV even at sub-50% probability",
      "The asymmetric payoff (risk $0.25 to win $0.75) creates edge",
    ],
    mathAnswer: 0.15,
    tolerance: 0.02,
    unit: "$",
  },
  {
    id: 203,
    category: "EV Practice",
    exerciseType: "math",
    front: "You can buy YES at $0.30 and NO at $0.65. They must sum to $1.00 at resolution. What is the arbitrage profit per contract pair?",
    back: "Cost = \\(0.30 + 0.65 = 0.95\\). Payout = \\(1.00\\). Profit = \\(1.00 - 0.95 = 0.05\\).",
    keyPoints: [
      "When YES + NO < $1.00, guaranteed profit exists",
      "No prediction needed — this is pure structural arbitrage",
    ],
    mathAnswer: 0.05,
    tolerance: 0.01,
    unit: "$",
  },

  // === Kelly Criterion ===
  {
    id: 204,
    category: "Kelly Practice",
    exerciseType: "math",
    front: "Win probability = 60%, net payout = 2:1. What is the full Kelly fraction?",
    back: "\\(f^* = \\frac{p \\cdot b - q}{b} = \\frac{0.6 \\times 2 - 0.4}{2} = \\frac{0.8}{2} = 0.40\\)",
    keyPoints: [
      "p = 0.60, q = 0.40, b = 2",
      "Full Kelly says bet 40% of bankroll — dangerously aggressive",
      "At quarter-Kelly (10%), you sacrifice ~25% of growth for much lower ruin risk",
    ],
    mathAnswer: 0.40,
    tolerance: 0.02,
    hints: ["\\(f^* = \\frac{p \\cdot b - q}{b}\\) where q = 1 − p"],
  },
  {
    id: 205,
    category: "Kelly Practice",
    exerciseType: "math",
    front: "Full Kelly says 40%. Using quarter-Kelly, what fraction of your bankroll should you risk?",
    back: "\\(\\frac{1}{4} \\times 0.40 = 0.10\\) — risk 10% of bankroll.",
    keyPoints: [
      "Quarter-Kelly is the standard for professional traders",
      "Sacrifices ~25% of theoretical growth rate for dramatically lower ruin probability",
    ],
    mathAnswer: 0.10,
    tolerance: 0.01,
  },
  {
    id: 206,
    category: "Kelly Practice",
    exerciseType: "math",
    front: "Win probability = 55%, net payout = 1:1. What is the full Kelly fraction?",
    back: "\\(f^* = \\frac{0.55 \\times 1 - 0.45}{1} = \\frac{0.10}{1} = 0.10\\)",
    keyPoints: [
      "Even with an edge, Kelly is small for 1:1 payouts",
      "55/45 edge at 1:1 odds → only risk 10%",
      "This is why pros rarely bet big on coin-flip-like events",
    ],
    mathAnswer: 0.10,
    tolerance: 0.02,
    hints: ["b = 1 for even-money bets"],
  },

  // === Bayes ===
  {
    id: 207,
    category: "Bayes Practice",
    exerciseType: "math",
    front: "Prior P(ceasefire) = 0.30. If ceasefire happens, P(talks) = 0.85. If no ceasefire, P(talks) = 0.20. Talks are announced. What is P(ceasefire | talks)?",
    back: "\\(P(E) = 0.85 \\times 0.30 + 0.20 \\times 0.70 = 0.255 + 0.14 = 0.395\\)\n\n\\(P(H|E) = \\frac{0.85 \\times 0.30}{0.395} \\approx 0.646\\)",
    keyPoints: [
      "First compute total probability of evidence: \\(P(E) = P(E|H) \\cdot P(H) + P(E|\\neg H) \\cdot P(\\neg H)\\)",
      "Don't overreact: 30% prior moves to ~65%, not 90%",
      "The talks signal is strong (0.85 vs 0.20) but not overwhelming",
    ],
    mathAnswer: 0.646,
    tolerance: 0.03,
    hints: [
      "Use Bayes: \\(P(H|E) = \\frac{P(E|H) \\cdot P(H)}{P(E)}\\)",
      "First find P(E) using the law of total probability",
    ],
  },
  {
    id: 208,
    category: "Bayes Practice",
    exerciseType: "math",
    front: "Base rate: incumbents win 82% of the time when approval > 50%. Market prices this at 60%. What is the edge in percentage points?",
    back: "Edge = 82 − 60 = 22 percentage points.",
    keyPoints: [
      "Base rates anchor your prior — the market is underpricing by 22pp",
      "This is a potential trade: buy at $0.60 when fair value is ~$0.82",
    ],
    mathAnswer: 22,
    tolerance: 1,
    unit: "pp",
  },
  {
    id: 209,
    category: "Bayes Practice",
    exerciseType: "math",
    front: "Prior = 50%. Test sensitivity = 90%, specificity = 80%. Test is positive. What is the posterior probability? (Answer as decimal)",
    back: "\\(P(E) = 0.90 \\times 0.50 + 0.20 \\times 0.50 = 0.45 + 0.10 = 0.55\\)\n\n\\(P(H|E) = \\frac{0.90 \\times 0.50}{0.55} \\approx 0.818\\)",
    keyPoints: [
      "Sensitivity = P(positive | true) = 0.90",
      "Specificity = P(negative | false) = 0.80, so P(positive | false) = 0.20",
      "Even a good test only moves 50% to 82% — base rates matter!",
    ],
    mathAnswer: 0.818,
    tolerance: 0.03,
    hints: ["False positive rate = 1 − specificity = 0.20"],
  },

  // === Brier Score ===
  {
    id: 210,
    category: "Brier Practice",
    exerciseType: "math",
    front: "You predicted 0.80 for three events. Two happened (outcome=1), one didn't (outcome=0). What is your Brier Score?",
    back: "\\(BS = \\frac{1}{3}[(0.8-1)^2 + (0.8-1)^2 + (0.8-0)^2] = \\frac{0.04 + 0.04 + 0.64}{3} = \\frac{0.72}{3} = 0.24\\)",
    keyPoints: [
      "Brier Score: 0 = perfect, 0.25 = coin flip, 1 = worst possible",
      "Your 0.24 is slightly better than a coin flip — the 80% confidence on the miss hurts badly",
      "The one wrong prediction at high confidence dominates the score",
    ],
    mathAnswer: 0.24,
    tolerance: 0.02,
    hints: ["\\(BS = \\frac{1}{n} \\sum (f_t - o_t)^2\\) where f = forecast, o = outcome (0 or 1)"],
  },
  {
    id: 211,
    category: "Brier Practice",
    exerciseType: "math",
    front: "A coin-flip forecaster predicts 0.50 for everything. What is their Brier Score over many events?",
    back: "\\(BS = (0.50 - 1)^2 = 0.25\\) for events that happen, \\((0.50 - 0)^2 = 0.25\\) for events that don't. Average = 0.25.",
    keyPoints: [
      "0.25 is the benchmark — any forecaster scoring above this has negative skill",
      "If your model's Brier Score > 0.25, you'd be better off flipping a coin",
    ],
    mathAnswer: 0.25,
    tolerance: 0.01,
  },

  // === VPIN ===
  {
    id: 212,
    category: "VPIN Practice",
    exerciseType: "math",
    front: "Buy volume = 850, sell volume = 350. What is VPIN? (Answer as decimal)",
    back: "\\(VPIN = \\frac{|V_{buy} - V_{sell}|}{V_{buy} + V_{sell}} = \\frac{|850 - 350|}{850 + 350} = \\frac{500}{1200} \\approx 0.417\\)",
    keyPoints: [
      "VPIN = 0.42 — below 0.70 threshold, safe to continue market-making",
      "Moderate imbalance but not yet in danger zone",
    ],
    mathAnswer: 0.417,
    tolerance: 0.02,
    hints: ["\\(VPIN = \\frac{|V_{buy} - V_{sell}|}{V_{buy} + V_{sell}}\\)"],
  },
  {
    id: 213,
    category: "VPIN Practice",
    exerciseType: "math",
    front: "Buy volume = 920, sell volume = 80. What is VPIN?",
    back: "\\(VPIN = \\frac{|920 - 80|}{920 + 80} = \\frac{840}{1000} = 0.84\\)",
    keyPoints: [
      "VPIN = 0.84 — well above 0.70 danger threshold!",
      "This means informed traders are aggressively buying — exit market-making positions immediately",
      "Someone knows something the market doesn't yet",
    ],
    mathAnswer: 0.84,
    tolerance: 0.02,
  },

  // === Market Making ===
  {
    id: 214,
    category: "Market Making Practice",
    exerciseType: "math",
    front: "You bid $0.48 and ask $0.52 on a contract. What is your spread capture per round-trip?",
    back: "Spread = \\(0.52 - 0.48 = 0.04\\). You earn $0.04 per round-trip (buy at bid, sell at ask).",
    keyPoints: [
      "Market making profits from the spread, not prediction",
      "4 cents per round-trip requires high volume to be worthwhile",
    ],
    mathAnswer: 0.04,
    tolerance: 0.005,
    unit: "$",
  },
  {
    id: 215,
    category: "Market Making Practice",
    exerciseType: "math",
    front: "You capture a $0.04 spread over 25 round-trips. What is total profit?",
    back: "\\(25 \\times 0.04 = 1.00\\). Total profit = $1.00.",
    keyPoints: [
      "Market making is a volume game — small edge repeated many times",
      "Must monitor VPIN to avoid toxic flow eating your profits",
    ],
    mathAnswer: 1.00,
    tolerance: 0.05,
    unit: "$",
  },

  // === Sharpe Ratio ===
  {
    id: 216,
    category: "Risk Practice",
    exerciseType: "math",
    front: "Portfolio return = 12%, risk-free rate = 2%, standard deviation = 15%. What is the Sharpe Ratio?",
    back: "\\(Sharpe = \\frac{R_p - R_f}{\\sigma_p} = \\frac{0.12 - 0.02}{0.15} = \\frac{0.10}{0.15} \\approx 0.667\\)",
    keyPoints: [
      "Sharpe < 1 is mediocre, 1-2 is good, > 2 is excellent",
      "0.67 means you get 0.67 units of excess return per unit of risk",
      "Sharpe is misleading for non-normal returns (prediction markets have binary payoffs)",
    ],
    mathAnswer: 0.667,
    tolerance: 0.02,
    hints: ["\\(Sharpe = \\frac{R_p - R_f}{\\sigma_p}\\)"],
  },

  // === Cointegration z-score ===
  {
    id: 217,
    category: "Pairs Practice",
    exerciseType: "math",
    front: "Contract A = $0.65, Contract B = $0.30, historical beta = 0.45. Expected B given A = beta × A. What is the spread (B − expected B)?",
    back: "Expected B = \\(0.45 \\times 0.65 = 0.2925\\). Spread = \\(0.30 - 0.2925 = 0.0075\\).",
    keyPoints: [
      "Spread of 0.0075 is tiny — likely not tradeable",
      "Need to normalize by standard deviation to get z-score",
      "Only trade when |z-score| > 2.0 and Gaussian Process confirms mean reversion",
    ],
    mathAnswer: 0.0075,
    tolerance: 0.002,
    hints: ["Expected B = beta × A"],
  },
];
