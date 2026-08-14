---
name: soraya-pricing
description: Use when costing or pricing any Soraya SKU — building a cost sheet, quoting an Omani buyer, setting wholesale or retail prices, checking whether a discount still clears margin, or deciding what a smaller box should cost relative to the Soraya box. Also use when a price already given needs re-checking after an FX move.
---

# Pricing Soraya

A saffron box is not priced by adding up ingredients. Three things fight each
other: what the goods cost, what a Gulf buyer will pay for a gift, and what
margin a trader needs before they will carry you. This skill holds the method
for landing all three in one number.

## Before you compute anything

Read `product/catalog.json` for the bill of materials and `product/costs.yaml`
for the inputs. If `costs.yaml` does not exist, tell the owner to copy
`costs.example.yaml` and fill it — then stop. Do not price from public averages.
A price built on someone else's cost base is a guess wearing a suit.

**Any `null` you need is a hard stop.** Name the missing field, say what it
blocks, and ask. Never substitute a plausible number to keep the calculation
moving; the output looks identical whether the inputs were real or invented,
and the owner cannot tell them apart afterwards.

## The cost ladder

Build in this order. Each rung is a named subtotal the owner can argue with.

1. **Goods** — every component at its cost, converted through the units in
   `catalog.json`. Saffron in mesghal (1 mesghal = 4.608 g); herbs in grams.
2. **Derived components** — kakuti leaf is costed at **0.9 × the per-gram cost
   of kakuti powder**. This is the owner's agreed simplification, not a measured
   figure; see `references/costing-rules.md` for why it holds and when it breaks.
3. **Assemblies** — the tea bag is its own small bill of materials plus filter
   paper, tag, thread. Cost one bag, then multiply.
4. **Packaging** — per unit *at the quantity actually being ordered*. Rigid
   drawer boxes drop steeply with volume, so a packaging cost without a quantity
   attached is not a cost. Amortise tooling across the first run and say so.
5. **Labour** — filling, sealing, labelling. Small per box, not zero.
6. **Export** — inland freight, certificates, freight, duty, clearance. These are
   per-shipment; divide by units per shipment and state the assumed shipment size
   on the sheet, because halving the shipment doubles this rung.
7. **Landed cost per box** — the sum. Everything above the line is arithmetic.
   Everything below is judgment.

## Then price, don't mark up

Cost-plus alone will underprice the Soraya box and overprice the tea bags.
Work the other direction as a cross-check:

- **Ceiling** — what the box competes with as a *gift*, not as a spice. See
  `references/gulf-market.md`. The comparison in the buyer's mind is a premium
  dates-and-chocolate box, not loose saffron by the gram.
- **Floor** — landed cost plus the minimum margin in `costs.yaml`.
- **The trader's cut** — if selling wholesale, the Omani buyer's own margin comes
  out before the shelf price. A price that works for you and leaves the trader
  nothing is not a price, it is a refusal. Model both lines.

If ceiling < floor, the SKU does not work. Say that plainly rather than shaving
margin until the arithmetic stops complaining.

## SKU laddering

The four SKUs must sit in a deliberate order, not just at whatever their costs
imply. The Soraya box is the flagship and should read as the *best value per
gram of saffron*, so that a customer comparing it with `iran` feels the
companion products came nearly free. Price the smaller boxes to make the big one
look generous. Check this explicitly every time a price changes — it is easy to
break by adjusting one SKU alone.

## Quoting

Every quote carries: the SKU, the quantity band, the currency, the FX rate and
its date, what is included (packaging, labels, freight terms), and an expiry.
The rial moves; an undated saffron quote is a liability. Re-cost before honouring
anything older than the `fxDate` in `costs.yaml` by more than a month.

The Omani buyers set a **100 mesghal minimum**. Convert that into boxes before
discussing it: at 2 mesghal per Soraya box that is 50 boxes of saffron content,
which is *below* a typical rigid-box MOQ of 100. The packaging, not the saffron,
sets the real first order. Surface this whenever minimums come up.

## References

- `references/costing-rules.md` — the 0.9× rule, unit conversion traps, yield loss
- `references/gulf-market.md` — Oman retail bands, gifting seasonality, what the box competes against
- `references/quote-template.md` — the shape of a quote that survives a follow-up

## Red flags

| Thought | Reality |
|---|---|
| "I'll use an average saffron price to fill the gap" | Their farm's cost is not the market's. Stop and ask. |
| "Round it to a nice number" | Fine at the end, never mid-ladder. Round once, at the price, not at the cost. |
| "The margin looks thin, drop the packaging spec" | Packaging is the product here. Cut quantity or contents first. |
| "Own-farm saffron costs nothing" | Then a bad harvest is invisible. Cost it at opportunity value. |
| "The quote is still good from last month" | Not if the rial moved. Check `fxDate`. |
