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
| `lady-with-taste` | Lady with Taste | All three crops, no drawers, no tea bags |
| `iran` | Iran | Saffron alone |
| `peace` | Peace | Tea bags alone |

Treat the flagship as one point on a range, never as the only SKU. `lady-with-taste` carries all
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
  written once per frame as a `--p` custom property and every drawer transform is derived from it
  in CSS, so React does not re-render during the scroll.
- Drawers open in the physical box's order: saffron, kakuti, rose, tea. Changing that here means
  changing it in the box.
- Box geometry constraint: box width × (1 + `--travel`) must stay inside the stage container, or
  drawers slide off-screen on narrow viewports.
- Contact is direct-to-owner, not checkout. One Omani number serves phone, WhatsApp and Telegram.
  A `null` in `brand.contact` renders as nothing — never as a dead link or a placeholder number.
- "What is in the box" is paginated by SKU: tabs of package names, contents grouped the way the
  flagship's drawers group them. Groups a SKU does not carry are dropped, so `iran` renders one
  card. Undecided quantities render as the pending label, not as a guess.
- All imagery in `public/images/` is placeholder stock; see its `ATTRIBUTION.md`. There is no
  photograph of the box because the box does not exist yet — it is drawn in CSS.

## Conventions

- The brief is written in Persian. Owner-facing docs and requirements may stay Persian; code,
  identifiers, and commit messages are English. Site copy is Arabic and English only — Persian is
  not a shipping locale.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
