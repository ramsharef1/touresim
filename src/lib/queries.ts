import { and, eq, like, or } from 'drizzle-orm'
import { db, schema } from '@/db'
import type { Locale } from '@/lib/locales'

// ---------------------------------------------------------------------------
// Visa requirements query
// ---------------------------------------------------------------------------
export async function getVisaRequirement(passportIso2: string, destinationCountryId: number) {
  const rows = await db
    .select()
    .from(schema.visaRequirements)
    .where(
      and(
        eq(schema.visaRequirements.passportIso2, passportIso2.toUpperCase()),
        eq(schema.visaRequirements.destinationCountryId, destinationCountryId),
      ),
    )
    .limit(1)
  return rows[0] ?? null
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function tr<T>(rows: T[], locale: Locale, fallback: Locale = 'en'): T | undefined {
  return (rows as (T & { locale: string })[]).find((r) => r.locale === locale)
    ?? (rows as (T & { locale: string })[]).find((r) => r.locale === fallback)
}

// ---------------------------------------------------------------------------
// Country queries
// ---------------------------------------------------------------------------

export async function getCountryBySlug(slug: string, locale: Locale) {
  const rows = await db
    .select({
      id: schema.countries.id,
      iso2: schema.countries.iso2,
      currencyCode: schema.countries.currencyCode,
      currencySymbol: schema.countries.currencySymbol,
      population: schema.countries.population,
      gdp: schema.countries.gdp,
      areaSqKm: schema.countries.areaSqKm,
      capital: schema.countries.capital,
      languages: schema.countries.languages,
      demonym: schema.countries.demonym,
      nativeName: schema.countries.nativeName,
      drivingSide: schema.countries.drivingSide,
      nationalDish: schema.countries.nationalDish,
      emergencyPolice: schema.countries.emergencyPolice,
      emergencyAmbulance: schema.countries.emergencyAmbulance,
      emergencyFire: schema.countries.emergencyFire,
      touristArrivals: schema.countries.touristArrivals,
      touristArrivalsYear: schema.countries.touristArrivalsYear,
      travelGuide: schema.countries.travelGuide,
      homicideRate: schema.countries.homicideRate,
      bigMacUsd: schema.countries.bigMacUsd,
      religion: schema.countries.religion,
      avgTempC: schema.countries.avgTempC,
      landlocked: schema.countries.landlocked,
      indexStatus: schema.countries.indexStatus,
      completenessScore: schema.countries.completenessScore,
      locale: schema.countryTranslations.locale,
      name: schema.countryTranslations.name,
      slug: schema.countryTranslations.slug,
      description: schema.countryTranslations.description,
      visaSummary: schema.countryTranslations.visaSummary,
      bestTimeSummary: schema.countryTranslations.bestTimeSummary,
    })
    .from(schema.countries)
    .innerJoin(
      schema.countryTranslations,
      eq(schema.countryTranslations.countryId, schema.countries.id),
    )
    .where(eq(schema.countryTranslations.slug, slug))

  if (!rows.length) return null
  const countryId = rows[0].id

  // Get all locale translations for hreflang
  const allTr = await db
    .select({ locale: schema.countryTranslations.locale, slug: schema.countryTranslations.slug })
    .from(schema.countryTranslations)
    .where(eq(schema.countryTranslations.countryId, countryId))

  const best = tr(rows, locale)
  if (!best) return null
  return { ...best, allTranslations: allTr }
}

export async function getCitiesForCountry(countryId: number, locale: Locale) {
  const rows = await db
    .select({
      id: schema.cities.id,
      indexStatus: schema.cities.indexStatus,
      locale: schema.cityTranslations.locale,
      name: schema.cityTranslations.name,
      slug: schema.cityTranslations.slug,
      description: schema.cityTranslations.description,
    })
    .from(schema.cities)
    .innerJoin(schema.cityTranslations, eq(schema.cityTranslations.cityId, schema.cities.id))
    .where(
      and(
        eq(schema.cities.countryId, countryId),
        eq(schema.cityTranslations.locale, locale),
      ),
    )

  // dedupe by city id, pick locale or fallback
  const map = new Map<number, typeof rows[0]>()
  for (const row of rows) {
    if (!map.has(row.id) || row.locale === locale) map.set(row.id, row)
  }
  return [...map.values()].filter((c) => c.indexStatus !== 'draft')
}

// ---------------------------------------------------------------------------
// City queries
// ---------------------------------------------------------------------------

export async function getCityBySlug(slug: string, locale: Locale) {
  const rows = await db
    .select({
      id: schema.cities.id,
      countryId: schema.cities.countryId,
      latitude: schema.cities.latitude,
      longitude: schema.cities.longitude,
      population: schema.cities.population,
      timezone: schema.cities.timezone,
      iataCode: schema.cities.iataCode,
      indexStatus: schema.cities.indexStatus,
      completenessScore: schema.cities.completenessScore,
      locale: schema.cityTranslations.locale,
      name: schema.cityTranslations.name,
      slug: schema.cityTranslations.slug,
      description: schema.cityTranslations.description,
    })
    .from(schema.cities)
    .innerJoin(schema.cityTranslations, eq(schema.cityTranslations.cityId, schema.cities.id))
    .where(eq(schema.cityTranslations.slug, slug))

  if (!rows.length) return null
  const cityId = rows[0].id

  const allTr = await db
    .select({ locale: schema.cityTranslations.locale, slug: schema.cityTranslations.slug })
    .from(schema.cityTranslations)
    .where(eq(schema.cityTranslations.cityId, cityId))

  const best = tr(rows, locale)
  if (!best) return null
  return { ...best, allTranslations: allTr }
}

export async function getCountryForCity(cityId: number, locale: Locale) {
  const rows = await db
    .select({
      id: schema.countries.id,
      locale: schema.countryTranslations.locale,
      name: schema.countryTranslations.name,
      slug: schema.countryTranslations.slug,
    })
    .from(schema.cities)
    .innerJoin(schema.countries, eq(schema.countries.id, schema.cities.countryId))
    .innerJoin(schema.countryTranslations, eq(schema.countryTranslations.countryId, schema.countries.id))
    .where(eq(schema.cities.id, cityId))

  return tr(rows, locale) ?? rows[0] ?? null
}

export async function getPoisForCity(cityId: number, locale: Locale) {
  const rows = await db
    .select({
      id: schema.pois.id,
      priceRange: schema.pois.priceRange,
      indexStatus: schema.pois.indexStatus,
      locale: schema.poiTranslations.locale,
      name: schema.poiTranslations.name,
      slug: schema.poiTranslations.slug,
      description: schema.poiTranslations.description,
    })
    .from(schema.pois)
    .innerJoin(schema.poiTranslations, eq(schema.poiTranslations.poiId, schema.pois.id))
    .where(and(eq(schema.pois.cityId, cityId), eq(schema.poiTranslations.locale, locale)))

  const map = new Map<number, typeof rows[0]>()
  for (const row of rows) {
    if (!map.has(row.id) || row.locale === locale) map.set(row.id, row)
  }
  return [...map.values()].filter((p) => p.indexStatus !== 'draft')
}

// ---------------------------------------------------------------------------
// POI queries
// ---------------------------------------------------------------------------

export async function getPoiBySlug(slug: string, locale: Locale) {
  const rows = await db
    .select({
      id: schema.pois.id,
      cityId: schema.pois.cityId,
      latitude: schema.pois.latitude,
      longitude: schema.pois.longitude,
      priceRange: schema.pois.priceRange,
      openingHours: schema.pois.openingHours,
      indexStatus: schema.pois.indexStatus,
      completenessScore: schema.pois.completenessScore,
      locale: schema.poiTranslations.locale,
      name: schema.poiTranslations.name,
      slug: schema.poiTranslations.slug,
      description: schema.poiTranslations.description,
      tips: schema.poiTranslations.tips,
    })
    .from(schema.pois)
    .innerJoin(schema.poiTranslations, eq(schema.poiTranslations.poiId, schema.pois.id))
    .where(eq(schema.poiTranslations.slug, slug))

  if (!rows.length) return null
  const poiId = rows[0].id

  const allTr = await db
    .select({ locale: schema.poiTranslations.locale, slug: schema.poiTranslations.slug })
    .from(schema.poiTranslations)
    .where(eq(schema.poiTranslations.poiId, poiId))

  const best = tr(rows, locale)
  if (!best) return null
  return { ...best, allTranslations: allTr }
}

// ---------------------------------------------------------------------------
// Intent page queries
// ---------------------------------------------------------------------------

export async function getIntentPage(
  placeLevel: 'country' | 'city',
  placeId: number,
  intentType: string,
  locale: Locale,
) {
  const rows = await db
    .select({
      id: schema.intentPages.id,
      indexStatus: schema.intentPages.indexStatus,
      locale: schema.intentPageTranslations.locale,
      title: schema.intentPageTranslations.title,
      slug: schema.intentPageTranslations.slug,
      body: schema.intentPageTranslations.body,
    })
    .from(schema.intentPages)
    .innerJoin(
      schema.intentPageTranslations,
      eq(schema.intentPageTranslations.intentPageId, schema.intentPages.id),
    )
    .where(
      and(
        eq(schema.intentPages.placeLevel, placeLevel),
        eq(schema.intentPages.placeId, placeId),
        eq(schema.intentPages.intentType, intentType as never),
      ),
    )

  return tr(rows, locale) ?? null
}

// ---------------------------------------------------------------------------
// Sitemap queries — bulk fetch of indexed entities with all locale slugs
// ---------------------------------------------------------------------------

export async function getSitemapCountries() {
  const rows = await db
    .select({
      id: schema.countries.id,
      updatedAt: schema.countries.updatedAt,
      locale: schema.countryTranslations.locale,
      slug: schema.countryTranslations.slug,
    })
    .from(schema.countries)
    .innerJoin(schema.countryTranslations, eq(schema.countryTranslations.countryId, schema.countries.id))
    .where(eq(schema.countries.indexStatus, 'indexed'))

  const map = new Map<number, { updatedAt: Date; translations: { locale: string; slug: string }[] }>()
  for (const row of rows) {
    if (!map.has(row.id)) map.set(row.id, { updatedAt: row.updatedAt, translations: [] })
    map.get(row.id)!.translations.push({ locale: row.locale, slug: row.slug })
  }
  return [...map.values()]
}

export async function getSitemapCitiesWithCountry() {
  const rows = await db
    .select({
      cityId: schema.cities.id,
      cityUpdatedAt: schema.cities.updatedAt,
      cityLocale: schema.cityTranslations.locale,
      citySlug: schema.cityTranslations.slug,
      countryLocale: schema.countryTranslations.locale,
      countrySlug: schema.countryTranslations.slug,
    })
    .from(schema.cities)
    .innerJoin(schema.cityTranslations, eq(schema.cityTranslations.cityId, schema.cities.id))
    .innerJoin(schema.countries, eq(schema.countries.id, schema.cities.countryId))
    .innerJoin(schema.countryTranslations, and(
      eq(schema.countryTranslations.countryId, schema.countries.id),
      eq(schema.countryTranslations.locale, schema.cityTranslations.locale),
    ))
    .where(eq(schema.cities.indexStatus, 'indexed'))

  const map = new Map<number, {
    updatedAt: Date
    translations: { locale: string; citySlug: string; countrySlug: string }[]
  }>()
  for (const row of rows) {
    if (!map.has(row.cityId)) map.set(row.cityId, { updatedAt: row.cityUpdatedAt, translations: [] })
    map.get(row.cityId)!.translations.push({ locale: row.cityLocale, citySlug: row.citySlug, countrySlug: row.countrySlug })
  }
  return [...map.values()]
}

export async function getSitemapPoisWithPath() {
  const rows = await db
    .select({
      poiId: schema.pois.id,
      poiUpdatedAt: schema.pois.updatedAt,
      poiLocale: schema.poiTranslations.locale,
      poiSlug: schema.poiTranslations.slug,
      cityLocale: schema.cityTranslations.locale,
      citySlug: schema.cityTranslations.slug,
      countryLocale: schema.countryTranslations.locale,
      countrySlug: schema.countryTranslations.slug,
    })
    .from(schema.pois)
    .innerJoin(schema.poiTranslations, eq(schema.poiTranslations.poiId, schema.pois.id))
    .innerJoin(schema.cities, eq(schema.cities.id, schema.pois.cityId))
    .innerJoin(schema.cityTranslations, and(
      eq(schema.cityTranslations.cityId, schema.cities.id),
      eq(schema.cityTranslations.locale, schema.poiTranslations.locale),
    ))
    .innerJoin(schema.countries, eq(schema.countries.id, schema.cities.countryId))
    .innerJoin(schema.countryTranslations, and(
      eq(schema.countryTranslations.countryId, schema.countries.id),
      eq(schema.countryTranslations.locale, schema.poiTranslations.locale),
    ))
    .where(eq(schema.pois.indexStatus, 'indexed'))

  const map = new Map<number, {
    updatedAt: Date
    translations: { locale: string; poiSlug: string; citySlug: string; countrySlug: string }[]
  }>()
  for (const row of rows) {
    if (!map.has(row.poiId)) map.set(row.poiId, { updatedAt: row.poiUpdatedAt, translations: [] })
    map.get(row.poiId)!.translations.push({
      locale: row.poiLocale,
      poiSlug: row.poiSlug,
      citySlug: row.citySlug,
      countrySlug: row.countrySlug,
    })
  }
  return [...map.values()]
}

// ---------------------------------------------------------------------------
// All countries list (for homepage / destinations page)
// ---------------------------------------------------------------------------

export async function getAllCountries(locale: Locale) {
  const rows = await db
    .select({
      id: schema.countries.id,
      iso2: schema.countries.iso2,
      indexStatus: schema.countries.indexStatus,
      locale: schema.countryTranslations.locale,
      name: schema.countryTranslations.name,
      slug: schema.countryTranslations.slug,
      description: schema.countryTranslations.description,
    })
    .from(schema.countries)
    .innerJoin(
      schema.countryTranslations,
      eq(schema.countryTranslations.countryId, schema.countries.id),
    )
    .where(eq(schema.countryTranslations.locale, locale))

  return rows.filter((c) => c.indexStatus === 'indexed')
}

export async function searchDestinations(query: string, locale: Locale) {
  const q = `%${query}%`
  const rows = await db
    .select({
      id: schema.countries.id,
      name: schema.countryTranslations.name,
      slug: schema.countryTranslations.slug,
      description: schema.countryTranslations.description,
      indexStatus: schema.countries.indexStatus,
    })
    .from(schema.countries)
    .innerJoin(
      schema.countryTranslations,
      and(
        eq(schema.countryTranslations.countryId, schema.countries.id),
        eq(schema.countryTranslations.locale, locale),
      ),
    )
    .where(
      and(
        eq(schema.countries.indexStatus, 'indexed'),
        or(
          like(schema.countryTranslations.name, q),
          like(schema.countryTranslations.slug, q),
        ),
      ),
    )
    .limit(8)

  return rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug, description: r.description }))
}

export async function getCountryHeroImage(countryId: number) {
  const rows = await db
    .select({ url: schema.media.url, credit: schema.media.credit })
    .from(schema.entityMedia)
    .innerJoin(schema.media, eq(schema.media.id, schema.entityMedia.mediaId))
    .where(
      and(
        eq(schema.entityMedia.entityType, 'country'),
        eq(schema.entityMedia.entityId, countryId),
      ),
    )
    .orderBy(schema.entityMedia.position)
    .limit(1)
  return rows[0] ?? null
}

export async function getCityHeroImage(cityId: number) {
  const rows = await db
    .select({ url: schema.media.url, credit: schema.media.credit })
    .from(schema.entityMedia)
    .innerJoin(schema.media, eq(schema.media.id, schema.entityMedia.mediaId))
    .where(
      and(
        eq(schema.entityMedia.entityType, 'city'),
        eq(schema.entityMedia.entityId, cityId),
      ),
    )
    .orderBy(schema.entityMedia.position)
    .limit(1)
  if (rows[0]) return rows[0]

  // Fallback: use the parent country's hero so every city page has an image.
  const [country] = await db
    .select({ countryId: schema.cities.countryId })
    .from(schema.cities)
    .where(eq(schema.cities.id, cityId))
    .limit(1)
  if (!country) return null
  const heroRows = await db
    .select({ url: schema.media.url, credit: schema.media.credit })
    .from(schema.entityMedia)
    .innerJoin(schema.media, eq(schema.media.id, schema.entityMedia.mediaId))
    .where(
      and(
        eq(schema.entityMedia.entityType, 'country'),
        eq(schema.entityMedia.entityId, country.countryId),
      ),
    )
    .orderBy(schema.entityMedia.position)
    .limit(1)
  return heroRows[0] ?? null
}

export async function getItinerariesForCity(cityId: number, locale: Locale) {
  const rows = await db
    .select({
      id: schema.itineraries.id,
      durationDays: schema.itineraries.durationDays,
      locale: schema.itineraryTranslations.locale,
      title: schema.itineraryTranslations.title,
      slug: schema.itineraryTranslations.slug,
      body: schema.itineraryTranslations.body,
    })
    .from(schema.itineraries)
    .innerJoin(
      schema.itineraryTranslations,
      eq(schema.itineraryTranslations.itineraryId, schema.itineraries.id),
    )
    .where(eq(schema.itineraries.cityId, cityId))
  const map = new Map<number, typeof rows[0]>()
  for (const row of rows) {
    if (!map.has(row.id) || row.locale === locale) map.set(row.id, row)
  }
  return [...map.values()].filter((r) => r.title)
}

export async function getItineraryBySlug(slug: string, locale: Locale) {
  const rows = await db
    .select({
      id: schema.itineraries.id,
      cityId: schema.itineraries.cityId,
      durationDays: schema.itineraries.durationDays,
      locale: schema.itineraryTranslations.locale,
      title: schema.itineraryTranslations.title,
      slug: schema.itineraryTranslations.slug,
      body: schema.itineraryTranslations.body,
    })
    .from(schema.itineraries)
    .innerJoin(
      schema.itineraryTranslations,
      eq(schema.itineraryTranslations.itineraryId, schema.itineraries.id),
    )
    .where(eq(schema.itineraryTranslations.slug, slug))
  const best = rows.find((r) => r.locale === locale) ?? rows[0] ?? null
  return best
}

export async function getSitemapIntentPages() {
  const rows = await db
    .select({
      slug: schema.intentPageTranslations.slug,
      countrySlug: schema.countryTranslations.slug,
      locale: schema.intentPageTranslations.locale,
      updatedAt: schema.intentPages.updatedAt,
    })
    .from(schema.intentPages)
    .innerJoin(
      schema.intentPageTranslations,
      eq(schema.intentPageTranslations.intentPageId, schema.intentPages.id),
    )
    .innerJoin(
      schema.countryTranslations,
      and(
        eq(schema.countryTranslations.countryId, schema.intentPages.placeId),
        eq(schema.countryTranslations.locale, schema.intentPageTranslations.locale),
      ),
    )
    .where(eq(schema.intentPages.placeLevel, 'country'))
  return rows
}

export async function getAllItineraries(locale: Locale) {
  const rows = await db
    .select({
      id: schema.itineraries.id,
      cityId: schema.itineraries.cityId,
      durationDays: schema.itineraries.durationDays,
      locale: schema.itineraryTranslations.locale,
      title: schema.itineraryTranslations.title,
      slug: schema.itineraryTranslations.slug,
    })
    .from(schema.itineraries)
    .innerJoin(
      schema.itineraryTranslations,
      eq(schema.itineraryTranslations.itineraryId, schema.itineraries.id),
    )
    .orderBy(schema.itineraries.durationDays)
  const map = new Map<number, typeof rows[0]>()
  for (const row of rows) {
    if (!map.has(row.id) || row.locale === locale) map.set(row.id, row)
  }
  return [...map.values()]
}

export async function getSitemapItineraries() {
  const rows = await db
    .select({
      slug: schema.itineraryTranslations.slug,
      locale: schema.itineraryTranslations.locale,
      updatedAt: schema.itineraries.updatedAt,
    })
    .from(schema.itineraries)
    .innerJoin(
      schema.itineraryTranslations,
      eq(schema.itineraryTranslations.itineraryId, schema.itineraries.id),
    )
  return rows
}

export async function getIntentPageContent(
  countryId: number,
  intentType: string,
  locale: Locale,
) {
  const rows = await db
    .select({
      body: schema.intentPageTranslations.body,
      title: schema.intentPageTranslations.title,
      locale: schema.intentPageTranslations.locale,
    })
    .from(schema.intentPages)
    .innerJoin(
      schema.intentPageTranslations,
      eq(schema.intentPageTranslations.intentPageId, schema.intentPages.id),
    )
    .where(
      and(
        eq(schema.intentPages.placeLevel, 'country'),
        eq(schema.intentPages.placeId, countryId),
        eq(schema.intentPages.intentType, intentType as 'things-to-do'),
      ),
    )
  return rows.find((r) => r.locale === locale) ?? rows.find((r) => r.locale === 'en') ?? null
}

export async function getCityById(cityId: number, locale: Locale) {
  const rows = await db
    .select({
      id: schema.cities.id,
      locale: schema.cityTranslations.locale,
      name: schema.cityTranslations.name,
      slug: schema.cityTranslations.slug,
    })
    .from(schema.cities)
    .innerJoin(schema.cityTranslations, eq(schema.cityTranslations.cityId, schema.cities.id))
    .where(eq(schema.cities.id, cityId))
  return rows.find((r) => r.locale === locale) ?? rows[0] ?? null
}

// ---------------------------------------------------------------------------
// Enrichment data (from external sources — see /admin/sources)
// ---------------------------------------------------------------------------

export async function getCountryHolidays(countryId: number, locale: Locale) {
  const rows = await db
    .select({
      rule: schema.countryHolidays.rule,
      month: schema.countryHolidays.month,
      day: schema.countryHolidays.day,
      type: schema.countryHolidays.type,
      nameEn: schema.countryHolidays.nameEn,
      nameAr: schema.countryHolidays.nameAr,
      nameFr: schema.countryHolidays.nameFr,
      nameTr: schema.countryHolidays.nameTr,
      nameEs: schema.countryHolidays.nameEs,
      position: schema.countryHolidays.position,
    })
    .from(schema.countryHolidays)
    .where(eq(schema.countryHolidays.countryId, countryId))

  const pick = (r: (typeof rows)[number]) => {
    const byLocale: Record<string, string | null> = {
      en: r.nameEn, ar: r.nameAr, fr: r.nameFr, tr: r.nameTr, es: r.nameEs,
    }
    return byLocale[locale] ?? r.nameEn
  }

  return rows
    .map((r) => ({ name: pick(r), month: r.month, day: r.day, type: r.type }))
    .filter((r) => r.name)
    .sort((a, b) => (a.month ?? 13) - (b.month ?? 13) || (a.day ?? 32) - (b.day ?? 32))
}

export async function getHeritageSites(countryId: number) {
  return db
    .select({
      name: schema.heritageSites.name,
      latitude: schema.heritageSites.latitude,
      longitude: schema.heritageSites.longitude,
    })
    .from(schema.heritageSites)
    .where(eq(schema.heritageSites.countryId, countryId))
    .orderBy(schema.heritageSites.name)
}

export async function getCountryHighlights(countryId: number) {
  return db
    .select({
      title: schema.countryHighlights.title,
      body: schema.countryHighlights.body,
      source: schema.countryHighlights.source,
    })
    .from(schema.countryHighlights)
    .where(eq(schema.countryHighlights.countryId, countryId))
}

export async function getCurrency(code: string | null) {
  if (!code) return null
  const [row] = await db
    .select({ code: schema.currencies.code, name: schema.currencies.name, symbol: schema.currencies.symbol })
    .from(schema.currencies)
    .where(eq(schema.currencies.code, code))
    .limit(1)
  return row ?? null
}

export async function getCityAttractions(cityId: number) {
  return db
    .select({
      name: schema.cityAttractions.name,
      type: schema.cityAttractions.type,
      latitude: schema.cityAttractions.latitude,
      longitude: schema.cityAttractions.longitude,
    })
    .from(schema.cityAttractions)
    .where(eq(schema.cityAttractions.cityId, cityId))
    .orderBy(schema.cityAttractions.id)
}

// ---------------------------------------------------------------------------
// Visa checker — all destinations for a given passport, grouped by requirement
// ---------------------------------------------------------------------------

export async function getVisaDestinationsForPassport(passportIso2: string, locale: Locale) {
  const rows = await db
    .select({
      requirement: schema.visaRequirements.requirement,
      maxStayDays: schema.visaRequirements.maxStayDays,
      notes: schema.visaRequirements.notes,
      countryId: schema.countries.id,
      iso2: schema.countries.iso2,
      locale: schema.countryTranslations.locale,
      name: schema.countryTranslations.name,
      slug: schema.countryTranslations.slug,
    })
    .from(schema.visaRequirements)
    .innerJoin(schema.countries, eq(schema.countries.id, schema.visaRequirements.destinationCountryId))
    .innerJoin(
      schema.countryTranslations,
      and(
        eq(schema.countryTranslations.countryId, schema.countries.id),
        eq(schema.countryTranslations.locale, locale),
      ),
    )
    .where(eq(schema.visaRequirements.passportIso2, passportIso2.toUpperCase()))

  // Group by requirement, alphabetical within each group
  const groups: Record<string, typeof rows> = {}
  for (const r of rows) {
    ;(groups[r.requirement] ??= []).push(r)
  }
  for (const k of Object.keys(groups)) {
    groups[k].sort((a, b) => a.name.localeCompare(b.name))
  }
  return { total: rows.length, groups }
}
