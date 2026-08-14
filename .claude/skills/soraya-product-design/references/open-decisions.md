# Open decisions — working sheet

Five decisions block the flagship. They are ordered by dependency: each one
unblocks the next. Record the answer here *and* in `product/catalog.json`.

---

## 1. Grams per kakuti leaf

**Status:** open
**Blocks:** flagship cost sheet, Arabic label net-weight declaration
**How to settle:** weigh 50 display-grade leaves, divide. Record the sample size.

**Answer:** ___ g per leaf, measured on ____-__-__ from a sample of ___

---

## 2. Kakuti leaf count in the Soraya box

**Status:** open — brief says 10–30, which is a range and cannot ship
**Blocks:** cost sheet, label, drawer sizing
**How to settle:** visual, not arithmetic. Lay leaves in the actual drawer
footprint at 10, 20 and 30 and pick the count that looks abundant rather than
sparse. A half-empty drawer in a premium box reads as short measure.

**Answer:** ___ leaves = ___ g declared

---

## 3. Tea-bag blend ratio

**Status:** open
**Blocks:** tea-bag cost, the `peace` SKU, ingredient ordering on the label
**Total per bag:** 1.5–2.5 g is conventional for an infusion bag

Constraints:
- Saffron powder dominates colour and cost — smallest fraction by weight
- Kakuti carries the aroma and should lead the blend
- Rose petals are mostly visual and soften the finish

**How to settle:** brew three ratios and taste them. This is the one decision in
the range that cannot be made on paper, and the one most likely to be guessed.
Ingredients must be declared in descending order by weight on the label, so the
ratio is also a labelling input.

| Trial | Saffron | Kakuti | Rose | Total | Verdict |
|---|---|---|---|---|---|
| A | | | | | |
| B | | | | | |
| C | | | | | |

**Answer:** ___ : ___ : ___ , ___ g per bag

---

## 4. Sizes for the three smaller SKUs

**Status:** open
**Blocks:** their prices, their packaging, the range ladder
**How to settle:** with the pricing skill, together — sizes and prices are one
decision. The test is whether the Soraya box still reads as the better value
per mesghal once the middles are priced.

Starting point to confirm, not to adopt:

| SKU | Proposed |
|---|---|
| `lady-with-taste` | 1 mesghal + 20 g kakuti powder + 10 g rose buds |
| `iran` | 1 mesghal |
| `peace` | 12 bags |

`lady-with-taste` carries all three crops, so contents alone barely separate it
from the flagship. Size it clearly smaller or it cannibalises.

**Answer:**

---

## 5. Drawer cube dimensions

**Status:** blocked on 1–4
**Blocks:** packaging quote, freight cost, every 3D render and the landing-page
scroll animation

Falls out of the fill volumes plus the inner containers plus clearance. Do not
attempt before the four above are answered — a box sized against guessed fills
will be re-tooled, and tooling is a one-off cost paid twice.

**Answer:** ___ × ___ × ___ mm, ___ drawers

---

## Also unresolved, tracked elsewhere

- Tea-bag HS heading: 0902.40 or 1211.90 — trader skill, needs the customs broker
- Soraya box as a customs set or itemised — trader skill
- Whether the Omani buyers' "mesghal" is 4.608 g or a rounded 5 g — pricing skill
- Everything in `product/costs.yaml`
