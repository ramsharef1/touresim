import { db } from '@/db/index'
import {
  countries,
  countryTranslations,
  cities,
  cityTranslations,
  pois,
  poiTranslations,
  dataSources,
} from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { refreshFromUrl, ingestUpload } from '@/lib/sources'

export const LOCALES = ['ar', 'en', 'fr', 'tr', 'es'] as const

// ── Data sources ─────────────────────────────────────────────────────────

export async function adminListSources() {
  return db.select().from(dataSources).orderBy(asc(dataSources.position))
}

export async function adminUpdateSourceUrl(id: number, sourceUrl: string) {
  await db.update(dataSources).set({ sourceUrl }).where(eq(dataSources.id, id))
}

export async function adminRefreshSource(id: number) {
  const [s] = await db.select().from(dataSources).where(eq(dataSources.id, id)).limit(1)
  if (!s) return { ok: false, message: 'Source not found' }
  const result = await refreshFromUrl(s.slug, s.sourceUrl, s.importerKey)
  await db
    .update(dataSources)
    .set({
      lastRefreshedAt: new Date(),
      lastRefreshStatus: result.ok ? result.message : `Error: ${result.message}`,
      recordCount: result.recordCount ?? s.recordCount,
      status: result.ok && s.importerKey ? 'applied' : s.status,
    })
    .where(eq(dataSources.id, id))
  return result
}

export async function adminUploadSource(id: number, raw: string) {
  const [s] = await db.select().from(dataSources).where(eq(dataSources.id, id)).limit(1)
  if (!s) return { ok: false, message: 'Source not found' }
  const result = await ingestUpload(s.slug, s.importerKey, raw)
  await db
    .update(dataSources)
    .set({
      lastRefreshedAt: new Date(),
      lastRefreshStatus: result.ok ? result.message : `Error: ${result.message}`,
      recordCount: result.recordCount ?? s.recordCount,
      status: result.ok && s.importerKey ? 'applied' : s.status,
    })
    .where(eq(dataSources.id, id))
  return result
}

// ── Countries ──────────────────────────────────────────────────────────

export async function adminListCountries() {
  const rows = await db
    .select({
      id: countries.id,
      iso2: countries.iso2,
      indexStatus: countries.indexStatus,
      completenessScore: countries.completenessScore,
    })
    .from(countries)
    .orderBy(asc(countries.iso2))
  return rows
}

export async function adminGetCountry(id: number) {
  const [country] = await db.select().from(countries).where(eq(countries.id, id)).limit(1)
  if (!country) return null
  const translations = await db
    .select()
    .from(countryTranslations)
    .where(eq(countryTranslations.countryId, id))
  return { ...country, translations }
}

export async function adminUpdateCountry(
  id: number,
  data: {
    indexStatus: 'draft' | 'noindex' | 'indexed'
    completenessScore: number
    currencyCode?: string | null
    latitude?: string | null
    longitude?: string | null
    translations: {
      locale: string
      name: string
      slug: string
      description?: string | null
      visaSummary?: string | null
      bestTimeSummary?: string | null
    }[]
  },
) {
  await db
    .update(countries)
    .set({
      indexStatus: data.indexStatus,
      completenessScore: data.completenessScore,
      currencyCode: data.currencyCode ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    })
    .where(eq(countries.id, id))

  for (const t of data.translations) {
    await db
      .insert(countryTranslations)
      .values({
        countryId: id,
        locale: t.locale,
        name: t.name,
        slug: t.slug,
        description: t.description ?? null,
        visaSummary: t.visaSummary ?? null,
        bestTimeSummary: t.bestTimeSummary ?? null,
      })
      .onDuplicateKeyUpdate({
        set: {
          name: t.name,
          slug: t.slug,
          description: t.description ?? null,
          visaSummary: t.visaSummary ?? null,
          bestTimeSummary: t.bestTimeSummary ?? null,
        },
      })
  }
}

// ── Cities ──────────────────────────────────────────────────────────────

export async function adminListCities() {
  const rows = await db
    .select({
      id: cities.id,
      countryId: cities.countryId,
      indexStatus: cities.indexStatus,
      completenessScore: cities.completenessScore,
    })
    .from(cities)
    .orderBy(asc(cities.id))
  // Attach EN name
  const ids = rows.map((r) => r.id)
  if (!ids.length) return []
  const names: { cityId: number; name: string }[] = []
  for (const cityId of ids) {
    const [t] = await db
      .select({ cityId: cityTranslations.cityId, name: cityTranslations.name })
      .from(cityTranslations)
      .where(eq(cityTranslations.cityId, cityId))
      .limit(1)
    if (t) names.push(t)
  }
  const nameMap = new Map(names.map((n) => [n.cityId, n.name]))
  return rows.map((r) => ({ ...r, name: nameMap.get(r.id) ?? `City #${r.id}` }))
}

export async function adminGetCity(id: number) {
  const [city] = await db.select().from(cities).where(eq(cities.id, id)).limit(1)
  if (!city) return null
  const translations = await db
    .select()
    .from(cityTranslations)
    .where(eq(cityTranslations.cityId, id))
  return { ...city, translations }
}

export async function adminUpdateCity(
  id: number,
  data: {
    indexStatus: 'draft' | 'noindex' | 'indexed'
    completenessScore: number
    latitude?: string | null
    longitude?: string | null
    translations: {
      locale: string
      name: string
      slug: string
      description?: string | null
    }[]
  },
) {
  await db
    .update(cities)
    .set({
      indexStatus: data.indexStatus,
      completenessScore: data.completenessScore,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    })
    .where(eq(cities.id, id))

  for (const t of data.translations) {
    await db
      .insert(cityTranslations)
      .values({ cityId: id, locale: t.locale, name: t.name, slug: t.slug, description: t.description ?? null })
      .onDuplicateKeyUpdate({ set: { name: t.name, slug: t.slug, description: t.description ?? null } })
  }
}

// ── POIs ────────────────────────────────────────────────────────────────

export async function adminListPois() {
  const rows = await db
    .select({
      id: pois.id,
      cityId: pois.cityId,
      priceRange: pois.priceRange,
      indexStatus: pois.indexStatus,
      completenessScore: pois.completenessScore,
    })
    .from(pois)
    .orderBy(asc(pois.id))
  const ids = rows.map((r) => r.id)
  if (!ids.length) return []
  const names: { poiId: number; name: string }[] = []
  for (const poiId of ids) {
    const [t] = await db
      .select({ poiId: poiTranslations.poiId, name: poiTranslations.name })
      .from(poiTranslations)
      .where(eq(poiTranslations.poiId, poiId))
      .limit(1)
    if (t) names.push(t)
  }
  const nameMap = new Map(names.map((n) => [n.poiId, n.name]))
  return rows.map((r) => ({ ...r, name: nameMap.get(r.id) ?? `POI #${r.id}` }))
}

export async function adminGetPoi(id: number) {
  const [poi] = await db.select().from(pois).where(eq(pois.id, id)).limit(1)
  if (!poi) return null
  const translations = await db
    .select()
    .from(poiTranslations)
    .where(eq(poiTranslations.poiId, id))
  return { ...poi, translations }
}

export async function adminUpdatePoi(
  id: number,
  data: {
    indexStatus: 'draft' | 'noindex' | 'indexed'
    completenessScore: number
    priceRange?: string | null
    latitude?: string | null
    longitude?: string | null
    openingHours?: string | null
    translations: {
      locale: string
      name: string
      slug: string
      description?: string | null
      tips?: string | null
    }[]
  },
) {
  const parsedHours = (() => {
    try { return data.openingHours ? JSON.parse(data.openingHours) : null } catch { return null }
  })()

  await db
    .update(pois)
    .set({
      indexStatus: data.indexStatus,
      completenessScore: data.completenessScore,
      priceRange: (data.priceRange as typeof pois.$inferInsert['priceRange']) ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      openingHours: parsedHours,
    })
    .where(eq(pois.id, id))

  for (const t of data.translations) {
    await db
      .insert(poiTranslations)
      .values({ poiId: id, locale: t.locale, name: t.name, slug: t.slug, description: t.description ?? null, tips: t.tips ?? null })
      .onDuplicateKeyUpdate({ set: { name: t.name, slug: t.slug, description: t.description ?? null, tips: t.tips ?? null } })
  }
}
