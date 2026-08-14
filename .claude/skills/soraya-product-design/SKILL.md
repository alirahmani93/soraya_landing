---
name: soraya-product-design
description: Use when deciding what goes in a Soraya box — adding, removing or resizing a SKU, setting fill quantities and the tea-bag blend ratio, resolving the open quantity decisions in the catalog, designing the range ladder from entry to flagship, or editing product/catalog.json. Use before packaging or pricing work, since both depend on what the contents are.
---

# Designing the Soraya range

The product designer owns `product/catalog.json`. Everything downstream —
packaging dimensions, cost sheets, label declarations, the landing page catalog —
reads from it. This skill is the only one that should be editing it.

## The rule that governs everything

**Contents decide the box, not the reverse.** Fill volumes determine drawer
sizes, drawer sizes determine the cube, the cube determines freight and cost.
Anyone who starts by choosing a nice box has committed to fill quantities without
knowing it.

## Open decisions

These are `null` in the catalog and each blocks real work downstream. In the order
they should be settled:

**1. Grams per kakuti leaf.** Blocks the flagship cost sheet *and* the Arabic
label, which must declare net weight and cannot say "10–30 leaves". Weigh a
representative sample. Five minutes with a kitchen scale unblocks two skills.

**2. Kakuti leaf count.** The brief says 10–30 — a range, not a specification.
Pick one number. The consideration is visual, not culinary: how many leaves fill
the drawer so it looks abundant rather than sparse when it slides out. Resolve
this by laying leaves out in the actual drawer footprint, not by arithmetic.

**3. Tea-bag blend ratio.** Saffron powder : kakuti leaf : rose petals, per bag.
A typical infusion bag is 1.5–2.5 g total. Constraints: saffron dominates colour
and cost, so it is the smallest fraction; kakuti carries the aroma and should
lead; rose is mostly visual and softens the finish. Brew three ratios and taste
them. This is the only decision in the range that must be made by tasting, and
it is also the one most likely to be settled by guessing — do not.

**4. Sizes for the three smaller SKUs.** See the ladder below.

**5. Drawer cube dimensions.** Blocked on 1–4. Falls out of them.

## The range ladder

Four SKUs is the right number: one flagship, two middles, one entry. Each needs a
job, and a SKU without a distinct job should be cut rather than kept for
completeness.

| SKU | Name | Job |
|---|---|---|
| `soraya` | Soraya | The product. Everything else exists to point at it. Carries the house name. |
| `lady-with-taste` | Lady with Taste | All three crops without the drawer cube. The closest thing to the flagship. |
| `iran` | Iran | For the buyer who wants saffron and not a story. Also the price anchor. |
| `peace` | Peace | Cheap enough to give away. The sample that is also a product. |

Names are the owner's. Note that none of them describes what the box *lacks* —
`lady-with-taste` is not "the one without drawers", it is its own thing. Keep that
when writing copy: never sell a smaller SKU as a reduced flagship.

**`lady-with-taste` is the dangerous one.** It carries all three crops, so the
only thing separating it from the flagship is the packaging and the tea bags. If
it is sized generously it eats the flagship. Size it *down* — meaningfully less of
each crop — so the ladder holds on contents as well as on presentation.

**Size the middles to make the flagship look generous.** If `iran` holds
2 mesghal at a price close to the Soraya box, the box's companion drawers read
as nearly free and the flagship sells itself. If `iran` is much cheaper
per mesghal, it cannibalises. Set the sizes and prices together with the pricing
skill — never in isolation.

Suggested starting point, to be confirmed against costs: `iran` at 1 mesghal,
`lady-with-taste` at 1 mesghal plus 20 g kakuti powder plus 10 g rose buds,
`peace` at 12 bags.

## Adding or changing a SKU

1. Give it a job in the ladder that no existing SKU has. If you cannot, stop.
2. Build it from existing components. A new component means new sourcing, new
   HS classification, new label lines and new inventory — a large cost that
   should be a deliberate decision, not a side effect of a product idea.
3. Write it into `catalog.json` with `status: "proposed"` and `qty: null` where
   undecided. Never invent a quantity to make the entry look finished.
4. Tell the packaging skill (new format?), the pricing skill (ladder still
   coherent?) and the trader skill (new heading?).

## Constraints that come from outside

Worth holding in mind while designing, because discovering them late is expensive:

- **Every drawer needs a declarable net weight.** Counts are not declarations.
- **Saffron and aromatics do not share air.** Saffron picks up neighbouring
  aromas and loses its own to light and heat. Each component needs its own sealed
  inner container inside the drawer; the drawer is presentation, not a barrier.
- **Shelf life is set by the shortest-lived component**, and Gulf importers apply
  a minimum-remaining-shelf-life rule at the border. A component with a short life
  drags the whole box down. See the trader skill.
- **One saffron grade in inventory.** The tea bags use ground saffron from the
  same lot as the threads, deliberately. A second grade doubles the inventory
  problem to save very little.

## References

- `references/components.md` — what each of the three crops is, how it behaves, what it needs
- `references/open-decisions.md` — the working sheet for the five decisions above

## Red flags

| Thought | Reality |
|---|---|
| "Put a nice round number in the null" | The null is doing its job. A guessed quantity is indistinguishable from a decided one later. |
| "Design the box first, it's the exciting part" | Contents set dimensions. A box designed first will be the wrong size. |
| "Add a fourth product to the box" | New component = new sourcing, HS code, label line, inventory. Deliberate decision only. |
| "10–30 leaves is fine, it's artisanal" | It is not label-compliant and it is not costable. |
| "Guess the tea ratio, adjust later" | Later means after the print run. Brew it. |
