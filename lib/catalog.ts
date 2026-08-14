import catalog from "../product/catalog.json";
import brand from "../product/brand.json";

export { catalog, brand };

export type Locale = "ar" | "en";

const MESGHAL_G = catalog.units.mesghal.grams;

export function grams(qty: number, unit: string): number | null {
  if (unit === "mesghal") return qty * MESGHAL_G;
  if (unit === "gram") return qty;
  return null;
}

type Qty = number | number[] | null;

export function formatQty(qty: Qty, unit: string, locale: Locale): string | null {
  if (qty === null) return null;
  const n = new Intl.NumberFormat(locale === "ar" ? "ar-u-nu-latn" : "en");
  const value = Array.isArray(qty) ? `${n.format(qty[0])}–${n.format(qty[1])}` : n.format(qty);
  const units: Record<string, Record<Locale, string>> = {
    mesghal: { ar: "مثقال", en: "mesghal" },
    gram: { ar: "غرام", en: "g" },
    piece: { ar: "حبة", en: "pcs" },
  };
  return `${value} ${units[unit]?.[locale] ?? unit}`;
}

export type DrawerSpec = {
  id: string;
  image: string;
  components: string[];
};

/** Physical opening order of the box. Fixed by the packaging skill — the site
 *  must open drawers in the same order the object does. */
export const DRAWERS: DrawerSpec[] = [
  { id: "saffron", image: "/images/saffron-jar.jpg", components: ["saffron-negin"] },
  { id: "kakuti", image: "/images/kakuti-leaves.jpg", components: ["kakuti-powder", "kakuti-leaf"] },
  { id: "rose", image: "/images/rose-buds-close.jpg", components: ["rose-buds", "rose-petals"] },
  { id: "tea", image: "/images/tea-glass.jpg", components: [] },
];

export type SkuId = keyof typeof catalog.skus;

/** Presentation order: flagship first, then down the ladder. */
export const SKU_ORDER = ["soraya", "lady-with-taste", "iran", "peace"] as SkuId[];

export const FLAGSHIP: SkuId = "soraya";

type ContentEntry = { component?: string; assembly?: string; qty: Qty; unit: string };

function contentsOf(sku: SkuId): ContentEntry[] {
  return catalog.skus[sku].contents as ContentEntry[];
}

function rowsForDrawer(entries: ContentEntry[], drawer: DrawerSpec): ContentEntry[] {
  return drawer.components.length
    ? entries.filter((c) => c.component && drawer.components.includes(c.component))
    : entries.filter((c) => c.assembly === "soraya-teabag");
}

function describe(row: ContentEntry, locale: Locale) {
  const key = row.component ?? row.assembly!;
  const source = row.component
    ? catalog.components[key as keyof typeof catalog.components]
    : catalog.assemblies[key as keyof typeof catalog.assemblies];
  return { key, name: source.name[locale], qty: formatQty(row.qty, row.unit, locale) };
}

/** A SKU's contents, grouped the way the flagship's drawers group them. Groups a SKU
 *  does not carry are dropped, so a one-component SKU renders as one group. */
export function skuGroups(sku: SkuId, locale: Locale) {
  const entries = contentsOf(sku);
  return DRAWERS.map((drawer) => ({
    id: drawer.id,
    rows: rowsForDrawer(entries, drawer).map((row) => describe(row, locale)),
  })).filter((group) => group.rows.length > 0);
}

/** One headline quantity per drawer for the scroll sequence. Gram rows sum; anything
 *  else falls back to the first row. Full per-component detail lives in the specs table. */
export function drawerHeadline(drawer: DrawerSpec, locale: Locale): string {
  const rows = rowsForDrawer(contentsOf(FLAGSHIP), drawer);

  const gramRows = rows.filter((r) => r.unit === "gram" && typeof r.qty === "number");
  if (gramRows.length) {
    const total = gramRows.reduce((sum, r) => sum + (r.qty as number), 0);
    return formatQty(total, "gram", locale) ?? "";
  }
  const first = rows[0];
  return first ? (formatQty(first.qty, first.unit, locale) ?? "") : "";
}

/** A null in brand.json renders as nothing. Never a dead link, never a placeholder number. */
export function contactLinks(): { id: string; href: string; value: string }[] {
  const c = brand.contact as Record<string, string | null>;
  const out: { id: string; href: string; value: string }[] = [];
  if (c.whatsapp) out.push({ id: "whatsapp", href: `https://wa.me/${c.whatsapp}`, value: `+${c.whatsapp}` });
  if (c.telegram) out.push({ id: "telegram", href: `https://t.me/${c.telegram}`, value: c.telegram });
  if (c.email) out.push({ id: "email", href: `mailto:${c.email}`, value: c.email });
  if (c.phoneOm) out.push({ id: "phone", href: `tel:${c.phoneOm}`, value: c.phoneOm });
  return out;
}
