---
name: soraya-packaging
description: Use for anything physical about how Soraya is packed — designing the drawer cube, sizing drawers, choosing inner containers and seals, specifying materials and finishes, writing a brief for a box manufacturer, laying out the Arabic/English label, or working out MOQ, tooling and lead times. Use after contents are settled and before ordering anything.
---

# Packaging Soraya

For this product the packaging is not a wrapper, it is the reason the price
works. Take the drawer cube away and the Soraya box competes on riyals per gram
against volume importers, which is a fight a family farm loses. Everything below
follows from that.

## Order of operations

Fill volumes → inner containers → drawer footprints → cube → materials → quote.

Never in reverse. A cube designed before the fills are known will be re-tooled,
and tooling is the one cost you cannot amortise twice. Check
`product/catalog.json` for `null` quantities before starting: if the contents are
open, the box cannot be sized. See the product-design skill.

## Two layers, not one

**The drawer is presentation. The seal is inside it.**

All three crops are aromatic and all three degrade with light, heat and humidity.
Saffron in particular absorbs neighbouring aromas — put it loose in a drawer
beside mint and rose and within a month it smells of mint and rose. Every
component gets its own sealed inner container:

| Component | Inner | Why |
|---|---|---|
| Negin saffron | Glass vial or small tin, opaque or amber | Light is the main enemy; glass also displays well |
| Kakuti powder | Sealed pouch or tin | Aroma loss |
| Kakuti leaf | Sealed pouch, ideally with a window | It is a display item; hiding it wastes it |
| Rose buds | Sealed pouch or clear-lidded tin | Buds are the visual hero — show them |
| Rose petals | Sealed pouch | Colour fades with light |
| Tea bags | Individually overwrapped | Otherwise they scent the whole box |

Windows are a real tension: they show the product, and they let in the light that
degrades it. Resolve it deliberately per drawer — buds and leaf earn a window,
saffron and petals do not.

## The cube

Reference form: a Japanese *jubako* or sushi presentation box — a rigid cube that
opens to reveal stacked sliding drawers, revealed one at a time.

Four drawers, one per crop plus tea:

1. Saffron — opens first, it is what they bought
2. Kakuti — powder and leaf together
3. Rose — buds and petals
4. Tea bags

The opening sequence is the product experience and it is also the landing page's
scroll animation. Physical and digital must match; a site that opens drawers in a
different order than the box does breaks the illusion the whole site exists to
create. Fix the sequence here and tell the tech-lead skill.

## Materials

Rigid boxes are thick paperboard wrapped in printed or textured paper. The
decisions that matter, in order of visible effect per riyal:

- **Wrap material.** Textured or uncoated stock reads premium; gloss lamination
  reads mass-market regardless of what it costs.
- **Foil or emboss on the brand mark.** Small area, large effect, modest cost.
- **Drawer pull.** Ribbon, notch, or cut-out. It is touched every time the box is
  opened, so it disproportionately sets the perceived quality.
- **Interior lining.** Printed or fabric. A raw grey board interior undoes an
  expensive exterior — this is the most commonly skipped item and the most
  visible one.
- **Magnetic closure.** Nice, adds cost, and is largely irrelevant on a drawer
  box where the drawers do the work.

Palette from `product/brand.json`. The rule holds in print as on screen: at most
two of the three product colours at full strength in any one view. Saffron red and
gold carry the brand; kakuti green and rose support.

## The label

Label layout is a packaging job, not an afterthought, because GCC rules force
content onto the pack that must be designed for rather than stickered over.
Mandatory in **Arabic**: product and brand name, country of origin (**Iran**),
ingredients in descending order, additives, net content in metric units,
production and expiry dates, manufacturer and importer details, storage and
preparation instructions.

Arabic stickers over an English label are legal and routine. They also look
exactly like what they are, which is wrong on a box whose premium rests entirely
on presentation. Design Arabic in from the start.

Two knock-on requirements: **net weight must be declarable** (so the kakuti leaf
count must resolve to grams), and **dates must be printed at filling**, which
means an overprint step in the process and a surface designed to take it.

See the trader skill for the full labelling rules.

## Sourcing

- Rigid box MOQ typically starts around **100 units**; some formats go lower and
  a few vendors quote no MOQ at higher unit prices.
- Production is typically **10–15 working days after artwork approval**, before
  freight.
- Tooling — dies, plates, first sampling — is one-off and must be amortised
  against a named first run, not an imagined lifetime volume.
- **Always order a physical sample before the run.** Screen proofs mislead on
  colour and tell you nothing about how a drawer slides.

Note the constraint this creates: the Omani buyers' 100 mesghal minimum is about
50 Soraya boxes, while the box MOQ is around 100. **Packaging, not saffron, sets
the first order size.** Everyone negotiating minimums needs to know that.

## References

- `references/box-spec.md` — the brief to send a manufacturer, with the fields they will ask for
- `references/materials.md` — finishes, linings, inner containers, what each costs in effect

## Red flags

| Thought | Reality |
|---|---|
| "Design the box, fills can adapt" | Backwards. Contents set dimensions; the box gets re-tooled. |
| "The drawer keeps it fresh" | It does not. The drawer is presentation; seal separately. |
| "Windows everywhere, show the product" | Light degrades all three crops. Window buds and leaf; not saffron. |
| "Sticker the Arabic on" | Legal, and it looks like a patch on a premium gift box. |
| "Skip the sample, approve the proof" | Proofs lie about colour and say nothing about how a drawer slides. |
| "Order 50, that's what the saffron minimum needs" | Box MOQ is ~100. The packaging binds first. |
