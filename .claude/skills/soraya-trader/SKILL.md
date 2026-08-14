---
name: soraya-trader
description: Use for the export and import side of Soraya — moving goods from Zanjan to Oman and the Gulf, HS classification, customs documents, certificates of origin and phytosanitary paperwork, GCC food labelling and shelf-life rules, Incoterms, and structuring the deal between the Iranian production side and the Omani selling entity. Use before any first shipment and whenever a border question comes up.
---

# Trading Soraya into the Gulf

The product is legal, ordinary food. What makes this non-trivial is the split:
goods originate in Iran, the seller is an Omani company, and the buyer is in a
GCC customs union with its own labelling regime. Most of the work is paperwork
that must be right *before* the goods move, because a container corrected at the
border is a container sitting in demurrage.

## Read first

`product/catalog.json` for HS codes and origins, `product/brand.json` for the
company structure. Both carry a note where a classification is not yet settled.

## Classification

| Goods | Heading | Confidence |
|---|---|---|
| Saffron, whole threads and ground | **0910.20** | Settled. Chapter 9, spices. |
| Kakuti (Ziziphora), leaf and powder | **1211.90** | Plants used in perfumery/pharmacy, incl. infusions. |
| Damask rose buds and petals | **1211.90** | Same heading. |
| Soraya tea bags | **0902.40** *or* **1211.90** | **Not settled.** |

The tea bag is the open question. Heading 0902 is tea — *Camellia sinensis*. The
Soraya blend contains none, which argues for 1211.90 as a herbal infusion. But
retail infusion bags are frequently entered under 0902 in practice, and the two
headings can carry different duty. Get the Omani customs broker to rule on it in
writing before the first shipment, and record the answer in `catalog.json`.

**A mixed box is its own classification problem.** The Soraya box contains
goods from two headings sold as one retail unit. Ask the broker whether it is
entered as a set taking the heading of the component giving it essential
character (saffron, 0910.20) or itemised. This affects duty and it affects how
the packing list must be written. Do not assume.

## Documents

Assume every one of these is needed until the broker says otherwise:

- **Commercial invoice** and **packing list** — itemised, with HS codes, net and
  gross weights per line
- **Certificate of origin** — issued Iran-side; the goods are Iranian regardless
  of the Omani seller
- **Phytosanitary certificate** — issued by Iran's Plant Protection Organization,
  Ministry of Jihad-e-Agriculture. Required for the dried plant material.
- **Health certificate** and **lab analysis** — commonly requested for food; a
  saffron ISO 3632 assay doubles as a quality claim, so get it anyway
- **Import licence** — the Omani entity must hold a valid commercial import
  licence from MOCIIP. This is the buyer's or the family company's, not the
  farm's.

See `references/oman-import.md` for the detail.

## Labelling — the constraint that shapes the packaging

GCC labelling (GSO 9, as adopted by Oman) requires the label to carry, **in
Arabic**, on the original label or primary packaging:

product and brand name · country of origin · ingredients in descending order ·
additives · net content in metric units · production and expiry dates ·
manufacturer/importer name and address · storage and preparation instructions

Arabic-only or Arabic+English. Arabic stickers are accepted in practice, but
designing Arabic into the label from the start looks materially better on a gift
box than a sticker applied over English does — and this is a product whose entire
premium rests on presentation.

Three things this forces on the product design:

1. **Net weight must be declared.** "10–30 leaves" is not a declaration. The
   kakuti leaf count has to resolve to a weight.
2. **Production and expiry dates** must be on-pack, which means a print or
   overprint step in the filling process, not an afterthought.
3. **Country of origin is Iran.** The Omani company is the seller, not the origin.
   Do not blur this on the label — it is a customs declaration, and it is also
   the honest version of the story the brand is selling.

## Shelf life

Oman applies GCC shelf-life standards, and Gulf importers generally require a
**minimum remaining shelf life** at the point of import — commonly 50% of the
declared life. Two consequences:

- Declare a realistic shelf life. Declaring 36 months to look generous means 18
  months must remain at the border.
- Stock that sits unsold in Oman ages against the same clock. Match order size to
  actual offtake rather than shipping a year's inventory to save freight.

## Structuring the deal

The Omani buyers quoted a **100 mesghal minimum**. Before negotiating, convert it:
~460.8 g of saffron, about 50 Soraya boxes — below a typical rigid-box MOQ of
100 units. The packaging minimum binds first. Bring that to the table as a fact
about the product, not a concession.

Questions to settle in writing with any Omani buyer, before the first shipment:

- Incoterm. Name it. EXW and DDP differ by the whole export cost rung.
- Who holds stock, and who owns it while it sits
- Exclusivity — territory, duration, and volume commitment. Never grant
  exclusivity without a minimum volume attached; it is otherwise a free option
  for the buyer and a locked market for you.
- Who owns the Arabic label artwork and the brand presentation
- Payment terms and what triggers the balance
- What happens to unsold stock as it approaches the shelf-life threshold

## References

- `references/oman-import.md` — MOCIIP licensing, documents, labelling detail, shelf life
- `references/hs-classification.md` — headings, the tea-bag question, the mixed-set question
- `references/incoterms.md` — which terms fit this trade lane and what each one costs you

## Red flags

| Thought | Reality |
|---|---|
| "The broker will sort classification at the border" | Then duty is a surprise and the quote was wrong. Settle it first. |
| "Arabic stickers are fine" | Legal, yes. On a gift box, they look like an afterthought — because they are. |
| "Ship a year's stock, freight is cheaper per unit" | Minimum-remaining-shelf-life rules make aged stock unsellable. |
| "Give them exclusivity to close the deal" | Only against a volume commitment. Otherwise it costs nothing to hold and blocks the market. |
| "Origin is Oman, we sell from there" | Origin is Iran. That is a customs declaration, not a marketing choice. |
