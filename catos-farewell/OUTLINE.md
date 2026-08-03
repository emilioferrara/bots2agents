# CATOS farewell talk — run sheet

**Deck:** `CATOS_Farewell_Ferrara_Aug2026.pptx` (31 slides, 29 presented + 2 backup)
**Audience:** CATOS / IHPC colleagues and leadership
**Target:** ~35 minutes speaking, then Q&A
**Regenerate:** `node build_deck.js` — then `python3 qa_geometry.py` and
`python3 ~/.claude/skills/pptx/scripts/office/validate.py CATOS_Farewell_Ferrara_Aug2026.pptx`

Speaker notes are embedded in the deck itself (presenter view). This file is the
timing plan and the source trail.

## Timing

| Slides | Section | Minutes |
|---|---|---|
| 1–2 | Title and the dedication to Dr. Yinping Yang | 2 |
| 3 | Roadmap | 1 |
| 4–5 | Part 1 — the brief, and what the year produced | 4 |
| 6–9 | Part 2 — the dataset, the F000 actor-less constraint, vocabulary discipline | 6 |
| 10–18 | Part 3 — the five findings | 12 |
| 19–22 | Part 4 — GE2025 end to end, including the error the pipeline caught | 5 |
| 23 | The preprint — a taste only | 2 |
| 24–27 | Part 5 — lessons, and the funding roadmap | 5 |
| 28–29 | What I take with me, and thank you | 3 |
| 30–31 | Backup — numbers and limitations, for Q&A | — |

Running total ≈ 40 minutes at a relaxed pace, ≈ 33 if brisk. The compressible
sections are Part 3 (drop slide 16, the inversion, if running long) and slide 23.

## The five findings, and where each lives in the report

1. **Coordination is real, and every count is a floor** — Ch. 4, with the
   injection sensitivity curve from Ch. 3 and §15.2.
2. **The dominant harm is commercial, not political** — Ch. 6 (harm census,
   precision-corrected floors) and Ch. 5 (domain infrastructure).
3. **Safety systems can't see the main harm** — Ch. 7 (RQ-D) and §15.5.
4. **Xenophobia is pervasive, not concentrated** — Ch. 6 base rates and §15.4.
5. **A single year can invert the truth** — Ch. 10–13, consolidated at §15.7 and
   §16.2. This is the spine.

## Numbers on the slides, and their sources

All from *The Singapore Online Information Environment* (technical report,
August 2026) unless noted.

- Corpus: 154,284,618 items; Facebook 129,506,705 / Reddit 16,487,473 /
  YouTube 8,290,440; 267 spaces; 11,959,097 URLs; 105,022 domains — §1.2, §2.
- Coordination funnel: 858,728 clusters → 50,124 surviving the within-day
  permutation null (57.6% of 86,955 tested) → 44,214 spanning 3+ spaces — §4.3–4.5.
- Detector recall under rewording: 0.500 / 0.375 / 0.067 / 0.011 — Table 15.A.
- Scam: 769,601 raw cue-hits × 0.2083 gold precision ≈ 160,307 floor;
  enrichment 5.6× — §6, §15.3.
- Xenophobia: 295,048 raw cue-hits × 0.8696 ≈ 256,573 floor; cue precision 87.0%
  against a ~61.7% base rate, so enrichment only ~1.4× — §15.3–15.4.
- Provider toxicity: scam-cue mean 0.1522 vs corpus mean 0.1625; Reddit scored
  (34,792,040 items), Facebook unscored (129,506,705) — Ch. 7 RQ-D, §15.5.
- Domain lifespan: 91.0-day median for flagged disposable domains vs 1,865.0 for
  persistent; DGA synchrony 55 of 70 at q < 0.05 (78.6%) — Ch. 5, §4.6.
- Longitudinal flips: funnel lift 15.8 (2020) → 0.19 (2025); Facebook-led → parity
  on cross-platform URL leadership — §15.7.
- April 2025: coordination share mean 4.5%, raw peak 22.0%; largest contributing
  cluster 13,014 items, single-space Reddit AutoModerator boilerplate — §10.3–10.4, §13.3.
- GE2025 stance v2: anti-incumbent 125 clusters / 7,416 items vs pro-incumbent
  53 / 3,886 — roughly 2.4:1 by cluster, 1.9:1 by item. v1 validation found 16 of
  42 anti-opposition clusters (38%) mislabelled at 0.98 mean confidence — Ch. 14.
- Hate audit: 8,561 candidates adjudicated, 2,190 confirmed hostile
  (English 26.0%, Chinese 27.1%, Indonesian 21.3%) — Ch. 9 and arXiv:2606.21996.

## Questions to expect

- **Can we release the corpus?** CATOS-internal; the decision sits above me. Worth
  a real answer — Roy Lee (SUTD/UBC) asked directly, and there is collaboration
  interest attached to it.
- **Can you name who did this?** No. Structural, not cautious — slide 8 explains why.
- **Is the anti-incumbent skew evidence of interference?** No. Slide 22, right column.
- **Why not just use the toxicity scores we already have?** Slide 15.
- **What would you do with another year?** Slide 27, in order of leverage.
