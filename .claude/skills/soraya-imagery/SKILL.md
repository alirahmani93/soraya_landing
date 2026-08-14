---
name: soraya-imagery
description: Use for every Soraya visual — enhancing the owner's product photographs, generating packshots or lifestyle images, building the 3D drawer-box asset the landing page animates, removing backgrounds, reframing for different placements, or writing a shot list before a photo session. Covers both the AI pipeline and the photography brief it depends on.
---

# Soraya imagery

The site sells a box nobody can touch. Every riyal of the premium rests on the
images, and the plan is to shoot the real product and enhance from there — not to
invent it. That order matters: generated images that do not match what ships are
a returns problem, not a marketing shortcut.

## The rule

**Photograph what exists. Generate only what cannot be photographed.**

Generated: environments, lighting fixes, backgrounds, angles impossible without a
studio, the 3D box the site animates before the box is manufactured.

Never generated: the product itself, in a way that differs from what ships.
A saffron drawer that looks fuller in the render than in the box is a complaint.

## Before spending anything

Higgsfield generation costs credits from the owner's account. **Ask before a
batch.** Check `balance` first, tell the owner roughly what the run will cost,
and get a yes. A single test image to validate a prompt is fine unasked; forty
variations is not.

## Pipeline

**1. Shoot.** See `references/shot-list.md`. The single highest-leverage step —
no amount of enhancement rescues a badly lit original, and saffron in particular
is hard to light without either blowing out the red or losing the thread detail.

**2. Upload.** `media_upload` for local files, `media_import_url` for hosted.
Returns a media reference the generation tools take as input.

**3. Enhance.** `generate_image` with the photograph as reference — relighting,
background replacement, colour correction toward the brand palette. Use
`models_explore` with `action: 'recommend'` when unsure which model fits.

**4. Isolate.** `remove_background` for packshots that need to sit on the site's
paper background at any size.

**5. Reframe.** `reframe` for aspect ratios, `outpaint_image` to extend a tight
crop into a hero banner. Both beat re-shooting and both beat cropping into a
compromise.

**6. Upscale.** `upscale_image` to 2K/4K, last, once the image is final. Upscaling
before other operations wastes the resolution.

**7. Batch.** `generate_image_batch` plus `jobs_wait`, then one
`show_generation_by_ids`, for independent variations. Cheaper in calls and much
cheaper in context than looping one at a time.

## The 3D box

The landing page opens drawers as the user scrolls. That asset is needed **before
the physical box exists**, which makes it the one place generation legitimately
precedes reality.

`generate_3d` turns an image into a GLB mesh. Path: render or photograph the box
form → `generate_3d` → GLB → the site animates it.

Two hard constraints:

- **The drawer opening order is fixed by the packaging skill** — saffron, kakuti,
  rose, tea. The site must open them in the same order the physical box does, or
  the animation is telling a different story than the product.
- **Dimensions come from `product/catalog.json`.** They are currently `null`. A
  3D box built to invented proportions will not match the manufactured one, and
  the site will need re-rendering. Either wait, or build it knowing it is a
  placeholder and say so.

Alternative worth considering: a scroll-driven sequence of *rendered stills* is
often lighter, more reliable across devices, and easier to art-direct than a live
3D model. See the tech-lead skill before committing to WebGL.

## Art direction

Palette and rules in `product/brand.json`. For images specifically:

- **Background is paper (#F6EFE2) or ink (#241C17).** Nothing else. Consistency
  across the catalog matters more than variety within it.
- **At most two product colours at full strength per image.** Saffron red and
  gold carry; kakuti green and rose support.
- **Light warm and directional**, as if late afternoon. Flat even lighting kills
  the thread texture that makes saffron look expensive.
- **Show scale.** Saffron photographs abstractly and viewers lose the sense of
  how much they are getting. A hand, a spoon, or the open drawer gives the eye a
  reference.
- **No generated hands touching product.** They still read as wrong and the error
  is more damaging on a premium page than a missing shot.

## What the site needs

Minimum set before launch:

| Shot | Use |
|---|---|
| Closed box, three-quarter | Hero |
| Box opening, drawers extended | Scroll sequence — many frames |
| Each drawer, top-down | Per-drawer sections, four images |
| Each component, macro | Detail, four images |
| Box in a hand or on a table | Scale and context |
| Tea brewing, cup with infusion | The tea-bag SKU |
| The three smaller SKUs | Range section |

Everything on paper or ink background, consistently lit, so the catalog reads as
one system.

## References

- `references/shot-list.md` — the photography brief for the real session
- `references/prompts.md` — prompt patterns that hold the brand look

## Red flags

| Thought | Reality |
|---|---|
| "Generate the product, photos come later" | The site would then advertise something that does not ship. |
| "Run forty variations and pick" | That is the owner's credit balance. Ask first. |
| "Make the saffron drawer look fuller" | That is a returns problem with a marketing coat on. |
| "Upscale first, then edit" | Upscale last. Everything before it wastes the resolution. |
| "Build the 3D box now" | Dimensions are `null`. It will not match what is manufactured. |
