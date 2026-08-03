/**
 * CATOS farewell talk — Emilio Ferrara, A*STAR IHPC, August 2026.
 *
 *   node build_deck.js
 *
 * Built to the house style measured from "From Bots to Agents" (IMDA 2026);
 * the spec is in house_style.md. Every figure traces to the CATOS technical
 * report (August 2026) or to arXiv:2606.21996.
 */

const pptxgen = require("pptxgenjs");

// ------------------------------------------------------------------ palette
const INK = "1A1A1A";
const ACCENT = "D04A2D";
const GRAY = "7A7A7A";
const CREAM = "F6F3EE";
const CREAM2 = "EFEBE6";
const PEACH = "F6D9CA";
const BLUEGRAY = "E6EBF1";
const DARK = "1F2A36";
const NAVY = "1F3A5F";
const WHITE = "FFFFFF";

const F = "Calibri";

// type ladder
const T_STATEMENT = 44;
const T_TITLE = 31.7;
const T_HEAD = 23.8;
const T_STAT = 26;
const T_NUMERAL = 66;
const T_BODY = 20.2;
const T_SUB = 18;
const T_CAP = 15.9;
const T_DIVSUB = 17.3;
const T_EYEBROW = 15.1;
const T_STATCAP = 12.3;
const T_CITE = 10.1;
const T_CHIP = 10.1;
const T_FOOT = 9.4;

const W = 13.333;
const H = 7.5;
const M = 0.7;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Emilio Ferrara";
pres.company = "A*STAR — Institute of High Performance Computing";
pres.title = "What the Data Says, and What Singapore Taught Me";

let n = 0;
const TOTAL = 40; // asserted against the real count at the end of this file

// ------------------------------------------------------------------ helpers

/** `*bold ink*` and `~bold accent~` inside running text. */
function rich(str, base) {
  const out = [];
  const re = /(\*[^*]+\*|~[^~]+~)/g;
  let last = 0, m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push({ text: str.slice(last, m.index), opt: {} });
    const tok = m[0];
    out.push(tok[0] === "*"
      ? { text: tok.slice(1, -1), opt: { bold: true, color: base || INK } }
      : { text: tok.slice(1, -1), opt: { bold: true, color: ACCENT } });
    last = m.index + tok.length;
  }
  if (last < str.length) out.push({ text: str.slice(last), opt: {} });
  return out;
}

/**
 * A block of short standalone lines — the deck's only body construct.
 * Each line is a string, or {t, size, mute, indent, gap}.
 */
function lines(s, arr, x, y, w, h, o = {}) {
  const items = [];
  arr.forEach((ln, li) => {
    const spec = typeof ln === "string" ? { t: ln } : ln;
    const size = spec.size || o.size || T_BODY;
    const color = spec.mute ? GRAY : INK;
    const runs = rich(spec.t, color);
    const isLast = li === arr.length - 1;
    runs.forEach((r, ri) => {
      const endOfLine = ri === runs.length - 1;
      items.push({
        text: r.text,
        options: Object.assign({}, r.opt, {
          fontSize: size,
          color: r.opt.color || color,
          italic: !!spec.italic,
          breakLine: endOfLine && !isLast,
          paraSpaceAfter: endOfLine ? (spec.gap !== undefined ? spec.gap : (o.gap !== undefined ? o.gap : 9)) : 0,
          indentLevel: spec.indent || 0,
        }),
      });
    });
  });
  s.addText(items, { x, y, w, h, fontFace: F, margin: 0, valign: "top" });
}

function slide(opts = {}) {
  const s = pres.addSlide();
  s.background = { color: opts.bg || WHITE };
  n += 1;
  if (!opts.noTick) {
    s.addShape(pres.ShapeType.rect, {
      x: M, y: 0.4, w: 0.42, h: 0.05,
      fill: { color: ACCENT }, line: { width: 0 },
    });
  }
  if (!opts.noFoot) {
    s.addText(`Ferrara · CATOS farewell · A*STAR IHPC 2026 · ${n}/${TOTAL}`, {
      x: W - M - 4.6, y: H - 0.42, w: 4.6, h: 0.26,
      fontFace: F, fontSize: T_FOOT, color: opts.bg ? "9AA3AC" : GRAY,
      align: "right", margin: 0,
    });
  }
  return s;
}

function title(s, text, standfirst) {
  s.addText(text, {
    x: M, y: 0.46, w: W - 2 * M - 2.2, h: 0.5,
    fontFace: F, fontSize: T_TITLE, bold: true, color: INK, margin: 0, valign: "top",
  });
  if (standfirst) {
    s.addText(standfirst, {
      x: M, y: 1.0, w: W - 2 * M - 2.2, h: 0.34,
      fontFace: F, fontSize: T_CAP, italic: true, color: GRAY, margin: 0,
    });
  }
}

function chip(s, text) {
  const w = 2.15;
  s.addShape(pres.ShapeType.rect, {
    x: W - M - w, y: 0.26, w, h: 0.3,
    fill: { color: WHITE }, line: { color: ACCENT, width: 0.75 },
  });
  s.addText(text.toUpperCase(), {
    x: W - M - w, y: 0.26, w, h: 0.3,
    fontFace: F, fontSize: T_CHIP, bold: true, color: ACCENT,
    align: "center", valign: "middle", margin: 0, charSpacing: 0.6,
  });
}

function cite(s, text) {
  s.addText(text, {
    x: 0.55, y: H - 0.42, w: 7.25, h: 0.26,
    fontFace: F, fontSize: T_CITE, italic: true, color: ACCENT, margin: 0,
  });
}

function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.05,
    fill: { color: fill || CREAM }, line: { width: 0 },
  });
}

/** Row of big red numbers over a cream strip — the reference's stat pattern. */
function statRow(s, y, items, opts = {}) {
  const x0 = opts.x !== undefined ? opts.x : M;
  const total = opts.w || W - 2 * M;
  const gap = 0.22;
  const cw = (total - gap * (items.length - 1)) / items.length;
  items.forEach((it, i) => {
    const x = x0 + i * (cw + gap);
    card(s, x, y, cw, opts.h || 1.15, opts.fill || CREAM);
    s.addText(it[0], {
      x, y: y + 0.1, w: cw, h: 0.52,
      fontFace: F, fontSize: opts.size || T_STAT, bold: true, color: ACCENT,
      align: "center", margin: 0, valign: "middle",
    });
    s.addText(it[1], {
      x: x + 0.12, y: y + 0.62, w: cw - 0.24, h: (opts.h || 1.15) - 0.7,
      fontFace: F, fontSize: T_STATCAP, color: GRAY,
      align: "center", margin: 0, valign: "top",
    });
  });
}

function divider(num, eyebrow, statement, standfirst) {
  const s = slide();
  s.addText(String(num).padStart(2, "0"), {
    x: W - M - 3.6, y: 2.3, w: 3.6, h: 2.6,
    fontFace: F, fontSize: 190, bold: true, color: CREAM2,
    align: "right", margin: 0, valign: "middle",
  });
  s.addText(eyebrow.toUpperCase(), {
    x: M, y: 3.05, w: 8.4, h: 0.3,
    fontFace: F, fontSize: T_EYEBROW, bold: true, color: ACCENT, margin: 0, charSpacing: 0.5,
  });
  s.addText(statement, {
    x: M, y: 3.32, w: 8.9, h: 1.65,
    fontFace: F, fontSize: T_STATEMENT, bold: true, color: INK, margin: 0, valign: "top",
  });
  s.addText(standfirst, {
    x: M, y: 5.05, w: 8.6, h: 0.4,
    fontFace: F, fontSize: T_DIVSUB, italic: true, color: GRAY, margin: 0,
  });
  return s;
}

/** Shared chart chrome. */
function chartOpts(extra) {
  return Object.assign({
    chartColors: [ACCENT, NAVY, GRAY],
    showLegend: false,
    catAxisLabelColor: INK, catAxisLabelFontFace: F, catAxisLabelFontSize: 14,
    valAxisLabelColor: GRAY, valAxisLabelFontFace: F, valAxisLabelFontSize: 12,
    dataLabelFontFace: F, dataLabelFontSize: 15, dataLabelColor: INK,
    catGridLine: { style: "none" },
    valGridLine: { color: "E8E4DE", size: 1 },
    titleFontFace: F, titleFontSize: 13, titleColor: GRAY,
  }, extra);
}

// ==================================================================== 1 TITLE
{
  const s = slide({ noFoot: true });
  s.addText("CATOS FAREWELL · A*STAR IHPC · SINGAPORE · AUGUST 2026", {
    x: M, y: 0.72, w: 9, h: 0.3,
    fontFace: F, fontSize: 11, bold: true, color: GRAY, margin: 0, charSpacing: 1.2,
  });
  s.addText("What the Data Says,", {
    x: M, y: 2.15, w: 11.9, h: 0.8,
    fontFace: F, fontSize: 48, bold: true, color: INK, margin: 0, valign: "middle",
  });
  s.addText("and What Singapore Taught Me", {
    x: M, y: 2.98, w: 11.9, h: 0.9,
    fontFace: F, fontSize: 48, bold: true, color: ACCENT, margin: 0, valign: "middle",
  });
  s.addText("Emilio Ferrara, Ph.D.", {
    x: M, y: 4.55, w: 8, h: 0.36,
    fontFace: F, fontSize: T_BODY, bold: true, color: INK, margin: 0,
  });
  lines(s, [
    { t: "Professor of Computer Science, University of Southern California", size: T_CAP, mute: true, gap: 2 },
    { t: "Visiting Scientist, CATOS · A*STAR Institute of High Performance Computing", size: T_CAP, mute: true },
  ], M, 4.95, 9, 0.7);

  // era strip, echoing the reference title slide
  const eras = ["2020  CORPUS BEGINS", "2025  THE ONE-YEAR STUDY", "2026  SIX AND A HALF YEARS", "NOW  HANDOVER"];
  let x = M;
  eras.forEach((e, i) => {
    const last = i === eras.length - 1;
    s.addText(e, {
      x, y: 6.55, w: 3.0, h: 0.3,
      fontFace: F, fontSize: 11, bold: true, color: last ? ACCENT : "B8B4AE", margin: 0, charSpacing: 0.8,
    });
    x += 3.05;
  });
  s.addShape(pres.ShapeType.line, {
    x: M, y: 6.44, w: W - 2 * M, h: 0,
    line: { color: "E8E4DE", width: 1 },
  });
  s.addNotes(
    "Open warmly. Frame it: about 35 minutes, six sections, and the last one is the only " +
    "part that outlives the dataset. Say up front that every number is a floor, and that " +
    "this is a feature, not a hedge."
  );
}

// =============================================================== 2 DEDICATION
{
  const s = slide();
  s.addText("This study was commissioned by", {
    x: M, y: 2.3, w: 10, h: 0.45,
    fontFace: F, fontSize: T_HEAD, color: GRAY, margin: 0,
  });
  s.addText("Dr. Yinping Yang", {
    x: M, y: 2.8, w: 10, h: 0.95,
    fontFace: F, fontSize: T_STATEMENT, bold: true, color: INK, margin: 0, valign: "middle",
  });
  s.addText("in her capacity as CATOS Director.", {
    x: M, y: 3.75, w: 10, h: 0.45,
    fontFace: F, fontSize: T_HEAD, color: GRAY, margin: 0,
  });
  lines(s, [
    "The report is dedicated to her memory, with the hope that it caught",
    "some of her vision and her commitment to understanding online harm",
    "in this ecosystem.",
    { t: "~She asked the questions. What follows is my attempt at answers.~", gap: 0 },
  ], M, 4.6, 10, 1.6, { gap: 3 });
  s.addNotes("Pause. Say it slowly and plainly, then move on without ceremony — the talk is the tribute.");
}

// =================================================================== 3 THE ARC
{
  const s = slide();
  title(s, "The arc of this talk", "One corpus, five findings, and the part I hope travels");

  // a timeline the audience can hold the whole talk against
  const legs = [
    ["The setting", "10 min", "154M posts · 3 platforms\n6½ years · no identities", CREAM],
    ["The findings", "12 min", "Five results, each with\nthe test that bounds it", PEACH],
    ["Worked case", "6 min", "GE2025 end to end — and\nthe mistake we caught", CREAM],
    ["The lessons", "7 min", "How to measure an\nenvironment honestly", PEACH],
  ];
  const lw = 2.85, lgap = 0.22;
  s.addShape(pres.ShapeType.line, {
    x: M + 0.5, y: 2.05, w: 11.0, h: 0,
    line: { color: "E8E4DE", width: 2 },
  });
  legs.forEach((lg, i) => {
    const x = M + i * (lw + lgap);
    s.addShape(pres.ShapeType.ellipse, {
      x: x + 0.32, y: 1.87, w: 0.36, h: 0.36,
      fill: { color: ACCENT }, line: { color: WHITE, width: 2 },
    });
    s.addText(String(i + 1), {
      x: x + 0.32, y: 1.87, w: 0.36, h: 0.36,
      fontFace: F, fontSize: 13, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    card(s, x, 2.45, lw, 2.5, lg[3]);
    s.addText(lg[0], {
      x: x + 0.28, y: 2.65, w: lw - 0.56, h: 0.42,
      fontFace: F, fontSize: T_HEAD, bold: true, color: INK, margin: 0,
    });
    s.addText(lg[1], {
      x: x + 0.28, y: 3.1, w: lw - 0.56, h: 0.3,
      fontFace: F, fontSize: T_STATCAP, bold: true, color: ACCENT, margin: 0, charSpacing: 0.5,
    });
    s.addText(lg[2], {
      x: x + 0.28, y: 3.5, w: lw - 0.56, h: 1.35,
      fontFace: F, fontSize: T_CAP, color: GRAY, margin: 0, valign: "top",
    });
  });

  lines(s, [
    "One thread throughout: ~every number here is a floor~, and the discipline",
    "that makes it a floor is exactly what makes it *usable*.",
  ], M, 5.4, 11.9, 1.0, { gap: 3 });
  s.addNotes("45 seconds. Signal that section six is the one that matters to them after I leave.");
}

// ============================================================== 4 DIVIDER 01
divider(1, "The brief · 2025–2026", "I was asked what is\nactually out there.", "Not what we fear is out there, and not what one year happened to show")
  .addNotes("Short. The brief was open; the one thing I committed to was the conservative posture.");

// ================================================================= 5 THE BRIEF
{
  const s = slide();
  chip(s, "The brief");
  title(s, "Four questions, asked in order of narrowing", "The CATOS Dataset — the time-extended successor to a corpus covering only 2025");

  const qs = [
    ["01", "How much coordination?", "And what infrastructure carries it"],
    ["02", "Which harms, how large?", "Scams, hostility, and where\nsafety systems fail"],
    ["03", "What changed over time?", "Whether one year guides\nthe next"],
    ["04", "What does it\nlook like?", "One event, detection\nthrough validation"],
  ];
  const cw = 2.85, gap = 0.22;
  qs.forEach((q, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 1.85, cw, 2.6, i === 3 ? PEACH : CREAM);
    s.addText(q[0], {
      x: x + 0.3, y: 2.05, w: 1.2, h: 0.6,
      fontFace: F, fontSize: 34, bold: true, color: ACCENT, margin: 0,
    });
    s.addText(q[1], {
      x: x + 0.3, y: 2.72, w: cw - 0.6, h: 0.82,
      fontFace: F, fontSize: T_SUB, bold: true, color: INK, margin: 0, valign: "top",
    });
    s.addText(q[2], {
      x: x + 0.3, y: 3.62, w: cw - 0.6, h: 0.8,
      fontFace: F, fontSize: T_CAP, color: GRAY, margin: 0, valign: "top",
    });
  });

  lines(s, [
    "The premise I was asked to test: that extending the corpus ~in time~ was not a",
    "quantitative convenience but a *qualitative* one.",
    { t: "It was. ~Three conclusions~ a 2025-only study would have supported are overturned by the full span.", gap: 0 },
  ], M, 4.85, 11.9, 1.5, { gap: 4 });
  s.addNotes("Land the last line — it is the spine of the report and the argument for how CATOS funds monitoring next.");
}

// =========================================================== 6 THE DELIVERABLES
{
  const s = slide();
  chip(s, "The brief");
  title(s, "What the year produced", "Two deliverables, and three things that keep working after the contract ends");

  statRow(s, 1.8, [
    ["~150", "pages · 17 chapters\n6 appendices"],
    ["1", "preprint\narXiv:2606.21996"],
    ["5", "briefings delivered\nDSO · DSTA · MDDI · IMDA · OTS Forum"],
    ["1", "grant call reopened\nOTS Call 3, AI-safety frontier"],
  ], { h: 1.5 });

  lines(s, [
    "*The report and the preprint are the deliverables.*",
    { t: "Every finding is chained to the test that bounds it, and Chapter 15 lists what I looked for and ~could not find~.", size: T_SUB, indent: 1 },
    "*The rest is infrastructure.*",
    { t: "A reproducibility manifest so this re-runs without me. A revised grant call opening agentic and multimodal AI safety. Introductions to MDDI, IMDA, SUTD and MLCommons left open and warm.", size: T_SUB, indent: 1 },
  ], M, 3.75, 11.9, 2.6, { gap: 10 });

  s.addNotes(
    "Don't read the stats. Spend the time on the second half: the durable output of a " +
    "visiting appointment is usually the connections and the reproducibility, not the PDF."
  );
}

// ====================================================== 7 VISHAKHA / ARES
{
  const s = slide();
  chip(s, "Collaborations");
  title(s, "With Vishakha Lall — whose scores are these?",
        "ARES · geopolitical bias in how models classify governance and freedom");

  lines(s, [
    "Ask several models to score countries on governance — transparency, corruption, rule of law — then change *who is asking*, and in *what language*.",
  ], M, 1.75, 11.9, 0.75, { size: T_SUB, gap: 0 });

  // each model carries a direction, and the direction is the finding
  const models = [
    ["Claude", "↓", "pulls scores down\nconsistently underestimates"],
    ["OpenAI", "↑", "pulls scores up\nconsistently overestimates"],
    ["DeepSeek", "↑", "overestimates, and warms to\nAsian countries as a China persona"],
  ];
  const cw = 3.83, gap = 0.2;
  models.forEach((m, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.6, cw, 1.75, i === 0 ? BLUEGRAY : PEACH);
    s.addText(m[0], {
      x: x + 0.3, y: 2.78, w: cw - 1.35, h: 0.45,
      fontFace: F, fontSize: T_HEAD, bold: true, color: INK, margin: 0, valign: "middle",
    });
    s.addText(m[1], {
      x: x + cw - 1.02, y: 2.7, w: 0.72, h: 0.66,
      fontFace: F, fontSize: 34, bold: true, color: ACCENT,
      align: "center", margin: 0, valign: "middle",
    });
    s.addText(m[2], {
      x: x + 0.3, y: 3.32, w: cw - 0.6, h: 0.85,
      fontFace: F, fontSize: T_CAP, color: GRAY, margin: 0, valign: "top",
    });
  });

  s.addText("THE SAME COUNTRY, SCORED UNDER FOUR CONDITIONS", {
    x: M, y: 4.55, w: 11.9, h: 0.3,
    fontFace: F, fontSize: 12, bold: true, color: ACCENT, margin: 0, charSpacing: 1,
  });
  const conds = ["No context", "As a US citizen", "As a China citizen", "Asked in Chinese"];
  conds.forEach((c, i) => {
    const x = M + i * (2.9 + 0.13);
    card(s, x, 4.9, 2.9, 0.6, CREAM);
    s.addText(c, {
      x, y: 4.9, w: 2.9, h: 0.6,
      fontFace: F, fontSize: T_SUB, color: INK, align: "center", margin: 0, valign: "middle",
    });
  });

  lines(s, [
    "The direction of the error is *stable per model* and moves with the persona — a Latin America penalty under both citizen framings, and Mexico scored correctly by one model and not others.",
    "What I added: plot ~context minus no-context~ to separate an induced shift from a standing bias; a per-country ranking so systematic offenders surface; finer regions than continents.",
  ], M, 5.7, 11.9, 1.3, { size: T_SUB, gap: 6 });

  cite(s, "Ground truth: US News soft-power index, top 90 countries. Repo: vishakha-astar/llm-bias.");
  s.addNotes(
    "Credit Vishakha properly — this is her analysis and her repo; I was a sounding board. " +
    "The finding that travels: bias here is not noise, it has a stable direction per model, " +
    "and the direction moves when you change who the model thinks is asking. " +
    "Meeting again Aug 3; the persona work in Singapore's languages is the natural next step."
  );
}

// ====================================================== 8 GERARD / BENCHMARK
{
  const s = slide();
  chip(s, "Collaborations");
  title(s, "With Gerard Yeo — correct until challenged",
        "Yeo & Ferrara · a benchmark for conversational epistemic robustness");

  lines(s, [
    "A model answers a factual claim correctly. Then the user pushes back for four turns — ~without ever supplying new evidence~. Does the judgment hold?",
  ], M, 1.72, 11.9, 0.75, { size: T_SUB, gap: 0 });

  const turns = [
    ["T1", "The claim\nis put", CREAM],
    ["T2", "A cue is\nintroduced", PEACH],
    ["T3", "The cue is\nreinforced", CREAM],
    ["T4", "“Are you\nsure?”", CREAM],
    ["T5", "Final recon-\nsideration", CREAM],
  ];
  const tw = 2.16, tgap = 0.28;
  turns.forEach((t, i) => {
    const x = M + i * (tw + tgap);
    card(s, x, 2.5, tw, 1.3, t[2]);
    s.addText(t[0], {
      x: x + 0.24, y: 2.62, w: tw - 0.48, h: 0.35,
      fontFace: F, fontSize: T_SUB, bold: true, color: i === 1 ? ACCENT : INK, margin: 0,
    });
    s.addText(t[1], {
      x: x + 0.24, y: 2.98, w: tw - 0.48, h: 0.72,
      fontFace: F, fontSize: T_CAP, color: GRAY, margin: 0, valign: "top",
    });
    if (i < 4) {
      s.addText("→", {
        x: x + tw + 0.01, y: 2.95, w: 0.26, h: 0.4,
        fontFace: F, fontSize: T_SUB, color: ACCENT, align: "center", margin: 0,
      });
    }
  });

  s.addChart(
    pres.ChartType.bar,
    [
      { name: "FEVER · encyclopaedic", labels: ["Emotional\nframing", "Provenance\nconflict", "Identity /\nauthority"], values: [5.7, 41.0, 53.0] },
      { name: "SciFact · scientific", labels: ["Emotional\nframing", "Provenance\nconflict", "Identity /\nauthority"], values: [9.7, 54.0, 61.7] },
    ],
    chartOpts({
      x: M, y: 4.05, w: 7.3, h: 2.5, barDir: "col", barGrouping: "clustered",
      showTitle: true, title: "Worst-case accuracy lost to the cue, in points (vs a neutral conversation)",
      showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12,
      chartColors: ["E4A08B", ACCENT],
      showLegend: true, legendPos: "b", legendFontFace: F, legendFontSize: 12, legendColor: GRAY,
      valAxisHidden: true, valGridLine: { style: "none" }, valAxisMaxVal: 75,
      catAxisLabelFontSize: 12,
    })
  );

  statRow(s, 4.15, [
    ["9,600", "five-turn conversations\n48,000 evaluated turns"],
    ["6", "models · Qwen3.5-9B, Qwen3-235B,\nGPT-5.5, GLM-5, DeepSeek V3.2, Mistral Large 3"],
  ], { x: 8.15, w: 4.5, h: 1.5 });

  lines(s, [
    "Not simply agreeable — ~selectively vulnerable~ to pressure dressed as evidence.",
  ], 8.15, 5.85, 4.5, 1.0, { size: T_SUB, gap: 0 });

  cite(s, "Yeo & Ferrara, Correct Until Challenged. Claims from FEVER and SciFact; C2PA-style provenance cues.");
  s.addNotes(
    "Gerard's experiment, Gerard's benchmark; I am second author. The design point worth " +
    "saying out loud: the user never supplies evidence, only the appearance of it. " +
    "So this measures deference to authority, not updating on new information."
  );
}

// ================================================== 9 GERARD / HOW IT FAILS
{
  const s = slide();
  chip(s, "Collaborations");
  title(s, "…and scientific claims break first",
        "Where the accuracy goes, and the two shapes the failure takes");

  s.addChart(
    pres.ChartType.bar,
    [
      { name: "Turn 1", labels: ["Qwen3.5-9B", "GPT-5.5", "GLM-5", "Qwen3-235B", "DeepSeek V3.2", "Mistral Large 3"], values: [80.0, 81.1, 80.6, 71.6, 59.9, 64.9] },
      { name: "Turn 5", labels: ["Qwen3.5-9B", "GPT-5.5", "GLM-5", "Qwen3-235B", "DeepSeek V3.2", "Mistral Large 3"], values: [72.8, 63.0, 61.9, 50.6, 34.0, 37.4] },
    ],
    chartOpts({
      x: M, y: 1.8, w: 7.3, h: 3.15, barDir: "col", barGrouping: "clustered",
      showTitle: true, title: "SciFact accuracy, first turn against last (%)",
      showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 10,
      chartColors: ["C9C2B8", ACCENT],
      showLegend: true, legendPos: "b", legendFontFace: F, legendFontSize: 12, legendColor: GRAY,
      valAxisHidden: true, valGridLine: { style: "none" }, valAxisMaxVal: 100,
      catAxisLabelFontSize: 10,
    })
  );

  lines(s, [
    "*Every* model ends lower than it started. Five lose more than 18 points.",
    "High first-turn accuracy buys nothing: GPT-5.5 opens strongest and still sheds 18 points.",
    "And the interaction ~damages far more than it repairs~ — up to 32.6% of correct answers go wrong, while under 6.3% of wrong ones come right.",
  ], 8.15, 1.95, 4.5, 2.9, { size: T_SUB, gap: 11 });

  card(s, M, 5.05, 5.75, 1.85, BLUEGRAY);
  s.addText("CONFIDENCE EROSION", {
    x: M + 0.35, y: 5.2, w: 5.05, h: 0.28,
    fontFace: F, fontSize: 12, bold: true, color: NAVY, margin: 0, charSpacing: 1,
  });
  s.addText("DeepSeek and Mistral retreat to uncertainty first — up to +46.3 points of correct→uncertain.", {
    x: M + 0.35, y: 5.55, w: 5.05, h: 1.3,
    fontFace: F, fontSize: T_SUB, color: INK, margin: 0, valign: "top",
  });

  card(s, M + 6.15, 5.05, 5.75, 1.85, PEACH);
  s.addText("SPECULATIVE RECONCILIATION", {
    x: M + 6.5, y: 5.2, w: 5.05, h: 0.28,
    fontFace: F, fontSize: 12, bold: true, color: ACCENT, margin: 0, charSpacing: 1,
  });
  s.addText("Told only that “a source says otherwise”, GPT-5.5 dropped a correct Booker Prize answer and invented an award-timing rule to justify it.", {
    x: M + 6.5, y: 5.55, w: 5.05, h: 1.3,
    fontFace: F, fontSize: T_SUB, color: INK, margin: 0, valign: "top",
  });

  cite(s, "Yeo & Ferrara, Correct Until Challenged, Tables 2 and 4. Under submission, ARR August.");
  s.addNotes(
    "The two cards are the transferable part. Erosion versus reversal is a model-family " +
    "property, so a guardrail that blocks direct agreement can still leave you with " +
    "authority-induced uncertainty. And the Rushdie example lands with any audience: the " +
    "model did not just cave, it manufactured a reason to cave."
  );
}

// ============================================================== 7 DIVIDER 02
divider(2, "The corpus", "154 million posts, and\nno idea who wrote them.", "One constraint shapes every sentence in the report")
  .addNotes("Everything in the findings section depends on the audience understanding this constraint.");

// ================================================================= 8 THE CORPUS
{
  const s = slide();
  chip(s, "The corpus");
  title(s, "What the CATOS Dataset is", "Facebook, Reddit and YouTube · January 2020 – June 2026");

  lines(s, [
    "~154,284,618~ items across three platforms",
    "*267 distinct spaces* — pages, subreddits, channels",
    "*11.96M URLs* pointing to *105,022 domains*",
    { t: "One national conversation running in English, Malay, Mandarin and other Chinese varieties, and Tamil — and out into the messaging apps people are funnelled toward.", size: T_SUB, gap: 0 },
  ], M, 1.85, 5.4, 3.4, { gap: 12 });

  s.addChart(
    pres.ChartType.bar,
    [{ name: "Items (millions)", labels: ["Facebook", "Reddit", "YouTube"], values: [129.5, 16.5, 8.3] }],
    chartOpts({
      x: 6.5, y: 1.7, w: 6.1, h: 3.3, barDir: "bar",
      showTitle: true, title: "Corpus composition · millions of items",
      showValue: true, dataLabelPosition: "outEnd",
      valAxisHidden: true, valGridLine: { style: "none" }, valAxisMaxVal: 158,
      chartColors: [ACCENT, ACCENT, ACCENT],
    })
  );

  card(s, M, 5.45, 11.9, 1.1, PEACH);
  s.addText([
    { text: "84% ", options: { bold: true, fontSize: T_HEAD, color: ACCENT } },
    { text: "of everything here is Facebook — the one platform with no provider safety score at all. Hold that thought.", options: { fontSize: T_BODY, color: INK } },
  ], { x: M + 0.35, y: 5.55, w: 11.2, h: 0.9, fontFace: F, margin: 0, valign: "middle" });

  s.addNotes("Flag the Facebook share now; it pays off on the safety blind-spot slide in six minutes.");
}

// ==================================================================== 9 F000
{
  const s = slide();
  chip(s, "The corpus");
  title(s, "The constraint that shaped everything", "F000 · the dataset carries no usable account identities");

  card(s, M, 1.85, 5.75, 3.5, BLUEGRAY);
  s.addText("WHAT WE CAN SEE", {
    x: M + 0.4, y: 2.1, w: 5.0, h: 0.3,
    fontFace: F, fontSize: 12, bold: true, color: NAVY, margin: 0, charSpacing: 1,
  });
  lines(s, [
    "*What* was said",
    "*When* — to the second",
    "*Where* — page, subreddit, channel",
    "*What it linked to* — domains, lifespans",
  ], M + 0.4, 2.55, 5.0, 2.6, { size: T_BODY, gap: 11 });

  card(s, M + 6.15, 1.85, 5.75, 3.5, PEACH);
  s.addText("WHAT IS PERMANENTLY OUT OF REACH", {
    x: M + 6.55, y: 2.1, w: 5.0, h: 0.3,
    fontFace: F, fontSize: 12, bold: true, color: ACCENT, margin: 0, charSpacing: 1,
  });
  lines(s, [
    "*Who* said it",
    "Sockpuppet or bot-network mapping",
    "Attribution to any actor or state",
    "Whether repetition was authentic",
  ], M + 6.55, 2.55, 5.0, 2.6, { size: T_BODY, gap: 11 });

  lines(s, [
    "The account-level toolkit platform integrity is built on is ~out of scope by construction~.",
    "So the study was rebuilt around *content, timing and infrastructure* — what the data can carry.",
  ], M, 5.6, 11.9, 1.45, { gap: 5 });

  s.addNotes(
    "Be blunt: I could not have done bot detection here if I had wanted to. The constraint " +
    "forced a better-disciplined study than I would otherwise have written."
  );
}

// ============================================================= 10 VOCABULARY
{
  const s = slide();
  chip(s, "The corpus");
  title(s, "So when this report says “coordinated”", "It means one thing, and the room should hear only that thing");

  card(s, M, 1.8, 11.9, 0.95, CREAM2);
  s.addText([
    { text: "The same text, verbatim, reposted across several distinct communities, in a temporal pattern ", options: { fontSize: T_BODY, color: INK } },
    { text: "tighter than chance predicts.", options: { fontSize: T_BODY, bold: true, color: ACCENT } },
  ], { x: M + 0.4, y: 1.85, w: 11.1, h: 0.85, fontFace: F, margin: 0, valign: "middle" });

  s.addText("Read it as “verbatim-repeated across spaces” — and no more. Equally consistent with:", {
    x: M, y: 3.0, w: 11.9, h: 0.5,
    fontFace: F, fontSize: T_BODY, color: INK, margin: 0,
  });

  const alts = [
    ["An organised campaign", "The reading people jump to.\nIt is one of four.", true],
    ["Many people, loosely aligned", "Independently favouring\nthe same slogan.", false],
    ["One viral post", "Quoted, screenshotted,\nre-pasted at scale.", false],
    ["Platform mechanics", "Share buttons, cross-posting,\nmoderation bots.", false],
  ];
  const cw = 2.85, gap = 0.22;
  alts.forEach((a, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 3.55, cw, 1.85, a[2] ? PEACH : CREAM);
    s.addText(a[0], {
      x: x + 0.28, y: 3.75, w: cw - 0.56, h: 0.75,
      fontFace: F, fontSize: T_SUB, bold: true, color: a[2] ? ACCENT : INK, margin: 0, valign: "top",
    });
    s.addText(a[1], {
      x: x + 0.28, y: 4.5, w: cw - 0.56, h: 0.8,
      fontFace: F, fontSize: T_CAP, color: GRAY, margin: 0, valign: "top",
    });
  });

  s.addText("This report identifies no one as responsible for anything. Crossing that line, even under pressure for a more dramatic finding, forfeits the trust that makes the rest usable.", {
    x: M, y: 5.65, w: 11.9, h: 0.8,
    fontFace: F, fontSize: T_SUB, italic: true, color: GRAY, margin: 0,
  });
  s.addNotes("Say the last line looking at the room. It is what lets this be handed to a ministry without becoming an accusation.");
}

// ============================================================= 11 DIVIDER 03
divider(3, "The findings", "Five results I would\ndefend anywhere.", "Each one paired with the specific test that bounds it")
  .addNotes("Twelve minutes. Keep moving — the detail is in the report.");

// ========================================================= 12 FINDING 1 FUNNEL
{
  const s = slide();
  chip(s, "Finding 1 · coordination");
  title(s, "Coordination is real, and substantial", "Chapter 4 · exact-duplicate clustering, then two filters that do real work");

  s.addChart(
    pres.ChartType.bar,
    [{ name: "Clusters", labels: ["Exact duplicates\n(≥5 items)", "Large enough\nto test", "Survive the\ntemporal null", "Span 3+\nspaces"], values: [858728, 86955, 50124, 44214] }],
    chartOpts({
      x: M, y: 1.8, w: 6.8, h: 3.5, barDir: "col",
      showTitle: true, title: "From raw duplicates to policy-relevant coordination",
      showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "#,##0",
      chartColors: ["C9C2B8", "C9C2B8", ACCENT, ACCENT],
      varyColors: true, valAxisHidden: true, valGridLine: { style: "none" },
      valAxisMaxVal: 1000000, catAxisLabelFontSize: 12,
    })
  );

  lines(s, [
    "The permutation null removed ~42%~ of flagged clusters.",
    { t: "Raw duplicate-counting would have overstated coordination by nearly half.", size: T_SUB, mute: true },
    "*44,214* crossed three or more community boundaries.",
    { t: "The only measure that means anything for platform integrity.", size: T_SUB, mute: true },
    { t: "Largest single cluster: *239,336 items*, one verbatim string.", size: T_SUB, gap: 0 },
  ], 7.75, 1.95, 4.85, 3.55, { gap: 10 });

  cite(s, "CATOS technical report, §4.3–4.5. Median effect size 2.21 among survivors; q < 0.05, Benjamini–Hochberg.");
  s.addNotes("If they remember one number here, make it 42% — that is what the null removed.");
}

// ============================================================ 13 FINDING 1b
{
  const s = slide();
  chip(s, "Finding 1 · coordination");
  title(s, "…and every count is a floor", "We injected known campaigns into the real corpus, then reworded them");

  s.addChart(
    pres.ChartType.line,
    [{ name: "Detector recall", labels: ["0%\nverbatim", "10%\nreworded", "20%\nreworded", "40%\nreworded"], values: [0.500, 0.375, 0.067, 0.011] }],
    chartOpts({
      x: M, y: 1.8, w: 7.0, h: 3.6,
      showTitle: true, title: "Share of a known campaign the detector recovers",
      lineDataSymbol: "circle", lineDataSymbolSize: 10, lineSize: 3,
      showValue: true, dataLabelPosition: "t", dataLabelFormatCode: "0.000",
      valAxisMinVal: 0, valAxisMaxVal: 0.6, valAxisLabelFormatCode: "0.0",
    })
  );

  lines(s, [
    "A campaign that varies its wording even slightly is ~almost entirely invisible~.",
    "*No count here estimates true coordination.* Each is a high-precision floor, and the truth is very likely much larger.",
    "Any comparison across time or platform compares ~verbatim floors~. A group that paraphrases more merely looks less coordinated.",
  ], 8.05, 1.95, 4.55, 3.5, { size: T_SUB, gap: 13 });

  card(s, M, 5.6, 11.9, 0.95, CREAM2);
  s.addText([
    { text: "This is the slide that makes the report honest — ", options: { fontSize: T_BODY, color: INK } },
    { text: "and it is also the strongest funding case in it.", options: { fontSize: T_BODY, bold: true, color: ACCENT } },
  ], { x: M + 0.4, y: 5.65, w: 11.1, h: 0.85, fontFace: F, margin: 0, valign: "middle" });

  cite(s, "CATOS technical report, Table 15.A. 360 injected items per condition.");
  s.addNotes("Convert the limitation into the ask: paraphrase-robust detection is the highest-leverage gap, and I return to it at the end.");
}

// ============================================================= 14 FINDING 2
{
  const s = slide();
  chip(s, "Finding 2 · harm");
  title(s, "The dominant harm is commercial", "Chapter 6 · precision-corrected floors, never raw cue-hits");

  statRow(s, 1.8, [
    ["769,601", "raw scam cue-hits\nbefore correction"],
    ["× 0.208", "measured gold-set\nprecision"],
    ["~160,307", "the floor I actually\nreport"],
    ["5.6×", "enrichment over\nthe corpus base rate"],
  ], { h: 1.35 });

  lines(s, [
    "Fake investments · job offers · giveaway impersonation · gambling · recovery scams",
    "All the same shape: a *polite, transactional* message carrying a link that funnels the reader ~off-platform into a private messaging app~, where nothing is observable at all.",
  ], M, 3.45, 11.9, 1.6, { gap: 12 });

  card(s, M, 5.2, 11.9, 1.3, DARK);
  s.addText("Politics is what everyone asks about. Fraud is what the data is full of.", {
    x: M + 0.45, y: 5.25, w: 11.0, h: 1.2,
    fontFace: F, fontSize: T_HEAD, bold: true, color: WHITE, margin: 0, valign: "middle",
  });
  cite(s, "CATOS technical report, §6 and §15.3. Gold set: 25 definite positives of 120 definite labels.");
  s.addNotes("Explain the arithmetic out loud. Anyone quoting 769,601 is quoting the wrong number.");
}

// ============================================================ 15 FINDING 2b
{
  const s = slide();
  chip(s, "Finding 2 · harm");
  title(s, "Two infrastructures, two lifecycles", "Chapter 5 · the signal that survives paraphrase");

  s.addChart(
    pres.ChartType.bar,
    [{ name: "Median observed lifespan (days)", labels: ["Disposable\nalgorithmically-named", "Persistent\nestablished domains"], values: [91, 1865] }],
    chartOpts({
      x: M, y: 1.8, w: 7.0, h: 3.2, barDir: "bar",
      showTitle: true, title: "Median domain lifespan · days",
      showValue: true, dataLabelPosition: "outEnd",
      chartColors: [ACCENT, NAVY], varyColors: true,
      valAxisHidden: true, valGridLine: { style: "none" }, valAxisMaxVal: 2150,
    })
  );

  lines(s, [
    "~A 20-fold gap~ — and *78.6%* of tested burner domains were pushed in synchronised bursts.",
    "Infrastructure survives rewording. Paraphrase defeats the text detector; it does not conjure a new domain.",
    "Visible from *public domain data alone*, with no platform cooperation.",
    { t: "But the flag misfires on ~1 in 10~ oddly-named legitimate sites. A candidate generator, not a verdict.", size: T_SUB },
  ], 8.05, 1.9, 4.55, 3.5, { size: T_SUB, gap: 10 });

  lines(s, [
    "A 91-day cycle is *invisible in any single-year window* — which is the next finding, arriving early.",
  ], M, 5.5, 11.9, 0.75, { gap: 0 });

  cite(s, "CATOS technical report, §5.4–5.6 and §4.6. DGA synchrony: 55 of 70 domains at q < 0.05.");
  s.addNotes("The misfire line matters — the report tables where the flag over-triggers, including recognisable publishers.");
}

// ============================================================= 16 FINDING 3
{
  const s = slide();
  chip(s, "Finding 3 · the blind spot");
  title(s, "The safety systems cannot see the main harm", "Chapter 7 · a negative result about a common instrument");

  s.addChart(
    pres.ChartType.bar,
    [{ name: "Mean provider toxicity", labels: ["Scam-cue content", "Corpus mean"], values: [0.1522, 0.1625] }],
    chartOpts({
      x: M, y: 1.85, w: 5.7, h: 3.0, barDir: "col",
      showTitle: true, title: "Scam scores calmer than average",
      showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.000",
      chartColors: [ACCENT, GRAY], varyColors: true,
      valAxisMaxVal: 0.2, valAxisLabelFormatCode: "0.00",
    })
  );

  s.addChart(
    pres.ChartType.bar,
    [{ name: "Items (millions)", labels: ["Scored by a provider\n(Reddit)", "No provider score\nat all (Facebook)"], values: [34.8, 129.5] }],
    chartOpts({
      x: 6.75, y: 1.85, w: 5.85, h: 3.0, barDir: "col",
      showTitle: true, title: "And most of the corpus is never scored",
      showValue: true, dataLabelPosition: "outEnd",
      chartColors: [NAVY, ACCENT], varyColors: true,
      valAxisHidden: true, valGridLine: { style: "none" }, valAxisMaxVal: 150,
    })
  );

  lines(s, [
    "Scam content is ~polite by design~. It is optimised to pass exactly the classifier we trust to catch harm.",
    { t: "This is not a coverage gap that more compute closes. A safety system tuned to toxicity, harassment and hate will *systematically under-serve* a market where commercial fraud is the principal measurable harm.", size: T_SUB, gap: 0 },
  ], M, 5.15, 11.9, 1.75, { gap: 8 });

  cite(s, "CATOS technical report, Chapter 7 (RQ-D) and §15.5.");
  s.addNotes("The most operationally consequential finding for partners in the room. Toxicity-classifier audits should test scam performance specifically.");
}

// ============================================================ 17 FINDING 3b
{
  const s = slide();
  chip(s, "Finding 3 · the blind spot");
  title(s, "The two blind spots are mirror images", "Each layer is blind roughly where the other is strong");

  const colX = [4.35, 8.6];
  ["Coordination & infrastructure", "Provider toxicity scoring"].forEach((h, i) => {
    s.addText(h, {
      x: colX[i], y: 1.9, w: 4.0, h: 0.4,
      fontFace: F, fontSize: T_SUB, bold: true, color: INK, align: "center", margin: 0,
    });
  });

  const rows = [
    ["Scam & funnel", "Strongest lift in the toolkit", "Weakest — scores below average", PEACH],
    ["Xenophobia", "Near-organic, little structure", "Comparatively well flagged", BLUEGRAY],
  ];
  let y = 2.45;
  rows.forEach((r) => {
    card(s, M, y, 11.9, 1.3, r[3]);
    s.addText(r[0], {
      x: M + 0.35, y: y + 0.3, w: 3.3, h: 0.7,
      fontFace: F, fontSize: T_HEAD, bold: true, color: INK, margin: 0, valign: "middle",
    });
    s.addText(r[1], {
      x: colX[0], y: y + 0.3, w: 4.0, h: 0.7,
      fontFace: F, fontSize: T_SUB, color: INK, align: "center", margin: 0, valign: "middle",
    });
    s.addText(r[2], {
      x: colX[1], y: y + 0.3, w: 4.0, h: 0.7,
      fontFace: F, fontSize: T_SUB, color: INK, align: "center", margin: 0, valign: "middle",
    });
    y += 1.5;
  });

  lines(s, [
    "Neither layer alone gives a complete picture of either harm.",
    "That is an argument for *combining* them — not for choosing between them.",
  ], M, 5.65, 11.9, 1.0, { gap: 5 });
  s.addNotes("Short slide, big point. The mismatch is the finding, and it is the clearest architectural recommendation in the report.");
}

// ============================================================= 18 FINDING 4
{
  const s = slide();
  chip(s, "Finding 4 · xenophobia");
  title(s, "Xenophobia is pervasive, not concentrated", "A genuine negative result, and the least comfortable one to deliver");

  s.addChart(
    pres.ChartType.bar,
    [{ name: "Enrichment over base rate", labels: ["Scam cues", "Xenophobia cues"], values: [5.6, 1.4] }],
    chartOpts({
      x: M, y: 1.9, w: 6.2, h: 3.1, barDir: "col",
      showTitle: true, title: "Cue precision relative to the corpus base rate",
      showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0.0"×"',
      chartColors: [NAVY, ACCENT], varyColors: true,
      valAxisHidden: true, valGridLine: { style: "none" }, valAxisMaxVal: 6.8,
    })
  );

  lines(s, [
    "Xenophobia cue precision is *high* — 87%.",
    "But so is its base rate: roughly ~62%~ of definite labels in a random sample.",
    "High precision on a common phenomenon is not a detector. It is a thermometer.",
    { t: "The signal is not a needle in a haystack. It is a property of much of the hay — and you cannot address that by taking down a network, because there is ~no network to take down~.", size: T_SUB },
  ], 7.35, 2.0, 5.25, 3.2, { size: T_SUB, gap: 13 });

  card(s, M, 5.35, 11.9, 1.15, CREAM2);
  s.addText("A coordinated-campaign result would have been easier to deliver. It comes with an obvious intervention. This one does not, and saying so is part of the job.", {
    x: M + 0.4, y: 5.4, w: 11.1, h: 1.05,
    fontFace: F, fontSize: T_BODY, color: INK, margin: 0, valign: "middle",
  });
  cite(s, "CATOS technical report, §6.7 and §15.4. Gold set: 80 of 92 definite labels.");
  s.addNotes("Do not soften this. An intervention premised on isolating a small coordinated core would be aimed at something that is not there.");
}

// ============================================================= 19 FINDING 5
{
  const s = slide();
  chip(s, "Finding 5 · time");
  title(s, "A single year can invert the truth", "The methodological spine · three conclusions a 2025-only corpus would support");

  const flips = [
    ["Commercial spam looks near-organic", "0.19", "15.8", "2025 funnel lift", "2020 funnel lift", "Scale inverted"],
    ["Sharing looks platform-balanced", "parity", "FB-led", "in 2025", "in 2020", "Direction inverted"],
    ["Disposable infrastructure looks absent", "91", "1,865", "day burner median", "day persistent median", "Invisible in one year"],
  ];
  let y = 1.85;
  flips.forEach((f, i) => {
    card(s, M, y, 11.9, 1.28, i === 0 ? PEACH : CREAM);
    s.addText(f[0], {
      x: M + 0.35, y: y + 0.28, w: 4.0, h: 0.75,
      fontFace: F, fontSize: T_SUB, bold: true, color: INK, margin: 0, valign: "middle",
    });
    s.addText(f[1], {
      x: M + 4.5, y: y + 0.2, w: 1.9, h: 0.55,
      fontFace: F, fontSize: T_HEAD, bold: true, color: GRAY, align: "center", margin: 0, valign: "middle",
    });
    s.addText(f[3], {
      x: M + 4.5, y: y + 0.74, w: 1.9, h: 0.35,
      fontFace: F, fontSize: T_STATCAP, color: GRAY, align: "center", margin: 0,
    });
    s.addText("→", {
      x: M + 6.5, y: y + 0.35, w: 0.5, h: 0.5,
      fontFace: F, fontSize: T_HEAD, color: ACCENT, align: "center", margin: 0, valign: "middle",
    });
    s.addText(f[2], {
      x: M + 7.1, y: y + 0.2, w: 1.9, h: 0.55,
      fontFace: F, fontSize: T_HEAD, bold: true, color: ACCENT, align: "center", margin: 0, valign: "middle",
    });
    s.addText(f[4], {
      x: M + 7.1, y: y + 0.74, w: 1.9, h: 0.35,
      fontFace: F, fontSize: T_STATCAP, color: GRAY, align: "center", margin: 0,
    });
    s.addText(f[5], {
      x: M + 9.3, y: y + 0.28, w: 2.25, h: 0.75,
      fontFace: F, fontSize: T_CAP, bold: true, color: ACCENT, align: "right", margin: 0, valign: "middle",
    });
    y += 1.42;
  });

  card(s, M, 6.2, 11.9, 0.85, DARK);
  s.addText("Longitudinal span is not more data. It is a correction mechanism.", {
    x: M + 0.45, y: 6.22, w: 11.0, h: 0.8,
    fontFace: F, fontSize: T_BODY, bold: true, color: WHITE, margin: 0, valign: "middle",
  });
  cite(s, "CATOS technical report, §15.7 and §16.2.");
  s.addNotes(
    "If the room takes one thing for how CATOS designs monitoring, it is this slide. " +
    "The 2025-only predecessor was not wrong — it was under-determined, and in two of three cases pointed the wrong way."
  );
}

// ============================================================= 20 DIVIDER 04
divider(4, "The worked case · GE2025", "One election,\nstart to finish.", "Including the mistake the pipeline caught before I published it")
  .addNotes("Six minutes. The point of this section is the error, not the headline.");

// ================================================================ 21 PIPELINE
{
  const s = slide();
  chip(s, "GE2025");
  title(s, "The pipeline, on one well-understood event", "Chapter 14 · the same four steps used everywhere else in the report");

  const steps = [
    ["Detect", "Exact-duplicate clustering,\nthen the multi-space filter", false],
    ["Label", "Local model, three passes,\nmajority vote", false],
    ["Validate", "A deliberately worst-case\nhuman sample, as a gate", true],
    ["Correct", "Targeted re-label,\nthen report v2", false],
  ];
  const cw = 2.72, gap = 0.42;
  steps.forEach((st, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 1.9, cw, 2.15, st[2] ? PEACH : CREAM);
    s.addText(st[0], {
      x: x + 0.28, y: 2.1, w: cw - 0.56, h: 0.5,
      fontFace: F, fontSize: T_HEAD, bold: true, color: st[2] ? ACCENT : INK, margin: 0,
    });
    s.addText(st[1], {
      x: x + 0.28, y: 2.68, w: cw - 0.56, h: 1.2,
      fontFace: F, fontSize: T_CAP, color: GRAY, margin: 0, valign: "top",
    });
    if (i < 3) {
      s.addText("→", {
        x: x + cw + 0.02, y: 2.65, w: 0.38, h: 0.5,
        fontFace: F, fontSize: T_HEAD, color: ACCENT, align: "center", margin: 0,
      });
    }
  });

  lines(s, [
    "Political copypasta peaks in the ~week before Polling Day~, then collapses.",
    "The third box is the one people skip. It is the one that saved this chapter.",
  ], M, 4.35, 11.9, 1.1, { gap: 7 });

  statRow(s, 5.55, [
    ["4.5%", "mean coordination share\nacross the corpus"],
    ["22.0%", "raw peak, April 2025\n— read the next slide first"],
    ["0.98", "mean self-reported\nmodel confidence"],
  ], { h: 1.1 });

  cite(s, "CATOS technical report, Chapter 14 and §10.3.");
  s.addNotes("Note the highlighted third box deliberately. Validation is a gate here, not a formality.");
}

// ======================================================== 22 WHAT IT CAUGHT
{
  const s = slide();
  chip(s, "GE2025");
  title(s, "What the validation gate caught", "A 3-billion-parameter model, confidently wrong in exactly one place");

  card(s, M, 1.85, 5.75, 3.3, CREAM);
  s.addText("VERSION 1 · AS THE MODEL REPORTED IT", {
    x: M + 0.4, y: 2.1, w: 5.0, h: 0.3,
    fontFace: F, fontSize: 12, bold: true, color: GRAY, margin: 0, charSpacing: 1,
  });
  s.addText("42 clusters · 1,925 items", {
    x: M + 0.4, y: 2.5, w: 5.0, h: 0.45,
    fontFace: F, fontSize: T_HEAD, bold: true, color: INK, margin: 0,
  });
  lines(s, [
    "labelled anti-opposition",
    "Reliable on *direct* pro/anti stance (80–100%)",
    "Agreed with itself across all three passes",
  ], M + 0.4, 3.05, 5.0, 1.9, { size: T_SUB, gap: 10 });

  card(s, M + 6.15, 1.85, 5.75, 3.3, PEACH);
  s.addText("WHAT A HUMAN REVIEWER FOUND", {
    x: M + 6.55, y: 2.1, w: 5.0, h: 0.3,
    fontFace: F, fontSize: 12, bold: true, color: ACCENT, margin: 0, charSpacing: 1,
  });
  s.addText("16 of 42 mislabelled — 38%", {
    x: M + 6.55, y: 2.5, w: 5.0, h: 0.45,
    fontFace: F, fontSize: T_HEAD, bold: true, color: INK, margin: 0,
  });
  lines(s, [
    "Sarcastic anti-incumbent posts read as anti-opposition",
    "Neutral structural commentary swept in with them",
    "Ten of the sixteen carried ~no partisan valence at all~",
  ], M + 6.55, 3.05, 5.0, 2.1, { size: T_SUB, gap: 10 });

  card(s, M, 5.4, 11.9, 1.15, DARK);
  s.addText([
    { text: "Small-model labels are hypotheses, not measurements. ", options: { bold: true, color: WHITE, fontSize: T_BODY } },
    { text: "Self-consistency is not correctness — it was most confident exactly where it was wrong.", options: { color: "C6CDD4", fontSize: T_BODY } },
  ], { x: M + 0.45, y: 5.45, w: 11.0, h: 1.05, fontFace: F, margin: 0, valign: "middle" });

  cite(s, "CATOS technical report, §14.5–14.6 and §15.8. Model: Qwen2.5-3B, 3-pass majority.");
  s.addNotes("Most transferable slide in the deck. Irony is the failure mode, and irony is the register political speech uses.");
}

// ============================================================= 23 THE HEADLINE
{
  const s = slide();
  chip(s, "GE2025");
  title(s, "The validated headline", "Corrected v2 — the numbers I actually report");

  s.addChart(
    pres.ChartType.bar,
    [
      { name: "Clusters", labels: ["Anti-incumbent", "Pro-incumbent"], values: [125, 53] },
      { name: "Items ÷ 50", labels: ["Anti-incumbent", "Pro-incumbent"], values: [148, 78] },
    ],
    chartOpts({
      x: M, y: 1.85, w: 6.5, h: 3.2, barDir: "col", barGrouping: "clustered",
      showTitle: true, title: "Copypasta volume by stance · clusters and scaled items",
      showValue: true, dataLabelPosition: "outEnd",
      chartColors: [ACCENT, "E4A08B"],
      showLegend: true, legendPos: "b", legendFontFace: F, legendFontSize: 12, legendColor: GRAY,
      valAxisHidden: true, valGridLine: { style: "none" }, valAxisMaxVal: 175,
    })
  );

  lines(s, [
    "~2.4 : 1~ by cluster count · ~1.9 : 1~ by item count",
    { t: "Pro-incumbent copypasta is a small set of *high-reach slogans* (73 items per cluster). Anti-incumbent is a wider variety of *longer critiques* (59 per cluster).", size: T_SUB },
  ], 7.55, 1.95, 5.05, 1.95, { gap: 10 });

  card(s, 7.55, 4.0, 5.05, 1.15, PEACH);
  s.addText("And what it is not: evidence of coordinated inauthentic behaviour, foreign interference, or manipulation.", {
    x: 7.85, y: 4.05, w: 4.45, h: 1.05,
    fontFace: F, fontSize: T_SUB, color: INK, margin: 0, valign: "middle",
  });

  lines(s, [
    "High-volume criticism of a long-governing party at its most exposed moment is *unremarkable* in a democracy. It is visible here only because some of it took verbatim, cross-space form.",
    "And the same week's largest raw cluster — ~13,014 items~ — was Reddit AutoModerator boilerplate in a single space. *Check spread, never size.*",
  ], M, 5.35, 11.9, 1.35, { size: T_SUB, gap: 7 });

  cite(s, "CATOS technical report, §14.7 and §13.3.");
  s.addNotes("Read the caveat card out loud, in full. This is the slide most likely to be photographed, and the caveat must travel with the number.");
}

// ============================================================= 24 DIVIDER 05
divider(5, "The preprint", "Hate has a different\nshape in each language.", "A cross-lingual audit — the one piece of this work that is public")
  .addNotes("Two minutes only. This is an appetiser; the room can read the preprint.");

// ================================================================ 25 THE PAPER
{
  const s = slide();
  chip(s, "The preprint");
  title(s, "Cultural targets, structural frames", "8,561 candidates adjudicated · 2,190 confirmed hostile · three languages");

  s.addChart(
    pres.ChartType.bar,
    [{ name: "Confirmed hostile (%)", labels: ["English", "Chinese", "Indonesian"], values: [26.0, 27.1, 21.3] }],
    chartOpts({
      x: M, y: 1.85, w: 5.5, h: 2.9, barDir: "col",
      showTitle: true, title: "Share of sampled candidates confirmed hostile",
      showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0.0"%"',
      chartColors: [ACCENT, ACCENT, ACCENT],
      valAxisHidden: true, valGridLine: { style: "none" }, valAxisMaxVal: 34,
    })
  );

  lines(s, [
    "~Targets~ are language-specific. English hostility spreads broadly; Chinese concentrates on a *Malay–Chinese divide*; Indonesian concentrates on *religion*.",
    "~Frames~ are determined by the target's category, and are shared across communities.",
    "~Resonance~ rewards nativist hostility over religious hostility.",
    "~Morals~ lean in-group-protective — but under a labelling confound.",
  ], 6.55, 1.95, 6.05, 3.0, { size: T_SUB, gap: 9 });

  card(s, M, 5.15, 11.9, 1.35, CREAM2);
  s.addText([
    { text: "Three of the four lenses replicate on the full 2020–2026 record. ", options: { bold: true, fontSize: T_BODY, color: INK } },
    { text: "The practical consequence: English-only monitoring systematically misses the Chinese- and Indonesian-language fault lines, because they target different groups entirely.", options: { fontSize: T_BODY, color: INK } },
  ], { x: M + 0.4, y: 5.2, w: 11.1, h: 1.25, fontFace: F, margin: 0, valign: "middle" });

  cite(s, "Ferrara (2026), arXiv:2606.21996; CATOS report Chapter 9.");
  s.addNotes("One line to land: English-only monitoring misses the other fault lines entirely, because they target different groups.");
}

// ============================================================= 26 DIVIDER 06
divider(6, "The lessons · what travels", "What Singapore\ntaught me.", "The dataset stays behind. This is the part I hope does not.")
  .addNotes("Slow down. This section has the longest half-life for the people in the room.");

// ============================================================== 27 THREE GATES
{
  const s = slide();
  chip(s, "Lessons");
  title(s, "Three gates, and what each one caught", "None of them expensive. All three changed a headline.");

  const gates = [
    ["Calibrate against a null", "Every detector gets a randomisation baseline and a sensitivity curve before its output is believed.", "Removed ~42%~ of flagged clusters, and reframed every count as a floor"],
    ["Correct by measured precision", "Every raw count is multiplied through a gold-set precision estimate and reported as an explicit floor.", "Turned 769,601 cue-hits into a defensible ~160,307~"],
    ["Validate against worst cases", "Every model label is checked against a deliberately adversarial human sample before it is reported.", "Caught a ~38%~ mislabel rate hiding behind 0.98 confidence"],
  ];
  let y = 1.9;
  gates.forEach((g, i) => {
    card(s, M, y, 11.9, 1.42, CREAM);
    s.addText(String(i + 1), {
      x: M + 0.3, y: y + 0.35, w: 0.7, h: 0.7,
      fontFace: F, fontSize: 40, bold: true, color: ACCENT, align: "center", margin: 0, valign: "middle",
    });
    s.addText(g[0], {
      x: M + 1.15, y: y + 0.2, w: 4.35, h: 0.45,
      fontFace: F, fontSize: T_SUB, bold: true, color: INK, margin: 0, valign: "middle",
    });
    s.addText(g[1], {
      x: M + 1.15, y: y + 0.66, w: 5.1, h: 0.62,
      fontFace: F, fontSize: T_STATCAP, color: GRAY, margin: 0, valign: "top",
    });
    lines(s, [g[2]], M + 6.6, y + 0.4, 5.0, 0.75, { size: T_SUB, gap: 0 });
    y += 1.56;
  });

  s.addText("Each gate caught a real error that would otherwise have reached the headline.", {
    x: M, y: 6.6, w: 11.9, h: 0.45,
    fontFace: F, fontSize: T_BODY, italic: true, color: GRAY, margin: 0,
  });
  s.addNotes("Emphasise cheapness. None of these needed new collection or compute — only deciding in advance that a result is not finished until it has been attacked.");
}

// ========================================================= 28 SPREAD NOT SIZE
{
  const s = slide();
  chip(s, "Lessons");
  title(s, "Trust spread, not size", "The biggest spike in six years was a moderation bot talking to itself");

  s.addChart(
    pres.ChartType.bar,
    [{ name: "Items", labels: ["Largest raw cluster\n(1 space, AutoModerator)", "Median multi-space\ncoordinated cluster"], values: [13014, 62] }],
    chartOpts({
      x: M, y: 1.9, w: 6.4, h: 3.1, barDir: "bar",
      showTitle: true, title: "Cluster size tells you almost nothing",
      showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "#,##0",
      chartColors: ["C9C2B8", ACCENT], varyColors: true,
      valAxisHidden: true, valGridLine: { style: "none" }, valAxisMaxVal: 15500,
    })
  );

  lines(s, [
    "April 2025 shows a raw coordination share of ~22%~ — the highest month in the corpus.",
    "Event-anchoring traces the largest cluster to *one space*: Reddit's AutoModerator, posting rule text that is verbatim by construction.",
    { t: "The trustworthy measure is the *multi-space fraction*. Raw size is a trap.", size: T_BODY },
  ], 7.45, 2.0, 5.15, 3.1, { size: T_SUB, gap: 12 });

  cite(s, "CATOS technical report, §10.4, §13.3 and §15.6.");
  s.addNotes("Good place for a beat of humour — six years of data and the headline spike is a bot reading out the subreddit rules.");
}

// ============================================================ 29 FIVE LESSONS
{
  const s = slide();
  chip(s, "Lessons");
  title(s, "Five things I'd tell whoever picks this up", "Not report language — what I actually say to students");

  const items = [
    ["Report floors, and say so every time", "A floor everyone understands beats an estimate nobody defends"],
    ["Never use toxicity as a scam screen", "The largest harm here is polite. It is engineered to pass"],
    ["Assume the model is confidently wrong somewhere", "Sarcasm was the where. Next time it will be something else"],
    ["Measure more than one year", "Two of three headline directions flipped at six years"],
    ["Publish the negative results", "A report that only says what it found is not trustworthy"],
  ];
  let y = 1.85;
  items.forEach((it, i) => {
    if (i % 2 === 0) card(s, M, y - 0.06, 11.9, 0.86, CREAM);
    s.addText(String(i + 1), {
      x: M + 0.3, y: y + 0.05, w: 0.5, h: 0.6,
      fontFace: F, fontSize: T_HEAD, bold: true, color: ACCENT, align: "center", margin: 0, valign: "middle",
    });
    s.addText(it[0], {
      x: M + 0.95, y: y + 0.02, w: 5.6, h: 0.65,
      fontFace: F, fontSize: T_SUB, bold: true, color: INK, margin: 0, valign: "middle",
    });
    s.addText(it[1], {
      x: M + 6.7, y: y + 0.02, w: 4.9, h: 0.65,
      fontFace: F, fontSize: T_CAP, color: GRAY, margin: 0, valign: "middle",
    });
    y += 0.85;
  });

  card(s, M, 6.1, 11.9, 0.85, PEACH);
  s.addText("The negative-results chapter is the one I'd read first if someone handed me this report. It is Chapter 15.", {
    x: M + 0.4, y: 6.12, w: 11.1, h: 0.8,
    fontFace: F, fontSize: T_BODY, color: INK, margin: 0, valign: "middle",
  });
  s.addNotes("Conversational delivery. Slow on the last one.");
}

// ============================================================ 30 WHAT TO FUND
{
  const s = slide();
  chip(s, "Lessons");
  title(s, "What I would fund next, in order of leverage", "Each gap is a specific, fundable capability — not a wish list");

  const dirs = [
    ["1", "Paraphrase-aware detection", "Turns every floor into a bounded estimate", "HIGHEST LEVERAGE", PEACH],
    ["2", "From floors to prevalence", "Annotation work, not new collection", "CHEAPEST WIN", CREAM],
    ["3", "A multi-model labelling stack", "Failure modes published, not just accuracies", "HIGHEST RIGOUR", CREAM],
    ["4", "Instagram, TikTok, X", "Delivered but unanalysed; lead-lag is moving", "WIDEST COVERAGE", CREAM],
    ["5", "Infrastructure-anchored monitoring", "A 91-day burner cycle needs a standing monitor", "MOST OPERATIONAL", CREAM],
  ];
  let y = 1.85;
  dirs.forEach((d) => {
    card(s, M, y, 11.9, 0.84, d[4]);
    s.addText(d[0], {
      x: M + 0.3, y: y + 0.14, w: 0.5, h: 0.6,
      fontFace: F, fontSize: T_HEAD, bold: true, color: ACCENT, align: "center", margin: 0, valign: "middle",
    });
    s.addText(d[1], {
      x: M + 0.95, y: y + 0.11, w: 3.9, h: 0.66,
      fontFace: F, fontSize: T_SUB, bold: true, color: INK, margin: 0, valign: "middle",
    });
    s.addText(d[2], {
      x: M + 4.95, y: y + 0.11, w: 4.85, h: 0.66,
      fontFace: F, fontSize: T_STATCAP, color: GRAY, margin: 0, valign: "middle",
    });
    s.addText(d[3], {
      x: M + 9.9, y: y + 0.11, w: 1.75, h: 0.66,
      fontFace: F, fontSize: 11, bold: true, color: ACCENT, align: "right", margin: 0, valign: "middle",
    });
    y += 0.92;
  });

  s.addText("Recall first, then calibration, then labelling rigour, then coverage, then timeliness. Each arrives paired with the validation that bounds it — or it should not arrive at all.", {
    x: M, y: 6.5, w: 11.9, h: 0.55,
    fontFace: F, fontSize: T_SUB, italic: true, color: GRAY, margin: 0,
  });
  cite(s, "CATOS technical report, §17.2.");
  s.addNotes("This is the slide for leadership. Every item maps to a numbered limitation in Chapter 15.");
}

// ========================================================= 31 WHAT I EXPECTED
{
  const s = slide();
  chip(s, "What Singapore taught me");
  title(s, "I came looking for the wrong thing", "And the data spent six months telling me so");

  card(s, M, 1.9, 5.75, 3.65, BLUEGRAY);
  s.addText("WHAT I ARRIVED EXPECTING", {
    x: M + 0.4, y: 2.15, w: 5.0, h: 0.3,
    fontFace: F, fontSize: 12, bold: true, color: NAVY, margin: 0, charSpacing: 1,
  });
  s.addText("Influence operations.", {
    x: M + 0.4, y: 2.5, w: 5.0, h: 0.9,
    fontFace: F, fontSize: T_HEAD, bold: true, color: INK, margin: 0,
  });
  lines(s, [
    "Political manipulation, coordinated networks, an election to be defended.",
    "Fifteen years of my field points there.",
  ], M + 0.4, 3.45, 5.0, 2.0, { size: T_SUB, gap: 10 });

  card(s, M + 6.15, 1.9, 5.75, 3.65, PEACH);
  s.addText("WHAT THE DATA KEPT SAYING", {
    x: M + 6.55, y: 2.15, w: 5.0, h: 0.3,
    fontFace: F, fontSize: 12, bold: true, color: ACCENT, margin: 0, charSpacing: 1,
  });
  s.addText("Fraud, infrastructure,\nlanguage.", {
    x: M + 6.55, y: 2.5, w: 5.0, h: 0.9,
    fontFace: F, fontSize: T_HEAD, bold: true, color: INK, margin: 0,
  });
  lines(s, [
    "The biggest harm is commercial.",
    "The durable signal is a domain, not a sentence.",
    "Fault lines differ ~in every language~.",
  ], M + 6.55, 3.45, 5.0, 2.0, { size: T_SUB, gap: 10 });

  s.addText("The politics was real, bounded, and episodic. It was not the story.", {
    x: M, y: 5.8, w: 11.9, h: 0.5,
    fontFace: F, fontSize: T_BODY, bold: true, color: INK, margin: 0,
  });
  s.addNotes("Honest and a little self-deprecating. This is the personal turn the title promises.");
}

// ============================================================== 32 THE PEOPLE
{
  const s = slide();
  chip(s, "What Singapore taught me");
  title(s, "The correction that mattered most", "It did not come from a model");

  card(s, M, 1.9, 11.9, 2.0, CREAM);
  s.addText([
    { text: "I had the corpus down as Bahasa Indonesia. ", options: { fontSize: T_HEAD, color: INK } },
    { text: "A colleague read the draft carefully and told me I was wrong — it is overwhelmingly Malay.", options: { fontSize: T_HEAD, bold: true, color: ACCENT } },
  ], { x: M + 0.45, y: 2.0, w: 11.0, h: 1.8, fontFace: F, margin: 0, valign: "middle" });

  lines(s, [
    "That single correction changed a chapter, and it changed what the hate audit is allowed to claim.",
    "No amount of compute would have caught it. ~A research centre would.~",
    "That is what CATOS was for me: a place where somebody knew the language, argued with my thresholds, checked my base rates, and told me when I had it wrong — early enough that it never reached print.",
  ], M, 4.2, 11.9, 2.55, { gap: 13 });

  s.addNotes(
    "Name Raj here if it feels right — he caught it on the June draft. Specific credit lands " +
    "better than general thanks, and this is the moment for it."
  );
}

// =========================================================== 33 THREE TAKEAWAYS
{
  const s = slide();
  chip(s, "What Singapore taught me");
  title(s, "Three takeaways", "If everything else falls out of memory on the way to the lift");

  const ts = [
    ["1", "The harm is commercial", "scam beats politics, by volume", "and it is polite enough that toxicity classifiers score it below average"],
    ["2", "Every count is a floor", "and saying so is the point", "a floor everyone understands is worth more than an estimate nobody defends"],
    ["3", "One year can invert the truth", "measure long, or say you did not", "two of three headline directions flipped once six years were available"],
  ];
  const cw = 3.83, gap = 0.2;
  ts.forEach((t, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 1.85, cw, 4.35, CREAM);
    s.addText(t[0], {
      x, y: 2.0, w: cw, h: 1.2,
      fontFace: F, fontSize: T_NUMERAL, bold: true, color: ACCENT, align: "center", margin: 0, valign: "middle",
    });
    s.addText(t[1], {
      x: x + 0.3, y: 3.2, w: cw - 0.6, h: 0.9,
      fontFace: F, fontSize: T_HEAD, bold: true, color: INK, align: "center", margin: 0, valign: "top",
    });
    s.addText(t[2], {
      x: x + 0.3, y: 4.15, w: cw - 0.6, h: 0.6,
      fontFace: F, fontSize: T_SUB, bold: true, color: ACCENT, align: "center", margin: 0, valign: "top",
    });
    s.addText(t[3], {
      x: x + 0.3, y: 4.85, w: cw - 0.6, h: 1.15,
      fontFace: F, fontSize: T_CAP, color: GRAY, align: "center", margin: 0, valign: "top",
    });
  });
  s.addNotes("Deliver these three slowly. They are the ones that survive the walk to the lift.");
}

// ================================================================ 34 THANK YOU
{
  const s = slide({ noFoot: true });
  s.addText("Thank you", {
    x: M, y: 1.85, w: 8.4, h: 1.5,
    fontFace: F, fontSize: 80, bold: true, color: INK, margin: 0, valign: "middle",
  });
  s.addText("Emilio Ferrara  ·  emiliofe@usc.edu", {
    x: M, y: 3.55, w: 8.4, h: 0.7,
    fontFace: F, fontSize: 32, bold: true, color: ACCENT, margin: 0, valign: "middle",
  });
  lines(s, [
    { t: "For the data, the arguments, the corrections, and the year.", size: T_CAP, mute: true, gap: 3 },
    { t: "And for Dr. Yinping Yang, who asked the questions this work tries to answer.", size: T_CAP, mute: true },
  ], M, 4.4, 8.4, 0.9);

  card(s, 9.3, 1.85, 3.35, 3.9, CREAM);
  s.addText("HANDED OVER", {
    x: 9.6, y: 2.1, w: 2.75, h: 0.3,
    fontFace: F, fontSize: 11, bold: true, color: ACCENT, margin: 0, charSpacing: 1,
  });
  lines(s, [
    "Technical report",
    "Preprint · arXiv:2606.21996",
    "Reproducibility manifest",
    "Every limitation, numbered",
  ], 9.6, 2.55, 2.75, 3.0, { size: T_CAP, gap: 12 });

  s.addText("Ferrara · CATOS farewell · A*STAR IHPC 2026", {
    x: W - M - 4.6, y: H - 0.42, w: 4.6, h: 0.26,
    fontFace: F, fontSize: T_FOOT, color: GRAY, align: "right", margin: 0,
  });
  s.addNotes(
    "Close on Yinping, then open the floor. Expected questions: can we release the corpus " +
    "(CATOS-internal, decision sits above me — Roy Lee at SUTD has asked); can you name actors " +
    "(no, and it is structural); is the anti-incumbent skew interference (no)."
  );
}

// ============================================================ 35–40 BACKUP
{
  const s = slide();
  chip(s, "Backup");
  title(s, "The corpus and the coordination funnel", "For questions · every count is a floor unless stated otherwise");

  statRow(s, 1.85, [
    ["154,284,618", "items, Jan 2020 – Jun 2026"],
    ["129,506,705", "Facebook comments (84%)"],
    ["16,487,473", "Reddit posts and comments"],
    ["8,290,440", "YouTube items"],
  ], { h: 1.1, size: 21 });

  statRow(s, 3.15, [
    ["858,728", "exact-duplicate clusters, ≥5 items"],
    ["50,124", "survive the null (57.6% of 86,955)"],
    ["44,214", "span 3 or more distinct spaces"],
    ["239,336", "items in the largest single cluster"],
  ], { h: 1.1, size: 21 });

  statRow(s, 4.45, [
    ["267", "distinct spaces"],
    ["11,959,097", "URLs"],
    ["105,022", "distinct domains"],
    ["2.21", "median effect size among survivors"],
  ], { h: 1.1, size: 21 });

  s.addText("Detector recall across rewording: 0.500 → 0.375 → 0.067 → 0.011 at 0 / 10 / 20 / 40 percent.", {
    x: M, y: 5.8, w: 11.9, h: 0.4,
    fontFace: F, fontSize: T_SUB, color: INK, margin: 0,
  });
  cite(s, "CATOS technical report, §1.2, §4.3–4.6, Table 15.A.");
  s.addNotes("Leave up during Q&A rather than walking through it.");
}

{
  const s = slide();
  chip(s, "Backup");
  title(s, "Harm, infrastructure and time", "The rest of the numbers");

  statRow(s, 1.85, [
    ["~160,307", "scam floor\n769,601 cue-hits × 0.208 precision"],
    ["~256,573", "xenophobia floor\n295,048 cue-hits × 0.870 precision"],
    ["5.6× / 1.4×", "enrichment\nscam vs xenophobia"],
  ], { h: 1.35 });

  statRow(s, 3.4, [
    ["0.152 / 0.163", "scam toxicity vs corpus mean\nprovider scoring, Reddit only"],
    ["91 / 1,865", "burner vs persistent domain\nmedian lifespan, days"],
    ["78.6%", "DGA synchrony\n55 of 70 domains at q < 0.05"],
  ], { h: 1.35 });

  statRow(s, 4.95, [
    ["15.8 → 0.19", "funnel lift\n2020 → 2025"],
    ["4.5% / 22.0%", "coordination share\nmean / raw peak (Apr 2025)"],
    ["2,190", "confirmed hostile\nof 8,561 adjudicated"],
  ], { h: 1.35 });

  cite(s, "CATOS technical report, §5–7, §10–13, Chapter 9; arXiv:2606.21996.");
  s.addNotes("Backup. Point at the relevant tile rather than reading it.");
}

{
  const s = slide();
  chip(s, "Backup");
  title(s, "What this study cannot do", "Chapter 15 · stated so that no finding is over-read");

  const lims = [
    ["No attribution", "No actor, group or state is identified. Structural, not cautious."],
    ["No prevalence", "Counts are floors, never population rates."],
    ["No paraphrased coordination", "Recall falls to 0.011 at 40% rewording."],
    ["No inauthenticity claim", "Repetition is measured. Intent and automation are not."],
    ["Partial platform coverage", "Instagram, TikTok and X delivered but unanalysed."],
    ["Screening is not incidence", "Safety-screen indicators have unknown precision."],
  ];
  const cw = 3.83, gap = 0.2;
  lims.forEach((l, i) => {
    const x = M + (i % 3) * (cw + gap);
    const y = 1.9 + Math.floor(i / 3) * 2.05;
    card(s, x, y, cw, 1.8, CREAM);
    s.addText(l[0], {
      x: x + 0.3, y: y + 0.22, w: cw - 0.6, h: 0.66,
      fontFace: F, fontSize: T_SUB, bold: true, color: ACCENT, margin: 0, valign: "top",
    });
    s.addText(l[1], {
      x: x + 0.3, y: y + 0.92, w: cw - 0.6, h: 0.8,
      fontFace: F, fontSize: T_CAP, color: GRAY, margin: 0, valign: "top",
    });
  });

  s.addText("Significance thresholds (q < 0.05, Benjamini–Hochberg) control the false-discovery rate across a tested population. They do not certify any individual cluster, URL or domain.", {
    x: M, y: 6.1, w: 11.9, h: 0.7,
    fontFace: F, fontSize: T_SUB, color: INK, margin: 0,
  });
  s.addNotes("Useful if anyone pushes for a claim the data cannot support — point at the relevant tile.");
}

// -------------------------------------------------------------------- write
pres.writeFile({ fileName: "CATOS_Farewell_Ferrara_Aug2026.pptx" }).then((f) => {
  console.log(`Wrote ${f} (${n} slides)`);
});

if (n !== TOTAL) {
  throw new Error(`TOTAL is ${TOTAL} but ${n} slides were built — update TOTAL so the footers read correctly.`);
}
