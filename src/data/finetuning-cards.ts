import type { Card } from "../types";

// === Finetuning & Serving — Neural Maze 8-lesson course + vault counter-research (2026-04-18) ===
// Sources: LIMA, LoRA, QLoRA, DoRA, DPO, IPO, GRPO, DeepSeek-R1, Gao RM-overopt,
//          CAI, Orca, PagedAttention, DistServe, EAGLE, vAttention, quantization-reasoning studies.
// IDs start at 7000 to avoid conflict with DDIA glossary (6000-6024) and prior decks.

export const FINETUNING_CARDS: Card[] = [
  // ================================================================
  // LESSON 1 — Training Pipeline & SFT (ft-pipeline)
  // ================================================================

  {
    id: 7000,
    category: "Finetuning",
    front: "What did LIMA actually demonstrate, and what is it commonly misread as?",
    back: "LIMA showed that 1,000 carefully curated examples fine-tune a 65B base model to a 43% win-rate vs GPT-4. It is commonly misread as 'instruction tuning is purely cosmetic' — the Superficial Alignment Hypothesis — which later work partially walked back.",
    keyPoints: [
      "Strong base + ~1K diverse curated examples unlocks instruction-following",
      "Style transfer saturates fast; reasoning and task capability continue scaling with SFT data",
      "Quality beats quantity for instruction-following, not for all downstream capability",
      "Source: Zhou et al., LIMA (arXiv 2305.11206); walkback — arXiv 2410.03717",
    ],
    exerciseType: "mcq",
    choices: [
      "LIMA proved that 1000 examples are sufficient for all finetuning use cases",
      "LIMA showed 1000 curated examples unlock instruction-following on a strong base; the claim that SFT only transfers style has since been partially walked back",
      "LIMA showed RLHF is unnecessary if you have high-quality SFT data",
      "LIMA demonstrated that smaller models can match larger ones with enough training data",
    ],
    correctAnswer: 1,
  },

  {
    id: 7001,
    category: "Finetuning",
    front: "Where does reasoning actually come from in the DeepSeek-R1 style pipeline — SFT or RL?",
    back: "RL. SFT on curated chain-of-thought examples seeds the distribution; GRPO (RL) discovers patterns the SFT data didn't contain. Smaller distilled models that learn reasoning via SFT are learning from an RL-trained teacher's outputs — the search happened upstream.",
    keyPoints: [
      "SFT on CoT is a prerequisite, not sufficient for frontier reasoning from scratch",
      "RL is where novel reasoning patterns emerge in the R1 recipe",
      "Distillation transfers behaviour downstream; it doesn't originate it",
      "Source: DeepSeek-R1 (arXiv 2501.12948)",
    ],
    exerciseType: "mcq",
    choices: [
      "SFT on chain-of-thought examples is sufficient for reasoning",
      "Reasoning emerges in RL; SFT only seeds the distribution",
      "Reasoning is purely a pretraining property — finetuning can't add it",
      "Reasoning comes equally from SFT and RL stages",
    ],
    correctAnswer: 1,
  },

  {
    id: 7002,
    category: "Finetuning",
    front: "What does loss masking in SFT actually do, and why?",
    back: "Loss masking sets the user-prompt tokens to -100 (ignore index in CrossEntropyLoss) so the model is only trained to predict the assistant response. Computing loss on prompt tokens wastes capacity teaching the model to predict inputs it will never need to generate.",
    keyPoints: [
      "User prompt tokens → label -100 → excluded from the loss",
      "Assistant response tokens → loss contributes to gradient",
      "Modern frameworks (HuggingFace TRL) expose this via `assistant_only_loss`",
      "Source: HuggingFace TRL documentation",
    ],
  },

  {
    id: 7003,
    category: "Finetuning",
    front: "What happens to pretraining knowledge during domain SFT, and how does model size affect it?",
    back: "Catastrophic forgetting — degradation of pretraining capabilities as the model specialises on the SFT domain. In the 1B-7B range, larger models forget more, not less. Mitigations: lower learning rates, instruction-data warm-up before domain data, and adapter methods like LoRA that constrain update capacity.",
    keyPoints: [
      "Empirical study: 1B-7B models, larger ones forget more within that range",
      "Lower LR (~2e-5 for 7B-class) and instruction warm-up are the evidence-backed mitigations",
      "LoRA forgets less than full FT — capacity limit is the feature here",
      "Scope caveat: the 'larger forgets more' result does not cleanly extrapolate to 70B+ frontier-scale models",
      "Source: Luo et al. (arXiv 2308.08747)",
    ],
    exerciseType: "mcq",
    choices: [
      "Larger models are more robust to forgetting, so catastrophic forgetting is primarily a small-model problem",
      "In the 1B-7B range, larger models forget more pretraining knowledge during domain SFT, though this doesn't cleanly extrapolate to frontier scale",
      "Catastrophic forgetting only affects reasoning tasks, not general knowledge",
      "Modern instruction-tuned bases are immune to catastrophic forgetting",
    ],
    correctAnswer: 1,
  },

  {
    id: 7004,
    category: "Finetuning",
    front: "What is a chat template, and what goes wrong when it is mismatched between training and inference?",
    back: "A chat template is the exact string format (special tokens, role markers, boundaries) that wraps messages before tokenization — e.g., Llama 3, Qwen, ChatML all differ. Training-inference template drift causes silent degradation: the model learned to condition on a specific format and gets a different one at inference, without any hard error.",
    keyPoints: [
      "Templates are a training-time semantic contract, not cosmetic formatting",
      "Silent failure mode — no exception, just quality collapse",
      "Common during distillation, model merging, or serving a finetune behind a different framework",
      "Sanity check: print the fully-rendered prompt before training and before inference, byte-for-byte",
    ],
  },

  // ================================================================
  // LESSON 2 — LoRA & QLoRA (ft-peft)
  // ================================================================

  {
    id: 7010,
    category: "Finetuning",
    front: "When does the low-intrinsic-rank hypothesis behind LoRA break down?",
    back: "On coding and math finetuning. Biderman et al. (2024) found that full-FT deltas on those domains have rank roughly 10-100x higher than typical LoRA settings (rank 8-64). LoRA's efficiency is real but not free: there is a measurable accuracy gap on domains that demand high-dimensional updates.",
    keyPoints: [
      "LoRA near-lossless on conversational / style finetuning",
      "Measurable accuracy gap on coding, math, reasoning",
      "Fix directions: raise rank, use DoRA, or accept full FT for those domains",
      "Source: Biderman et al., LoRA Learns Less and Forgets Less (TMLR 2024, arXiv 2405.09673)",
    ],
    exerciseType: "mcq",
    choices: [
      "LoRA works on all tasks because weight updates are always low-rank",
      "LoRA's low-intrinsic-rank hypothesis holds on style tasks but breaks on coding and math, where full-FT deltas have 10-100x higher rank",
      "LoRA only works for small models under 7B",
      "The low-rank hypothesis was disproven — LoRA is empirically not better than random adapter methods",
    ],
    correctAnswer: 1,
  },

  {
    id: 7011,
    category: "Finetuning",
    front: "What condition does QLoRA's 'NF4 is information-theoretically optimal' claim assume, and why does the condition matter?",
    back: "It assumes weights are exactly zero-mean unit-variance Gaussian. Under that assumption, NF4 places its 16 quantization levels at the optimal quantiles of the normal distribution. Real post-training weights are heavy-tailed — outlier activations and attention weights are the cause of most quantization accuracy loss, which is exactly where the normality assumption fails.",
    keyPoints: [
      "Optimal under idealised Gaussian prior — close to optimal in practice",
      "Heavy-tailed outliers are the failure mode; SmoothQuant, AWQ exist to address them",
      "The 'information-theoretically optimal' line often drops the condition in citation",
      "Source: Dettmers et al., QLoRA (arXiv 2305.14314)",
    ],
  },

  {
    id: 7012,
    category: "Finetuning",
    front: "What does Rank-Stabilized LoRA (RSLoRA) change, and what problem does it solve?",
    back: "Standard LoRA scales the adapter output by alpha/r. RSLoRA uses alpha/sqrt(r). This makes the optimal learning rate approximately rank-independent, so you can sweep rank without retuning LR at every step.",
    keyPoints: [
      "One-line change removes LR-vs-rank coupling from hyperparameter search",
      "Standard alpha = r and alpha = 2r are folk conventions, not theoretically grounded",
      "Empirically underadopted despite zero-cost integration",
      "Source: Kalajdzievski (arXiv 2312.03732)",
    ],
    exerciseType: "mcq",
    choices: [
      "RSLoRA replaces the alpha/r scaling with alpha/sqrt(r), making the optimal learning rate approximately rank-independent",
      "RSLoRA adds a second low-rank matrix in parallel",
      "RSLoRA uses rank-stabilized gradient descent (a new optimizer)",
      "RSLoRA freezes the rank dynamically during training",
    ],
    correctAnswer: 0,
  },

  {
    id: 7013,
    category: "Finetuning",
    front: "What is DoRA's decomposition, and why is its inference cost zero?",
    back: "DoRA splits each weight update into a learned magnitude (scalar) and direction (standard LoRA adapters). Both components are merged back into the base weights after training — so at inference, the model is a plain merged full-precision model with no runtime overhead vs a vanilla checkpoint.",
    keyPoints: [
      "Magnitude + direction decomposition, merged post-training",
      "+3.7-4.4% on Llama variants at matched rank",
      "The gap over LoRA narrows at higher ranks and on stronger bases",
      "ICML 2024 oral, but replication base is thinner than visibility suggests",
      "Source: Liu et al., DoRA (arXiv 2402.09353)",
    ],
  },

  {
    id: 7014,
    category: "Finetuning",
    front: "Which two LoRA/QLoRA components are load-bearing for fitting a 65B model on a 48GB GPU — not just incidental detail?",
    back: "NF4 weight quantization (4-bit weights are the dominant memory saving) and paged optimizers (bitsandbytes pages optimizer state between GPU VRAM and CPU RAM during memory spikes). Double quantization adds an additional ~0.4-0.5 bits/param on top.",
    keyPoints: [
      "NF4 is the primary memory win; paged optimizers handle training-time spikes",
      "Double quantization: 8-bit quantization of NF4's scaling constants at block size 256",
      "All three together enable single-48GB-GPU finetuning of 65B",
      "Paging is a hardware-agnostic OS-style trick, not LoRA-specific",
    ],
  },

  {
    id: 7015,
    category: "Finetuning",
    front: "When you want to minimise catastrophic forgetting during finetuning, is LoRA or full-FT the safer default, and why?",
    back: "LoRA. Biderman et al. (2024) found that LoRA preserves out-of-distribution performance better than full-FT and standard regularisation (weight decay, dropout). The restricted update capacity is the mechanism: the model can't overwrite pretraining knowledge as aggressively.",
    keyPoints: [
      "LoRA learns less AND forgets less — a principled tradeoff",
      "Relevant in multi-domain or continual-learning setups",
      "Both findings come from the same Biderman study — source-independence is weak",
      "Full-FT still wins on accuracy where rank-capacity matters (code, math)",
      "Source: arXiv 2405.09673",
    ],
    exerciseType: "mcq",
    choices: [
      "Full-FT — higher capacity means better generalisation",
      "LoRA — restricted update capacity means less overwriting of pretraining knowledge",
      "Neither matters; dropout and weight decay dominate",
      "Only LoRA with rank >= 256 preserves knowledge; smaller ranks degrade faster",
    ],
    correctAnswer: 1,
  },

  // ================================================================
  // LESSON 3 — Alignment Algorithms (ft-alignment)
  // ================================================================

  {
    id: 7020,
    category: "Alignment",
    front: "What is DPO's core insight, and why does it remove the need for a separate reward model?",
    back: "The optimal RLHF policy has a closed-form relationship with the reward. Rafailov et al. show the policy itself is an implicit reward model, so alignment reduces to a classification loss over preference pairs — no separate reward network, no critic, no rollouts. Just supervised training on (prompt, chosen, rejected) triples.",
    keyPoints: [
      "Closed-form derivation of optimal policy from reward",
      "Removes RL infrastructure — pure supervised loss",
      "Won on engineering simplicity in open-source, not on quality at frontier",
      "Source: Rafailov et al. (NeurIPS 2023, arXiv 2305.18290)",
    ],
  },

  {
    id: 7021,
    category: "Alignment",
    front: "What is DPO's best-documented failure mode, and what is the standard fix?",
    back: "Length bias — DPO systematically lengthens outputs, with measurable degradation after about three epochs of training. SamPO (EMNLP 2024) debiases this via downsampled KL divergence and recovers 5-12% over raw DPO. A related issue is DPO's unbounded reward gap (fixed by IPO with an identity loss).",
    keyPoints: [
      "Length bias is the well-replicated failure mode",
      "SamPO, IPO, CPO, SimPO are the 2024-era fixes",
      "DPO also degrades more than tuned PPO on code and STEM",
      "Sources: SamPO (EMNLP 2024), IPO (Azar et al., ICML 2024)",
    ],
    exerciseType: "mcq",
    choices: [
      "DPO requires more compute than PPO",
      "DPO biases toward longer responses, with measurable degradation after ~3 epochs",
      "DPO cannot be trained without an explicit reward model",
      "DPO only works on instruct models, not base models",
    ],
    correctAnswer: 1,
  },

  {
    id: 7022,
    category: "Alignment",
    front: "What does GRPO eliminate compared to PPO, and how does it replace it?",
    back: "GRPO eliminates the critic / value network. Instead of a learned value baseline, it samples G responses per prompt and uses the within-group mean and standard deviation of rewards as the baseline. Result: roughly 50% memory and compute reduction vs PPO, and a natural fit for verifiable-reward tasks like math and code.",
    keyPoints: [
      "No critic network — just group-relative baselines",
      "~50% compute/memory savings vs standard PPO setup",
      "On-policy and online, unlike DPO",
      "Partial rediscovery of RLOO and ReMax, which predate it",
      "Source: DeepSeekMath (arXiv 2402.03300), DeepSeek-R1 (arXiv 2501.12948)",
    ],
  },

  {
    id: 7023,
    category: "Alignment",
    front: "The DeepSeek-R1 paper reports AIME 2024 pass@1 going from 15.6% (SFT) to 71% (with GRPO). What does that number actually credit?",
    back: "The full R1 recipe, not GRPO alone. The 71% follows cold-start SFT on curated CoT, rule-based verifiable rewards, iterative rollouts, and self-distillation. GRPO is one ingredient in a heavily engineered pipeline. Reading the 55-point jump as 'swap PPO for GRPO, get +55 on AIME' misattributes the gain.",
    keyPoints: [
      "Large benchmark gains usually credit a recipe, not a single algorithm swap",
      "GRPO's real savings are compute/memory, not +55 AIME points on its own",
      "Common failure mode: headline numbers are cited as algorithm effects rather than pipeline effects",
      "Source: DeepSeek-R1 (arXiv 2501.12948)",
    ],
    exerciseType: "mcq",
    choices: [
      "Switching from PPO to GRPO alone adds ~55 AIME points",
      "The 15.6 → 71 jump credits the full R1 recipe (SFT cold-start + rule-based rewards + iterative rollouts + distillation), not GRPO in isolation",
      "GRPO's benefit is entirely in memory savings — accuracy is unchanged",
      "The 71% figure is from pretraining improvements, not finetuning",
    ],
    correctAnswer: 1,
  },

  {
    id: 7024,
    category: "Alignment",
    front: "What does Gao et al.'s scaling law for reward-model overoptimization show, and what does it mean for the KL penalty?",
    back: "The gap between proxy reward (what RLHF optimises) and gold reward (true human preference) grows as a power law in the KL distance from the reference policy. Goodhart's law with an exponent. Counterintuitively, tuning the KL penalty coefficient does not close the gap — KL is a regulariser, not a fix for reward hacking.",
    keyPoints: [
      "Proxy-gold reward divergence follows a power law in KL distance",
      "KL penalty reshapes but does not eliminate reward hacking",
      "Frontier mitigation: larger RMs, ensembles, curated preferences — not tighter KL alone",
      "Source: Gao, Schulman, Hilton (ICML 2023, arXiv 2210.10760)",
    ],
  },

  {
    id: 7025,
    category: "Alignment",
    front: "Between tuned PPO (online) and DPO (offline), which wins on harder tasks like code and STEM, and why?",
    back: "Tuned PPO. The ICML 2024 oral 'Is DPO Superior to PPO?' and follow-up studies show tuned PPO beats DPO on harder reasoning and code tasks because on-policy data is strictly better for learning — the policy can generate fresh rollouts under its current distribution. Iterative / online DPO closes the gap but rarely eliminates it. Data composition usually dominates both.",
    keyPoints: [
      "On-policy (PPO) > off-policy (DPO) on hard tasks",
      "Iterative DPO (resample preferences with current policy) is the pragmatic middle",
      "For conversational alignment on curated preferences, DPO is usually enough",
      "Data freshness and composition dominate the algorithm choice in practice",
      "Source: arXiv 2404.10719",
    ],
    exerciseType: "mcq",
    choices: [
      "DPO wins everywhere because it's simpler and avoids reward hacking",
      "Tuned PPO beats DPO on code and STEM because on-policy data is strictly better; iterative DPO closes but does not eliminate the gap",
      "They are empirically identical — the choice is pure engineering preference",
      "PPO only wins at frontier scale (>70B); below that DPO dominates",
    ],
    correctAnswer: 1,
  },

  {
    id: 7026,
    category: "Alignment",
    front: "How does Constitutional AI (CAI / RLAIF) fit into Anthropic's alignment pipeline — as a replacement for RLHF, or something else?",
    back: "CAI is used before RLHF, not instead of it. The two-stage pipeline: synthetic AI feedback handles harmlessness cheaply and at scale; human preference handles helpfulness where quality matters most. Cost differential is ~$0.01/example for CAI vs $1-10 for human labels.",
    keyPoints: [
      "CAI then RLHF — complementary, not substitution",
      "Harmlessness: ~88% CAI vs ~76% RLHF-only (Anthropic reporting)",
      "Synthetic feedback has a lower ceiling on edge-case helpfulness and stylistic nuance",
      "Source: Bai et al., Constitutional AI (arXiv 2212.08073)",
    ],
  },

  // ================================================================
  // LESSON 4 — Inference Serving (ft-serving)
  // ================================================================

  {
    id: 7030,
    category: "Serving",
    front: "Why do prefill and decode fight over the same GPU in LLM inference?",
    back: "They are different workload shapes. Prefill is compute-bound — arithmetic intensity 200-400 FLOP/byte, ~92% H100 tensor-core utilisation. Decode is memory-bandwidth-bound — 1-2 FLOP/byte, ~30% utilisation, because each step rereads the entire KV-cache to produce one token. Running them together under-uses the GPU in both directions.",
    keyPoints: [
      "Prefill: compute-bound, high utilisation, one-shot",
      "Decode: memory-bandwidth-bound, low utilisation, token-by-token",
      "Every modern serving optimisation (continuous batching, PagedAttention, chunked prefill, PD disaggregation) exists to navigate this mismatch",
      "Source: TDS + HuggingFace serving blogs",
    ],
    exerciseType: "mcq",
    choices: [
      "Prefill and decode use different model weights, causing cache contention",
      "Prefill is compute-bound (high arithmetic intensity); decode is memory-bandwidth-bound (rereads the full KV-cache per token) — the same GPU runs both workload shapes poorly when mixed",
      "Decode needs more VRAM than prefill, causing OOM when combined",
      "They run on different GPU architectures (SM vs CUDA core)",
    ],
    correctAnswer: 1,
  },

  {
    id: 7031,
    category: "Serving",
    front: "What problem does PagedAttention solve, and what cost does it pay?",
    back: "It solves KV-cache memory fragmentation: block-based virtual memory (with a block table mapping logical to physical blocks) cuts fragmentation from 60-80% down to under 4%, giving 2-4x throughput vs prior SOTA and enabling copy-on-write prefix sharing. The cost: roughly 20-26% extra attention-kernel latency from block-table indirection (vAttention paper).",
    keyPoints: [
      "Fragmentation 60-80% → <4% via OS-style paging over the KV-cache",
      "2-4x throughput vs FasterTransformer/Orca, up to 24x vs HF Transformers",
      "20-26% kernel latency overhead — not free",
      "vLLM marketing cites the fragmentation win; honest comparisons cite the indirection cost",
      "Sources: Kwon et al. (SOSP 2023, arXiv 2309.06180); vAttention (arXiv 2405.04437)",
    ],
    exerciseType: "mcq",
    choices: [
      "PagedAttention is free — pure throughput win, no downside",
      "PagedAttention cuts KV fragmentation from 60-80% to under 4% and delivers 2-4x throughput, at the cost of roughly 20-26% extra attention-kernel latency from block-table indirection",
      "PagedAttention only helps for context windows over 128K",
      "PagedAttention replaces FlashAttention and is incompatible with it",
    ],
    correctAnswer: 1,
  },

  {
    id: 7032,
    category: "Serving",
    front: "What problem does continuous batching / iteration-level scheduling solve compared to naive static batching, and what is the catch in production?",
    back: "Static batching holds the whole batch until the slowest sequence finishes, wasting decode cycles on completed sequences. Iteration-level scheduling (Orca, OSDI 2022) lets new requests join mid-generation — ~36.9x throughput at fixed latency vs FasterTransformer, ~23x with vLLM memory optimisations. The production catch: head-of-line blocking. One expensive request can starve the batch, pushing p99 tail latency to ~100x p50 under contention, and the problem is invisible to GPU-utilisation dashboards.",
    keyPoints: [
      "Throughput win: 23-37x over static batching",
      "Tail-latency loss: p99 can blow out under contention; a single expensive request starves the batch",
      "Field report: 11-second TTFT regression documented on real production vLLM",
      "Also opens a DoS surface (Fill-Squeeze attack, 280x TTFT slowdown)",
      "Admission control must be explicit — the default scheduler doesn't enforce per-request SLOs",
      "Sources: Orca (OSDI 2022), Anyscale vLLM blog, ebpfchirp production report",
    ],
  },

  {
    id: 7033,
    category: "Serving",
    front: "When does prefill-decode disaggregation NOT pay off?",
    back: "Small models, short contexts, single-user latency-critical workloads, and bursty low-concurrency traffic. Each pool needs a full model replica, so memory cost is real; with few requests, both pools under-utilise. KV-cache transfer over RDMA can also regress single-request TTFT. 2025 designs like Nexus propose intra-GPU disaggregation specifically to fit lower-concurrency shapes.",
    keyPoints: [
      "Wins on: high concurrency + large models + throughput-dominated SLOs + NVLink intra-node",
      "Loses on: small models, short contexts, single-user TTFT SLOs, bursty low-concurrency",
      "2025 counter-design: intra-GPU disaggregation (Nexus, arXiv 2507.06608)",
      "DistServe headline: 7.4x goodput or 12.6x tighter SLO — workload-dependent",
    ],
    exerciseType: "mcq",
    choices: [
      "Disaggregation always pays off because the phases genuinely differ",
      "Disaggregation pays off best under high concurrency with large models; it fails on small models, short contexts, and single-user latency-critical or bursty workloads",
      "Disaggregation only makes sense for models over 100B parameters",
      "Disaggregation is a research artefact with no production deployment",
    ],
    correctAnswer: 1,
  },

  {
    id: 7034,
    category: "Serving",
    front: "What are the two main failure modes of speculative decoding?",
    back: "Long-context collapse and batch-size saturation. Earlier EAGLE variants had context caps around 2048 tokens and acceptance rates that degrade with position. Speedups diminish past batch size ~32 and can break even, because at high concurrency the system becomes compute-bound and the draft-verification arithmetic stops paying off. On some tasks (e.g., translation) optimal draft length collapses to zero.",
    keyPoints: [
      "Low-batch, short-to-medium context, latency-sensitive → 2-3x win",
      "Long context (32K+) → degraded unless EAGLE-3 or newer",
      "Batch >32 → diminishing or negative returns",
      "Translation tasks → optimal draft length ~0",
      "Sources: EAGLE-3 (arXiv 2503.01840), vLLM spec-decode docs, AWS P-EAGLE blog",
    ],
  },

  {
    id: 7035,
    category: "Serving",
    front: "What is the impact of aggressive weight quantization (AWQ/GPTQ 4-bit) on reasoning-heavy tasks?",
    back: "Substantial. Two 2025 studies report 11-32% accuracy loss on MATH from 4-bit weight quantization, with hard tasks degrading about 4x more than easy ones. RL-trained reasoning models lose 14%+; small models (Llama-3.2-1B) lose 32%+; 4-bit on long-context contexts can drop up to 59%. Crucial scope: these numbers are for full-model weight quantization — FP8 KV-cache-only quantization still reports <1% loss on standard long-context benchmarks.",
    keyPoints: [
      "4-bit full-model weights: 11-32% MATH loss, 4x worse on hard tasks",
      "Small models and long-context reasoning are disproportionately hurt",
      "FP8 KV-cache only: <1% loss — a different story",
      "Practical: quantize KV-cache aggressively before weights for reasoning workloads",
      "Sources: arXiv 2501.03035, arXiv 2504.04823",
    ],
    exerciseType: "mcq",
    choices: [
      "4-bit weight quantization uniformly loses ~1% accuracy across all task types",
      "4-bit full-model weight quantization loses 11-32% on reasoning benchmarks and ~4x more on hard tasks; FP8 KV-cache-only is a separate story with <1% loss",
      "Quantization has no measurable effect on reasoning — it's purely a memory optimisation",
      "Quantization only matters for small models; at 70B+ it's free",
    ],
    correctAnswer: 1,
  },

  {
    id: 7036,
    category: "Serving",
    front: "If you had to pick one fact about LLM serving to understand everything else, what would it be?",
    back: "Prefill is compute-bound; decode is memory-bandwidth-bound. The entire modern serving stack — continuous batching, PagedAttention, chunked prefill, prefill-decode disaggregation, speculative decoding, KV quantization — is navigating the consequences of that arithmetic-intensity mismatch on one piece of hardware.",
    keyPoints: [
      "Prefill: 200-400 FLOP/byte, compute-bound",
      "Decode: 1-2 FLOP/byte, memory-bandwidth-bound",
      "Every serving optimisation derives from this one mismatch",
      "If you understand this, the rest of the stack makes structural sense",
    ],
  },

  {
    id: 7037,
    category: "Serving",
    front: "You have a reasoning-critical workload on an H100 and need to cut memory. Which quantization order is the evidence-backed default?",
    back: "FP8 (or NVFP4) KV-cache first, weights later. KV-cache-only quantization preserves accuracy (<1% loss on long-context reasoning benchmarks), while 4-bit weight quantization is where the 11-32% MATH losses and 4x hard-task degradation show up. Benchmark on your actual task distribution before quantizing weights on a reasoning workload.",
    keyPoints: [
      "First: FP8/NVFP4 KV-cache — large memory win, minimal accuracy loss",
      "Second: FP8 weights — moderate risk, measurable on reasoning",
      "Last resort: 4-bit full-model weights — expect regressions on hard tasks",
      "Always eval on your task distribution, not generic benchmarks",
    ],
  },
];
