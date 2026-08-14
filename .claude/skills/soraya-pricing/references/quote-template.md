# Quote template

A quote that omits any of these fields will be argued about later. Fill every one.

```
SORAYA — QUOTATION
Quote no.        SOR-YYYYMM-NN
Date             YYYY-MM-DD
Valid until      YYYY-MM-DD          (default 30 days; shorter if the rial is moving)
For              Buyer name, company, country

PRODUCT
  SKU            soraya
  Contents       <generated from catalog.json — never retyped>
  Net weight     <declared, per unit>
  Packaging      Drawer cube, <dimensions>, <finish>
  Origin         Zanjan, Iran. Sold by <Omani entity>.

PRICE
  Quantity band  <e.g. 100 / 250 / 500 units>
  Unit price     OMR <x>
  Total          OMR <x>
  FX basis       1 OMR = <rate> IRR as at <date>

INCLUDED           Packaging, Arabic + English labelling, <inner packaging>
NOT INCLUDED       <freight / duty / clearance — be explicit, this is where disputes start>
INCOTERM           <EXW / FOB / CIF / DDP — name one, never leave it implied>

TERMS
  Payment        <deposit % / balance trigger>
  Lead time      <production + freight + clearance, stated separately>
  Minimum order  <units — the packaging MOQ, not the saffron minimum>
  Shelf life     <months from production; see trader skill on GCC minimum remaining shelf life>
```

## Notes

**Name the Incoterm.** "Price per box" without one means the buyer assumes DDP
and you assumed EXW. That gap is the entire export cost rung.

**State lead time in parts.** Production, freight, and clearance are three
different risks and the buyer needs to know which one they can influence.

**Quantity bands, not a single price.** Volume changes the packaging cost
materially. Showing three bands also makes the larger order the buyer's idea.

**Shelf life goes on the quote, not just the label.** Gulf importers apply a
minimum-remaining-shelf-life rule at the border; a buyer who finds out late will
blame the quote.
