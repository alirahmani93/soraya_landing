import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Packages, { type PackageView } from "@/components/Packages";
import Stage, { type StageDrawer } from "@/components/Stage";
import {
  catalog,
  contactLinks,
  DRAWERS,
  drawerHeadline,
  skuGroups,
  SKU_ORDER,
  type Locale,
} from "@/lib/catalog";
import { getDictionary, isLocale, otherLocale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = getDictionary(locale);
  const other = otherLocale(locale);

  const stageDrawers: StageDrawer[] = DRAWERS.map((drawer) => {
    const copy = t.drawers[drawer.id as keyof typeof t.drawers];
    return {
      id: drawer.id,
      image: drawer.image,
      name: copy.name,
      note: copy.note,
      qty: drawerHeadline(drawer, locale),
    };
  });

  const packages: PackageView[] = SKU_ORDER.map((id) => {
    const sku = catalog.skus[id];
    return {
      id,
      name: sku.name[locale],
      tier: t.specs.tiers[sku.tier as keyof typeof t.specs.tiers],
      description: t.specs.descriptions[id as keyof typeof t.specs.descriptions],
      groups: skuGroups(id, locale).map((group) => {
        const copy = t.drawers[group.id as keyof typeof t.drawers];
        return { ...group, name: copy.name, note: copy.note };
      }),
    };
  });

  const links = contactLinks();

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 text-paper sm:px-10">
        <span className="display text-2xl">{t.nav.brand}</span>
        <Link
          href={`/${other}`}
          aria-label={t.nav.switchLabel}
          className="border-b border-gold/50 pb-0.5 text-xs uppercase tracking-[0.25em] text-paper/80 transition-colors hover:text-gold"
        >
          {t.nav.switch}
        </Link>
      </header>

      <main>
        <section className="relative flex min-h-screen items-end bg-ink px-6 pb-20 pt-32 text-paper sm:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{t.hero.eyebrow}</p>
            <h1 className="display mt-8 text-[clamp(2.6rem,9vw,7rem)] leading-[0.95]">
              {t.hero.title.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-10 max-w-xl text-lg leading-relaxed text-paper/70">{t.hero.lede}</p>
          </div>
        </section>

        <Stage drawers={stageDrawers} hint={t.hero.scroll} />

        <section className="bg-paper px-6 py-28 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <h2 className="display text-[clamp(2rem,5vw,3.5rem)] leading-tight">
              {t.specs.heading}
            </h2>
            <p className="mt-4 max-w-md text-ink/60">{t.specs.lede}</p>
            <Packages packages={packages} pendingLabel={t.specs.pending} />
          </div>
        </section>

        <section className="bg-ink text-paper">
          <div className="relative h-[52vh] w-full">
            <Image
              src="/images/saffron-field.jpg"
              alt={t.origin.caption}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 sm:px-10 md:grid-cols-[1fr_2fr]">
            <h2 className="display text-[clamp(2rem,5vw,3.5rem)] leading-tight">
              {t.origin.heading}
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-paper/70">
              {t.origin.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper px-6 py-28 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <h2 className="display text-[clamp(2rem,5vw,3.5rem)] leading-tight">
              {t.contact.heading}
            </h2>
            <p className="mt-4 max-w-md text-ink/60">{t.contact.lede}</p>

            {links.length > 0 ? (
              <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {links.map((link) => (
                  <li key={link.id}>
                    <a href={link.href} className="group block">
                      <span className="display block border-b-2 border-saffron/40 pb-2 text-2xl transition-colors group-hover:border-saffron group-hover:text-saffron">
                        {t.contact.labels[link.id as keyof typeof t.contact.labels]}
                      </span>
                      <span className="mt-2 block text-sm text-ink/50">
                        <bdi dir="ltr">{link.value}</bdi>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-12 text-sm uppercase tracking-[0.2em] text-ink/40">
                {t.contact.pending}
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-ink px-6 py-12 text-paper/50 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm">
          <p>{t.footer.line}</p>
          <Link href={`/${other}`} className="hover:text-gold">
            {t.nav.switch}
          </Link>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-xs text-paper/25">{t.footer.placeholder}</p>
      </footer>
    </>
  );
}

export const dynamicParams = false;
