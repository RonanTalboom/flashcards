import type { Card } from "../types";

// === LLM Papers — Foundations (2017-2023) ===
// Source: "Research papers every LLM engineer must read" clipping (X thread @amitiitbhu, 2026-04-07)
// Treated as: historical foundations deck, NOT a complete 2026 curriculum.
// Red team identified ~8 missing papers (MoE, reasoning models, tool use, multimodal, Constitutional AI, etc.)
// — captured in card 7150 as a deliberate gap-flagging card.
// IDs 7100-7199. Max prior ID was 7063 (austrian-deflationism-cards).
// Dates verified against arXiv. YouTube videos only attached where creator is verifiable (Kilcher /
// paper authors / Stanford MLSys) — per the YouTube-link-rot research, no video is better than a
// flaky one. Scaling Laws, Chinchilla, CoT intentionally have NO videoUrl.

export const LLM_PAPERS_CARDS: Card[] = [
  // ================================================================
  // LESSON 1 — Architecture foundations (Attention / BERT / GPT-3 / LLaMA / FlashAttention)
  // ================================================================

  // --- Attention Is All You Need (Vaswani et al. 2017, arXiv:1706.03762) ---
  {
    id: 7100,
    category: "LLM Papers",
    front: "What did Attention Is All You Need (Vaswani et al. 2017) replace, and with what?",
    back: "It replaced recurrence (RNN/LSTM) and convolutions with self-attention alone. Every position can attend to every other position in parallel, enabling the training throughput that powers every modern LLM.",
    keyPoints: [
      "Recurrence was the bottleneck: O(n) sequential steps made long-sequence training slow",
      "Self-attention: all positions processed in parallel during training",
      "Encoder-decoder architecture; decoder uses masked self-attention to prevent attending to future tokens",
      "Source: arXiv:1706.03762 (NeurIPS 2017)",
    ],
    videoUrl: "https://www.youtube.com/watch?v=cbYxHkgkSVs",
  },
  {
    id: 7101,
    category: "LLM Papers",
    front: "What is the time and space complexity of self-attention in sequence length n?",
    back: "O(n²) in both time and space. Every token attends to every other token, producing an n×n attention matrix. This is why long-context remained expensive until FlashAttention and approximations.",
    keyPoints: [
      "Quadratic complexity is the central scalability constraint",
      "Constant factor is small, but the n² term dominates at long contexts",
      "FlashAttention reduces the constant via IO-aware tiling — NOT the asymptotic complexity",
      "Linear-attention approximations (Performer, Linformer) change the math; they trade accuracy",
    ],
    exerciseType: "mcq",
    choices: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
    correctAnswer: 2,
  },
  {
    id: 7102,
    category: "LLM Papers",
    front: "What are the three matrices in scaled dot-product attention, and what is the scaling factor?",
    back: "Query (Q), Key (K), Value (V). The scaling factor is 1/sqrt(d_k), where d_k is the dimension of the key vectors. The scaling prevents the softmax from saturating when d_k is large, which would produce vanishingly small gradients.",
    keyPoints: [
      "Attention(Q,K,V) = softmax(QKᵀ / sqrt(d_k)) V",
      "Without the sqrt(d_k) scaling, dot-product magnitudes grow with d_k and softmax saturates",
      "Multi-head: run h parallel attention operations with different learned projections, concatenate",
      "h=8 in the base Transformer; each head sees d_model/h = 64 dims",
    ],
  },
  {
    id: 7103,
    category: "LLM Papers",
    front: "Why does the decoder use masked self-attention?",
    back: "To preserve causality during training. The decoder generates tokens autoregressively at inference, so during parallel training we mask future positions (set their attention weights to −∞ before softmax) so each position can only attend to itself and earlier positions.",
    keyPoints: [
      "Causal mask is an upper-triangular matrix of −∞ added before softmax",
      "Without masking, the decoder would leak future tokens into earlier position representations during training",
      "Encoder has no mask — it sees the full input bidirectionally (this is BERT's contribution)",
    ],
  },

  // --- BERT (Devlin et al. 2018, arXiv:1810.04805) ---
  {
    id: 7104,
    category: "LLM Papers",
    front: "What did BERT (Devlin et al. 2018) introduce, and what made it the default for classification tasks?",
    back: "Bidirectional pre-training via Masked Language Modeling (MLM): randomly mask 15% of input tokens and train the model to predict them. Because each position attends to BOTH left and right context (unlike GPT's unidirectional), BERT representations encode richer features for classification, NER, and extractive QA.",
    keyPoints: [
      "MLM + Next Sentence Prediction (NSP) on BookCorpus (800M words) + English Wikipedia (2.5B words)",
      "BERT-base: 110M params, 12 layers. BERT-large: 340M params, 24 layers",
      "Fine-tune by adding a task-specific head and training on labelled data",
      "Source: arXiv:1810.04805 (NAACL 2019)",
    ],
    videoUrl: "https://www.youtube.com/watch?v=j9toSIRf4RI",
  },
  {
    id: 7105,
    category: "LLM Papers",
    front: "Was BERT's Next Sentence Prediction (NSP) objective load-bearing?",
    back: "No — largely ceremonial. RoBERTa (Liu et al. 2019) showed that removing NSP and training MLM alone on more data for longer matches or beats BERT. NSP is the part of BERT's recipe that did not survive replication.",
    keyPoints: [
      "RoBERTa ablation: MLM alone + longer training + more data outperforms MLM+NSP",
      "Later models (SpanBERT, ALBERT) either dropped or modified NSP",
      "Lesson: in a paper's recipe, individual components need ablations — not every component earns its keep",
      "Source: Liu et al. 2019, arXiv:1907.11692",
    ],
    exerciseType: "mcq",
    choices: [
      "NSP was essential — all later MLM models include it",
      "NSP was ceremonial — RoBERTa showed MLM alone is sufficient",
      "NSP was replaced by span-based masking in all downstream work",
      "NSP only mattered for question-answering fine-tuning",
    ],
    correctAnswer: 1,
  },
  {
    id: 7106,
    category: "LLM Papers",
    front: "In BERT's Masked Language Modeling, what happens to the 15% of tokens chosen for masking?",
    back: "80% are replaced with [MASK], 10% are replaced with a random token, and 10% are left unchanged. This mix reduces the train/test mismatch (fine-tuning data has no [MASK] tokens) and forces the model to build robust representations for every position.",
    keyPoints: [
      "80/10/10 split mitigates the [MASK] token distributional shift at inference",
      "The 10% unchanged forces the model to represent even 'clean' tokens carefully",
      "The 10% random introduces noise that regularizes the representations",
    ],
  },

  // --- GPT-3 (Brown et al. 2020, arXiv:2005.14165) ---
  {
    id: 7107,
    category: "LLM Papers",
    front: "What capability did GPT-3 (Brown et al. 2020) demonstrate that prior models did not?",
    back: "In-context few-shot learning: the model adapts to new tasks from a handful of examples in the prompt, with no gradient updates. Translation, arithmetic, QA, unscrambling — specified in natural language with k=0, 1, or few exemplars.",
    keyPoints: [
      "Zero-shot / one-shot / few-shot all improve with scale; few-shot closes much of the gap to fine-tuned",
      "In-context learning is an emergent property of scale + diverse pre-training — not an architectural addition",
      "175B parameters, ~300B training tokens from Common Crawl, WebText2, Books, Wikipedia",
      "Source: arXiv:2005.14165 (NeurIPS 2020)",
    ],
    videoUrl: "https://www.youtube.com/watch?v=SY5PvZrJhLE",
  },
  {
    id: 7108,
    category: "LLM Papers",
    front: "What is GPT-3's parameter count and training-token count, and how does that compare to compute-optimal scaling?",
    back: "175B parameters, ~300B training tokens. That is roughly 1.7 tokens per parameter — far below Chinchilla's (2022) compute-optimal ~20 tokens/parameter. GPT-3 is undertrained by modern standards; a much smaller model trained on more tokens would match or beat it at the same compute.",
    keyPoints: [
      "GPT-3 pre-dates Chinchilla scaling by ~2 years — it followed Kaplan's (incorrect) asymmetric allocation",
      "Undertrained: more parameters than the data justified at that compute budget",
      "Chinchilla 70B (1.4T tokens) matches much larger undertrained models at equal compute",
    ],
  },
  {
    id: 7109,
    category: "LLM Papers",
    front: "Why is GPT-3's few-shot performance described as 'brittle'?",
    back: "Few-shot accuracy is highly sensitive to prompt format, choice of examples, and example ordering. Swapping two examples, rewording the instruction, or changing the separator can swing accuracy by 10-30 points on the same task. This was the seed of the later 'prompt engineering' discipline.",
    keyPoints: [
      "Format sensitivity: newlines vs separators vs explicit labels all matter",
      "Example-selection sensitivity: random few-shot examples underperform curated",
      "Order sensitivity: the last example often has the largest effect on predictions",
      "Implication: single-prompt reported accuracy is an upper bound, not a typical-case estimate",
    ],
  },

  // --- LLaMA (Touvron et al. 2023, arXiv:2302.13971) ---
  {
    id: 7110,
    category: "LLM Papers",
    front: "What was LLaMA's (Touvron et al. 2023) headline finding?",
    back: "A well-trained 13B-parameter model outperforms GPT-3 (175B) on most benchmarks. Efficiency through data scale and quality, not through architectural breakthrough. The open-weight release reshaped the open-source research landscape.",
    keyPoints: [
      "13B LLaMA > 175B GPT-3 on MMLU, reasoning, and most closed-book QA — the Chinchilla lesson embodied",
      "Trained on 1.4T tokens from publicly available sources (CommonCrawl, C4, GitHub, ArXiv, Books, Wikipedia)",
      "Open weights (via application) — ignited the open-model ecosystem (Alpaca, Vicuna, LLaMA-2, Mistral, etc.)",
      "Source: arXiv:2302.13971",
    ],
    videoUrl: "https://www.youtube.com/watch?v=E5OnoYF2oAk",
  },
  {
    id: 7111,
    category: "LLM Papers",
    front: "What are LLaMA's three architectural tweaks vs the vanilla Transformer?",
    back: "Pre-normalization with RMSNorm (instead of post-norm LayerNorm), SwiGLU activation (instead of ReLU in the feedforward), and Rotary Positional Embeddings (RoPE, instead of sinusoidal/learned). None are original to LLaMA — the contribution is bundling them with data quality and scale.",
    keyPoints: [
      "RMSNorm: simpler + faster than LayerNorm; from Zhang & Sennrich 2019",
      "SwiGLU: gated linear unit with Swish activation; from Shazeer 2020",
      "RoPE: rotary positional embedding; from Su et al. (RoFormer) 2021",
      "LLaMA is a recipe consolidation, not an architectural invention",
    ],
    exerciseType: "mcq",
    choices: [
      "Mixture-of-Experts, RMSNorm, SwiGLU",
      "RMSNorm, SwiGLU, Rotary Positional Embeddings",
      "LayerNorm, GeLU, sinusoidal positional embeddings",
      "Grouped-query attention, SwiGLU, ALiBi",
    ],
    correctAnswer: 1,
  },

  // --- FlashAttention (Dao et al. 2022, arXiv:2205.14135) ---
  {
    id: 7113,
    category: "LLM Papers",
    front: "What problem does FlashAttention (Dao et al. 2022) solve, and how?",
    back: "Self-attention is memory-bound, not compute-bound, on modern GPUs because it reads/writes the O(n²) attention matrix to HBM (main memory) many times. FlashAttention reorders the computation into on-chip SRAM tiles using IO-aware block-wise tiling plus a numerically stable log-sum-exp online softmax. Exact attention, not an approximation.",
    keyPoints: [
      "Memory bandwidth is the bottleneck, not FLOPs — the attention matrix never needs to be materialized",
      "Block-wise tiling keeps tiles on on-chip SRAM; online softmax merges results across blocks",
      "Exact, not approximate — produces the same output as vanilla attention, just faster",
      "Reported: ~3× speedup on GPT-2 at seq 1K; enables longer contexts at the same memory budget",
      "Source: arXiv:2205.14135 (NeurIPS 2022)",
    ],
    videoUrl: "https://www.youtube.com/watch?v=gMOAud7hZg4",
  },
  {
    id: 7114,
    category: "LLM Papers",
    front: "Why does FlashAttention need the log-sum-exp trick?",
    back: "Because softmax is computed block-by-block over tiles, not over the full row. Naively summing per-block softmax values overflows. Keeping a running maximum and a running normalizer (the log-sum-exp of the running logits) lets each new tile update the partial softmax without catastrophic cancellation or overflow.",
    keyPoints: [
      "Standard softmax: subtract the max for stability, then exp, then normalize",
      "Block-wise softmax needs to merge partial softmaxes — done by tracking (running_max, running_sum)",
      "This is the same 'online softmax' trick used elsewhere in streaming numerics",
    ],
  },

  // ================================================================
  // LESSON 2 — Scaling + Alignment (Kaplan / Chinchilla / InstructGPT / LoRA / DPO)
  // ================================================================

  // --- Scaling Laws (Kaplan et al. 2020, arXiv:2001.08361) ---
  {
    id: 7120,
    category: "LLM Papers",
    front: "What did Kaplan et al. (2020) Scaling Laws show about how loss varies with compute, data, and parameters?",
    back: "Cross-entropy loss falls as a power law in each of model parameters (N), dataset size (D), and training compute (C). Smooth, predictable, spanning 7+ orders of magnitude. For a fixed compute budget, there is an optimal allocation between N and D. This turned model-sizing from guesswork into a calculation.",
    keyPoints: [
      "Loss L ∝ N^(−α_N), D^(−α_D), C^(−α_C) — three separate power laws that compose",
      "Architecture details (depth/width ratios, attention heads) matter far less than N, D, C",
      "Published by OpenAI; motivated the 'bigger is better' thesis that powered 2020-2022 scaling",
      "Source: arXiv:2001.08361",
    ],
  },
  {
    id: 7121,
    category: "LLM Papers",
    front: "What compute-allocation rule did Kaplan (2020) propose, and what did Chinchilla (2022) correct?",
    back: "Kaplan proposed ASYMMETRIC scaling: for each 10× more compute, grow the model ~5.5× but data only ~1.8×. Chinchilla (Hoffmann et al. 2022) replaced this with EQUAL-RATIO scaling: model and data should grow at roughly equal rates — about 20 training tokens per parameter for compute-optimal training. Kaplan's rule systematically undertrained models.",
    keyPoints: [
      "Kaplan: scale parameters faster than data → the 'big undertrained models' era (GPT-3, Gopher)",
      "Chinchilla: scale both together → Chinchilla 70B on 1.4T tokens beats Gopher 280B at equal compute",
      "Kaplan is now taught as 'what was wrong' — the paper is historically important, the allocation rule is not",
    ],
    exerciseType: "mcq",
    choices: [
      "Kaplan and Chinchilla agreed on ~20 tokens per parameter",
      "Kaplan proposed asymmetric (model >> data) scaling; Chinchilla corrected to equal-ratio (~20 tokens/param)",
      "Kaplan proposed equal-ratio scaling; Chinchilla proposed data-heavy scaling",
      "Chinchilla showed that scaling laws don't hold past 100B parameters",
    ],
    correctAnswer: 1,
  },

  // --- Chinchilla (Hoffmann et al. 2022, arXiv:2203.15556) ---
  {
    id: 7123,
    category: "LLM Papers",
    front: "What is Chinchilla's (Hoffmann et al. 2022) compute-optimal ratio of training tokens to parameters?",
    back: "Roughly 20 tokens per parameter. A 70B-parameter model should be trained on ~1.4T tokens to be compute-optimal. Chinchilla 70B (1.4T tokens) matches Gopher 280B (300B tokens) at equal compute — demonstrating that most prior large models were undertrained.",
    keyPoints: [
      "The ratio comes from fitting parametric models of loss vs (N, D, C) across 400+ training runs",
      "At fixed compute, a smaller model on more data beats a bigger model on less",
      "Chinchilla: 70B params × 1.4T tokens ≈ same compute as Gopher's 280B × 300B, better loss",
      "Source: arXiv:2203.15556",
    ],
  },
  {
    id: 7124,
    category: "LLM Papers",
    front: "What's a major caveat on Chinchilla's 20-tokens-per-parameter rule?",
    back: "It's not perfectly reproducible and not applied at the frontier. Epoch AI's 2024 replication attempt, using Chinchilla's own methodology, estimated a ratio closer to ~70:1. And frontier models (GPT-4, Claude) train with FEWER tokens/parameter than 20:1, not more — because high-quality unique web data is a finite, exhausted resource. Chinchilla is compute-optimal only when data is unbounded.",
    keyPoints: [
      "Epoch AI 2024: can't reproduce 20:1; their fit is ~70:1 from the same paper's data",
      "Data scarcity: the indexable web has finite unique high-quality tokens; repeated epochs have diminishing returns",
      "At the frontier, compute budget is no longer the only binding constraint — data quality is",
      "Chinchilla is a recipe for the era where data is free; the 2024+ era is data-constrained",
    ],
  },

  // --- InstructGPT (Ouyang et al. 2022, arXiv:2203.02155) ---
  {
    id: 7126,
    category: "LLM Papers",
    front: "What is InstructGPT's (Ouyang et al. 2022) three-stage alignment pipeline?",
    back: "(1) SFT: supervised fine-tuning on human-written demonstrations. (2) Reward Modeling (RM): train a separate model to predict human preferences over pairs of outputs. (3) PPO: reinforcement-learning fine-tune the SFT model against the reward model, with a KL penalty to the SFT policy to prevent mode collapse. This is the RLHF recipe that produced ChatGPT.",
    keyPoints: [
      "Stage 1 (SFT) teaches format and baseline instruction-following",
      "Stage 2 (RM) learns 'what humans prefer' from pairwise comparisons",
      "Stage 3 (PPO) optimizes the policy against the RM with KL regularization",
      "Headline: 1.3B InstructGPT beats 175B GPT-3 on human preference (own eval, ~71% win rate)",
      "Source: arXiv:2203.02155",
    ],
    videoUrl: "https://www.youtube.com/watch?v=2MBJOuVq380",
  },
  {
    id: 7127,
    category: "LLM Papers",
    front: "What does PPO in InstructGPT's pipeline actually optimize, and why the KL penalty?",
    back: "It optimizes the expected reward from the RM MINUS a KL-divergence penalty to the SFT policy. Without the KL term, PPO aggressively drifts toward over-optimized outputs that exploit the RM rather than please humans (reward hacking / mode collapse). The KL penalty keeps the policy 'close to' the SFT distribution — hoping to stay in-distribution for the RM.",
    keyPoints: [
      "Objective: E[R(x,y) − β · KL(π_θ(·|x) || π_SFT(·|x))]",
      "β (KL coefficient) is the most important hyperparameter — too low → reward hacking; too high → no improvement over SFT",
      "Reward-model overoptimization (Gao et al. 2022) showed KL does not fully contain it; follows its own scaling law",
    ],
  },
  {
    id: 7128,
    category: "LLM Papers",
    front: "What's the 2024-2026 status of the SFT→RM→PPO pipeline?",
    back: "Legacy, not frontier. Most shipped alignment now uses variants that avoid PPO's instability or the explicit RM: DPO (direct preference optimization), KTO, GRPO (DeepSeek-R1's group-relative critic-free method), or Constitutional AI / RLAIF. PPO still wins on code/STEM reasoning in controlled evals, but the pure SFT→RM→PPO trinity has been superseded in practice.",
    keyPoints: [
      "DPO: closed-form from Bradley-Terry, no RM, no RL — simpler but inherits length bias",
      "GRPO: group-relative baselines, no critic — ~50% less compute than PPO; used in DeepSeek-R1",
      "CAI / RLAIF: use an AI feedback model instead of paid human labelers",
      "Production reality: labs like Anthropic and OpenAI use hybrid recipes that are not fully disclosed",
    ],
  },

  // --- LoRA (Hu et al. 2021, arXiv:2106.09685) ---
  {
    id: 7130,
    category: "LLM Papers",
    front: "What is LoRA's (Hu et al. 2021) core trick, and why does it work?",
    back: "Freeze the pretrained weights W. Add a low-rank update W + BA, where B is d×r, A is r×d, and r ≪ d. Only train A and B. Empirically, fine-tuning updates have low intrinsic rank — full-rank updates are wasteful. LoRA cuts trainable parameters up to 10,000× while matching full fine-tuning on many benchmarks.",
    keyPoints: [
      "W_effective = W_0 + BA, where BA is the low-rank update (rank r, typically 4-64)",
      "Trainable parameters: 2dr instead of d² — orders of magnitude fewer",
      "At inference, B·A can be merged into W → zero additional latency (unlike adapter layers)",
      "Source: arXiv:2106.09685 (ICLR 2022)",
    ],
    videoUrl: "https://www.youtube.com/watch?v=DhRoTONcyZE",
  },
  {
    id: 7131,
    category: "LLM Papers",
    front: "Does LoRA truly match full fine-tuning, or are there domains where it fails?",
    back: "It matches on many tasks but FAILS on reasoning-heavy domains. Biderman et al. (2024, TMLR) showed LoRA 'learns less and forgets less' — on math and code, typical-rank LoRA substantially underperforms full fine-tuning. The low-intrinsic-rank hypothesis holds for style/instruction-following but breaks for tasks that require dense weight updates.",
    keyPoints: [
      "Instruction-following, style transfer, classification: LoRA at rank 16-64 ≈ full FT",
      "Math / code / multi-step reasoning: LoRA underperforms; needs 10-100× higher rank to close the gap",
      "Trade-off: LoRA preserves pretraining capability (less catastrophic forgetting) but caps ceiling performance",
      "Source: Biderman et al. 2024, arXiv:2405.09673",
    ],
    exerciseType: "mcq",
    choices: [
      "LoRA matches full fine-tuning across all domains",
      "LoRA matches on style/instruction tasks but underperforms on math/code reasoning",
      "LoRA always underperforms full fine-tuning",
      "LoRA only works for classification tasks",
    ],
    correctAnswer: 1,
  },

  // --- DPO (Rafailov et al. 2023, arXiv:2305.18290) ---
  {
    id: 7133,
    category: "LLM Papers",
    front: "What is DPO's (Rafailov et al. 2023) key insight vs PPO-based RLHF?",
    back: "The optimal policy under a Bradley-Terry reward model has a closed-form expression in terms of the base policy and the reference SFT policy. This collapses the three-stage SFT→RM→PPO pipeline into a single supervised loss on preference pairs. No explicit reward model, no RL sampling loop, no KL-coefficient tuning.",
    keyPoints: [
      "Trains directly on (prompt, preferred_response, rejected_response) triples",
      "Loss is a log-sigmoid of the difference of log-probability ratios — purely supervised",
      "No online sampling from the LM during training → ~50% less compute than PPO",
      "Source: arXiv:2305.18290 (NeurIPS 2023)",
    ],
    videoUrl: "https://www.youtube.com/watch?v=fcHW7xTlMkQ",
  },
  {
    id: 7134,
    category: "LLM Papers",
    front: "Does DPO outperform PPO in production, or only in academic benchmarks?",
    back: "DPO wins on stability, simplicity, and compute — but on hard reasoning tasks (code, math, STEM) PPO-variants still match or beat DPO when tuned. Frontier labs (OpenAI, Anthropic, DeepMind) have not openly replaced PPO with DPO; DeepSeek-R1 uses GRPO (a PPO variant). DPO also exhibits a verbosity bias — trained models tend to produce longer outputs than the preferred data.",
    keyPoints: [
      "DPO simpler, more stable, easier to train — genuine wins",
      "PPO / GRPO still dominate at the frontier for reasoning-heavy post-training",
      "DPO verbosity bias: output length grows beyond the preference data",
      "DPO reward-hacks the implicit reward (log-prob ratio) without a critic to bound it",
    ],
  },

  // ================================================================
  // LESSON 3 — Techniques + 2026 gaps (CoT / RAG / What's missing)
  // ================================================================

  // --- Chain-of-Thought (Wei et al. 2022, arXiv:2201.11903) ---
  {
    id: 7140,
    category: "LLM Papers",
    front: "What did Chain-of-Thought prompting (Wei et al. 2022) demonstrate?",
    back: "Prompting a large language model with step-by-step reasoning exemplars (or just 'let's think step by step') substantially improves performance on arithmetic, commonsense, and symbolic reasoning tasks. On GSM8K, 540B PaLM with 8 CoT exemplars surpassed prior fine-tuned SOTA.",
    keyPoints: [
      "CoT is inference-time — no training changes needed",
      "Few-shot CoT: include reasoning-step exemplars in the prompt",
      "Zero-shot CoT: append 'Let's think step by step' (Kojima et al. 2022) — surprisingly effective",
      "Source: arXiv:2201.11903 (NeurIPS 2022)",
    ],
  },
  {
    id: 7141,
    category: "LLM Papers",
    front: "Under what condition does Chain-of-Thought prompting help, and under what condition does it not?",
    back: "CoT is an emergent ability of scale: it helps at ~100B+ parameters and produces little to no gain on smaller models. Below that scale, asking a small model to think step-by-step can even HURT performance — it produces more plausible-looking but still wrong reasoning chains.",
    keyPoints: [
      "Scale threshold: helpful gains appear around 100B parameters in the original study",
      "Smaller models: CoT may be neutral or negative — they can't execute the extra reasoning reliably",
      "Task dependence: helps most on multi-step arithmetic and symbolic reasoning; less on single-step",
    ],
  },
  {
    id: 7142,
    category: "LLM Papers",
    front: "What does 'CoT faithfulness' mean, and what did Turpin et al. (2023) find?",
    back: "Faithfulness = whether the stated reasoning steps actually describe HOW the model arrived at its answer. Turpin et al. (2023) showed CoT is often NOT faithful: biasing the model toward a particular answer (e.g., via an unfair few-shot demo) changes the output, but the model rationalizes around the bias in the chain rather than surfacing it. CoT steps are often post-hoc rationalizations, not transparent reasoning.",
    keyPoints: [
      "CoT looks like transparent reasoning but can be confabulated after the fact",
      "Implication: CoT is a capability lever (improves accuracy) but not a reliable interpretability tool",
      "Safety-adjacent: CoT monitoring is only trustworthy to the extent CoT is faithful — which is limited",
      "Source: Turpin et al. 2023, 'Language Models Don't Always Say What They Think'",
    ],
  },

  // --- RAG (Lewis et al. 2020, arXiv:2005.11401) ---
  {
    id: 7143,
    category: "LLM Papers",
    front: "What is the architecture proposed in the original RAG paper (Lewis et al. 2020)?",
    back: "A dense retriever (DPR — Dense Passage Retrieval, bi-encoder BERT) indexes a corpus of documents. At query time, the retriever pulls the top-K passages; a seq2seq generator (BART) attends over both the query and the retrieved passages to produce the answer. Retriever and generator are jointly fine-tuned end-to-end on knowledge-intensive QA tasks (NaturalQuestions, TriviaQA, FEVER).",
    keyPoints: [
      "Separates parametric memory (the generator's weights) from non-parametric memory (the document index)",
      "Fresh knowledge updates possible by updating the corpus — no retraining the generator",
      "Attribution is possible: the generator's output can be traced back to retrieved documents",
      "Source: arXiv:2005.11401 (NeurIPS 2020)",
    ],
    videoUrl: "https://www.youtube.com/watch?v=JGpmQvlYRdU",
  },
  {
    id: 7144,
    category: "LLM Papers",
    front: "Why is the 2020 RAG architecture considered dated in 2026, and what replaced it?",
    back: "The 2020 setup assumes a frozen dense retriever, single-pass generation, and a fixed top-K. Modern production RAG uses hybrid retrieval (BM25 + dense + re-rankers), multi-hop / agentic retrieval loops (the model decides what to retrieve next), and long-context models that can absorb many retrieved passages at once. What's evergreen is the pattern — decouple retrieval from generation. What's superseded is the specific architecture.",
    keyPoints: [
      "Hybrid retrieval: BM25 + dense embeddings + learned re-rankers (Cursor, Milvus, claude-context)",
      "Agentic retrieval: tool-use loops where the model issues multiple retrieval queries",
      "Long-context: when the window holds 200K+ tokens, 'retrieve a lot then read' can replace fine-grained retrieval",
      "The evergreen lesson: separate parametric from non-parametric memory; let documents be the source of truth",
    ],
  },

  // --- Meta card: what's missing from this list in 2026 ---
  {
    id: 7150,
    category: "LLM Papers",
    front: "What classes of foundational LLM paper are conspicuously ABSENT from this 12-paper 'must-read' list?",
    back: "At least six: (1) Mixture of Experts / Switch Transformer — every frontier model is MoE. (2) Reasoning models — o1, DeepSeek-R1, test-time compute scaling. (3) Tool use / ReAct / function calling — the basis of agents. (4) Multimodal — CLIP, Flamingo, vision-language alignment. (5) Constitutional AI / RLAIF — Anthropic's production alignment recipe. (6) Speculative decoding + long-context methods — every modern inference stack. The list is a 2023-frozen snapshot of pretraining + RLHF; it is not a 2026 shipping-engineer's reading list.",
    keyPoints: [
      "MoE (Fedus 2021 Switch Transformer) — routing is how you scale past data bottlenecks",
      "Reasoning models (o1, DeepSeek-R1 2025) — test-time compute is the 2024+ paradigm",
      "Tool use / ReAct (Yao 2022) — agent behavior starts here",
      "Multimodal (Radford 2021 CLIP, Alayrac 2022 Flamingo)",
      "Constitutional AI (Bai 2022) — RLAIF alternative to RLHF",
      "Speculative decoding (Leviathan 2023) + long-context methods (YaRN, ring attention)",
      "Source curation warning: the original list was a single X/Twitter thread — treat it as one person's 2023 taste, not a canon",
    ],
    exerciseType: "mcq",
    choices: [
      "The 12-paper list is complete — nothing is missing",
      "Only mechanistic interpretability papers are missing",
      "At least 6 classes are missing: MoE, reasoning models, tool use, multimodal, Constitutional AI, speculative decoding/long-context",
      "The list needs only speculative decoding added",
    ],
    correctAnswer: 2,
  },
];
