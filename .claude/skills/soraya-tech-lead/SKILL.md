---
name: soraya-tech-lead
description: Use for any software work on Soraya — building or changing the landing page, the Arabic/English locale setup and RTL, the scroll-driven drawer animation, images and performance, deploying to Vercel, environment variables, or domain setup. Holds the project's own decisions and routes generic Next.js, Vercel and design questions to the installed skills rather than restating them.
---

# Soraya technical lead

This skill is deliberately thin on Next.js and Vercel. Those are covered better
by skills already installed, and duplicating them here guarantees a stale copy.
What lives here is what those skills cannot know: the decisions this project has
already made, and the constraints the physical product places on the site.

## Route out for generic work

| Question | Skill |
|---|---|
| App Router, Server Components, data fetching, caching | `vercel:nextjs` |
| Deploying, promoting, rollbacks, preview URLs | `vercel:deploy`, `vercel:deployments-cicd` |
| Environment variables | `vercel:env-vars` |
| CLI, domains, logs | `vercel:vercel-cli` |
| Tailwind, component composition, shadcn | `vercel:shadcn`, `ui-ux-pro-max:ui-styling` |
| Visual direction for new UI | `frontend-design:frontend-design` |
| Debugging in a real browser | `chrome-devtools-mcp:chrome-devtools` |

Read those for *how*. Read this for *what this project decided*.

## Stack, and why

- **Next.js, App Router, TypeScript.** Static output; there is no backend and no
  checkout. Every page is prerendered for both locales.
- **Tailwind CSS v4.** Palette as CSS custom properties generated from
  `product/brand.json` so the site and the box cannot drift apart.
- **Custom i18n, no library.** Two locales, one page, a handful of strings. A
  `[locale]` route segment plus JSON dictionaries costs less than the config of
  any i18n package, and there is nothing here that needs pluralisation rules or
  runtime locale negotiation.
- **No animation library.** One scroll-driven sequence, driven by a small hook.
  A general-purpose animation dependency for a single effect is not worth its
  bundle on a page whose Gulf audience is largely on mobile networks.
- **Vercel.** Owner's choice, already decided.

## The decisions that are not negotiable

**Arabic is the default locale, not the translation.** `/ar` is the root
experience; `/en` is second. Copy is written in Arabic first — see the seller
skill. Anything that treats English as the source and Arabic as output will read
as imported, which undoes the premium the whole site exists to establish.

**RTL is a direction flip, not a stylesheet.** Use logical properties throughout —
`ms-*`/`me-*`, `ps-*`/`pe-*`, `start`/`end` — never `left`/`right`. Set `dir` on
`<html>` from the locale. Directional assets (arrows, the scroll indicator, the
drawer-slide direction) mirror; the product photography does not.

**The drawers open in the physical box's order.** Saffron, kakuti, rose, tea —
fixed by the packaging skill. If the site opens them in a different order it is
telling a different story than the object, and the object is the product.

**Content comes from `product/catalog.json`.** The catalog section reads the same
file the pricing and packaging skills read. Never retype contents into a
component; that is a second source of truth and it will drift the first time a
quantity changes.

**Contact links, not checkout.** WhatsApp, Telegram, email, Omani phone. There is
no cart. The values live in `product/brand.json` and several are currently `null` —
a `null` must render as *nothing*, never as a dead link or a placeholder number.

## The scroll sequence

The signature interaction: as the user scrolls, the box opens and drawers slide
out one at a time, each revealing its contents.

Implementation, in order of preference:

1. **Image sequence.** Frames shot as stop-motion with a fixed camera (the
   imagery skill's shot 4), swapped on scroll progress. Predictable, art-directed,
   works everywhere, degrades to a single still. This is the default.
2. **CSS transforms on layered images.** Individual drawer PNGs translated on
   scroll. Lighter than a sequence, less photographic.
3. **WebGL / 3D model.** Only if 1 and 2 genuinely cannot carry it. Costs bundle
   size, battery, and a fallback path, on a page selling to mobile users on Gulf
   mobile networks.

Whichever: `prefers-reduced-motion` must produce a static, complete view of the
open box — not a broken half-animation. And the sequence must not be the only way
to learn what is in the box; the content exists as text below it as well.

## Performance

Photography *is* the product here, so images are large and cannot simply be
compressed away. Budget: hero interactive quickly on a mid-range phone over
mobile data.

- `next/image` everywhere, AVIF and WebP, explicit sizes
- Preload only the first frame of the sequence; lazy-load the rest with a small
  lookahead
- Self-host fonts. An Arabic face is large — subset it. Check the Arabic
  rendering specifically, since a Latin-tested font stack routinely falls back
  badly for Arabic and nobody notices until an Arabic reader does.
- No third-party scripts. Nothing on this page needs them.

## Before deploying

- Both locales render, both directions correct
- Every contact link works from a phone, not just a desktop browser — WhatsApp
  and Telegram deep links behave differently there
- No `null` from `brand.json` rendered as a dead link
- Reduced-motion path shows the full open box
- Arabic text renders in the intended font, not a fallback
- Catalog figures match `product/catalog.json`
- Lighthouse on mobile throttling, not desktop

## Red flags

| Thought | Reality |
|---|---|
| "Write the English copy, translate to Arabic" | Arabic is the primary market. Write it first. |
| "Hardcode the box contents in the component" | Second source of truth. Read `catalog.json`. |
| "`left`/`right` is fine, I'll add an RTL override" | Logical properties from the start. Overrides rot. |
| "Add framer-motion for the scroll effect" | One effect. A hook is smaller than the dependency. |
| "Placeholder phone number until they send the real one" | A dead contact link on a launched page is worse than no link. Render nothing. |
| "Explain Next.js caching here" | Route to `vercel:nextjs`. A copy here goes stale. |
