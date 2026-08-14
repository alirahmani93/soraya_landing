import ar from "../content/ar.json";
import en from "../content/en.json";
import type { Locale } from "./catalog";

export const LOCALES: Locale[] = ["ar", "en"];

const DICTIONARIES = { ar, en } as const;

export type Dictionary = typeof ar;

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] as Dictionary;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}
