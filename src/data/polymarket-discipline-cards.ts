import type { Card } from "../types";

// === Polymarket Trading Discipline — session 2026-04-18 (thesis #3 + #4 killed pre-entry) ===
// Captures the anti-patterns and surviving edge paths from two killed affiliate-promoted
// bot threads: @0xricker Markov $1M and @goatyishere RN1 $7M sports bot.
// Sources: Polymarket docs, Kuypers 2000, Thorp 2008, academic HMM + Kelly literature,
//          QuantVPS latency analysis, DLNews on-chain stats, vault thesis files.
// IDs start at 7040 (finetuning deck ends at 7037).

export const POLYMARKET_DISCIPLINE_CARDS: Card[] = [
  // ================================================================
  // LESSON 1 — Bot-Pitch Red Flags (pm-bot-redflags)
  // ================================================================

  {
    id: 7040,
    category: "Polymarket",
    front:
      "A promotional X thread claims a Polymarket wallet earned $7M over 50,000 trades. What's the fastest way to verify — or refute — the PnL claim?",
    back:
      "Cross-check against the Polymarket public leaderboard and independent news (Phemex, KuCoin, MEXC, Dune dashboards). Thread-authored numbers that don't appear on the leaderboard are typically 2–5× overstatement. The RN1 case: $7M claimed, ~$2M verified on leaderboard + news — 3.5× overstated.",
    keyPoints: [
      "Polymarket leaderboard exposes realised P&L rankings; affiliate threads often don't",
      "Independent aggregators (Phemex, KuCoin, Dune) pick up genuine whales — cross-reference",
      "Observed pattern: promotional thread figures overstate by 2–5× vs ground truth",
      "If the number appears only in the thread, treat it as marketing until proven otherwise",
    ],
    exerciseType: "mcq",
    choices: [
      "Trust the thread — the wallet address is on-chain, so the PnL must be real",
      "Cross-check the Polymarket leaderboard + independent news; treat thread-only numbers as 2–5× overstated",
      "Wait for the author to publish an audited report",
      "Verify via the wallet's realised PnL on Etherscan — it's published there",
    ],
    correctAnswer: 1,
  },

  {
    id: 7041,
    category: "Polymarket",
    front:
      "A Polymarket profile URL ends in ?r=somename. What does that tell you about the author who shared it?",
    back:
      "It's a referral code. Polymarket pays referrers $10 per signup plus 30% of referred-user fees for 180 days. Anyone sharing a wallet URL with ?r= has a material financial incentive — $50–500+ per referred user — that is almost never disclosed in promotional threads.",
    keyPoints: [
      "?r= is Polymarket's affiliate program referral code",
      "$10/signup + 30% of fees over 180 days — $50-$500+ per referred user in practice",
      "Disclosure is voluntary and usually absent",
      "Rule of thumb: author with ?r= link → discount the PnL claim heavily, demand independent verification",
    ],
  },

  {
    id: 7042,
    category: "Polymarket",
    front:
      "The promoted strategy is 'Markov transition-matrix persistence' on 5-minute crypto Up-Down markets — enter when the diagonal exceeds 0.87. Why does this fail structurally, independent of the wallet claim?",
    back:
      "The Markov (memoryless) assumption is violated on short-window crypto prices. Empirical work shows BTC/ETH/XRP have 7–9 steps of autocorrelation at these lags, and Bayesian HMM forecasts collapse past one step (30-step-ahead MAPE >100%). The 0.87 threshold is not peer-reviewed — it's folk/promotional.",
    keyPoints: [
      "Markov models assume next state depends only on current state — fails on 5-min crypto",
      "BTC/ETH/XRP exhibit 7–9 lag autocorrelation — the assumption is empirically wrong",
      "Bayesian HMM 30-step-ahead MAPE >100% — the forecast horizon the strategy needs",
      "The 0.87 diagonal threshold appears in no published study",
      "Source: Extracting Rules via Markov Chains for Cryptocurrencies (Springer, 2022)",
    ],
    exerciseType: "mcq",
    choices: [
      "The Markov assumption holds on crypto; the 0.87 threshold is the real issue",
      "Crypto returns have 7–9 steps of memory at short lags, so the Markov (memoryless) assumption fails before the first inference",
      "Markov models work only on stocks, not crypto",
      "The strategy fails because 0.87 is too high — lower thresholds would work",
    ],
    correctAnswer: 1,
  },

  {
    id: 7043,
    category: "Polymarket",
    front:
      "Someone claims Kelly f* ≈ 0.71 is the right sizing for their Polymarket strategy. Why is that already disqualifying?",
    back:
      "Thorp's professional default is 0.5× Kelly; hedge funds and poker pros use 0.25×–0.5×. f*=0.71 implies ~78.5% true win-probability confidence — and Kelly's growth curve is one-sided under overestimation. A 3-point overestimate makes the bet 5–10× too large and flips compounding into ruin. Any sizing above 0.5× Kelly signals the probability estimation hasn't been stress-tested.",
    keyPoints: [
      "Thorp's recommended default: 0.5× Kelly (half-Kelly)",
      "Professional range: 0.25–0.5× — never 0.71",
      "f*=0.71 requires ~78.5% true win prob on 1:1 binary",
      "3-point probability overestimate → 5–10× overbet → negative growth",
      "Half-Kelly gives 51% of optimal growth with 75% less variance",
    ],
    exerciseType: "mcq",
    choices: [
      "f*=0.71 is aggressive but acceptable for high-edge strategies",
      "Anything above 0.5× Kelly signals overconfident probability estimation; even 3-point overestimation destroys growth",
      "f*=0.71 is the standard for binary contracts like Polymarket",
      "Kelly doesn't apply to binary prediction markets",
    ],
    correctAnswer: 1,
  },

  {
    id: 7044,
    category: "Polymarket",
    front:
      "At a 50¢ midpoint, what does Polymarket's dynamic taker fee do to a delta-neutral sports-market arbitrage with a 0.3% gross spread?",
    back:
      "The 2026 dynamic taker fee peaks at ~1.80% near 50¢. A delta-neutral entry pays that on both legs (~3.6% round trip) against a ~0.3% median arb spread. Net: about –1.6% before slippage. The fee schedule was designed explicitly to curb latency arbitrage — it succeeded.",
    keyPoints: [
      "Max taker fee ~1.80% at 50¢ midpoint (scales with probability)",
      "Delta-neutral = 2 legs = ~3.6% fee round trip",
      "Median sports-arb spread ~0.3% post-HFT compression",
      "Net: –1.6% before any slippage",
      "Polymarket designed the regime to kill latency arb — and it works",
    ],
  },

  {
    id: 7045,
    category: "Polymarket",
    front:
      "Polymarket sports arbitrage windows averaged 12.3 seconds in 2024. What are they in 2026, and what does that mean for a solo TypeScript/Cloudflare Workers bot?",
    back:
      "~2.7 seconds average, with 73% of arbitrage profit captured by sub-100ms execution. Susquehanna, Jane Street, DRW, and Jump Trading entered as day-1 institutional market makers with colocated infrastructure. Cloudflare Workers + TypeScript bottoms out at 300–500ms end-to-end — it cannot close the compute-bound portion of the opportunity window.",
    keyPoints: [
      "Arb window: 12.3s (2024) → 2.7s (2026)",
      "73% of profit captured by sub-100ms HFT",
      "Institutional LPs (Susquehanna, Jane Street, DRW, Jump) colocated at AWS eu-west-2",
      "Solo TypeScript/Workers stack: 300–500ms minimum — too slow by ~3×",
      "Consumer VPS out of Dublin: 5–15ms network, but bot logic still adds 50–100ms",
    ],
    exerciseType: "mcq",
    choices: [
      "~5 seconds; solo bots can still win with careful optimisation",
      "~2.7 seconds with 73% captured by sub-100ms HFT; Workers cannot compete",
      "Latency hasn't changed materially since 2024",
      "Windows are now under 50ms; only FPGA stacks can trade",
    ],
    correctAnswer: 1,
  },

  {
    id: 7046,
    category: "Polymarket",
    front:
      "The '92.4% of Polymarket traders lose money' statistic is often cited to argue solo trading is hopeless. Why is that overclaim?",
    back:
      "Survivor-math noise. The 92.4% figure includes every degen election punter and memecoin-style speculator. Conditioned on 'has a probability model, Kelly-sized, trades >1,000 contracts,' the base rate flips. The statistic correctly discourages random retail; it does not disprove disciplined solo edge.",
    keyPoints: [
      "92.4% loss rate is computed over all wallets, including degenerate punters",
      "Conditioning on model + Kelly sizing + high trade count flips the base rate",
      "Documented 7-figure solo traders (Theo, Fredi9999, PrincessCaro) all use research + patient orders, not arb",
      "Use the statistic to discourage unreflective participation, not to foreclose disciplined strategy",
    ],
  },

  // ================================================================
  // LESSON 2 — What Solo Polymarket Edge Actually Looks Like (pm-solo-edge)
  // ================================================================

  {
    id: 7047,
    category: "Polymarket",
    front:
      "Given institutional HFT dominates flagship sports arb, where does documented solo edge on Polymarket actually come from?",
    back:
      "Three paths: (1) information edge — research-driven views and patient limit orders on markets where you have genuine insight (the $85M French-polling trader is the extreme example); (2) tail-liquidity markets — niche props, college, lower-leagues, thin live sub-markets that institutional MMs ignore because integration cost + inventory risk exceed expected PnL; (3) closing-line-value exploitation against Pinnacle/Circa sharp closes, which is latency-insensitive.",
    keyPoints: [
      "Information edge: Theo, Fredi9999, PrincessCaro all compounded via research + limit orders",
      "Largest documented Polymarket alpha ($85M) came from proprietary polling, not signal processing",
      "Tail-liquidity books: spreads remain wide where HFTs don't bother to integrate",
      "Closing-line-value vs Pinnacle/Circa: no sub-100ms requirement",
      "What doesn't work for solo: delta-neutral cross-book arb on flagship markets",
    ],
    exerciseType: "mcq",
    choices: [
      "Delta-neutral cross-market arbitrage with high-frequency execution",
      "Research-driven information edge, tail-liquidity books, and closing-line-value exploitation — all latency-insensitive",
      "Copy-trading successful whales via kreo.app and similar services",
      "There is no residual solo edge — the market is fully efficient",
    ],
    correctAnswer: 1,
  },

  {
    id: 7048,
    category: "Polymarket",
    front:
      "The vault's polymarket-pipeline repo has 713 LOC and 4 D1 tables (digests, leads, watchlist_series, watchlist_observations). What does extending it into an execution bot actually require?",
    back:
      "A new repo, not an extension. Building execution needs: CLOB API client with EIP-712 order signing + wallet custody, WebSocket depth across N markets, per-market position/inventory state, a risk manager with delta/max-loss/circuit breakers, execution router with cancel-replace, realised-vs-mark-to-market P&L attribution, and a CLOB replay backtest framework. Minimum ~5,000–10,000 additional LOC and a fundamentally different risk posture.",
    keyPoints: [
      "Pipeline is an ideation surface — no order signing, no positions, no risk state",
      "Execution bot needs ~5–10K additional LOC and wallet/key custody",
      "README policy: 'Not an execution system... No scoring, no auto-trading'",
      "Anchored to [[Solo Polymarket edge is thesis generation not signal processing]]",
      "Commitment is revisable only if the 10-thesis gate clears with good Brier scores",
    ],
  },

  {
    id: 7049,
    category: "Polymarket",
    front:
      "Why doesn't the Polymarket theses Tracker apply to evaluating a trading bot's performance?",
    back:
      "The tracker measures discrete Brier-scored predictions against market resolutions. A bot running 50,000 trades per football match produces Sharpe ratio, maximum drawdown, and capacity curves — different evaluation discipline. If execution tooling is ever built, it needs its own tracker: trade log, daily equity curve, running drawdown, capacity probes. Not the thesis Brier book.",
    keyPoints: [
      "Thesis tracker: Brier score + resolution outcome + post-mortem tag",
      "Bot evaluation: Sharpe + drawdown + capacity + trade log",
      "Conflating the two makes both worse — hide bot risk, inflate thesis count",
      "Different evaluation disciplines for different activities",
    ],
  },

  {
    id: 7050,
    category: "Polymarket",
    front:
      "What is the 10-thesis gate, and what does it exist to prevent?",
    back:
      "Write and resolve 10 discrete Polymarket theses (paper-traded, Brier-scored, kill-criterion-gated) before building any execution tooling. It prevents premature optimisation of an unproven edge — the most common failure mode for solo quants who build a bot before proving they can even predict markets. The tracker's distribution of post-mortem tags (right/right-reason vs right/wrong-reason vs wrong-quick-kill vs wrong-drift) is more informative than any P&L number.",
    keyPoints: [
      "Gate: 10 resolved theses with honest calibration analysis",
      "Each thesis: template, kill criterion, resolution post-mortem",
      "Paper-trade only — the goal is calibration, not revenue",
      "Post-mortem tag distribution > Brier score > P&L for signal",
      "Only after the gate does tool-building earn its weekend",
    ],
    exerciseType: "mcq",
    choices: [
      "A speed-running challenge to write 10 theses in one day",
      "The discipline of writing and resolving 10 Brier-scored paper theses before building any execution tooling — prevents premature optimisation of unproven edge",
      "A rule that bans all Polymarket trading until 10 theses are reviewed",
      "A specific Polymarket market limit of 10 open positions",
    ],
    correctAnswer: 1,
  },

  {
    id: 7051,
    category: "Polymarket",
    front:
      "You see a new X thread: wallet PnL claim, mechanism description, specific-sounding numbers, a referral link at the bottom. Name three of the checks that should fire before you even open a research session.",
    back:
      "(1) Does the claimed PnL appear on Polymarket's public leaderboard or only in the thread? (2) Is the author's X timeline full of similar whale amplifications (affiliate-aggregator pattern)? (3) Does the mechanism have published out-of-sample evaluation, or is it pseudo-academic (theorem numbers in a Twitter thread)? (4) Does the claim ignore platform-level changes — fees, rate limits, maker rebate schedule — that directly bear on the edge? (5) Is the sizing rule (Kelly, leverage) consistent with professional practice, or absurdly aggressive? If three of these fire, kill before paper-entry.",
    keyPoints: [
      "Leaderboard corroboration test — thread-only numbers are 2–5× overstated",
      "Author timeline pattern — affiliate promoters amplify multiple whales",
      "Mechanism publication test — pseudo-academic dressing ≠ actual evidence",
      "Platform-change blindness — ignoring fees and microstructure is a tell",
      "Sizing sanity — Kelly >0.5× or undefined leverage signals carelessness",
      "Three of five fire → kill without running the full research session",
    ],
  },
];
