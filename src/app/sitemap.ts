export const dynamic = 'force-dynamic'

import type { MetadataRoute } from 'next'
import {
  getSitemapCountries,
  getSitemapCitiesWithCountry,
  getSitemapPoisWithPath,
  getSitemapIntentPages,
  getSitemapItineraries,
} from '@/lib/queries'
import { LAUNCH_LOCALES, DEFAULT_LOCALE } from '@/lib/locales'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://touresim.com'

function localUrl(locale: string, ...segments: string[]): string {
  const path = segments.filter(Boolean).join('/')
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`
  return `${SITE_URL}${prefix}/${path}`
}

function buildAlts(translations: { locale: string; [key: string]: string }[], pathFn: (t: { locale: string; [key: string]: string }) => string) {
  const languages: Record<string, string> = {}
  for (const t of translations) {
    if (!LAUNCH_LOCALES.includes(t.locale as typeof LAUNCH_LOCALES[number])) continue
    const prefix = t.locale === DEFAULT_LOCALE ? '' : `/${t.locale}`
    languages[t.locale] = `${SITE_URL}${prefix}${pathFn(t)}`
  }
  const defaultTr = translations.find((t) => t.locale === DEFAULT_LOCALE)
  if (defaultTr) languages['x-default'] = `${SITE_URL}${pathFn(defaultTr)}`
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // ── Static pages ──────────────────────────────────────────────────────────
  entries.push({
    url: SITE_URL + '/',
    changeFrequency: 'weekly',
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        LAUNCH_LOCALES.map((l) => [l, localUrl(l, '')])
          .concat([['x-default', SITE_URL + '/']]),
      ),
    },
  })

  entries.push({
    url: localUrl(DEFAULT_LOCALE, 'destinations'),
    changeFrequency: 'weekly',
    priority: 0.9,
    alternates: {
      languages: Object.fromEntries(
        LAUNCH_LOCALES.map((l) => [l, localUrl(l, 'destinations')])
          .concat([['x-default', localUrl(DEFAULT_LOCALE, 'destinations')]]),
      ),
    },
  })

  // ── Countries ─────────────────────────────────────────────────────────────
  const countries = await getSitemapCountries()
  for (const c of countries) {
    const arTr = c.translations.find((t) => t.locale === DEFAULT_LOCALE)
    if (!arTr) continue

    entries.push({
      url: localUrl(DEFAULT_LOCALE, arTr.slug),
      lastModified: c.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: buildAlts(c.translations, (t) => `/${t.slug}`),
      },
    })
  }

  // ── Cities ────────────────────────────────────────────────────────────────
  const cities = await getSitemapCitiesWithCountry()
  for (const city of cities) {
    const arTr = city.translations.find((t) => t.locale === DEFAULT_LOCALE)
    if (!arTr) continue

    entries.push({
      url: localUrl(DEFAULT_LOCALE, arTr.countrySlug, arTr.citySlug),
      lastModified: city.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: buildAlts(city.translations, (t) => `/${t.countrySlug}/${t.citySlug}`),
      },
    })
  }

  // ── Intent pages (English only — single locale seeded) ───────────────────
  const intentPages = await getSitemapIntentPages()
  for (const row of intentPages) {
    if (row.locale !== DEFAULT_LOCALE) continue
    entries.push({
      url: `${SITE_URL}/${row.countrySlug}/${row.slug}`,
      lastModified: row.updatedAt ?? undefined,
      changeFrequency: 'monthly',
      priority: 0.65,
      alternates: { languages: { en: `${SITE_URL}/${row.countrySlug}/${row.slug}`, 'x-default': `${SITE_URL}/${row.countrySlug}/${row.slug}` } },
    })
  }

  // ── Itineraries ───────────────────────────────────────────────────────────
  const itineraries = await getSitemapItineraries()
  for (const row of itineraries) {
    if (row.locale !== DEFAULT_LOCALE) continue
    entries.push({
      url: `${SITE_URL}/itineraries/${row.slug}`,
      lastModified: row.updatedAt ?? undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: { en: `${SITE_URL}/itineraries/${row.slug}`, 'x-default': `${SITE_URL}/itineraries/${row.slug}` } },
    })
  }

  // ── POIs ──────────────────────────────────────────────────────────────────
  const poisList = await getSitemapPoisWithPath()
  for (const poi of poisList) {
    const arTr = poi.translations.find((t) => t.locale === DEFAULT_LOCALE)
    if (!arTr) continue

    entries.push({
      url: localUrl(DEFAULT_LOCALE, arTr.countrySlug, arTr.citySlug, 'attractions', arTr.poiSlug),
      lastModified: poi.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: buildAlts(
          poi.translations,
          (t) => `/${t.countrySlug}/${t.citySlug}/attractions/${t.poiSlug}`,
        ),
      },
    })
  }

  return entries
}
