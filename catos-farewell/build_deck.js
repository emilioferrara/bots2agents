/**
 * CATOS farewell presentation — Emilio Ferrara, A*STAR IHPC, August 2026.
 *
 * Regenerate with:  node build_deck.js
 * Every figure on these slides is traceable to the CATOS technical report
 * ("The Singapore Online Information Environment", August 2026) or to the
 * cross-lingual hate audit preprint (arXiv:2606.21996).
 */

const pptxgen = require("pptxgenjs");

// ---------------------------------------------------------------- palette
const INK = "17161A";      // near-black, dominant on dark slides
const INK_SOFT = "55525C"; // muted body text on light
const FAINT = "8A8691";    // captions
const RULE = "E4E1DE";     // hairlines and card borders
const WHITE = "FFFFFF";
const ACCENT = "C4432A";   // burnt red — carried over from the research index
const ACCENT_SOFT = "FBF0ED";
const TEAL = "27607A";     // secondary data series
const TEAL_SOFT = "EAF0F3";

const H_FONT = "Cambria";
const B_FONT = "Calibri";

const W = 13.333;
const H = 7.5;
const M = 0.7; // page margin

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Emilio Ferrara";
pres.company = "A*STAR — Institute of High Performance Computing";
pres.title = "What the Data Says, and What Singapore Taught Me";

// ---------------------------------------------------------------- helpers

let slideNo = 0;

function lightSlide() {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  slideNo += 1;
  return s;
}

function darkSlide() {
  const s = pres.addSlide();
  s.background = { color: INK };
  slideNo += 1;
  return s;
}

/** Slide title on a light slide, plus optional kicker above it. */
function title(s, text, opts = {}) {
  const y = opts.kicker ? 0.95 : 0.62;
  if (opts.kicker) {
    s.addText(opts.kicker.toUpperCase(), {
      x: M, y: 0.5, w: W - 2 * M, h: 0.3,
      fontFace: B_FONT, fontSize: 11, bold: true, charSpacing: 2,
      color: ACCENT, margin: 0,
    });
  }
  s.addText(text, {
    x: M, y, w: opts.w || W - 2 * M, h: opts.h || 0.7,
    fontFace: H_FONT, fontSize: opts.size || 34, bold: true,
    color: opts.color || INK, margin: 0, valign: "top",
  });
}

/** Small page footer — appears on content slides only. */
function footer(s, note) {
  s.addText(note || "CATOS · A*STAR IHPC · August 2026", {
    x: M, y: H - 0.52, w: W - 2 * M - 0.6, h: 0.3,
    fontFace: B_FONT, fontSize: 9, color: FAINT, margin: 0,
  });
  s.addText(String(slideNo), {
    x: W - M - 0.5, y: H - 0.52, w: 0.5, h: 0.3,
    fontFace: B_FONT, fontSize: 9, color: FAINT, align: "right", margin: 0,
  });
}

/** The deck's one repeated motif: a numbered disc. */
function disc(s, n, x, y, opts = {}) {
  const d = opts.d || 0.52;
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d,
    fill: { color: opts.fill || ACCENT },
    line: { color: opts.fill || ACCENT, width: 0 },
  });
  s.addText(String(n), {
    x, y, w: d, h: d,
    fontFace: B_FONT, fontSize: opts.size || 15, bold: true,
    color: opts.color || WHITE, align: "center", valign: "middle", margin: 0,
  });
}

/** A soft content card. Tint + hairline, never an edge stripe. */
function card(s, x, y, w, h, opts = {}) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: opts.fill || "FAF9F8" },
    line: { color: opts.line || RULE, width: 1 },
  });
}

/** Big number + label, the workhorse for findings. */
function stat(s, x, y, w, value, label, opts = {}) {
  s.addText(value, {
    x, y, w, h: 0.85,
    fontFace: H_FONT, fontSize: opts.size || 42, bold: true,
    color: opts.color || ACCENT, margin: 0, valign: "middle",
  });
  s.addText(label, {
    x, y: y + 0.82, w, h: opts.labelH || 0.7,
    fontFace: B_FONT, fontSize: 12, color: INK_SOFT, margin: 0, valign: "top",
  });
}

function bullets(s, items, x, y, w, h, opts = {}) {
  s.addText(
    items.map((t, i) => ({
      text: t,
      options: {
        bullet: { indent: 18 },
        breakLine: i !== items.length - 1,
        paraSpaceAfter: opts.gap === undefined ? 10 : opts.gap,
      },
    })),
    {
      x, y, w, h,
      fontFace: B_FONT, fontSize: opts.size || 15,
      color: opts.color || INK_SOFT, margin: 0, valign: "top",
    }
  );
}

/** Section divider. */
function divider(part, heading, blurb) {
  const s = darkSlide();
  s.addText(`PART ${part}`, {
    x: M, y: 2.5, w: 6, h: 0.35,
    fontFace: B_FONT, fontSize: 12, bold: true, charSpacing: 3,
    color: ACCENT, margin: 0,
  });
  s.addText(heading, {
    x: M, y: 2.95, w: 8.6, h: 1.5,
    fontFace: H_FONT, fontSize: 42, bold: true, color: WHITE, margin: 0,
  });
  s.addText(blurb, {
    x: M, y: 4.5, w: 7.6, h: 1.0,
    fontFace: B_FONT, fontSize: 15, color: "B9B5BF", margin: 0,
  });
  disc(s, part, W - M - 1.9, 2.9, { d: 1.4, size: 44, fill: "241F26", color: ACCENT });
  return s;
}

// ================================================================ 1. TITLE
{
  const s = darkSlide();
  s.addText("A*STAR · INSTITUTE OF HIGH PERFORMANCE COMPUTING", {
    x: M, y: 1.35, w: 10, h: 0.3,
    fontFace: B_FONT, fontSize: 11, bold: true, charSpacing: 2,
    color: FAINT, margin: 0,
  });
  s.addText("What the Data Says,\nand What Singapore Taught Me", {
    x: M, y: 1.9, w: 11.6, h: 2.2,
    fontFace: H_FONT, fontSize: 46, bold: true, color: WHITE,
    lineSpacing: 54, margin: 0,
  });
  s.addText(
    "Closing remarks on a year with CATOS: 154 million posts, six and a half years, " +
    "three platforms, and the findings I trust — with the reasons I trust them.",
    { x: M, y: 4.3, w: 8.9, h: 1.0, fontFace: B_FONT, fontSize: 16, color: "B9B5BF", margin: 0 }
  );
  s.addText(
    [
      { text: "Emilio Ferrara", options: { bold: true, color: WHITE, breakLine: true } },
      { text: "Professor of Computer Science, University of Southern California", options: { color: FAINT, breakLine: true } },
      { text: "Visiting Scientist, CATOS · A*STAR IHPC   ·   August 2026", options: { color: FAINT } },
    ],
    { x: M, y: 5.6, w: 9, h: 1.1, fontFace: B_FONT, fontSize: 13, margin: 0 }
  );
  s.addNotes(
    "Open warmly. This is a farewell, not a status report — but the way to say thank you " +
    "to a research centre is to tell them honestly what the work found. " +
    "Frame the hour: ~35 minutes, five parts, and I'll leave time for questions. " +
    "Say up front: every number here is a floor, and I'll explain why that's a feature."
  );
}

// ============================================================ 2. DEDICATION
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.rect, {
    x: M, y: 2.15, w: 0.045, h: 2.4, fill: { color: ACCENT }, line: { width: 0 },
  });
  s.addText(
    "This work was commissioned by Dr. Yinping Yang\nin her capacity as CATOS Director.",
    { x: M + 0.45, y: 2.15, w: 9.4, h: 1.2, fontFace: H_FONT, fontSize: 26, bold: true, color: WHITE, lineSpacing: 34, margin: 0 }
  );
  s.addText(
    "The report is dedicated to her memory, with the hope that it captured some of her vision " +
    "and her commitment to understanding online harm in the Singapore information ecosystem.\n\n" +
    "She asked the questions. What follows is my attempt at answers.",
    { x: M + 0.45, y: 3.5, w: 8.9, h: 1.6, fontFace: B_FONT, fontSize: 16, color: "B9B5BF", lineSpacing: 24, margin: 0 }
  );
  s.addNotes(
    "Pause here. Say this slowly and simply — do not rush past it. " +
    "Yinping commissioned the study; the dedication is printed at the front of the report. " +
    "Then move on without ceremony; the rest of the talk is the tribute."
  );
}

// =============================================================== 3. ROADMAP
{
  const s = lightSlide();
  title(s, "Where we're going", { kicker: "Roadmap" });

  const rows = [
    ["The brief, and what came of it", "What Yinping asked for, and the year's deliverables"],
    ["The data, and its one binding constraint", "154M items — and no account identities, ever"],
    ["Five findings I'd defend anywhere", "Coordination, scams, the safety blind spot, xenophobia, time"],
    ["One worked example, end to end", "GE2025 — including the mistake the pipeline caught"],
    ["Lessons, and what I'd fund next", "The part that outlives the dataset"],
  ];
  let y = 1.95;
  rows.forEach((r, i) => {
    disc(s, i + 1, M, y + 0.06, { d: 0.46, size: 14 });
    s.addText(r[0], {
      x: M + 0.72, y, w: 6.2, h: 0.34,
      fontFace: B_FONT, fontSize: 16, bold: true, color: INK, margin: 0,
    });
    s.addText(r[1], {
      x: M + 0.72, y: y + 0.33, w: 8.5, h: 0.34,
      fontFace: B_FONT, fontSize: 13, color: FAINT, margin: 0,
    });
    y += 0.92;
  });

  card(s, 9.9, 1.9, 2.75, 3.35, { fill: ACCENT_SOFT, line: ACCENT_SOFT });
  s.addText("35\nminutes", {
    x: 10.15, y: 2.15, w: 2.25, h: 1.2,
    fontFace: H_FONT, fontSize: 30, bold: true, color: ACCENT, lineSpacing: 32, margin: 0,
  });
  s.addText(
    "Then questions — including the awkward ones. I have answers for most of them, " +
    "and honest 'we can't know that' for the rest.",
    { x: 10.15, y: 3.5, w: 2.25, h: 1.6, fontFace: B_FONT, fontSize: 12, color: INK_SOFT, margin: 0 }
  );
  footer(s);
  s.addNotes("Keep this to 45 seconds. Signal that Part 5 — lessons — is the part that matters most to them after I leave.");
}

// ============================================================= 4. THE BRIEF
{
  const s = lightSlide();
  title(s, "The brief", { kicker: "Part 1 · How this started" });

  s.addText(
    "Take the CATOS Dataset — the time-extended successor to a corpus that covered only 2025 — " +
    "and say what is actually in Singapore's online information environment. Conservatively. " +
    "With every claim paired to the limitation that constrains it.",
    { x: M, y: 1.75, w: 7.3, h: 1.5, fontFace: B_FONT, fontSize: 16, color: INK_SOFT, lineSpacing: 24, margin: 0 }
  );

  const qs = [
    "How much coordinated manipulation is there, and what infrastructure supports it?",
    "What harms are present, and how large are they?",
    "How has the picture changed over six and a half years?",
    "What does a complete worked example look like, start to finish?",
  ];
  s.addText("FOUR RESEARCH QUESTIONS", {
    x: M, y: 3.35, w: 7.3, h: 0.3,
    fontFace: B_FONT, fontSize: 11, bold: true, charSpacing: 2, color: ACCENT, margin: 0,
  });
  bullets(s, qs, M, 3.75, 7.3, 2.0, { size: 15 });

  card(s, 8.6, 1.72, 4.05, 4.05);
  s.addText("The premise I was asked to test", {
    x: 8.95, y: 2.0, w: 3.4, h: 0.45,
    fontFace: B_FONT, fontSize: 14, bold: true, color: INK, margin: 0,
  });
  s.addText(
    "That extending the corpus in time was not a quantitative convenience but a qualitative one.\n\n" +
    "It was. Three conclusions a 2025-only study would have supported are overturned by the full span.\n\n" +
    "That finding is the spine of the report.",
    { x: 8.95, y: 2.5, w: 3.4, h: 3.0, fontFace: B_FONT, fontSize: 13, color: INK_SOFT, lineSpacing: 20, margin: 0 }
  );
  footer(s);
  s.addNotes(
    "The brief was deliberately open. The one thing I committed to was the conservative posture: " +
    "floors not prevalence, repetition not attribution. That posture is what makes the positive findings usable."
  );
}

// ======================================================== 5. THE DELIVERABLES
{
  const s = lightSlide();
  title(s, "What the year produced", { kicker: "Part 1 · The record" });

  const items = [
    ["Technical report", "~150 pages, 17 chapters, 6 appendices. Delivered and handed over.", ACCENT],
    ["Preprint", "Cross-lingual audit of online hate in multicultural Singapore. arXiv:2606.21996.", TEAL],
    ["OTS Grant Call 3", "Revised the call to open an AI-safety frontier: agentic systems, companions, multimodal.", ACCENT],
    ["Reproducibility manifest", "Corpus, compute, model configs, finding codes — so this can be re-run without me.", TEAL],
    ["Talks and briefings", "OTS Forum & Content Authenticity Summit, DSO, DSTA, MDDI, Lorong AI.", ACCENT],
    ["Network handover", "MDDI, IMDA, SUTD, MLCommons/DeepMind introductions left open and warm.", TEAL],
  ];
  const cw = 3.85, ch = 1.55;
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (cw + 0.28);
    const y = 1.85 + row * (ch + 0.3);
    card(s, x, y, cw, ch);
    s.addShape(pres.ShapeType.ellipse, {
      x: x + 0.28, y: y + 0.28, w: 0.22, h: 0.22,
      fill: { color: it[2] }, line: { width: 0 },
    });
    s.addText(it[0], {
      x: x + 0.62, y: y + 0.2, w: cw - 0.9, h: 0.38,
      fontFace: B_FONT, fontSize: 15, bold: true, color: INK, margin: 0,
    });
    s.addText(it[1], {
      x: x + 0.28, y: y + 0.65, w: cw - 0.56, h: 0.8,
      fontFace: B_FONT, fontSize: 12, color: INK_SOFT, margin: 0,
    });
  });

  s.addText(
    "The report and the preprint are the deliverables. The grant call and the introductions are the part " +
    "that keeps working after the contract ends.",
    { x: M, y: 5.55, w: 11.9, h: 0.5, fontFace: B_FONT, fontSize: 13, italic: true, color: FAINT, margin: 0 }
  );
  footer(s);
  s.addNotes(
    "Don't read the grid — let them read it. Spend the time on the last line: " +
    "the durable output of a visiting appointment is usually the connections, not the PDF."
  );
}

// ============================================================ 6. DIVIDER II
divider(2, "The data, and\nits one constraint", "What 154 million items can tell you — and the thing they can never tell you.")
  .addNotes("Transition: everything in Part 3 depends on understanding this constraint first.");

// ========================================================== 7. THE DATASET
{
  const s = lightSlide();
  title(s, "The CATOS Dataset at a glance", { kicker: "Part 2 · Provenance" });

  stat(s, M, 1.75, 2.6, "154.3M", "posts and comments\nJan 2020 – Jun 2026");
  stat(s, M + 2.75, 1.75, 2.6, "267", "distinct spaces\npages, subreddits, channels", { color: TEAL });
  stat(s, M + 5.5, 1.75, 2.6, "105,022", "domains behind\n11.96M URLs", { size: 36 });

  s.addChart(
    pres.ChartType.bar,
    [{ name: "Items (millions)", labels: ["Facebook", "Reddit", "YouTube"], values: [129.5, 16.5, 8.3] }],
    {
      x: 8.35, y: 1.6, w: 4.3, h: 3.0,
      barDir: "bar", barGrapicStyle: 1,
      showTitle: true, title: "Corpus composition (millions of items)",
      titleFontFace: B_FONT, titleFontSize: 12, titleColor: INK,
      chartColors: [ACCENT, ACCENT, ACCENT],
      showValue: true, dataLabelPosition: "outEnd",
      dataLabelFontFace: B_FONT, dataLabelFontSize: 11, dataLabelColor: INK_SOFT,
      catAxisLabelColor: INK_SOFT, catAxisLabelFontFace: B_FONT, catAxisLabelFontSize: 11,
      valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
      showLegend: false, valAxisMaxVal: 155,
    }
  );

  s.addText(
    [
      { text: "84%", options: { bold: true, color: ACCENT } },
      { text: " of the corpus is Facebook — which matters enormously in a moment, because it is also the platform with no provider safety score at all.", options: { color: INK_SOFT } },
    ],
    { x: M, y: 4.2, w: 7.3, h: 0.9, fontFace: B_FONT, fontSize: 15, margin: 0 }
  );
  s.addText(
    "One national conversation, running simultaneously in English, Malay, Mandarin and other Chinese " +
    "varieties, and Tamil — across three platforms and into the messaging apps people are funnelled toward.",
    { x: M, y: 5.15, w: 11.9, h: 0.85, fontFace: B_FONT, fontSize: 14, color: INK_SOFT, margin: 0 }
  );
  footer(s);
  s.addNotes(
    "Flag the Facebook share now and call back to it on the safety blind-spot slide. " +
    "The linguistic diversity is the reason this environment is worth studying and the reason it is hard to measure."
  );
}

// ============================================================ 8. F000
{
  const s = lightSlide();
  title(s, "The constraint that shaped everything", { kicker: "Part 2 · F000, the actor-less corpus" });

  s.addText("The dataset carries no usable account identities. None.", {
    x: M, y: 1.72, w: 11.9, h: 0.45,
    fontFace: B_FONT, fontSize: 18, bold: true, color: ACCENT, margin: 0,
  });

  card(s, M, 2.4, 5.75, 2.85, { fill: TEAL_SOFT, line: TEAL_SOFT });
  s.addText("What that lets us see", {
    x: M + 0.35, y: 2.62, w: 5.05, h: 0.35,
    fontFace: B_FONT, fontSize: 15, bold: true, color: TEAL, margin: 0,
  });
  bullets(s, [
    "What was said — the content itself",
    "When it was said — to the second",
    "Where it appeared — which page, subreddit, channel",
    "What it linked to — URLs, domains, infrastructure",
  ], M + 0.35, 3.05, 5.05, 2.0, { size: 13.5, color: INK });

  card(s, M + 6.15, 2.4, 5.75, 2.85, { fill: ACCENT_SOFT, line: ACCENT_SOFT });
  s.addText("What it puts permanently out of reach", {
    x: M + 6.5, y: 2.62, w: 5.05, h: 0.35,
    fontFace: B_FONT, fontSize: 15, bold: true, color: ACCENT, margin: 0,
  });
  bullets(s, [
    "Who said it — no accounts, no operators",
    "Sockpuppet detection and bot-network mapping",
    "Attribution to any actor, group, or state",
    "Whether repetition was authentic or inauthentic",
  ], M + 6.5, 3.05, 5.05, 2.0, { size: 13.5, color: INK });

  s.addText(
    "The entire account-level toolkit that platform-integrity work usually centres on is out of scope by construction. " +
    "So the study was rebuilt around content, timing, and infrastructure — the three things the data can actually carry.",
    { x: M, y: 5.5, w: 11.9, h: 0.8, fontFace: B_FONT, fontSize: 14, color: INK_SOFT, margin: 0 }
  );
  footer(s);
  s.addNotes(
    "This is the single most important slide for interpreting everything after it. " +
    "Be blunt: I could not have done bot detection here if I had wanted to. " +
    "The constraint forced a better-disciplined study than I would otherwise have written."
  );
}

// ========================================================= 9. THE VOCABULARY
{
  const s = lightSlide();
  title(s, "So when this report says 'coordinated'…", { kicker: "Part 2 · Vocabulary discipline" });

  card(s, M, 1.72, 11.9, 1.15, { fill: INK, line: INK });
  s.addText(
    "…it means one thing only: the same text, verbatim, reposted across several distinct communities, " +
    "in a temporal pattern tighter than chance predicts.",
    { x: M + 0.4, y: 1.86, w: 11.1, h: 0.9, fontFace: B_FONT, fontSize: 16, color: WHITE, valign: "middle", margin: 0 }
  );

  s.addText("Read 'coordinated' as 'verbatim-repeated across spaces' — and no more. It is equally consistent with:", {
    x: M, y: 3.1, w: 11.9, h: 0.4, fontFace: B_FONT, fontSize: 15, color: INK, margin: 0,
  });

  const alts = [
    ["An organised campaign", "The reading people jump to. It is one of four."],
    ["Loosely-organised people", "Many individuals independently favouring the same slogan."],
    ["A single viral post", "Quoted, screenshotted, and re-pasted at scale."],
    ["Ordinary platform mechanics", "Share buttons, cross-posting tools, moderation bots."],
  ];
  const cw = 2.85;
  alts.forEach((a, i) => {
    const x = M + i * (cw + 0.13);
    card(s, x, 3.7, cw, 1.75);
    s.addText(a[0], {
      x: x + 0.25, y: 3.92, w: cw - 0.5, h: 0.6,
      fontFace: B_FONT, fontSize: 14, bold: true, color: i === 0 ? ACCENT : INK, margin: 0,
    });
    s.addText(a[1], {
      x: x + 0.25, y: 4.5, w: cw - 0.5, h: 0.8,
      fontFace: B_FONT, fontSize: 12, color: INK_SOFT, margin: 0,
    });
  });

  s.addText(
    "This report identifies no one as responsible for anything. Crossing that line — even under pressure to " +
    "deliver a more dramatic finding — would forfeit the trust that makes the rest of it useful.",
    { x: M, y: 5.65, w: 11.9, h: 0.8, fontFace: B_FONT, fontSize: 14, italic: true, color: INK_SOFT, margin: 0 }
  );
  footer(s);
  s.addNotes(
    "Say the last line looking at the room. This is the discipline that lets a report like this be handed " +
    "to a ministry without it becoming an accusation. It is also what stops the work being weaponised later."
  );
}

// =========================================================== 10. DIVIDER III
divider(3, "Five findings\nI'd defend anywhere", "Each one paired with the specific test that bounds it. None of them is a headline number.")
  .addNotes("This is the substance section, roughly 12 minutes. Keep moving; the detail is in the report.");

// ================================================= 11. FINDING 1 — the funnel
{
  const s = lightSlide();
  title(s, "Coordination is real, and substantial", { kicker: "Finding 1 · Chapter 4" });

  const steps = [
    ["858,728", "exact-duplicate clusters\n(≥5 items, 6.2% of corpus)", FAINT],
    ["86,955", "large enough to test against\na within-day permutation null", INK_SOFT],
    ["50,124", "survive at q < 0.05\n— 42% of candidates removed", ACCENT],
    ["44,214", "span 3+ distinct spaces\n— the policy-relevant measure", ACCENT],
  ];
  const cw = 2.85;
  steps.forEach((st, i) => {
    const x = M + i * (cw + 0.13);
    card(s, x, 1.85, cw, 2.25, i >= 2 ? { fill: ACCENT_SOFT, line: ACCENT_SOFT } : {});
    s.addText(st[0], {
      x: x + 0.25, y: 2.1, w: cw - 0.5, h: 0.75,
      fontFace: H_FONT, fontSize: 30, bold: true, color: st[2] === FAINT ? INK_SOFT : st[2], margin: 0,
    });
    s.addText(st[1], {
      x: x + 0.25, y: 2.9, w: cw - 0.5, h: 1.0,
      fontFace: B_FONT, fontSize: 12, color: INK_SOFT, margin: 0,
    });
    if (i < 3) {
      s.addText("→", {
        x: x + cw - 0.02, y: 2.6, w: 0.2, h: 0.4,
        fontFace: B_FONT, fontSize: 16, color: FAINT, align: "center", margin: 0,
      });
    }
  });

  s.addText(
    "The permutation null did real work: it removed 42% of naively-flagged clusters. " +
    "Raw duplicate-counting would have overstated coordination by nearly half.",
    { x: M, y: 4.35, w: 7.6, h: 0.8, fontFace: B_FONT, fontSize: 15, color: INK, margin: 0 }
  );

  card(s, 8.6, 4.28, 4.05, 1.55, { fill: INK, line: INK });
  s.addText("Largest single cluster: 239,336 items sharing one verbatim string.", {
    x: 8.9, y: 4.5, w: 3.45, h: 1.1,
    fontFace: B_FONT, fontSize: 13, color: WHITE, valign: "middle", margin: 0,
  });
  footer(s);
  s.addNotes(
    "The funnel is the story: 858K raw → 50K statistically survivable → 44K that actually crossed community " +
    "boundaries. If you remember one number from this slide, remember 42% — that's what the null removed."
  );
}

// ============================================ 12. FINDING 1b — the floor
{
  const s = lightSlide();
  title(s, "…and every count is a floor", { kicker: "Finding 1 · The paraphrase blind spot" });

  s.addText(
    "We injected known coordinated campaigns into the real corpus, then progressively reworded them " +
    "and re-ran the detector. Recall halves immediately and all but vanishes.",
    { x: M, y: 1.7, w: 6.6, h: 0.9, fontFace: B_FONT, fontSize: 15, color: INK_SOFT, margin: 0 }
  );

  s.addChart(
    pres.ChartType.line,
    [{ name: "Detector recall", labels: ["0% (verbatim)", "10% reworded", "20% reworded", "40% reworded"], values: [0.500, 0.375, 0.067, 0.011] }],
    {
      x: M, y: 2.7, w: 6.6, h: 3.0,
      showTitle: true, title: "Recall against progressively reworded injected campaigns",
      titleFontFace: B_FONT, titleFontSize: 12, titleColor: INK,
      chartColors: [ACCENT], lineDataSymbol: "circle", lineDataSymbolSize: 8, lineSize: 3,
      showValue: true, dataLabelPosition: "t", dataLabelFormatCode: "0.000",
      dataLabelFontFace: B_FONT, dataLabelFontSize: 11, dataLabelColor: INK,
      catAxisLabelColor: INK_SOFT, catAxisLabelFontFace: B_FONT, catAxisLabelFontSize: 11,
      valAxisLabelColor: INK_SOFT, valAxisLabelFontFace: B_FONT, valAxisLabelFontSize: 10,
      valAxisMaxVal: 0.6, valGridLine: { color: RULE, size: 1 }, catGridLine: { style: "none" },
      showLegend: false,
    }
  );

  card(s, 7.85, 1.68, 4.8, 4.0, { fill: ACCENT_SOFT, line: ACCENT_SOFT });
  s.addText("Two consequences", {
    x: 8.15, y: 1.9, w: 4.2, h: 0.4,
    fontFace: B_FONT, fontSize: 16, bold: true, color: ACCENT, margin: 0,
  });
  bullets(s, [
    "No coordination count in this report estimates true coordination. Each is a high-precision floor, and the real figure is very likely much larger.",
    "Any comparison across time, platform, or topic compares verbatim floors. A group that paraphrases more looks less coordinated — an artefact of the detector, not a fact about the world.",
  ], 8.15, 2.4, 4.2, 3.1, { size: 13, color: INK, gap: 14 });

  footer(s);
  s.addNotes(
    "This is the slide that makes the report honest. It also converts a limitation into a funding pitch — " +
    "paraphrase-robust detection is the single highest-leverage gap, and I'll come back to it at the end."
  );
}

// =============================================== 13. FINDING 2 — commercial
{
  const s = lightSlide();
  title(s, "The dominant harm is commercial, not political", { kicker: "Finding 2 · Chapter 6" });

  stat(s, M, 1.8, 3.4, "~160,307", "precision-corrected floor\nfor scam content", { size: 36 });
  stat(s, M + 3.6, 1.8, 3.4, "5.6×", "scam enrichment over\nthe corpus base rate", { color: TEAL });
  stat(s, M + 7.2, 1.8, 3.4, "769,601", "raw scam cue-hits before\nprecision correction", { size: 36, color: INK_SOFT });

  s.addText("Scam typology — fake investments, job offers, giveaway impersonation, gambling, recovery scams", {
    x: M, y: 3.55, w: 11.9, h: 0.35, fontFace: B_FONT, fontSize: 14, bold: true, color: INK, margin: 0,
  });
  s.addText(
    "All of it organised around the same shape: a polite, transactional message carrying a link that funnels " +
    "the reader off-platform into a private messaging app, where nothing can be observed at all.",
    { x: M, y: 3.95, w: 11.9, h: 0.7, fontFace: B_FONT, fontSize: 15, color: INK_SOFT, margin: 0 }
  );

  card(s, M, 4.8, 11.9, 1.15, { fill: INK, line: INK });
  s.addText(
    "Politics is what everyone asks about. Fraud is what the data is full of.",
    { x: M + 0.4, y: 4.95, w: 11.1, h: 0.85, fontFace: H_FONT, fontSize: 20, bold: true, color: WHITE, valign: "middle", margin: 0 }
  );
  footer(s);
  s.addNotes(
    "Explain the correction: 769,601 raw cue-hits × 0.208 measured gold-set precision = the ~160K floor. " +
    "I report the corrected floor, never the raw number. Anyone quoting 769,601 is quoting the wrong figure."
  );
}

// ========================================== 14. FINDING 2b — infrastructure
{
  const s = lightSlide();
  title(s, "Two infrastructures, two lifecycles", { kicker: "Finding 2 · Chapter 5" });

  s.addChart(
    pres.ChartType.bar,
    [{ name: "Median observed lifespan (days)", labels: ["Disposable / algorithmically-named", "Persistent domains"], values: [91, 1865] }],
    {
      x: M, y: 1.8, w: 7.2, h: 2.7,
      barDir: "bar",
      showTitle: true, title: "Median domain lifespan (days)",
      titleFontFace: B_FONT, titleFontSize: 12, titleColor: INK,
      chartColors: [ACCENT, TEAL],
      showValue: true, dataLabelPosition: "outEnd",
      dataLabelFontFace: B_FONT, dataLabelFontSize: 12, dataLabelColor: INK,
      catAxisLabelColor: INK_SOFT, catAxisLabelFontFace: B_FONT, catAxisLabelFontSize: 11,
      valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
      showLegend: false, valAxisMaxVal: 2100, varyColors: true,
    }
  );

  s.addText("Roughly a 20-fold difference — and 78.6% of tested burner domains were pushed in synchronised bursts.", {
    x: M, y: 4.6, w: 7.2, h: 0.7, fontFace: B_FONT, fontSize: 14, color: INK, margin: 0,
  });

  card(s, 8.25, 1.78, 4.4, 3.9);
  s.addText("Why this matters more than the text signal", {
    x: 8.6, y: 2.0, w: 3.7, h: 0.55,
    fontFace: B_FONT, fontSize: 15, bold: true, color: INK, margin: 0,
  });
  bullets(s, [
    "Infrastructure survives paraphrase. Rewording defeats the text detector; it does not conjure a new domain.",
    "A 91-day cycle is invisible in any single-year window.",
    "It is observable from public domain data alone — no platform cooperation required.",
    "But the flag misfires on ~1 in 10 legitimate but oddly-named sites. It is a candidate generator, not a verdict.",
  ], 8.6, 2.6, 3.7, 2.95, { size: 12.5, gap: 11 });

  footer(s);
  s.addNotes(
    "The last bullet matters — I put a whole table in the report showing where the disposable-domain flag " +
    "over-triggers, including recognisable publishers. Never present a heuristic as a verdict."
  );
}

// ============================================ 15. FINDING 3 — the blind spot
{
  const s = lightSlide();
  title(s, "The safety systems can't see the main harm", { kicker: "Finding 3 · Chapter 7, a negative result" });

  card(s, M, 1.78, 5.75, 2.5, { fill: ACCENT_SOFT, line: ACCENT_SOFT });
  s.addText("The accuracy gap", {
    x: M + 0.35, y: 1.98, w: 5.05, h: 0.35,
    fontFace: B_FONT, fontSize: 15, bold: true, color: ACCENT, margin: 0,
  });
  s.addText(
    [
      { text: "0.152", options: { fontSize: 34, bold: true, color: ACCENT, fontFace: H_FONT } },
      { text: "   vs   ", options: { fontSize: 16, color: INK_SOFT } },
      { text: "0.163", options: { fontSize: 34, bold: true, color: INK_SOFT, fontFace: H_FONT } },
    ],
    { x: M + 0.35, y: 2.42, w: 5.05, h: 0.7, fontFace: B_FONT, margin: 0, valign: "middle" }
  );
  s.addText("Mean provider toxicity of scam-cue content, against the corpus mean. Scam scores calmer than average.", {
    x: M + 0.35, y: 3.15, w: 5.05, h: 0.9, fontFace: B_FONT, fontSize: 13, color: INK, margin: 0,
  });

  card(s, M + 6.15, 1.78, 5.75, 2.5, { fill: TEAL_SOFT, line: TEAL_SOFT });
  s.addText("The coverage gap", {
    x: M + 6.5, y: 1.98, w: 5.05, h: 0.35,
    fontFace: B_FONT, fontSize: 15, bold: true, color: TEAL, margin: 0,
  });
  s.addText(
    [
      { text: "129,506,705", options: { fontSize: 30, bold: true, color: TEAL, fontFace: H_FONT } },
    ],
    { x: M + 6.5, y: 2.42, w: 5.05, h: 0.7, fontFace: B_FONT, margin: 0, valign: "middle" }
  );
  s.addText("Facebook comments — 84% of the corpus — carry no provider affect score at all. Toxicity scoring exists at scale only for Reddit.", {
    x: M + 6.5, y: 3.15, w: 5.05, h: 0.9, fontFace: B_FONT, fontSize: 13, color: INK, margin: 0,
  });

  s.addText("Scam content is polite by design. It is optimised to pass exactly the classifier we rely on to catch harm.", {
    x: M, y: 4.5, w: 11.9, h: 0.4, fontFace: B_FONT, fontSize: 16, bold: true, color: INK, margin: 0,
  });
  s.addText(
    "This is not a gap in coverage that more compute fixes. It is a finding about the inadequacy of a common safety " +
    "instrument: a system tuned to toxicity, harassment, and hate will systematically under-serve a market where " +
    "commercial fraud is the principal measurable harm.",
    { x: M, y: 4.95, w: 11.9, h: 1.0, fontFace: B_FONT, fontSize: 14, color: INK_SOFT, margin: 0 }
  );
  footer(s);
  s.addNotes(
    "This is the finding with the most direct operational consequence for CATOS partners. " +
    "Recommendation I'd repeat to any regulator in the room: toxicity-classifier audits should test scam performance specifically."
  );
}

// =============================================== 16. FINDING 3b — inversion
{
  const s = lightSlide();
  title(s, "The two blind spots are mirror images", { kicker: "Finding 3 · The inversion" });

  const colX = [M + 3.9, M + 8.0];
  const headers = ["Coordination / infrastructure detection", "Provider toxicity scoring"];
  headers.forEach((h, i) => {
    s.addText(h, {
      x: colX[i], y: 1.85, w: 3.8, h: 0.6,
      fontFace: B_FONT, fontSize: 14, bold: true, color: INK, align: "center", margin: 0,
    });
  });

  const rows = [
    ["Scam / funnel content", "Strongest lift in the whole toolkit", "Weakest — scores below average", ACCENT],
    ["Xenophobic content", "Near-organic; little structural signal", "Comparatively well flagged", TEAL],
  ];
  let y = 2.6;
  rows.forEach((r) => {
    card(s, M, y, 11.9, 1.35, { fill: "FAF9F8" });
    s.addText(r[0], {
      x: M + 0.35, y: y + 0.35, w: 3.3, h: 0.65,
      fontFace: B_FONT, fontSize: 15, bold: true, color: r[3], margin: 0, valign: "middle",
    });
    s.addText(r[1], {
      x: colX[0], y: y + 0.3, w: 3.8, h: 0.75,
      fontFace: B_FONT, fontSize: 13, color: INK_SOFT, align: "center", margin: 0, valign: "middle",
    });
    s.addText(r[2], {
      x: colX[1], y: y + 0.3, w: 3.8, h: 0.75,
      fontFace: B_FONT, fontSize: 13, color: INK_SOFT, align: "center", margin: 0, valign: "middle",
    });
    y += 1.55;
  });

  card(s, M, 5.75, 11.9, 0.95, { fill: INK, line: INK });
  s.addText(
    "Each layer's blind spot is roughly where the other layer's strength lies. Neither one alone gives a complete picture — " +
    "which is an argument for combining them, not for choosing between them.",
    { x: M + 0.4, y: 5.85, w: 11.1, h: 0.75, fontFace: B_FONT, fontSize: 14, color: WHITE, valign: "middle", margin: 0 }
  );
  footer(s);
  s.addNotes("Short slide, big point. The mismatch is the finding — it's the clearest architectural recommendation in the report.");
}

// ============================================= 17. FINDING 4 — pervasiveness
{
  const s = lightSlide();
  title(s, "Xenophobia is pervasive, not concentrated", { kicker: "Finding 4 · A negative result" });

  s.addChart(
    pres.ChartType.bar,
    [{ name: "Enrichment over base rate", labels: ["Scam cues", "Xenophobia cues"], values: [5.6, 1.4] }],
    {
      x: M, y: 1.85, w: 6.4, h: 2.6,
      barDir: "col",
      showTitle: true, title: "Cue precision relative to corpus base rate (×)",
      titleFontFace: B_FONT, titleFontSize: 12, titleColor: INK,
      chartColors: [TEAL, ACCENT], varyColors: true,
      showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0.0"×"',
      dataLabelFontFace: B_FONT, dataLabelFontSize: 13, dataLabelColor: INK,
      catAxisLabelColor: INK_SOFT, catAxisLabelFontFace: B_FONT, catAxisLabelFontSize: 12,
      valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
      showLegend: false, valAxisMaxVal: 6.6,
    }
  );

  s.addText(
    "Xenophobia cue precision is high — 87%. But so is its base rate in a random sample of the corpus: " +
    "roughly 62% of definite labels. High precision on a common phenomenon is not a detector; it is a thermometer.",
    { x: M, y: 4.6, w: 6.4, h: 1.2, fontFace: B_FONT, fontSize: 14, color: INK_SOFT, margin: 0 }
  );

  card(s, 7.55, 1.82, 5.1, 3.95, { fill: ACCENT_SOFT, line: ACCENT_SOFT });
  s.addText("Why this is the uncomfortable finding", {
    x: 7.9, y: 2.05, w: 4.4, h: 0.4,
    fontFace: B_FONT, fontSize: 16, bold: true, color: ACCENT, margin: 0,
  });
  s.addText(
    "The signal is not a needle in a haystack. It is a property of much of the hay.\n\n" +
    "You cannot address it by taking down a network, because there is no network to take down — " +
    "the coordination profile is organic across all six years.\n\n" +
    "Any intervention premised on isolating a small coordinated core would be aimed at something that isn't there.",
    { x: 7.9, y: 2.55, w: 4.4, h: 3.0, fontFace: B_FONT, fontSize: 13, color: INK, lineSpacing: 19, margin: 0 }
  );
  footer(s);
  s.addNotes(
    "A coordinated-campaign result would have been a more comfortable finding to deliver — it comes with an " +
    "obvious intervention. This one doesn't, and saying so is part of the job."
  );
}

// ================================================= 18. FINDING 5 — the year
{
  const s = lightSlide();
  title(s, "A single year can invert the truth", { kicker: "Finding 5 · The methodological spine" });

  s.addText("Three conclusions a 2025-only corpus would have supported, overturned by the full span:", {
    x: M, y: 1.72, w: 11.9, h: 0.4, fontFace: B_FONT, fontSize: 15, color: INK, margin: 0,
  });

  const flips = [
    ["Commercial spam looks near-organic", "Funnel lift 0.19 in 2025", "…but 15.8 in 2020 — an order of magnitude higher", "Scale inverted"],
    ["Cross-platform sharing looks balanced", "Near-parity Facebook / Reddit in 2025", "…but strongly Facebook-led in 2020", "Direction inverted"],
    ["Disposable infrastructure looks absent", "Invisible in any one-year window", "…a 91-day cycle against a 1,865-day baseline", "Phenomenon invisible"],
  ];
  let y = 2.25;
  flips.forEach((f, i) => {
    card(s, M, y, 11.9, 1.05);
    disc(s, i + 1, M + 0.3, y + 0.27, { d: 0.5, size: 14 });
    s.addText(f[0], {
      x: M + 1.0, y: y + 0.14, w: 3.55, h: 0.75,
      fontFace: B_FONT, fontSize: 14, bold: true, color: INK, margin: 0, valign: "middle",
    });
    s.addText(f[1], {
      x: M + 4.65, y: y + 0.14, w: 2.75, h: 0.75,
      fontFace: B_FONT, fontSize: 12.5, color: FAINT, margin: 0, valign: "middle",
    });
    s.addText(f[2], {
      x: M + 7.5, y: y + 0.14, w: 2.9, h: 0.75,
      fontFace: B_FONT, fontSize: 12.5, color: INK_SOFT, margin: 0, valign: "middle",
    });
    s.addText(f[3], {
      x: M + 10.5, y: y + 0.14, w: 1.15, h: 0.75,
      fontFace: B_FONT, fontSize: 11.5, bold: true, color: ACCENT, align: "right", margin: 0, valign: "middle",
    });
    y += 1.2;
  });

  card(s, M, 5.9, 11.9, 0.9, { fill: INK, line: INK });
  s.addText(
    "Longitudinal span is not more data. It is a correction mechanism. Treat a single-year measurement as a hypothesis, not a result.",
    { x: M + 0.4, y: 5.98, w: 11.1, h: 0.75, fontFace: B_FONT, fontSize: 15, bold: true, color: WHITE, valign: "middle", margin: 0 }
  );
  footer(s);
  s.addNotes(
    "If the room takes away one thing for how CATOS designs future monitoring, it should be this slide. " +
    "The 2025-only predecessor corpus was not wrong — it was under-determined, and in two of three cases it pointed the wrong way."
  );
}

// ============================================================ 19. DIVIDER IV
divider(4, "One worked example,\nend to end", "GE2025 — including the mistake the pipeline caught, which is the reason to trust the answer.")
  .addNotes("Roughly 5 minutes. The point of this section is the error, not the headline.");

// ============================================================= 20. PIPELINE
{
  const s = lightSlide();
  title(s, "The GE2025 pipeline", { kicker: "Part 4 · Chapter 14" });

  const steps = [
    ["Detect", "Exact-duplicate clustering, then the multi-space filter. Political copypasta peaks in the week before Polling Day, then collapses."],
    ["Label", "Local instruction model (Qwen2.5-3B), three passes, majority vote. Mean self-reported confidence: 0.98."],
    ["Validate", "A deliberately worst-case stratified human sample — treated as a gate, not a formality."],
    ["Correct", "Targeted re-label of the one failing category, then report v2. The correction is part of the finding."],
  ];
  const cw = 2.85;
  steps.forEach((st, i) => {
    const x = M + i * (cw + 0.13);
    card(s, x, 1.9, cw, 2.9, i === 2 ? { fill: ACCENT_SOFT, line: ACCENT_SOFT } : {});
    disc(s, i + 1, x + 0.25, 2.15, { d: 0.48, size: 14, fill: i === 2 ? ACCENT : INK });
    s.addText(st[0], {
      x: x + 0.85, y: 2.2, w: cw - 1.1, h: 0.42,
      fontFace: B_FONT, fontSize: 17, bold: true, color: INK, margin: 0, valign: "middle",
    });
    s.addText(st[1], {
      x: x + 0.25, y: 2.85, w: cw - 0.5, h: 1.8,
      fontFace: B_FONT, fontSize: 12.5, color: INK_SOFT, margin: 0,
    });
    if (i < 3) {
      s.addText("→", { x: x + cw - 0.02, y: 3.1, w: 0.2, h: 0.4, fontFace: B_FONT, fontSize: 16, color: FAINT, align: "center", margin: 0 });
    }
  });

  s.addText(
    "This is the same pipeline used everywhere else in the report. GE2025 is where it can be shown end to end, " +
    "on a single well-understood event, with a human check at the point where it would otherwise have gone wrong.",
    { x: M, y: 5.1, w: 11.9, h: 0.8, fontFace: B_FONT, fontSize: 14, color: INK_SOFT, margin: 0 }
  );
  footer(s);
  s.addNotes("Note that the third box is highlighted deliberately — validation is the step people skip, and it is the step that saved this chapter.");
}

// ======================================================== 21. WHAT IT CAUGHT
{
  const s = lightSlide();
  title(s, "What the validation gate caught", { kicker: "Part 4 · The mistake" });

  card(s, M, 1.8, 5.75, 3.4);
  s.addText("Version 1 — as the model reported it", {
    x: M + 0.35, y: 2.02, w: 5.05, h: 0.4,
    fontFace: B_FONT, fontSize: 15, bold: true, color: INK_SOFT, margin: 0,
  });
  s.addText("42 clusters · 1,925 items labelled anti-opposition", {
    x: M + 0.35, y: 2.5, w: 5.05, h: 0.5,
    fontFace: B_FONT, fontSize: 15, bold: true, color: INK, margin: 0,
  });
  bullets(s, [
    "Mean self-reported confidence: 0.98",
    "Reliable on direct pro/anti stance (80–100%)",
    "Agreed with itself across all three passes",
  ], M + 0.35, 3.05, 5.05, 1.9, { size: 13 });

  card(s, M + 6.15, 1.8, 5.75, 3.4, { fill: ACCENT_SOFT, line: ACCENT_SOFT });
  s.addText("What a human reviewer found", {
    x: M + 6.5, y: 2.02, w: 5.05, h: 0.4,
    fontFace: B_FONT, fontSize: 15, bold: true, color: ACCENT, margin: 0,
  });
  s.addText("16 of 42 clusters — 38% — were mislabelled", {
    x: M + 6.5, y: 2.5, w: 5.05, h: 0.5,
    fontFace: B_FONT, fontSize: 15, bold: true, color: INK, margin: 0,
  });
  bullets(s, [
    "Sarcastic anti-incumbent posts read as anti-opposition",
    "Neutral structural commentary swept in with them",
    "Ten of the sixteen carried no partisan valence at all",
  ], M + 6.5, 3.05, 5.05, 1.9, { size: 13, color: INK });

  card(s, M, 5.45, 11.9, 1.25, { fill: INK, line: INK });
  s.addText(
    "Small-model labels are hypotheses, not measurements. Self-consistency is not correctness — the model was most " +
    "confident precisely where it was confidently wrong. Validate against worst-case strata, or don't report the label.",
    { x: M + 0.4, y: 5.58, w: 11.1, h: 1.0, fontFace: B_FONT, fontSize: 14.5, color: WHITE, valign: "middle", margin: 0 }
  );
  footer(s);
  s.addNotes(
    "Deliver this as the most transferable slide in the deck. Irony is the failure mode, and it is exactly the " +
    "register political speech uses. Any team doing LLM labelling on Singaporean political content will hit this."
  );
}

// ========================================================== 22. THE HEADLINE
{
  const s = lightSlide();
  title(s, "The validated headline", { kicker: "Part 4 · GE2025, corrected" });

  s.addChart(
    pres.ChartType.bar,
    [
      { name: "Clusters", labels: ["Anti-incumbent", "Pro-incumbent"], values: [125, 53] },
    ],
    {
      x: M, y: 1.9, w: 6.3, h: 2.35,
      barDir: "col",
      showTitle: true, title: "Copypasta clusters by stance (validated v2)",
      titleFontFace: B_FONT, titleFontSize: 12, titleColor: INK,
      chartColors: [ACCENT, TEAL], varyColors: true,
      showValue: true, dataLabelPosition: "outEnd",
      dataLabelFontFace: B_FONT, dataLabelFontSize: 13, dataLabelColor: INK,
      catAxisLabelColor: INK_SOFT, catAxisLabelFontFace: B_FONT, catAxisLabelFontSize: 12,
      valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
      showLegend: false, valAxisMaxVal: 150,
    }
  );

  s.addText("Roughly 2.4 : 1 by cluster count, 1.9 : 1 by item count (7,416 vs 3,886).", {
    x: M, y: 4.35, w: 6.3, h: 0.5, fontFace: B_FONT, fontSize: 14, color: INK, margin: 0,
  });
  s.addText(
    "The two sides are shaped differently: pro-incumbent copypasta is a small set of high-reach slogans " +
    "(73 items per cluster); anti-incumbent copypasta is a wider variety of longer critiques (59 per cluster).",
    { x: M, y: 4.85, w: 6.3, h: 1.1, fontFace: B_FONT, fontSize: 13, color: INK_SOFT, margin: 0 }
  );

  card(s, 7.55, 1.85, 5.1, 4.1, { fill: INK, line: INK });
  s.addText("And what it is not", {
    x: 7.9, y: 2.1, w: 4.4, h: 0.4,
    fontFace: B_FONT, fontSize: 17, bold: true, color: ACCENT, margin: 0,
  });
  s.addText(
    "This is a measurement of what was repeated. It is not evidence of coordinated inauthentic behaviour, " +
    "foreign interference, or manipulation.\n\n" +
    "High-volume criticism of a long-governing party at its most electorally exposed moment is an unremarkable " +
    "feature of democratic contestation. It is visible here only because some of it took verbatim, cross-space form.\n\n" +
    "The same week's largest raw cluster — 13,014 items — was Reddit AutoModerator boilerplate in a single space. " +
    "Check spread, never size.",
    { x: 7.9, y: 2.6, w: 4.4, h: 3.2, fontFace: B_FONT, fontSize: 12.5, color: "C9C5CF", lineSpacing: 18, margin: 0 }
  );
  footer(s);
  s.addNotes(
    "Read the right-hand column out loud, in full. This is the slide most likely to be screenshotted, " +
    "and the caveat must travel with the number."
  );
}

// ============================================================= 23. THE PAPER
{
  const s = lightSlide();
  title(s, "The paper: a cross-lingual audit of online hate", { kicker: "Part 4 · A taste, not the whole thing" });

  s.addText(
    "“Cultural Targets, Structural Frames, Binding Morals” — 8,561 sampled candidates adjudicated across three " +
    "languages, 2,190 confirmed hostile. Four lenses on the same material.",
    { x: M, y: 1.72, w: 11.9, h: 0.75, fontFace: B_FONT, fontSize: 15, color: INK_SOFT, margin: 0 }
  );

  const lenses = [
    ["Targets", "Who gets targeted depends on which language the conversation is in. English spreads broadly; Chinese concentrates on a Malay–Chinese divide; Indonesian concentrates on religion.", ACCENT],
    ["Frames", "How hostility is framed is determined by the target's category, and is largely shared across language communities.", TEAL],
    ["Morals", "The moral vocabulary leans to the in-group-protective foundations — reported cautiously, under a labelling confound.", FAINT],
    ["Resonance", "The audience rewards nativist hostility more than religious hostility. Hate is under-engaged overall.", TEAL],
  ];
  const cw = 2.85;
  lenses.forEach((l, i) => {
    const x = M + i * (cw + 0.13);
    card(s, x, 2.65, cw, 2.5);
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: 2.88, w: 0.22, h: 0.22, fill: { color: l[2] }, line: { width: 0 } });
    s.addText(l[0], {
      x: x + 0.6, y: 2.8, w: cw - 0.85, h: 0.4,
      fontFace: B_FONT, fontSize: 16, bold: true, color: INK, margin: 0, valign: "middle",
    });
    s.addText(l[1], {
      x: x + 0.25, y: 3.3, w: cw - 0.5, h: 1.7,
      fontFace: B_FONT, fontSize: 12, color: INK_SOFT, margin: 0,
    });
  });

  s.addText(
    [
      { text: "Three of the four lenses replicate on the full 2020–2026 record. ", options: { bold: true, color: INK } },
      { text: "The fourth differs under a labelling confound, so it is reported as a within-language distribution and nothing more.", options: { color: INK_SOFT } },
    ],
    { x: M, y: 5.4, w: 11.9, h: 0.6, fontFace: B_FONT, fontSize: 14, margin: 0 }
  );
  s.addText("Preprint: arXiv:2606.21996 — the full argument, the annotation protocol, and the limits are all there.", {
    x: M, y: 5.95, w: 11.9, h: 0.4, fontFace: B_FONT, fontSize: 13, italic: true, color: ACCENT, margin: 0,
  });
  footer(s);
  s.addNotes(
    "Deliberately light on detail — this is an appetiser, and the room can read the preprint. " +
    "The one line worth landing: English-only monitoring systematically misses the Chinese- and " +
    "Indonesian-language fault lines, because they target different groups entirely."
  );
}

// ============================================================= 24. DIVIDER V
divider(5, "Lessons, and\nwhat I'd fund next", "The dataset stays behind. This is the part I hope travels.")
  .addNotes("Slow down here. This is the section with the longest half-life for the people in the room.");

// ========================================================== 25. THREE GATES
{
  const s = lightSlide();
  title(s, "Three gates, and what each one caught", { kicker: "Lesson 1 · The method discipline" });

  const gates = [
    ["Calibrate against a null", "Every detector gets a randomisation baseline and a sensitivity curve before its output is believed.", "Removed 42% of naively-flagged clusters, and reframed every coordination count as a floor."],
    ["Correct by measured precision", "Every raw count is multiplied through a gold-set precision estimate and reported as an explicit floor.", "Turned 769,601 cue-hits into a defensible ~160,307 — and exposed the xenophobia base-rate result."],
    ["Validate against worst cases", "Every model label is checked against a deliberately adversarial human sample before it is reported.", "Caught a 38% mislabel rate hiding behind 0.98 confidence."],
  ];
  let y = 1.9;
  gates.forEach((g, i) => {
    card(s, M, y, 11.9, 1.35);
    disc(s, i + 1, M + 0.32, y + 0.42, { d: 0.52, size: 15 });
    s.addText(g[0], {
      x: M + 1.05, y: y + 0.16, w: 3.75, h: 0.38,
      fontFace: B_FONT, fontSize: 14.5, bold: true, color: INK, margin: 0,
    });
    s.addText(g[1], {
      x: M + 1.05, y: y + 0.58, w: 4.7, h: 0.65,
      fontFace: B_FONT, fontSize: 12, color: FAINT, margin: 0,
    });
    s.addText(g[2], {
      x: M + 6.0, y: y + 0.25, w: 5.6, h: 0.85,
      fontFace: B_FONT, fontSize: 13.5, color: INK_SOFT, margin: 0, valign: "middle",
    });
    y += 1.45;
  });

  s.addText(
    "Each gate caught a real error that would otherwise have propagated into the headline. " +
    "None of them is expensive. All three are the reason I'll stand behind the findings.",
    { x: M, y: 6.25, w: 11.9, h: 0.55, fontFace: B_FONT, fontSize: 14.5, italic: true, color: INK, margin: 0 }
  );
  footer(s);
  s.addNotes(
    "Emphasise cheapness. None of these gates required new collection or new compute — they required " +
    "deciding in advance that a result isn't finished until it has been attacked."
  );
}

// ======================================================== 26. LESSONS, PLAIN
{
  const s = lightSlide();
  title(s, "Five things I'd tell whoever picks this up", { kicker: "Lesson 2 · Plainly" });

  const items = [
    ["Trust spread, not size.", "The biggest raw spike in six years was a moderation bot talking to itself."],
    ["Report floors, and say so every time.", "A floor that everyone understands is worth more than an estimate nobody can defend."],
    ["Never use toxicity as a scam screen.", "The largest harm in this environment is polite. It is engineered to pass."],
    ["Assume the model is confidently wrong somewhere.", "Find where. Sarcasm was the where, here — it will be somewhere else next time."],
    ["Publish the negative results.", "A report that only says what it found is not a trustworthy report."],
  ];
  let y = 1.9;
  items.forEach((it, i) => {
    disc(s, i + 1, M, y + 0.05, { d: 0.46, size: 14, fill: i % 2 ? TEAL : ACCENT });
    s.addText(it[0], {
      x: M + 0.72, y, w: 5.4, h: 0.4,
      fontFace: B_FONT, fontSize: 16, bold: true, color: INK, margin: 0,
    });
    s.addText(it[1], {
      x: M + 6.3, y: y + 0.02, w: 5.6, h: 0.6,
      fontFace: B_FONT, fontSize: 13.5, color: INK_SOFT, margin: 0,
    });
    y += 0.88;
  });

  card(s, M, 6.0, 11.9, 0.75, { fill: ACCENT_SOFT, line: ACCENT_SOFT });
  s.addText(
    "The negative-results chapter is the one I'd read first if someone handed me this report. It is Chapter 15.",
    { x: M + 0.4, y: 6.08, w: 11.1, h: 0.6, fontFace: B_FONT, fontSize: 14, color: INK, valign: "middle", margin: 0 }
  );
  footer(s);
  s.addNotes("Conversational delivery. These are the things I actually say to students, not report language.");
}

// ============================================================ 27. WHAT NEXT
{
  const s = lightSlide();
  title(s, "What I'd fund next, in order of leverage", { kicker: "Lesson 3 · The handover" });

  const dirs = [
    ["Paraphrase-aware detection", "Semantic clustering calibrated against the same injected campaigns. Turns every floor in the report into a bounded estimate.", "Highest leverage"],
    ["From floors to prevalence", "Larger, stratified, multilingual gold sets. Annotation work, not new collection — cheap relative to its value.", "Cheapest win"],
    ["A multi-model labelling stack", "Several models against one human-adjudicated benchmark, with failure modes published. Human validation as standing practice.", "Highest rigour"],
    ["Instagram, TikTok, X", "Delivered but unanalysed. The lead-lag result is already moving — a monitor fixed on one platform decays.", "Widest coverage"],
    ["Infrastructure-anchored monitoring", "A 91-day burner cycle is exactly what a standing monitor is for. Retrospective findings become early warning.", "Most operational"],
  ];
  let y = 1.85;
  dirs.forEach((d, i) => {
    card(s, M, y, 11.9, 0.85, i === 0 ? { fill: ACCENT_SOFT, line: ACCENT_SOFT } : {});
    disc(s, i + 1, M + 0.3, y + 0.17, { d: 0.5, size: 14, fill: i === 0 ? ACCENT : INK });
    s.addText(d[0], {
      x: M + 1.0, y: y + 0.08, w: 3.2, h: 0.68,
      fontFace: B_FONT, fontSize: 14, bold: true, color: INK, margin: 0, valign: "middle",
    });
    s.addText(d[1], {
      x: M + 4.3, y: y + 0.08, w: 5.85, h: 0.68,
      fontFace: B_FONT, fontSize: 12, color: INK_SOFT, margin: 0, valign: "middle",
    });
    s.addText(d[2], {
      x: M + 10.3, y: y + 0.08, w: 1.35, h: 0.68,
      fontFace: B_FONT, fontSize: 11, bold: true, color: i === 0 ? ACCENT : FAINT, align: "right", margin: 0, valign: "middle",
    });
    y += 0.95;
  });

  s.addText(
    "Recall first, then calibration, then labelling rigour, then coverage, then timeliness. " +
    "Each one arrives paired with the validation that bounds it — or it shouldn't arrive at all.",
    { x: M, y: 6.45, w: 11.9, h: 0.45, fontFace: B_FONT, fontSize: 13.5, italic: true, color: INK_SOFT, margin: 0 }
  );
  footer(s);
  s.addNotes(
    "This is the slide for the leadership in the room. Every item maps to a specific limitation in Chapter 15 " +
    "and to a specific section of Chapter 17. It is a fundable roadmap, not a wish list."
  );
}

// ===================================================== 28. WHAT I TAKE AWAY
{
  const s = lightSlide();
  title(s, "What I'll take with me", { kicker: "Personally" });

  const cw = 3.85;
  const takeaways = [
    ["A harder standard", "I have never written a report where every finding is chained to the test that limits it. I will not write one the old way again."],
    ["A different default", "I came in expecting politics and influence operations. The data kept saying: fraud, infrastructure, and language."],
    ["The people", "The colleagues who checked my Malay, argued with my thresholds, chased my invoices, and made a visiting researcher feel like staff."],
  ];
  takeaways.forEach((t, i) => {
    const x = M + i * (cw + 0.28);
    card(s, x, 1.9, cw, 2.5, i === 2 ? { fill: ACCENT_SOFT, line: ACCENT_SOFT } : {});
    s.addText(t[0], {
      x: x + 0.3, y: 2.15, w: cw - 0.6, h: 0.45,
      fontFace: H_FONT, fontSize: 19, bold: true, color: i === 2 ? ACCENT : INK, margin: 0,
    });
    s.addText(t[1], {
      x: x + 0.3, y: 2.7, w: cw - 0.6, h: 1.5,
      fontFace: B_FONT, fontSize: 13, color: INK_SOFT, lineSpacing: 19, margin: 0,
    });
  });

  s.addText(
    "One more, which I did not expect: the correction that mattered most in this whole study — that the corpus " +
    "was overwhelmingly Malay, not Bahasa Indonesia — came from a colleague reading a draft carefully and telling " +
    "me I was wrong. That is what a research centre is for.",
    { x: M, y: 4.75, w: 11.9, h: 1.1, fontFace: B_FONT, fontSize: 15, color: INK, lineSpacing: 23, margin: 0 }
  );
  footer(s);
  s.addNotes(
    "Name Raj here if it feels right — he caught the Malay / Bahasa Indonesia error on the June draft, " +
    "and it changed a chapter. Genuine, specific credit lands better than general thanks."
  );
}

// ============================================================== 29. CLOSING
{
  const s = darkSlide();
  s.addText("Thank you", {
    x: M, y: 1.6, w: 8, h: 1.0,
    fontFace: H_FONT, fontSize: 46, bold: true, color: WHITE, margin: 0,
  });
  s.addText(
    "For the data, the arguments, the corrections, and the year.",
    { x: M, y: 2.65, w: 8.5, h: 0.5, fontFace: B_FONT, fontSize: 17, color: "B9B5BF", margin: 0 }
  );

  s.addShape(pres.ShapeType.rect, { x: M, y: 3.45, w: 0.045, h: 1.35, fill: { color: ACCENT }, line: { width: 0 } });
  s.addText(
    "For Dr. Yinping Yang, who asked the questions this report tries to answer, and whose commitment to " +
    "understanding online harm in this ecosystem outlasts all of it.",
    { x: M + 0.45, y: 3.45, w: 7.9, h: 1.35, fontFace: B_FONT, fontSize: 15, color: "C9C5CF", lineSpacing: 24, margin: 0 }
  );

  card(s, 9.2, 1.6, 3.45, 4.2, { fill: "241F26", line: "34303A" });
  s.addText("Everything is handed over", {
    x: 9.5, y: 1.85, w: 2.85, h: 0.6,
    fontFace: B_FONT, fontSize: 14, bold: true, color: ACCENT, margin: 0,
  });
  s.addText(
    "Technical report — delivered\n\n" +
    "Preprint — arXiv:2606.21996\n\n" +
    "Reproducibility manifest — corpus, compute, model configs, finding codes\n\n" +
    "Every limitation, written down and numbered",
    { x: 9.5, y: 2.5, w: 2.85, h: 3.1, fontFace: B_FONT, fontSize: 12.5, color: "B9B5BF", lineSpacing: 18, margin: 0 }
  );

  s.addText("Emilio Ferrara   ·   emiliofe@usc.edu   ·   Questions, please.", {
    x: M, y: 5.6, w: 8.5, h: 0.4, fontFace: B_FONT, fontSize: 14, color: FAINT, margin: 0,
  });
  s.addNotes(
    "Close on Yinping, not on myself. Then open the floor. " +
    "Anticipated questions: (1) can we share the corpus — CATOS internal, needs a decision above me; " +
    "(2) can you name actors — no, and the report explains why that is structural, not cautious; " +
    "(3) is the anti-incumbent skew evidence of interference — no."
  );
}

// ====================================================== 30. BACKUP: NUMBERS
{
  const s = lightSlide();
  title(s, "Reference: the numbers, in one place", { kicker: "Backup" });

  const cols = [
    ["Corpus", [
      "154,284,618 items · Jan 2020 – Jun 2026",
      "Facebook 129,506,705 (84%)",
      "Reddit 16,487,473 · YouTube 8,290,440",
      "267 spaces · 11,959,097 URLs · 105,022 domains",
    ]],
    ["Coordination", [
      "858,728 exact-duplicate clusters (≥5 items)",
      "50,124 survive the temporal null (57.6% of 86,955 tested)",
      "44,214 span 3+ spaces · median effect size 2.21",
      "Detector recall 0.500 → 0.011 across 0–40% rewording",
    ]],
    ["Harm", [
      "Scam floor ≈160,307 (from 769,601 cue-hits, precision 0.208)",
      "Xenophobia floor ≈256,573 (from 295,048, precision 0.870)",
      "Enrichment: scam 5.6× · xenophobia 1.4×",
      "Scam toxicity 0.152 vs corpus mean 0.163",
    ]],
    ["Time & infrastructure", [
      "Coordination share: mean 4.5%, raw peak 22.0% (Apr 2025)",
      "Funnel lift 15.8 (2020) → 0.19 (2025)",
      "Burner domains: 91-day median vs 1,865-day persistent",
      "DGA synchrony: 55 of 70 domains at q < 0.05 (78.6%)",
    ]],
  ];
  const cw = 5.9;
  cols.forEach((c, i) => {
    const x = M + (i % 2) * (cw + 0.18);
    const y = 1.8 + Math.floor(i / 2) * 2.35;
    card(s, x, y, cw, 2.15);
    s.addText(c[0], {
      x: x + 0.3, y: y + 0.18, w: cw - 0.6, h: 0.35,
      fontFace: B_FONT, fontSize: 14, bold: true, color: ACCENT, margin: 0,
    });
    bullets(s, c[1], x + 0.3, y + 0.6, cw - 0.6, 1.45, { size: 11.5, gap: 5 });
  });

  s.addText("All figures from the CATOS technical report, August 2026. Every count is a floor unless stated otherwise.", {
    x: M, y: 6.4, w: 11.9, h: 0.35, fontFace: B_FONT, fontSize: 11.5, italic: true, color: FAINT, margin: 0,
  });
  footer(s);
  s.addNotes("Backup slide — leave up during Q&A rather than walking through it.");
}

// =================================================== 31. BACKUP: LIMITATIONS
{
  const s = lightSlide();
  title(s, "Reference: what this study cannot do", { kicker: "Backup · Chapter 15" });

  const lims = [
    ["No attribution", "No actor, group, or state is identified. Structural, not cautious — the data carries no identities."],
    ["No prevalence", "Counts are floors, never population rates. No error rate is extrapolated into an estimate."],
    ["No paraphrased coordination", "Recall collapses to 0.011 at 40% rewording. Whole campaigns can be invisible."],
    ["No inauthenticity claim", "Repetition is measured. Intent, automation, and authenticity are not."],
    ["Partial platform coverage", "Instagram, TikTok, X delivered but unanalysed. Provider affect exists at scale only for Reddit."],
    ["Screening ≠ incidence", "Safety-screen indicators are signals of unknown precision, not verified counts."],
  ];
  const cw = 3.85;
  lims.forEach((l, i) => {
    const x = M + (i % 3) * (cw + 0.28);
    const y = 1.85 + Math.floor(i / 3) * 1.95;
    card(s, x, y, cw, 1.7);
    s.addText(l[0], {
      x: x + 0.3, y: y + 0.22, w: cw - 0.6, h: 0.4,
      fontFace: B_FONT, fontSize: 14.5, bold: true, color: INK, margin: 0,
    });
    s.addText(l[1], {
      x: x + 0.3, y: y + 0.68, w: cw - 0.6, h: 0.85,
      fontFace: B_FONT, fontSize: 12, color: INK_SOFT, margin: 0,
    });
  });

  s.addText(
    "Significance thresholds (q < 0.05, Benjamini–Hochberg) control the false-discovery rate across a tested " +
    "population. They do not certify any individual cluster, URL, or domain.",
    { x: M, y: 5.95, w: 11.9, h: 0.7, fontFace: B_FONT, fontSize: 13, color: INK_SOFT, margin: 0 }
  );
  footer(s);
  s.addNotes("Backup slide. Useful if anyone pushes for a claim the data can't support — point at the relevant box.");
}

// ------------------------------------------------------------------ write
pres.writeFile({ fileName: "CATOS_Farewell_Ferrara_Aug2026.pptx" }).then((f) => {
  console.log(`Wrote ${f} (${slideNo} slides)`);
});
