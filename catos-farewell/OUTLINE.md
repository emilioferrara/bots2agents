# CATOS farewell talk — run sheet

**Deck:** `CATOS_Farewell_Ferrara_Aug2026.pptx` — 37 slides (34 presented + 3 backup), ~35 min
**Audience:** CATOS / IHPC colleagues and leadership
**Built to:** `house_style.md`, measured from the IMDA "From Bots to Agents" deck

```
node build_deck.js                 # regenerate
python3 qa_geometry.py             # text overflow + overlap (LibreOffice can't render here)
python3 analyze_reference.py CATOS_Farewell_Ferrara_Aug2026.pptx   # style conformance
python3 ~/.claude/skills/pptx/scripts/office/validate.py CATOS_Farewell_Ferrara_Aug2026.pptx
```

Speaker notes are on every slide. This file is the timing plan and the source trail.

## Timing

| Slides | Section | Min |
|---|---|---|
| 1–3 | Title, dedication to Dr. Yinping Yang, the arc | 3 |
| 4–6 | **01** The brief · four questions, what the year produced | 5 |
| 7–10 | **02** The corpus · 154M items, the F000 constraint, vocabulary | 6 |
| 11–19 | **03** Five findings | 12 |
| 20–23 | **04** GE2025 end to end, including the caught error | 6 |
| 24–25 | **05** The preprint, briefly | 2 |
| 26–33 | **06** Lessons, funding roadmap, three takeaways | 8 |
| 34 | Thank you | 1 |
| 35–37 | Backup — corpus, harm, limitations | — |

Compressible if running long: drop 17 (the inversion) and 25 (the preprint).

## Source trail

All from *The Singapore Online Information Environment* (technical report, August
2026) unless noted.

- Corpus: 154,284,618 items; FB 129,506,705 / Reddit 16,487,473 / YT 8,290,440;
  267 spaces; 11,959,097 URLs; 105,022 domains — §1.2, §2.
- Funnel: 858,728 clusters → 50,124 surviving the null (57.6% of 86,955 tested)
  → 44,214 spanning 3+ spaces; largest cluster 239,336 — §4.3–4.5.
- Recall under rewording: 0.500 / 0.375 / 0.067 / 0.011 — Table 15.A.
- Scam: 769,601 cue-hits × 0.2083 ≈ 160,307 floor; enrichment 5.6× — §6, §15.3.
- Xenophobia: 295,048 × 0.8696 ≈ 256,573; 87.0% precision on a ~61.7% base rate,
  so enrichment ~1.4× — §15.3–15.4.
- Toxicity: scam 0.1522 vs corpus 0.1625; Reddit scored 34,792,040, Facebook
  129,506,705 unscored — Ch. 7 (RQ-D), §15.5.
- Domains: 91.0-day vs 1,865.0-day median; DGA synchrony 55/70 (78.6%) — Ch. 5, §4.6.
- Longitudinal flips: funnel lift 15.8 (2020) → 0.19 (2025); FB-led → parity — §15.7.
- April 2025: 4.5% mean share, 22.0% raw peak; largest contributor 13,014 items,
  single-space Reddit AutoModerator — §10.3–10.4, §13.3.
- GE2025 v2: anti-incumbent 125 clusters / 7,416 items vs pro-incumbent 53 / 3,886.
  v1 validation: 16 of 42 (38%) mislabelled at 0.98 mean confidence — Ch. 14.
- Hate audit: 8,561 adjudicated, 2,190 confirmed hostile (EN 26.0%, ZH 27.1%,
  ID 21.3%) — Ch. 9 and arXiv:2606.21996.

## Questions to expect

- **Can we release the corpus?** CATOS-internal; the decision sits above me. Roy Lee
  (SUTD/UBC) has asked directly and there is collaboration interest attached.
- **Can you name who did this?** No — structural, not cautious. Slide 9.
- **Is the anti-incumbent skew interference?** No. Slide 23, right-hand card.
- **Why not use the toxicity scores we already have?** Slide 16.
- **What would you do with another year?** Slide 30, in order of leverage.

## Known gap

The reference deck carries a published figure on 76% of its slides. This one has no
photographs or paper figures to embed — 10 native charts and 18 shape-built diagrams
carry 73% of slides instead. If you want it closer to the reference, the highest-value
additions are the GE2025 weekly timeline and the coordination-share-by-month series;
both need data I did not have in hand.
