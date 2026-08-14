# Costing rules and traps

## The 0.9× kakuti leaf rule

Whole kakuti leaf is costed at **0.9 × the per-gram cost of kakuti powder**.

The owner set this deliberately. It is a simplification, and knowing why it is
roughly right tells you when it stops being right.

Powder is made *from* leaf, so powder should cost more (leaf plus grinding plus
yield loss), which argues for leaf below powder — the rule's direction is correct.
But whole leaf that is intact enough to display in a drawer is a *selected*
grade: broken leaf goes to the grinder, unbroken leaf goes in the box. Selection
has a cost that grinding does not.

So the rule holds while display-grade leaf is abundant. It breaks if:

- a poor season makes intact leaf scarce and it prices *above* powder
- the box's leaf count rises enough that selection becomes a real sorting job
- leaf and powder start coming from different suppliers

Re-check it each season. When it breaks, cost leaf directly and retire the rule
rather than adjusting the multiplier — a multiplier nobody can derive is worse
than two honest line items.

## Counting leaves is not costing leaves

The Soraya box lists kakuti leaf in **pieces**, but cost is per gram. Someone
must weigh a representative sample and record grams-per-leaf, or the line cannot
be costed at all. This is a five-minute job with a kitchen scale that has been
deferred; it blocks the flagship's cost sheet.

The same measurement solves a second problem: a label cannot declare "10–30
leaves". It declares net weight. One weighing gives both.

## Unit conversion

1 mesghal = 4.608 g (Iranian *mesghal-e sharie*).

Store saffron in mesghal. Derive grams when you need them. Do not store grams and
convert back — the round trip introduces error that compounds once it is multiplied
across a bill of materials and a shipment.

Watch for the other mesghal. Some Iranian trade contexts use 5 g as a rounded
"mesghal". A 100 mesghal minimum is 460.8 g under one reading and 500 g under the
other — an 8% difference in the first order. Confirm which the Omani buyer meant
before quoting against their minimum.

## Yield loss

Grinding saffron loses material to the grinder and to air. Sieving loses fines.
Neither is large, but both are real and both are invisible if you cost the ground
saffron at the whole-thread price. Record an actual yield figure the first time a
batch is ground and carry it in `costs.yaml`.

## Per-shipment versus per-unit

Freight, certificates of origin, phytosanitary certificates, lab tests and
clearance are per *shipment*. Divide by units per shipment — and write the
assumed shipment size on the cost sheet, because the number changes completely
when the shipment does. A cost sheet built at 500 units that gets quoted against
an order of 50 is wrong by an order of magnitude on this rung.

Tooling for packaging (dies, plates, first sampling) is one-off. Amortise across
the first run only, and say which run. If it is silently spread across an
imagined lifetime volume, the first order looks profitable when it is not.

## Own-farm inputs

Saffron from the family's own land is not free. Cost it at what it would fetch
sold as raw saffron. Otherwise a bad harvest year shows up as excellent margin
on the box, and there is no signal anywhere that anything went wrong.
