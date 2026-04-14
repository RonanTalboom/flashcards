import type { Card } from "../types";

// Client-side interactive/simulation cards. IDs 2000+ to avoid collisions with
// the software-architecture deck (1-39) and the French A1 deck (1000+).
export const INTERACTIVE_CARDS: Card[] = [
  {
    id: 2001,
    category: "Quant",
    front: "Play with expected value",
    back: "Move the sliders to see when a trade flips from negative to positive EV. Break-even probability is the threshold where you'd be indifferent — any edge above it is profitable over many plays.",
    keyPoints: [
      "EV > 0 is the only long-run survival condition",
      "High win rate ≠ profitable: a 77% win rate at $0.77 barely breaks even",
      "Break-even probability = loss / (win + loss)",
    ],
    exerciseType: "interactive",
    widget: "expected-value",
    widgetInitial: { p: 0.55, win: 0.6, loss: 0.4 },
  },
  {
    id: 2002,
    category: "Quant",
    front: "Kelly Criterion: optimal bet sizing",
    back: "Full Kelly maximizes log-wealth growth. Half Kelly gives up ~25% of growth for much lower volatility. 2× Kelly produces negative growth with high probability — guaranteed ruin over time.",
    keyPoints: [
      "f* = p − (1 − p) / b",
      "Most pros use half Kelly for psychological drawdown tolerance",
      "Overbetting is catastrophic — the penalty is asymmetric",
    ],
    exerciseType: "interactive",
    widget: "kelly",
    widgetInitial: { p: 0.55, b: 1 },
  },
  {
    id: 2003,
    category: "Quant",
    front: "Compound growth — the exponential feel",
    back: "Linear intuition fails for exponential processes. At 10%/year, $1k becomes $17k in 30 years, not $4k. The curve looks flat for years then goes vertical — which is why starting early is the single largest lever.",
    keyPoints: [
      "Rule of 72: doubling time ≈ 72 / rate",
      "Small rate differences compound into huge gaps over decades",
      "Most of the gains come in the last third of the time horizon",
    ],
    exerciseType: "interactive",
    widget: "compound-growth",
    widgetInitial: { principal: 1000, rate: 8, years: 30 },
  },
  {
    id: 2004,
    category: "Infrastructure",
    front: "Replica math: how many nines can you add?",
    back: "Adding a replica squares the failure probability (for uncorrelated failures). Going from 99% to 99.99% availability only needs 2 replicas — if failures are independent. The real world rarely cooperates.",
    keyPoints: [
      "P(all down) = (1 − A)ⁿ for independent failures",
      "Each extra replica adds roughly one 'nine'",
      "Correlated failures (same rack, same AZ, same bug) cap real-world redundancy",
    ],
    exerciseType: "interactive",
    widget: "availability",
    widgetInitial: { a: 0.99, n: 3 },
  },
  {
    id: 2005,
    category: "Learning Science",
    front: "Binomial distribution — practice testing intuition",
    back: "The binomial shows the spread of outcomes for n independent Bernoulli trials. Mean = np; standard deviation shrinks relative to the mean as √n grows — the Law of Large Numbers in one formula.",
    keyPoints: [
      "Mean = np, Variance = np(1−p)",
      "As n grows, the distribution approaches a normal (de Moivre-Laplace)",
      "Short sequences have huge variance — a coin flipped 10× lands 7+ heads ~17% of the time",
    ],
    exerciseType: "interactive",
    widget: "binomial",
    widgetInitial: { n: 10, p: 0.5 },
  },
  {
    id: 2006,
    category: "Infrastructure",
    front: "Tail latency amplification",
    back: "If any one of N parallel calls is slow, the user sees a slow request. A 1% tail with fan-out of 100 means 63% of users hit the tail. This is why p99 dominates perceived performance at scale — and why microservices with deep call graphs are so latency-hostile.",
    keyPoints: [
      "P(any slow) = 1 − (1 − p)ⁿ",
      "Deep call graphs multiply tail exposure",
      "Fixes: hedged requests, tied requests, smaller fan-out, caching",
    ],
    exerciseType: "interactive",
    widget: "latency-percentile",
    widgetInitial: { p99: 0.01, n: 100 },
  },
];
