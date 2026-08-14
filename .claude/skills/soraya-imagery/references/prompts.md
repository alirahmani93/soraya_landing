# Prompt patterns

The point of a pattern is consistency. Twenty images that share a lighting
description read as one catalog; twenty individually excellent images do not.

## The base

Append to every product prompt:

```
Warm directional late-afternoon light from the left, soft fill.
Background: flat warm paper #F6EFE2 [or deep ink #241C17].
Shallow depth of field. Sharp on the product.
Editorial food photography, restrained, no props competing with the subject.
No text, no logos, no hands.
```

Swap the background line and nothing else between shots. Resist rewriting the
light description per image — that is exactly how a catalog stops matching itself.

## Enhancement, not invention

When the input is a real photograph, constrain the model to the photograph:

```
Relight and clean up this product photograph. Keep the product, its quantity,
its colour and its arrangement exactly as photographed. Change only the lighting,
the background, and colour balance.
```

If a result differs from the original in *what is in the frame*, discard it. That
is the whole rule from the skill body, in prompt form.

## Per subject

**Saffron threads (macro)**
```
Macro photograph of long unbroken Iranian Negin saffron threads, deep red with
fine texture visible, loosely piled. [base]
```

**Kakuti / Ziziphora**
```
Macro photograph of dried Persian Ziziphora (kakuti), small grey-green aromatic
mountain-mint leaves, dry and matte. [base]
```

**Damask rose buds**
```
Macro photograph of dried Damask rose buds, closed, dusty pink fading to soft
brown at the edges, arranged loosely. [base]
```

**The box, closed**
```
A rigid cube gift box in warm cream board with a deep saffron-red foil mark,
closed, three-quarter view, sitting on a plain surface. Premium food gift
packaging, Japanese jubako proportions. [base]
```

**The box, open**
```
The same cube box with four drawers slid out at staggered depths, each drawer
holding a different dried botanical — red saffron threads, grey-green leaves,
pink rose buds, tea bags. Viewed three-quarter from slightly above. [base]
```

## Colour discipline

`product/brand.json` holds the palette. The rule that keeps images looking like a
set: **at most two product colours at full strength in any one frame.** A single
image containing saturated saffron red, kakuti green and rose pink together reads
as busy, and it also flattens the hierarchy — saffron is supposed to lead.

Name the hex in the prompt when a specific colour must hold. Models drift on
"saffron red" and do not drift on `#C1440E`.

## Batching

Independent variations go through `generate_image_batch` with `jobs_wait`, then a
single `show_generation_by_ids`. One call per image wastes both credits and
context.

Validate a prompt with one image before batching it. A batch of forty run on an
unvalidated prompt is forty images of the same mistake.

## Things that still come out wrong

- **Hands.** Do not generate them. Photograph them.
- **Text on packaging.** Generated Arabic script is reliably wrong and a wrong
  Arabic label on a page selling to Arabic readers is worse than a blank one.
  Composite real artwork instead.
- **Quantity.** Models generously overfill containers. Check every generated
  drawer against the real fill and reject the flattering ones.
