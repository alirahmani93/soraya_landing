import type { Metadata } from "next";
import { Fraunces, Aref_Ruqaa, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import "../globals.css";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import { brand } from "@/lib/catalog";
import { UMAMI_SRC, UMAMI_WEBSITE_ID } from "@/lib/analytics";
import { VIDEO_ORIGIN } from "@/components/HeroVideo";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const aref = Aref_Ruqaa({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-aref",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { languages: { ar: "/ar", en: "/en" } },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={brand.locales[locale].dir}>
      <head>
        <link rel="preconnect" href={VIDEO_ORIGIN} />
        <link rel="dns-prefetch" href={VIDEO_ORIGIN} />
      </head>
      <body className={`${fraunces.variable} ${aref.variable} ${tajawal.variable}`}>
        {children}
        <Script src={UMAMI_SRC} data-website-id={UMAMI_WEBSITE_ID} strategy="afterInteractive" />
      </body>
    </html>
  );
}
