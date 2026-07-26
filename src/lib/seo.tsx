import type { Metadata } from 'next'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/locales'
import type { Locale } from '@/lib/locales'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://touresim.com'

/** Minimum completeness score before a page can be indexed. */
export const COMPLETENESS_THRESHOLD = 50

/** Returns the robots directive for a page based on index status + quality gate. */
export function robotsDirective(
  indexStatus: 'draft' | 'noindex' | 'indexed',
  completenessScore: number,
): string {
  if (indexStatus !== 'indexed' || completenessScore < COMPLETENESS_THRESHOLD) {
    return 'noindex,nofollow'
  }
  return 'index,follow'
}

/** Build the canonical URL for a given locale + path segments. */
export function canonicalUrl(locale: Locale, ...segments: string[]): string {
  const path = segments.filter(Boolean).join('/')
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`
  return `${SITE_URL}${prefix}/${path}`
}

/** hreflang alternates for a page that exists in multiple locales.
 *  Pass allTranslations = [{locale, slug}] from the DB query.
 *  pathBuilder receives (locale, slug) and returns the full path string (no origin). */
export function buildAlternates(
  allTranslations: { locale: string; slug: string }[],
  pathBuilder: (locale: string, slug: string) => string,
): Metadata['alternates'] {
  const languages: Record<string, string> = {}

  for (const { locale, slug } of allTranslations) {
    if (!SUPPORTED_LOCALES.includes(locale as Locale)) continue
    const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`
    languages[locale] = `${SITE_URL}${prefix}${pathBuilder(locale, slug)}`
  }

  // x-default → Arabic (the default locale)
  const defaultTr = allTranslations.find((t) => t.locale === DEFAULT_LOCALE)
  if (defaultTr) {
    languages['x-default'] = `${SITE_URL}${pathBuilder(DEFAULT_LOCALE, defaultTr.slug)}`
  }

  return { languages }
}

/** Emit JSON-LD as a <script> tag (XSS-safe). */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

/** BreadcrumbList schema.org item. */
export interface BreadcrumbItem {
  name: string
  url: string
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function touristDestinationJsonLd({
  name,
  description,
  url,
  image,
  geo,
}: {
  name: string
  description?: string | null
  url: string
  image?: string | null
  geo?: { lat: string; lng: string } | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name,
    ...(description ? { description } : {}),
    url,
    ...(image ? { image } : {}),
    ...(geo
      ? { geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng } }
      : {}),
  }
}

export function touristAttractionJsonLd({
  name,
  description,
  url,
  image,
  geo,
  priceRange,
}: {
  name: string
  description?: string | null
  url: string
  image?: string | null
  geo?: { lat: string; lng: string } | null
  priceRange?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name,
    ...(description ? { description } : {}),
    url,
    ...(image ? { image } : {}),
    ...(priceRange ? { priceRange } : {}),
    ...(geo
      ? { geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng } }
      : {}),
  }
}
