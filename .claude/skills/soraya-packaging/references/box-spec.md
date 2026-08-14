# Box specification brief

Send this to a manufacturer. Every field they will ask for is here; leaving one
blank costs a round trip, and quotes cannot be compared across vendors unless the
brief is identical.

```
SORAYA — RIGID DRAWER BOX, REQUEST FOR QUOTATION

STRUCTURE
  Style              Rigid cube, outer shell with stacked sliding drawers
  Reference          Japanese jubako / sushi presentation box
  Drawers            4
  External dims      ___ x ___ x ___ mm          (from fill volumes — see below)
  Drawer internal    ___ x ___ x ___ mm each     (state if drawers differ)
  Board thickness    ___ mm                       (2 mm typical for rigid)
  Drawer action      Ribbon pull / notch / cut-out — specify one
  Closure            None / magnetic / belly band

MATERIALS
  Outer wrap         ___ gsm, ___ finish          (uncoated or textured preferred)
  Interior lining    Printed paper / fabric / flocked — specify
  Drawer lining      Same as interior? state explicitly

PRINT AND FINISH
  Process            Litho / digital
  Colours            CMYK + ___ spot             (see palette below)
  Special finish     Foil ___ / emboss ___ / spot UV ___
  Brand mark         Foil + emboss on lid, ___ mm

PALETTE (from product/brand.json)
  Saffron red        #C1440E
  Saffron gold       #E3A21C
  Kakuti green       #7D8C6A
  Rose dusk          #B4687C
  Paper              #F6EFE2
  Ink                #241C17
  Rule               Max two product colours at full strength per surface

INSERTS
  Per drawer         Specify fitment for the inner containers listed below
  Saffron vial       ___ x ___ mm, must not move in transit

QUANTITIES
  Quote at           100 / 250 / 500 units
  Tooling            Itemise separately — dies, plates, sampling

DELIVERY
  Ship to            ___ (Oman — confirm whether boxes ship to Iran for filling,
                     or flat to Oman with filling done locally. This changes the
                     freight cost and the customs treatment of the packaging.)
  Lead time          Working days after artwork approval
  Sampling           Physical sample REQUIRED before production run

ALSO QUOTE
  Overprint          Surface and method for production/expiry dates at filling
  Label              Arabic + English, applied or printed — see labelling brief
```

## Before sending

Dimensions come last, not first. Sequence:

1. Fill volumes — from `product/catalog.json`, with the open quantities resolved
2. Inner containers — vial and pouch sizes, from `references/materials.md`
3. Drawer footprints — containers laid out flat, with clearance
4. Cube — drawers stacked, plus shell thickness

If any fill quantity is still `null`, stop. See the product-design skill's
open-decisions sheet.

## Filling location

Decide before quoting: boxes shipped to Iran, filled at source, then exported
full — or shipped flat to Oman and filled there. It changes freight, customs
treatment of the empty packaging, and where the production-date overprint happens.
It is a real decision with a real cost difference and it is easy to leave implicit
until a vendor asks.

## Comparing quotes

Get three. Compare on the same quantity band, and check that each includes:
tooling itemised separately, a physical sample, the interior lining, and the
insert fitment. A quote that omits the lining will look cheapest and is not.
