# CATOS farewell talk — run sheet

**Deck:** `CATOS_Farewell_Ferrara_Aug2026.pptx` — 40 slides (37 presented + 3 backup), ~38 min
**Audience:** CATOS / IHPC colleagues and leadership
**Built to:** `house_style.md`, measured from the IMDA "From Bots to Agents" deck

```
node build_deck.js                 # regenerate
python3 qa_geometry.py             # text overflow, overlap, panel collisions
python3 analyze_reference.py CATOS_Farewell_Ferrara_Aug2026.pptx   # style conformance
python3 ~/.claude/skills/pptx/scripts/office/validate.py CATOS_Farewell_Ferrara_Aug2026.pptx
soffice --headless --convert-to pdf CATOS_Farewell_Ferrara_Aug2026.pptx   # visual review
```

**Rendering prerequisites.** A bare container has only `libreoffice-core`, which has no
import filter for any document — every conversion fails with "source file could not be
loaded". And without Carlito, Calibri falls back to DejaVu Sans, which is ~30% wider, so
the PDF shows wrapping that will not happen in PowerPoint. Install both before trusting
a render:

```
apt-get update && apt-get install -y libreoffice-impress fonts-crosextra-carlito
```

Speaker notes are on every slide. This file is the timing plan and the source trail.

## Timing

| Slides | Section | Min |
|---|---|---|
| 1–3 | Title, dedication to Dr. Yinping Yang, the arc | 3 |
| 4–6 | **01** The brief · four questions, what the year produced | 5 |
| 7–9 | Collaborations — Vishakha Lall (ARES), Gerard Yeo (2 slides) | 4 |
| 10–13 | **02** The corpus · 154M items, the F000 constraint, vocabulary | 6 |
| 14–22 | **03** Five findings | 12 |
| 23–26 | **04** GE2025 end to end, including the caught error | 6 |
| 27–28 | **05** The preprint, briefly | 2 |
| 29–36 | **06** Lessons, funding roadmap, three takeaways | 8 |
| 37 | Thank you | 1 |
| 38–40 | Backup — corpus, harm, limitations | — |

Compressible if running long: drop 20 (the inversion) and 28 (the preprint).

## The two collaboration slides

Both are the colleague's work; say so out loud. Sourced from meeting records, not from
a written report — check the numbers with each of them before presenting.

**Vishakha Lall (ARES) — slide 7.** Models score countries on governance indicators
(transparency, corruption, rule of law) against the US News soft-power index, top 90
countries. Conditions: no context, as a US citizen, as a China citizen, asked in
Chinese. Claude pulls scores down, OpenAI pulls them up, DeepSeek overestimates and
warms to Asian countries under a China persona. Latin America penalty under both
citizen framings; Mexico correct in one model, not others. Error measured as
cross-entropy with ordinal and directional components (~10% overall). My contributions:
plotting context minus no-context to separate induced shift from standing bias, a
per-country ranking for systematic offenders, finer regions than continents, and
country-persona experiments (Singapore, in its languages) as the next step.
Repo: `vishakha-astar/llm-bias`. Meeting again Aug 3.

**Gerard Yeo — slides 8–9.** *Correct Until Challenged: How Authority and Provenance
Cues Destabilize LLM Truth Judgments*, Yeo & Ferrara — you are second author. A
benchmark for **conversational epistemic robustness**: 9,600 five-turn conversations,
48,000 evaluated turns, 200 claims (100 FEVER encyclopaedic, 100 SciFact scientific),
six models (Qwen3.5-9B, Qwen3-235B, GPT-5.5, GLM-5, DeepSeek V3.2, Mistral Large 3).
Turn 1 poses the claim; turn 2 introduces a cue; turn 3 reinforces it; turn 4 challenges
("Are you sure?"); turn 5 asks for final reconsideration. The user never supplies
evidence — only its appearance — so this measures deference to authority, not updating.

Headline results, all from the paper:

- **Scientific claims break first.** Every model ends SciFact lower than it started;
  five lose more than 18 points. Mistral Large 3 falls 64.9 → 37.4, DeepSeek V3.2
  59.9 → 34.0. On FEVER only Qwen3.5-9B holds (78.0 → 79.5).
- **Authority cues do the damage, emotion does not.** Worst-case neutral-adjusted loss:
  identity 53.0 points (FEVER) and 61.7 (SciFact), both Mistral; provenance 41.0 and
  54.0, both DeepSeek; emotional framing only 5.7 and 9.7.
- **Damage exceeds repair.** Correct→incorrect reaches 32.6%; incorrect→correct never
  exceeds 6.3%.
- **Most of it lands at turn 2**, immediately on cue introduction.
- **Two failure pathways.** DeepSeek and Mistral erode to uncertainty first (+46.3
  points correct→uncertain); GPT-5.5 and Qwen3-235B reverse directly (+18.0 points
  correct→incorrect).
- **Authority-driven speculative reconciliation.** Told only that a source disagrees,
  GPT-5.5 abandoned a correct answer on Rushdie's 1981 Booker Prize and invented an
  award-timing convention to justify it. The model did not merely cave; it manufactured
  a reason to.

Status: under submission, ARR August. Follow-up owed: talk to Raj about continuing the
collaboration.

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

Slides 8–9 come from the paper itself and are reliable. **Slide 7 (Vishakha) still
comes from a meeting record, not a written report** — confirm those figures with her
before presenting.

## Questions to expect

- **Can we release the corpus?** CATOS-internal; the decision sits above me. Roy Lee
  (SUTD/UBC) has asked directly and there is collaboration interest attached.
- **Can you name who did this?** No — structural, not cautious. Slide 11.
- **Is the anti-incumbent skew interference?** No. Slide 26, right-hand card.
- **Why not use the toxicity scores we already have?** Slide 18.
- **What would you do with another year?** Slide 33, in order of leverage.

## Known gap

The reference deck carries a published figure on 76% of its slides. This one has no
photographs or paper figures to embed — 10 native charts and 18 shape-built diagrams
carry 73% of slides instead. If you want it closer to the reference, the highest-value
additions are the GE2025 weekly timeline and the coordination-share-by-month series;
both need data I did not have in hand.
