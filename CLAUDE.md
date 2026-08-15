# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

| Path | What it is |
|---|---|
| `Soraya.md` | The owner's original Persian brief. Source of truth if anything here disagrees. |
| `product/` | Machine-readable truth: `catalog.json`, `brand.json`, the cost-input template. Read `product/README.md` first. |
| `.claude/skills/soraya-*/` | Seven project skills — see below |
| `app/`, `components/`, `lib/`, `content/` | The landing page (Next.js App Router, deployed to Vercel) |

The Next app lives at the repo root rather than in a subdirectory, so `product/` sits inside
Vercel's deploy root and can be imported directly. Moving the app into a subdirectory would break
that import.

## Commands

```bash
npm run dev      # dev server (falls back to :3001 if :3000 is taken)
npm run build    # production build; also type-checks
npm run lint     # eslint
```

There are no tests. Verification is a build plus looking at both locales in a browser — the
checklist is in the `soraya-tech-lead` skill.

**The data core is load-bearing.** `product/catalog.json` and `product/brand.json` are read by
every skill and by the site. Box contents, quantities, palette and contact details live there and
nowhere else — a component or a skill that restates them has created a second source of truth that
will drift. `null` in those files means genuinely undecided, and consuming code should stop and say
what is missing rather than substitute a plausible value.

## The seven skills

| Skill | Owns |
|---|---|
| `soraya-product-design` | What goes in a box. The only skill that edits `catalog.json`. |
| `soraya-pricing` | Cost ladder, quotes, the SKU price ladder |
| `soraya-packaging` | The physical box, inner containers, the label, manufacturer briefs |
| `soraya-trader` | Export/import, HS codes, GCC labelling, Incoterms, deal structure |
| `soraya-seller` | Pitching, outreach, objections, product copy |
| `soraya-imagery` | Photography brief and the Higgsfield enhancement pipeline |
| `soraya-tech-lead` | The site. Thin by design — routes generic Next.js/Vercel work to the installed `vercel:*` skills and holds only Soraya's own decisions. |

Dependency order runs product-design → packaging → pricing → trader/seller. Contents decide the
box; the box decides cost; cost decides price.

## The business

Brand: **Soraya / ثریا**. A family saffron farm in Zanjan, Iran, selling through the family's Omani
company into Oman and the wider Gulf. Buyers in Oman quoted a 100-mesghal minimum order. Samples
were well received.

Two sides of the work, both requested by the owner:

1. A bilingual (Arabic + English) landing page / catalog, hosted on Vercel.
2. A set of skills and agents covering the non-software side: sales, trading, pricing, product
   design, packaging, 3D site imagery, plus a technical-lead skill for the landing page itself.

## Product structure

The flagship SKU is a single gift box combining three Zanjan products — saffron, kakuti
(*Ziziphora*), and Damask rose. Kakuti and rose are easier and cheaper to source than saffron and
exist partly to make the box viable at a sane price.

Flagship box contents:

| Item | Quantity |
|---|---|
| Negin saffron | 2 mesghal |
| Kakuti powder | 30 g |
| Kakuti leaf | 10–30 pieces |
| Damask rose buds | 20 g |
| Damask rose petals | 20 g |
| Tea bags (saffron + kakuti leaf + rose blend) | 20 |

Packaging: an East-Asian bento/sushi-style cube that opens into stacked sliding drawers. This is
the most expensive and most presentable configuration.

The range is four SKUs, named by the owner. Ids in `catalog.json` match the names:

| Id | Name | What it is |
|---|---|---|
| `soraya` | Soraya | The flagship drawer cube, all four drawers |
| `sofreh` | Sofreh | All three crops, no drawers, no tea bags |
| `iran` | Iran | Saffron alone |
| `peace` | Peace | Tea bags alone |

Treat the flagship as one point on a range, never as the only SKU. `sofreh` carries all
three crops, so only packaging and the tea bags separate it from the flagship — it must be sized
down or it cannibalises.

### Pricing conventions from the brief

- Kakuti leaf is costed at **0.9× the price of kakuti powder** — a deliberate simplification that
  keeps cost and margin arithmetic tractable.
- Tea bags use **saffron powder**, not a second grade of whole saffron, so the box carries only one
  saffron grade in inventory.
- Saffron is quantified in **mesghal** (the Iranian unit, ~4.6 g), not grams. Keep the unit
  explicit in any pricing or inventory code.

## Landing page

Built. Next.js 16 App Router, Tailwind v4, no i18n or animation library. See the
`soraya-tech-lead` skill for the decisions and the pre-deploy checklist; it routes generic
Next.js/Vercel questions to the installed `vercel:*` skills instead of restating them.

- `/ar` is the default locale and `/` redirects to it. Arabic is written first; English is the
  second copy, not the source. RTL uses logical properties — never `left`/`right`.
- The signature interaction is the sticky drawer box in `components/Stage.tsx`. Scroll progress is
  written once per frame as a `--p` custom property and every transform derives from it in CSS, so
  React does not re-render during the scroll.
- **The box is real CSS 3D**, not a layered 2D fake: every surface is a plane in one `preserve-3d`
  context and drawers pull along Z, toward the viewer. Two rules that are easy to get backwards
  and hard to debug from a screenshot:
  - The camera needs a **negative** `rotateX` to look *down* into the box. Positive looks up at it.
  - A horizontal surface that faces up must be `translateZ(-depth) rotateX(90deg)`. Using
    `rotateX(-90deg)` puts the plane in the same place with its normal pointing down, which is
    invisible once backfaces are culled — and backfaces must be culled, or the box's underside and
    far wall render on top of the drawers.
- Drawers open **one at a time**, in explicit phases: open over `RAMP`, hold, shut over `RAMP`,
  then a short gap with the box closed before the next starts. Overlapping the phases leaves a
  moment with a half-open drawer under a half-faded caption, which reads as broken — most visibly
  when scrolling back up. Each caption's fade window matches its drawer's exactly. After the last
  drawer, all four step out together as a finale.
- Drawer contents ride up as the drawer opens so the product clears the drawer walls.
- **The flat hero is the default** — flat photographic bands sliding sideways,
  `components/StageFlat.tsx`. **`?hero=3d`** serves the CSS 3D box (`components/Stage.tsx`) for
  comparison. Read client-side via `useSearchParams` inside a `Suspense` boundary so both locales
  stay statically rendered. Everything below about the 3D box applies to that variant.
- Drawers open in the physical box's order: saffron, kakuti, rose, tea. Changing that here means
  changing it in the box.
- Drawers run flush with the box sides. Inset them and the channel either side shows the interior
  through the closed front, so it stops reading as a closed box.
- Contact is direct-to-owner, not checkout. One Omani number serves phone, WhatsApp and Telegram.
  A `null` in `brand.contact` renders as nothing — never as a dead link or a placeholder number.
- "What is in the box" is paginated by SKU: tabs of package names, contents grouped the way the
  flagship's drawers group them. Groups a SKU does not carry are dropped, so `iran` renders one
  card. Undecided quantities render as the pending label, not as a guess.
- The enquiry form (`components/Enquiry.tsx`) is a native `<dialog>` opened from two places: under
  the packages tabs, where it preselects the open tab, and in the contact section. **It composes a
  `mailto:` — there is no server and nothing is sent from the site.** A real send needs an email
  provider and an API key; until then the copy says plainly that submitting opens the visitor's
  mail app, and there is a copy-to-clipboard fallback for anyone without one. Tailwind's preflight
  zeroes the margin a native dialog uses to centre itself, so the centring is explicit.
- Below the packages section sits **the real 3D box**: `components/BoxViewer.tsx` renders the
  three.js model in `lib/boxModel.ts`, ported from the Claude Design project
  `ac31e815-21b6-42d8-afb1-3582f0d50f4a` (`soraya-box-model.js`). Same box maker's dimensions —
  200 mm cube, 3 mm board, drawers of 40/44/48/53 mm. It is a **turntable, not an orbit**: the
  camera elevation is fixed and dragging only changes yaw, so there is no angle where the box tips
  or looks skewed. Field of view is 24° and the camera far back (near-orthographic) — a wide lens
  makes a cube read as bent while it turns; on a narrow viewport pull the camera back rather than
  widening the lens. three.js and the model load only when the section is within 600 px of the
  viewport and the render loop stops when it scrolls out.
- The foil lettering is drawn into a canvas at runtime, so it uses the site's own fonts read from
  the `--font-*` custom properties — next/font family names are generated and cannot be hardcoded.
- All imagery in `public/images/` is placeholder stock; see its `ATTRIBUTION.md`. There is no
  photograph of the box because the box does not exist yet — it is drawn in CSS in the hero and in
  three.js below.

## Conventions

- The brief is written in Persian. Owner-facing docs and requirements may stay Persian; code,
  identifiers, and commit messages are English. Site copy is Arabic and English only — Persian is
  not a shipping locale.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
