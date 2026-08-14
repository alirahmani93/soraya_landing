# HS classification

## Settled

**0910.20 — Saffron.** Chapter 9 covers coffee, tea, maté and spices; heading
0910 covers ginger, saffron, turmeric, thyme, bay leaves, curry and other spices.
Subheading 0910.20 is saffron specifically, and covers the dried stigmas of
*Crocus sativus* whether whole or ground. Both `saffron-negin` and
`saffron-powder` fall here.

**1211.90 — Plants and parts of plants used primarily in perfumery, pharmacy, or
for insecticidal/fungicidal purposes, fresh or dried.** In practice this is where
pure dried flowers and herbs for infusion sit — chamomile, rose, and the like.
Covers `kakuti-powder`, `kakuti-leaf`, `rose-buds`, `rose-petals`.

## Open: the tea bag

Heading **0902** is *Tea, whether or not flavoured* — that is *Camellia sinensis*.
The Soraya blend is saffron powder, kakuti leaf and rose petals, with no tea leaf
in it. On a strict reading it is a herbal infusion and belongs in **1211.90**.

Against that: retail infusion bags are routinely entered under 0902 subheadings
in practice, and some administrations expect it.

The two headings can attract different duty treatment, so this is not academic —
it feeds directly into the landed cost and therefore into any DDP quote.

**Action:** get the Omani customs broker to rule in writing before the first
shipment. Record the answer in `product/catalog.json` under
`assemblies.soraya-teabag.hsCode` and delete the `hsCodeNote`.

## Open: the Soraya box as a mixed set

The Soraya box is one retail unit containing goods from two headings. There are
two possible treatments and they produce different paperwork:

1. **Set treatment** — goods put up in a set for retail sale take the heading of
   the component that gives the set its essential character. That is saffron, so
   the whole box enters under 0910.20.
2. **Itemised** — each component declared under its own heading, with the box as
   packaging.

Which applies affects duty, the shape of the packing list, and how net weights
must be declared. Ask the broker; do not pick the one that looks cheaper and hope.

Note that the answer may differ between the Soraya box (six components, two
headings) and the smaller SKUs (`iran` is unambiguously 0910.20).

## Sources

- [HS Code 0910.20 — Flexport](https://www.flexport.com/data/hs-code/091020-saffron/)
- [HS Code 0902 — Flexport](https://www.flexport.com/data/hs-code/0902-tea-whether-or-not-flavored/)
- [HS code for flower tea and herbal infusions](https://www.freightamigo.com/en/blog/hs-code/hs-code-for-flower-tea/)
- [Saffron HS code and customs tariff — Mojalal](https://mojalalsaffron.com/saffron-hs-code-and-custom-tariff/)
