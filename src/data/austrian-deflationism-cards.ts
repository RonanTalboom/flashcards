import type { Card } from "../types";

// === Austrian Deflationism — session 2026-04-19 ("Number Go Down" research) ===
// Captures the scale-conflation critique + mainstream counter-mechanisms + the
// historical record + Selgin's steelman, from a /research session on Farrington
// & Meyers' 2026 essay.
// Sources: Fisher 1933, Bernanke 1983, Krugman 1998, Koo 2010 PIIE WP10-7,
//          Atkeson & Kehoe 2004 AER, Bordo-Landon-Lane-Redish NBER 10329,
//          Selgin 1997 IEA Less Than Zero, SF Fed WP 2013-08 (DNWR),
//          ARK Invest & Our World in Data (Wright's Law).
// IDs start at 7052 (polymarket-discipline deck ends at 7051).

export const AUSTRIAN_DEFLATIONISM_CARDS: Card[] = [
  // ================================================================
  // LESSON 1 — The Scale-Conflation Core (austrian-scale-conflation)
  // ================================================================

  {
    id: 7052,
    category: "Economics",
    front:
      "Farrington & Meyers' \"Number Go Down\" argues productivity deflation is benign using Moore's Law, Ford's Model T, and Rockefeller oil as evidence. What is the central move the argument makes — and why does it fail?",
    back:
      "The scale conflation. Falling prices on specific goods under competitive pressure (micro) is uncontroversial; that does not establish that a generally falling price level (macro) is benign. The macro claim smuggles in assumptions about nominal debt contracts, monetary transmission, and wage-setting that the micro evidence does not settle. Goods can deflate while the aggregate price level does something entirely different for monetary reasons.",
    keyPoints: [
      "Micro claim (uncontroversial): innovating producers can cut prices on specific goods",
      "Macro claim (contested): therefore aggregate price deflation is benign",
      "The move smuggles in debt-contract, ZLB, and wage-rigidity assumptions",
      "Specific goods can deflate while aggregate prices do the opposite — different mechanisms",
    ],
    exerciseType: "mcq",
    choices: [
      "The argument correctly scales microeconomic observations to the macroeconomy",
      "It conflates productivity-driven price declines in specific goods with aggregate price-level deflation being benign — different mechanisms govern each",
      "The argument fails because Moore's Law is outdated, not for any deeper reason",
      "Austrian economics rejects the micro/macro distinction, so the move is internally consistent",
    ],
    correctAnswer: 1,
  },

  {
    id: 7053,
    category: "Economics",
    front:
      "Farrington & Meyers dismiss debt contracts as \"institutional fragility\" that sound money would resolve. What is the Fisher–Bernanke debt-deflation mechanism they fail to engage?",
    back:
      "Nominal debt contracts transfer wealth from debtors to creditors during any aggregate deflation — not just credit-unwind deflation. Creditors' marginal propensity to spend differs from debtors'; collateral values fall, forcing credit rationing on productive firms. Bernanke (1983) formalised this as the financial-accelerator: deflation is endogenously contractionary via the credit channel, regardless of whether the prior monetary regime was \"sound.\" Fisher (1933) is the original; Koo (2010) documents it in Japan.",
    keyPoints: [
      "Nominal debt + aggregate deflation = mechanical wealth transfer to creditors",
      "Collateral destruction forces credit rationing on solvent productive firms",
      "Mechanism is endogenous to aggregate deflation, not a feature of fiat credit alone",
      "Fisher 1933; Bernanke 1983 financial accelerator (QJE 1999); Koo 2010 balance-sheet recession",
    ],
  },

  {
    id: 7054,
    category: "Economics",
    front:
      "Krugman's \"It's Baaack\" (1998) identifies a mechanism by which deflation is contractionary without invoking wage stickiness. What is it, and why does it matter for the sound-money debate?",
    back:
      "The zero lower bound. Expected deflation raises the real interest rate (r = i − π^e) even when the nominal rate is floored at zero. Central banks can always tighten money but cannot always loosen it below zero, making monetary offset asymmetric. This mechanism operates independently of sticky wages or debt dynamics — pure deflation expectations are contractionary at the ZLB. Japan's 1995–2015 experience empirically confirms the dynamic.",
    keyPoints: [
      "r = i − π^e: expected deflation raises real rates even at nominal zero",
      "Monetary policy asymmetric: tightening always possible, easing bounded below",
      "Independent of wage stickiness and debt dynamics",
      "Japan 1995–2015 is the empirical case; Austrian framework has no response",
    ],
    exerciseType: "mcq",
    choices: [
      "The Paradox of Thrift — people defer all consumption",
      "The ZLB: expected deflation raises real interest rates even when nominal rates are at zero, making monetary easing impossible to deliver",
      "The Cantillon effect transmits unevenly",
      "Deflation causes hoarding, which causes more deflation",
    ],
    correctAnswer: 1,
  },

  {
    id: 7055,
    category: "Economics",
    front:
      "The essay dismisses sticky wages as \"institutional rigidity\" removable by sound money. What does the downward-nominal-wage-rigidity (DNWR) literature actually show, and why does it get worse under low inflation?",
    back:
      "DNWR is robust across countries, decades, and methodologies: workers strongly resist nominal cuts even when equivalent real adjustment via inflation is acceptable. Mechanism is rational — reference-point psychology, fairness norms (Bewley's interview research), and menu costs. Under moderate inflation, firms adjust real wages invisibly through inflation; under zero inflation or deflation, the constraint binds and firms choose layoffs/hiring freezes instead of cuts. SF Fed WP 2013-08 documents the spike-at-zero during 2008–2012. Sound money amplifies rather than removes the rigidity.",
    keyPoints: [
      "DNWR empirically robust: US, UK, Eurozone; multiple decades and methods",
      "Mechanism: reference-point psychology + fairness norms + menu costs — rational, not institutional",
      "Inflation hides real-wage adjustment; deflation forces it into the open, triggering layoffs",
      "Low-inflation regimes tighten the constraint rather than loosen it",
      "Source: Daly & Hobijn SF Fed WP 2013-08; Bewley (1999); BoE QB 1998",
    ],
  },

  {
    id: 7056,
    category: "Economics",
    front:
      "The essay cites Moore's Law in the present tense — \"the price of computing power roughly halves every 18 to 24 months.\" What's wrong with the framing, and when did the regime end?",
    back:
      "Moore's Law in the classic form broke around 2005–2007 with the end of Dennard scaling. Transistor density still rises (multicore, 3D stacking, chiplets), but single-thread performance improves at ~10–15% per year, not the 40–50% implied by the classic doubling. The mechanism that drove the 1965–2005 curve — power density staying constant as transistors shrank — stopped working when leakage current began dominating. The essay's live-tense framing is ~20 years out of date; the historical record (1970–2005) is still sufficient to refute the \"people defer forever\" strawman, but the curve itself is not currently running.",
    keyPoints: [
      "Classic Moore's Law: broken ~2005–2007 with end of Dennard scaling",
      "Dennard scaling: as transistors shrank, power density stayed constant → clock speeds rose",
      "Leakage current overtook scaling; clock speeds plateaued near 3–4 GHz",
      "Single-thread perf now ~10–15% per year vs. 40–50% historically",
      "The historical record still disproves \"people defer forever\" — but the curve is not live",
    ],
    exerciseType: "mcq",
    choices: [
      "Moore's Law continues at the classic 18–24 month doubling through 2026",
      "The classic regime ended around 2005–2007 with the end of Dennard scaling; single-thread gains are now ~10–15%/year",
      "Moore's Law was never an empirical regularity, only a marketing slogan",
      "The curve broke in 2015 when EUV lithography was delayed",
    ],
    correctAnswer: 1,
  },

  {
    id: 7057,
    category: "Economics",
    front:
      "What is Wright's Law, and how does it relate to Moore's Law?",
    back:
      "Wright's Law (1936, Theodore Wright on aircraft production) states that costs fall by a constant percentage for each doubling of cumulative production — typically 10–25% per doubling across 60+ documented technologies (solar PV, batteries, semiconductors, genome sequencing). Moore's Law is a special case where the doubling cadence has been extraordinarily fast. Wright generalises the regularity: technological deflation is a function of cumulative experience, not calendar time. Caveat: the empirical base (ARK, Our World in Data) shares methodological lineage; survivorship bias in the \"60+\" canon is real. Keep `confidence: medium`.",
    keyPoints: [
      "Wright 1936: aircraft production — costs fall ~15–20% per cumulative doubling",
      "Moore's Law = a fast special case of Wright's Law",
      "Documented across 60+ technologies: solar, batteries, chips, sequencing",
      "Mechanism: cumulative experience → learning + process innovation + scale",
      "Caveat: aggregator sources share method; survivorship bias in the canon is real",
    ],
  },

  {
    id: 7058,
    category: "Economics",
    front:
      "The Austrian \"good vs bad deflation\" binary sorts deflation into productivity-driven (benign) and credit-unwind (painful). Japan's post-1995 experience fits neither. What's the third category, and whose framework names it?",
    back:
      "Balance-sheet recession, named by Richard Koo (Nomura; PIIE WP10-7, 2010). Mechanism: asset-price collapse (Japan 1990 real estate + equity) leaves firms technically insolvent despite being operationally profitable. Rational firms pivot from profit maximisation to debt minimisation — paying down debt rather than investing, even at zero interest rates. Aggregate demand collapses not because households won't spend but because the corporate sector is a net saver. No productivity gains drive the deflation; no credit crunch triggers it. Sound money does not, by itself, prevent the high-leverage conditions that produce balance-sheet recessions — the binary breaks.",
    keyPoints: [
      "Koo 2010: balance-sheet recession — debt minimisation over profit maximisation",
      "Trigger: asset-price collapse leaving firms technically insolvent",
      "Neither productivity-driven (TFP flat) nor credit crunch (credit available)",
      "Refutes Austrian binary by exposing a third category of debt-overhang stagnation",
      "Sound money does not structurally prevent the high-leverage precondition",
    ],
    exerciseType: "mcq",
    choices: [
      "Japan's deflation was productivity-driven (\"good\"), the Austrians got it right",
      "Balance-sheet recession (Koo): firms deleverage despite zero rates because asset collapse left them technically insolvent — neither Austrian category applies",
      "Japan had hyperinflation, not deflation",
      "The deflation was caused purely by demographic decline",
    ],
    correctAnswer: 1,
  },

  // ================================================================
  // LESSON 2 — Historical Record & Steelman (austrian-historical-record)
  // ================================================================

  {
    id: 7059,
    category: "Economics",
    front:
      "The 1873–1896 US/UK/Germany deflation is the Austrian school's canonical example of \"good\" deflation. What features of the episode do Austrian retellings omit?",
    back:
      "Two features Bordo-Landon-Lane-Redish (NBER 10329, 2004) themselves document: (1) German real wages fell sharply in several periods because nominal wage rigidity was partial, not complete — the benefits were distributionally uneven; (2) contemporaries hated the deflation, with farmers, workers, and debtors lobbying fiercely against it throughout the period, culminating in Bryan's 1896 \"Cross of Gold\" campaign. If the deflation was uniformly benign, the political economy it generated is hard to explain. Kaufmann (2020) reclassifies some \"neutral\" periods as moderately costly.",
    keyPoints: [
      "Supply-shock decomposition is real: productivity gains drove most of the price decline",
      "But German real wages fell — distributional costs were non-trivial",
      "Contemporaries lobbied fiercely against deflation across the period",
      "1896 Bryan \"Cross of Gold\" campaign fought on exactly this question",
      "Kaufmann 2020 (J. Appl. Econometrics) reclassifies as moderately costly",
    ],
  },

  {
    id: 7060,
    category: "Economics",
    front:
      "Atkeson & Kehoe (AER 2004) find \"no empirical link between deflation and depression except the 1930s\" across 17 countries and 100+ years. Austrians sometimes cite this as vindication. What's the inversion?",
    back:
      "The 1930s exception is precisely the regime Austrian sound money cannot structurally prevent — high private debt, financial fragility, balance-sheet exposure. Atkeson-Kehoe show that in regimes with low leverage and limited financial intermediation (most of the 1880–1920 period), deflation was indeed tolerable. But the 1930s gold standard amplified the debt-deflation spiral rather than preventing it. Sound money is compatible with — and arguably accelerates — the leverage conditions that turn deflation catastrophic. Note: this inversion is an interpretation, not the authors' stated conclusion.",
    keyPoints: [
      "Atkeson-Kehoe finding: no deflation-depression link except the 1930s",
      "Austrian reading: vindication — deflation is usually fine",
      "Inversion: the 1930s are precisely the regime sound money does not prevent",
      "Gold standard amplified 1930s debt-deflation rather than preventing it",
      "Caveat: the inversion is interpretation, not the authors' conclusion",
    ],
    exerciseType: "mcq",
    choices: [
      "Deflation and depression are unlinked, so sound money is vindicated",
      "The 1930s exception is the regime sound money cannot prevent — high leverage and financial fragility — which inverts the vindication into a critique",
      "Atkeson-Kehoe's methodology is flawed and the finding should be ignored",
      "The result is consistent with but does not prove Austrian claims",
    ],
    correctAnswer: 1,
  },

  {
    id: 7061,
    category: "Economics",
    front:
      "Farrington & Meyers cite Mises, Hayek, and Böhm-Bawerk but not the living economist whose formalism most resembles their argument. Who is it, and what does his framework specify more rigorously?",
    back:
      "George Selgin — Less Than Zero (IEA 1997) and the free-banking literature. His productivity norm targets stable nominal aggregate spending (MV or NGDP) rather than stable prices. Under the rule: productivity gains translate directly into mild price deflation; productivity stagnation gives stable prices; money-demand shocks are absorbed by free-banking fractional-reserve dynamics. This is the orthodox-engageable version of the Austrian argument — narrower than the essay's blanket defence of deflation. It maps cleanly onto Sumner's NGDP level-targeting. The omission of Selgin from the essay is notable; he's the technical anchor the rhetorical case needs.",
    keyPoints: [
      "Selgin, Less Than Zero (IEA 1997) — the productivity norm",
      "Targets stable nominal aggregate spending, not stable prices",
      "Productivity ↑ → mild price deflation; productivity flat → stable prices",
      "Orthodox-engageable; narrower than the essay's blanket defence",
      "Maps onto Sumner's market-monetarist NGDP targeting — shared diagnosis, different regime",
    ],
    exerciseType: "mcq",
    choices: [
      "Murray Rothbard and Hans-Hermann Hoppe",
      "George Selgin — the productivity norm targets stable nominal spending, not stable prices, and is the rigorous version of the essay's informal argument",
      "Ludwig von Mises — already cited",
      "Milton Friedman's k-percent rule",
    ],
    correctAnswer: 1,
  },

  {
    id: 7062,
    category: "Economics",
    front:
      "Farrington & Meyers treat the Paradox of Thrift as pure fallacy and use Moore's Law to refute it. Where does the Keynesian argument actually have a point, and where does it genuinely fail?",
    back:
      "Fails (Austrian is right): nobody's time preference is zero — people must eventually consume to live, and Moore's Law empirically disproves the strawman that predictable deflation stops consumption indefinitely. Has a point (Austrian is wrong): at the ZLB with deflation expectations, rational savers prefer cash to lending because expected-negative-real-return investment is dominated by waiting for lower prices. The paradox survives not as a universal claim about savings, but as a rational response to expected deflation in a ZLB-constrained regime. Austrian treatment of the paradox ignores the ZLB conditioning.",
    keyPoints: [
      "Strawman the essay beats: \"people defer all consumption forever\" — empirically false",
      "Real argument: at the ZLB with deflation expectations, waiting dominates investing",
      "Mechanism: r = i − π^e; with i floored at 0 and π^e < 0, real rates rise",
      "Paradox of Thrift survives as ZLB-conditioned rational response, not universal law",
      "Austrian treatment doesn't distinguish normal conditions from ZLB conditions",
    ],
  },

  {
    id: 7063,
    category: "Economics",
    front:
      "The essay frames Cantillon effects — new money benefits first recipients at the expense of others — as proof that fiat money structurally corrupts price signals. What does mainstream economics actually concede, and where does it push back?",
    back:
      "Concedes: Cantillon effects are real; monetary expansion has first-round distributional effects; proximity to the spigot (banks, governments, asset holders) matters. QE research explicitly documents this. Pushes back: (1) the effects are temporary and small relative to macro stabilisation gains from avoiding deflation spirals; (2) redistribution is not the same as waste — reallocation ≠ permanent productive-capacity reduction; (3) the empirical claim that fiat corrupts price signals enough to prevent innovation is weak — post-1971 productivity growth was rapid, contradicting the strong version of the thesis. The magnitude question, not existence, is the disagreement.",
    keyPoints: [
      "Existence of Cantillon effects: mainstream concedes — textbook material",
      "Magnitude: disputed — small vs macro stabilisation gains",
      "Redistribution ≠ productive-capacity loss (Ricardian-equivalence style argument)",
      "Post-1971 productivity growth rapid despite fiat — empirical pushback on the strong thesis",
      "Useful follow-up: Coibion et al. on monetary policy & inequality; Auclert on redistribution channels",
    ],
  },
];
