// Single source of truth for locales across the app (routing, i18n, DB seeds).
// See SEO-TOPICAL-BLUEPRINT.md §0.

/** Locales we populate content for at launch. */
export const LAUNCH_LOCALES = ['en', 'ar', 'fr', 'tr', 'es'] as const

/** Locales the schema/routing supports; populated in later tiers. */
export const SUPPORTED_LOCALES = [
  ...LAUNCH_LOCALES,
  'de',
  'ru',
  'pt',
  'it',
  'zh',
  'ja',
] as const

/** English-first: `/` renders English. */
export const DEFAULT_LOCALE = 'en' as const

/** Right-to-left locales (drives `dir` + logical CSS). */
export const RTL_LOCALES = ['ar'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function isRtl(locale: string): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale)
}

export function dirFor(locale: string): 'rtl' | 'ltr' {
  return isRtl(locale) ? 'rtl' : 'ltr'
}
