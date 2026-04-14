import type { Card } from "../types";

export const QUANT_CARDS: Card[] = [
  // === Core Formulas ===
  {
    id: 100,
    category: "Core Formulas",
    front: "What is the Expected Value formula, and when do you enter a trade?",
    back: "\\(EV = (p_{win} \\times profit) - (p_{loss} \\times loss)\\). Only enter when EV > 0. The top 1.2% of traders never enter negative EV — 87% of losers do.",
    keyPoints: [
      "Example: contract at $0.40, model says 55% → \\(EV = (0.55 \\times 0.60) - (0.45 \\times 0.40) = +\\$0.15\\)",
      "EV ≤ 0 kills all strategies long-term — this is the single most important check",
      "Prediction markets 2026 = retail on gut, mispricings last hours → EV edge exists",
    ],
  },
  {
    id: 101,
    category: "Core Formulas",
    front: "What is the Kelly Criterion, and why do pros use fractional Kelly?",
    back: "\\(f^* = \\frac{p \\cdot b - q}{b}\\), where p = win probability, q = 1−p, b = net payout. It gives the optimal fraction of bankroll to bet for maximum long-term growth.",
    keyPoints: [
      "Full Kelly is too aggressive — a bad run can wipe you out",
      "Pros use ¼ to ½ Kelly for survivability",
      "\\(2 \\times\\) Kelly = 0× long-run return (mathematically proven to go broke)",
      "Example: 60% win, 2:1 payout → \\(f^* = \\frac{0.6 \\times 2 - 0.4}{2} = 0.40\\) (way too much — use 10-20%)",
    ],
  },
  {
    id: 102,
    category: "Core Formulas",
    front: "How does Bayes' Theorem apply to prediction markets?",
    back: "\\(P(H|E) = \\frac{P(E|H) \\cdot P(H)}{P(E)}\\). Update probability proportionally to new evidence — don't overreact. Bots update faster than humans refresh Twitter.",
    keyPoints: [
      "Ceasefire contract at 30% → 'both sides agree to talks' → Bayes → ~58% (not 90% panic)",
      "Each piece of evidence nudges proportionally, it doesn't replace",
      "Start with base rate \\(P(H)\\), update with signal strength \\(P(E|H)\\)",
      "Bayesian event arbitrage: update faster than market within a 3-minute window",
    ],
  },
  {
    id: 103,
    category: "Core Formulas",
    front: "What is a base rate, and why does it matter more than narratives?",
    back: "\\(P(A|signal) = \\frac{TP}{TP + FP}\\). The historical frequency of an event before any new information. Ignore narratives — look at denominators.",
    keyPoints: [
      "Incumbent approval > 50% → wins 82% of the time historically",
      "If market prices this at 60%, there's a 22-point gap = potential trade",
      "Base rates anchor your prior; Bayes updates from there",
      "Most losing traders skip base rates and trade on feelings",
    ],
  },
  {
    id: 104,
    category: "Core Formulas",
    front: "What is KL-Divergence and how does it find hidden arbitrage?",
    back: "\\(D_{KL}(P \\| Q) = \\sum P_i \\cdot \\ln\\frac{P_i}{Q_i}\\). Measures how two probability distributions differ. Finds contracts that 'should' be correlated but the market has mispriced.",
    keyPoints: [
      "'X wins nomination' 70%, 'X wins general' 55% — history says general should be ~62%",
      "KL flags the gap → buy underpriced, hedge with other",
      "Profit from convergence, not prediction",
      "Scans for structural mispricings across correlated markets",
    ],
  },
  {
    id: 105,
    category: "Core Formulas",
    front: "What is the Brier Score and how do you use it for calibration?",
    back: "\\(BS = \\frac{1}{n} \\sum (f_t - o_t)^2\\). Measures probability calibration. 0 = perfect oracle, 0.25 = coin flip. Polymarket averages ~0.0581 at 12 hours before resolution.",
    keyPoints: [
      "If your model's Brier Score > market's → stop directional bets, restrict to arbitrage",
      "Track over time: improving score = model is learning; worsening = overfitting",
      "Used in Superhuman Bot: triggers mode switch from directional to arb-only",
    ],
  },

  // === Trading Strategies ===
  {
    id: 110,
    category: "Strategies",
    front: "What are the only 3 strategies that survived 10,000 Polymarket simulations?",
    back: "Insurance Model (71.4% survival), Sports O/U Quant (68.9%), and Bayesian Event Arbitrage (64.2%). 9,710 of 10,000 simulated traders went broke.",
    keyPoints: [
      "Insurance: sell 'No' at 88–98¢ (e.g. LucasMeow: 148-0 record, $275K profit)",
      "Sports O/U: statistical model on game totals, entry only when edge > 5%",
      "Bayesian Arb: update probability faster than market in a 3-minute window",
      "4 properties predict survival: positive EV on every entry, Kelly sizing, model-first, structural edge",
    ],
  },
  {
    id: 111,
    category: "Strategies",
    front: "Why do momentum trading, gut feeling, blind copy-trading, and spread arbitrage all fail?",
    back: "All have EV ≤ 0 at scale. Momentum: 94.2% death rate (LMSR prices instantly). Gut: 91.7% (public info priced in). Copy: 88.3% (edge decays before fill). Spread arb: 79.1% (slippage eats profit).",
    keyPoints: [
      "The unifying killer: EV ≤ 0 destroys all strategies eventually",
      "Copy-trading fails because you can't clone another trader's edge (quantum no-cloning analogy)",
      "Spread arbitrage only works with institutional-grade execution infrastructure",
    ],
  },
  {
    id: 112,
    category: "Strategies",
    front: "How does market making work on prediction markets?",
    back: "Post bid below fair price, ask above it → capture the spread. Use inventory skew to rebalance: accumulated YES position → raise ask, lower bid. Profit without predicting outcomes.",
    keyPoints: [
      "Example: bid $0.48, ask $0.52 → collect $0.04 per round-trip",
      "Reservation price adjusts dynamically based on inventory exposure",
      "Monitor VPIN for toxic flow: VPIN > 0.70 → exit immediately",
      "\\(VPIN = \\frac{|V_{buy} - V_{sell}|}{V_{buy} + V_{sell}}\\) — measures informed trading",
    ],
  },
  {
    id: 113,
    category: "Strategies",
    front: "How does pairs/spread trading work with cointegrated contracts?",
    back: "Find two logically related contracts (e.g. 'Fed cuts March?' and 'Fed cuts June?'). Calculate beta, test cointegration (Engle-Granger), trade when z-score > 2.0 and Gaussian Process confirms mean reversion.",
    keyPoints: [
      "Beta: if June +10%, March should move +4.5% (beta=0.45). If only +2%, gap exists",
      "Engle-Granger test: p-value < 0.05 → real connection; > 0.05 → coincidence, skip",
      "Three conditions: cointegrated (p<0.05) + large gap (|z|>2.0) + GP confirms return",
      "Result: $10K-$20K monthly profit without predicting direction",
    ],
  },
  {
    id: 114,
    category: "Strategies",
    front: "How does the Insurance Model strategy work?",
    back: "Sell 'No' contracts at 88–98¢ on events extremely unlikely to happen. You collect small premiums repeatedly. Like selling insurance — small consistent profit, rare catastrophic loss.",
    keyPoints: [
      "LucasMeow: 148-0 record, $275K profit using this strategy",
      "71.4% survival rate in 10,000 simulations (best of all strategies)",
      "Key risk: tail events — the rare loss can be huge",
      "Requires strict position sizing and diversification across many markets",
    ],
  },

  // === Market Infrastructure ===
  {
    id: 120,
    category: "Infrastructure",
    front: "What is Polymarket's market structure?",
    back: "Polymarket is a CLOB (Central Limit Order Book), NOT an LMSR (Logarithmic Market Scoring Rule). Binary constraint: YES + NO must sum to $1.00.",
    keyPoints: [
      "CLOB: matching engine like traditional exchanges (bid/ask, depth, spread)",
      "If YES $0.47 + NO $0.50 = $0.97 → buy both for $0.97, collect $1.00 → 3¢ per dollar",
      "API: Gamma (discovery) + CLOB (trading), REST or WebSocket",
      "Gas on Polygon: ~$0.007 per transaction (negligible)",
    ],
  },
  {
    id: 121,
    category: "Infrastructure",
    front: "What is VPIN and why is it a critical risk signal?",
    back: "Volume-Synchronized Probability of Informed Trading: \\(VPIN = \\frac{|V_{buy} - V_{sell}|}{V_{buy} + V_{sell}}\\). Measures whether informed traders are active. High VPIN = toxic flow = danger for market makers.",
    keyPoints: [
      "VPIN > 0.70 → toxic flow, exit market-making positions immediately",
      "Low VPIN → safe to provide liquidity and capture spread",
      "Acts as a kill switch: real-time monitoring prevents catastrophic losses",
      "Informed traders move before public news → VPIN detects the imbalance",
    ],
  },
  {
    id: 122,
    category: "Infrastructure",
    front: "What are the four components of an arbitrage system?",
    back: "Data Collector (WebSocket order book), Strategy Engine (YES + NO check every tick), Order Manager (FOK execution, retry, rate limits), Risk Manager (exposure tracking, kill switch).",
    keyPoints: [
      "Fill-or-Kill (FOK) orders: both sides execute together or neither does — prevents unhedged exposure",
      "Rate limit: 60 orders/min on Polymarket CLOB API",
      "Keep single market exposure < 5% of total book",
      "SDKs: Python (py-clob-client), TypeScript (@polymarket/clob-client), Rust (lowest latency)",
    ],
  },

  // === Order Book Analysis ===
  {
    id: 130,
    category: "Order Books",
    front: "How do you read an order book and what do limit vs. market orders do?",
    back: "Bids (buy) on left at prices ≤ current. Asks (sell) on right at prices ≥ current. Limit orders create liquidity (walls). Market orders consume liquidity (cross the spread).",
    keyPoints: [
      "Large limit orders at key levels = supply/demand zones (more reliable than TA alone)",
      "Thick book = high liquidity = hard to move price",
      "Thin book = low liquidity = easy to move price, strong momentum effects",
      "Avoid Binance Perpetuals for book analysis — massive spoofing with 1000+ BTC orders",
    ],
  },
  {
    id: 131,
    category: "Order Books",
    front: "What is depth delta and how does it signal reversals?",
    back: "Depth delta = total bid volume − total ask volume in a price range. Positive delta (more bids) = buying pressure. Significant imbalances signal potential reversals.",
    keyPoints: [
      "Example: 550 bids vs 350 asks in 0-10% range → delta = +200 (bullish)",
      "Recommended depth ranges: 2.5% and 5% (intraday), 10% (larger moves)",
      "Depth is a lagging indicator — reflects where liquidity is building, not where price goes next",
      "Best on Binance Spot and Coinbase (deepest, most reliable liquidity)",
    ],
  },
  {
    id: 132,
    category: "Order Books",
    front: "How do order book heatmaps work and what patterns should you look for?",
    back: "Heatmaps visualize resting limit orders over time on the price chart. Red lines = large sell walls (resistance). Green lines = large buy walls (support). Shows where big players accumulate or defend.",
    keyPoints: [
      "Price repeatedly testing a wall without breaking = strong defense",
      "Sudden appearance of walls near price = institutions positioning",
      "Use filter slider to hide market-maker noise, focus on large orders",
      "Depth overlay displays liquidity directly on price candles (green bands = support, red = resistance)",
    ],
  },

  // === Statistical Validation ===
  {
    id: 140,
    category: "Validation",
    front: "Why is one backtest meaningless, and how does bootstrap simulation fix this?",
    back: "One backtest could be luck. Bootstrap: sample trades with replacement 10,000 times to build a distribution of possible outcomes. If the 95% confidence interval excludes 50%, the edge is likely real.",
    keyPoints: [
      "CI = np.percentile(results, [2.5, 97.5])",
      "Example result: win rate CI [87.3%, 91.8%] — far from 50% → real edge",
      "If CI includes 50% → coin flip, no edge",
      "Every metric gets a CI: win rate, Sharpe, max drawdown",
    ],
  },
  {
    id: 141,
    category: "Validation",
    front: "How do Markov chains model contract state transitions?",
    back: "States: low (0-30%), mid (30-60%), high (60-90%), resolved (100%). Transition matrix gives probability of moving between states. Use to predict contract trajectory.",
    keyPoints: [
      "Contract at 28% (low) → 60% chance stays low, 30% to mid, 8% to high, 2% resolves",
      "Buy signal: contract price ≤ p_resolve_yes × 0.5 (market underpricing resolution probability)",
      "Burn-in: first ~1000 steps unreliable — don't trade newly listed contracts (wait 48-72 hours)",
      "Combine with bootstrap: Markov predicts trajectory, bootstrap validates edge",
    ],
  },
  {
    id: 142,
    category: "Validation",
    front: "Why is win rate a trap on Polymarket?",
    back: "At $0.77 YES, you risk $0.77 to win $0.23 (3.3:1 against). A single loss wipes out 3 wins. 77% win rate barely breaks even. Only 16.8% of Polymarket wallets show any net gain.",
    keyPoints: [
      "Ghost positions: losers held at near-zero artificially inflate win rate",
      "52% win rate + $1.3M realized PnL >>> 85% win rate + $30K realized PnL",
      "What actually matters: absolute realized PnL, PnL by category, position size consistency",
      "Copy-trading minimum: 50+ resolved trades, no single trade = 70%+ of total PnL",
    ],
  },

  // === Fear & Sentiment ===
  {
    id: 150,
    category: "Sentiment",
    front: "How does adding fear/sentiment to a trading model work, and what's the critical insight?",
    back: "Layer VIX + CNN Fear & Greed Index + social sentiment. Critical insight: not all contracts react to fear the same way. You must calculate a sensitivity factor per contract.",
    keyPoints: [
      "'Will there be recession?' → Fear ↑ → YES price ↑ (correlated)",
      "'Will Fed raise rates?' → Fear ↑ → YES price ↓ (anti-correlated)",
      "Sensitivity = 60-day backward correlation between price changes and fear/greed",
      "Without sensitivity factor: baseline barely beaten. With it: $5K → $18K (backtest)",
    ],
  },
  {
    id: 151,
    category: "Sentiment",
    front: "What are the entry rules for a fear-based trading model?",
    back: "Extreme Fear (FGI < 20): buy underpriced YES when model_prob − price > 0.15. Extreme Greed (FGI > 80): sell overpriced YES when price − model_prob > 0.15. Neutral: only enter on strong signal (model_prob ≥ 0.65, price ≤ 0.5 × model_prob).",
    keyPoints: [
      "Three fear layers: VIX (surface), CNN FGI (middle), Reddit/Twitter (depth — noisiest but earliest)",
      "CNN FGI: 0-100 scale, data since 2011, updates daily",
      "VIX rolling averages (10d, 20d, 30d) smooth noise",
      "Neutral zone (20-80) requires much higher conviction to enter",
    ],
  },

  // === AI/ML Trading ===
  {
    id: 160,
    category: "AI/ML",
    front: "How does MiroFish use multi-agent simulation for prediction markets?",
    back: "Build a knowledge graph from real-world data → generate AI agent personas → simulate social interaction on a virtual platform → extract emergent probability estimates from convergent opinions.",
    keyPoints: [
      "Stack: GPT-4o mini + Zep Cloud (memory) + OASIS engine (CAMEL-AI)",
      "200 agents with distinct personas (governments, traders, media, military)",
      "Organic posting more reliable than formal interviews (cooperation bias in interviews)",
      "Cost: $3-5 per simulation run, ~49 minutes on Mac Mini M4 Pro",
    ],
  },
  {
    id: 161,
    category: "AI/ML",
    front: "How do poker AI algorithms (CFR+, DeepStack, Libratus) apply to market arbitrage?",
    back: "Prediction markets are imperfect information games like poker. CFR+ minimizes regret across strategies. DeepStack uses neural networks for real-time subgame solving. Libratus handles off-tree scenarios.",
    keyPoints: [
      "CFR+: reset negative regret to zero, weight later iterations more (converges to Nash equilibrium)",
      "DeepStack: local strategy computation requiring minimal memory, neural net provides 'intuition'",
      "Libratus: constructs new detailed subgames in real-time for unseen situations",
      "Marginal polytope: if market prices fall outside valid probability space → arbitrage exists",
    ],
  },
  {
    id: 162,
    category: "AI/ML",
    front: "What's the 6-month progression from zero to autonomous trading agent?",
    back: "Month 1: probability thinking (track 30 predictions). Month 2: core formulas (EV, Kelly, base rates). Month 3: ML model (Random Forest, 38 features). Month 4: validation (bootstrap, Markov). Month 5: XGBoost (330 trees). Month 6: RL agent (PPO).",
    keyPoints: [
      "Month 1 formula: edge = real_probability − market_price",
      "Month 3: 100 decision trees, 38 features → target 80%+ win rate on unseen data",
      "Month 5: XGBoost loss 0.891 → 0.094 after 330 cycles → 89.6% win rate",
      "Month 6: PPO with 50,000 historical trades, reward = pnl × contract_payout",
    ],
  },

  // === Quantum Markets Framework ===
  {
    id: 170,
    category: "Quantum Framework",
    front: "How does the quantum mechanics analogy apply to prediction markets?",
    back: "Contract = spin-1/2 system. Price = squared amplitude of YES state. Same price can have different 'phases' (momentum, liquidity context). Markets behave quantum-like far from resolution, classical near it.",
    keyPoints: [
      "State vector: \\(|market\\rangle = \\sqrt{p}\\,|YES\\rangle + \\sqrt{1-p}\\,|NO\\rangle\\)",
      "Bloch sphere: polar angle \\(\\theta\\) → price, azimuthal angle \\(\\phi\\) → market context (hidden in price alone)",
      "Entanglement: correlated markets update simultaneously when one resolves",
      "Decoherence: far from resolution → quantum effects dominate; near resolution → classical convergence",
    ],
  },
  {
    id: 171,
    category: "Quantum Framework",
    front: "What is the Market Uncertainty Principle?",
    back: "You can't simultaneously know fair price AND momentum with arbitrary precision. Liquid markets → known price, zero predictive momentum (random walk). Thin markets → uncertain price, strong extractable momentum.",
    keyPoints: [
      "\\(\\Delta Price \\times \\Delta Momentum \\geq constant\\)",
      "Implication: edge lives in thinner, less efficient markets",
      "Quantum edge exists in longer-dated markets (pre-decoherence)",
      "Information = rotation on Bloch sphere (axis = type, angle = magnitude)",
    ],
  },
  {
    id: 172,
    category: "Quantum Framework",
    front: "Why are prediction markets not purely Bayesian, and how does interference explain this?",
    back: "Quantum interference: amplitudes of different paths add before squaring. Two paths to same outcome can cancel or amplify each other. Classical probability (Bayesian) misses these nonlinear, context-dependent correlations.",
    keyPoints: [
      "'Will Company X be acquired?' — two paths: strategic buyer vs. PE buyout",
      "PE less likely IF strategic buyer emerges (destructive interference / cancellation)",
      "Classical: P(acquired) = P(strategic) + P(PE). Quantum: amplitudes add, then square",
      "No-cloning theorem: can't perfectly replicate another trader's edge (copy-trading = noisy approximation)",
    ],
  },

  // === Weather Bot ===
  {
    id: 180,
    category: "Weather Bot",
    front: "How does a self-calibrating Polymarket weather bot work?",
    back: "Aggregate 3 forecast sources (ECMWF, HRRR/GFS, METAR), compare against market prices, calculate EV, size with fractional Kelly (0.25), and self-calibrate after 30+ resolved markets per city.",
    keyPoints: [
      "EV = p × (1.0/price − 1.0) − (1.0 − p). Example: p=0.80, price=$0.14 → EV = +4.94",
      "Use airport ICAO station coordinates (KLGA, KORD), not city center",
      "Calibration: MAE per forecast source per city → becomes sigma for normal distribution",
      "Stops: -20% stop-loss, trailing stop, forecast stop if >2°F/1°C shift out of bought bucket",
    ],
  },

  // === Edge Stacking ===
  {
    id: 190,
    category: "Edge Theory",
    front: "What are the 7 categories of market edges, and how do you stack them?",
    back: "Broker/execution, factor (academic), information, strategy/process, structural, volatility, and time-based (calendar). Stack multiple for compounding advantage.",
    keyPoints: [
      "Structural: crypto liquidation cascades → forced selling → snap-back (use Coinglass to monitor)",
      "Volatility Risk Premium: selling options works 85% of the time, but the 15% can blow you up",
      "Time-based: turn-of-month effect, January effect, sell in May",
      "Stacking: tested system + low commissions + turn-of-month + domain expertise = compounding edge",
    ],
  },
  {
    id: 191,
    category: "Edge Theory",
    front: "What are the 4 properties that predict long-term survival in prediction markets?",
    back: "1) Positive EV on EVERY entry (no exceptions). 2) Kelly Criterion position sizing. 3) Model-first, never intuition-first. 4) Edge has a structural reason (not historical luck).",
    keyPoints: [
      "From 10,000 simulations: 97.1% of traders went broke",
      "Top survivors: Bayesian arb +1240%, Sports O/U +890%, Insurance +340%",
      "2× Kelly = guaranteed long-term ruin (mathematical certainty)",
      "If you can't explain WHY the edge exists structurally, it's probably luck",
    ],
  },
];
