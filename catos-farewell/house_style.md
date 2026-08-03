# House style — extracted from "From Bots to Agents" (IMDA, 45 min, 41 slides)

Measured from the reference PDF, not guessed. `build_deck.js` implements this.

## Canvas and fonts

13.333 × 7.5 in. Calibri throughout — Regular, Bold, Italic, BoldItalic. White
background; one dark slide permitted late in the deck.

## Colours

| Role | Hex |
|---|---|
| Ink (all body and titles) | `1A1A1A` |
| Accent red (text) | `D04A2D` |
| Accent red (fill) | `D0492C` |
| Gray (standfirst, captions, footer) | `7A7A7A` |
| Cream card | `F6F3EE` |
| Deeper cream card | `EFEBE6` |
| Peach card (contrast / warning) | `F6D9CA` |
| Blue-gray card (contrast) | `E6EBF1` |
| Dark panel | `1F2A36` |
| Navy text (rare) | `1F3A5F` |

## Type ladder

| Role | Size | Weight / colour |
|---|---|---|
| Section-divider statement | 44 | Bold ink |
| Slide title | 31.7 | Bold ink |
| Card heading / takeaway head | 23.8 | Bold ink |
| Stat number (row of three) | 26 | Bold red |
| Giant numeral (takeaways) | 66 | Bold red |
| **Body primary** | **20.2** | Regular ink; emphasis inline |
| Body secondary (indented) | 18 | Regular ink |
| Caption / detail | 15.9 | Regular gray |
| Divider standfirst | 17.3 | Italic gray |
| Divider eyebrow | 15.1 | Bold red, caps |
| Slide standfirst | 15.9 | Italic gray |
| Stat caption | 12.3 | Gray |
| Citation (bottom-left) | 10.1 | Italic red |
| Section chip (top-right) | 10.1 | Bold red, caps, thin red outline |
| Footer (bottom-right) | 9.4 | Gray |

## Geometry (inches)

- Tick mark: x 0.70, y 0.40, 0.42 × 0.05, accent red. On every slide.
- Title top: y 0.50. Standfirst top: y 1.00.
- Content starts: y ≈ 1.70.
- Footer baseline: y 7.20, right-aligned. Citation: x 0.55, y 7.20.
- Section chip: right-aligned at x ≈ 10.75, y 0.28.
- Divider: eyebrow y 3.05, statement y 3.35, standfirst y 4.65; ghosted numeral
  right at ~190pt in `EFEBE6`.

## Rules that matter most

1. **Every content slide carries a figure** — a chart or a shape-built diagram.
   76% of the reference does; a text-only slide is the exception, not the norm.
2. **Body copy is 20pt.** Not 13. This alone forces brevity.
3. **Emphasis is inline** — `~red bold~` and `*ink bold*` inside running
   sentences. Never a separate coloured box to carry the emphasis.
4. **No bullet characters.** Short standalone lines; sub-points indented one level
   at 18pt.
5. Text column left ~40%, figure right ~55%. Or a short text block above a
   full-width diagram.
6. Published results get a citation bottom-left in small red italic.
7. Section dividers are **sentences**, not noun phrases: "Detection got good. The
   problem got organized."
