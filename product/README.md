# Product data core

Machine-readable truth about what Soraya sells. Everything else in this repo —
the seven skills, the landing page — reads these files instead of restating them.

| File | Holds | Editable by |
|---|---|---|
| `catalog.json` | Components, the tea-bag assembly, packaging formats, SKUs and their bills of material, unit conversions | Owner + product-design skill |
| `brand.json` | Name, positioning, palette, locales, contact details, company structure | Owner + product-design skill |
| `costs.example.yaml` | Template for the cost inputs only the owner can supply | Template is versioned; the filled copy is not |
| `costs.yaml` | The real numbers. **Gitignored.** | Owner only |

## Rules

**Change contents here, nowhere else.** If a drawer's fill weight changes, it
changes in `catalog.json` and every consumer follows. A skill or a page that
hardcodes "2 mesghal" has introduced a second source of truth and will drift.

**`null` means unknown, and unknown blocks.** Several quantities are genuinely
undecided — tea-bag fill ratios, the smaller SKUs' sizes, box dimensions. They
are `null` rather than estimated. Any skill that hits a `null` should say what
is missing and stop, not substitute a plausible number. A guessed number in a
quote is worse than no quote.

**Saffron is stored in mesghal.** 1 mesghal = 4.608 g. Store the mesghal figure
and derive grams for labels; never store the gram figure and derive back, or
rounding compounds across the bill of materials.

## Known open decisions

These are tracked here rather than in five skill files:

- Tea-bag fill ratio — saffron powder : kakuti leaf : rose petals, per bag
- Kakuti leaf count in the Soraya box — the brief says 10–30, which cannot be
  costed or declared on a label
- Sizes for the three smaller SKUs
- Drawer-cube dimensions, which follow from the six fill volumes
- Whether the tea bags classify under HS 0902.40 or 1211.90 — different duty
- All of `costs.yaml`
