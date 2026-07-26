import 'dotenv/config'
import { and, eq } from 'drizzle-orm'
import { db } from '../index'
import {
  continents,
  continentTranslations,
  countries,
  countryTranslations,
  cities,
  cityTranslations,
  pois,
  poiTranslations,
} from '../schema'
import {
  SEED_CONTINENTS,
  SEED_COUNTRIES,
  SEED_CITIES,
  SEED_POIS,
} from './tier1-places'

type LocaleRow = { locale: string; name: string; slug: string; description?: string | null }

async function upsertContinents() {
  const idMap = new Map<string, number>()
  for (const c of SEED_CONTINENTS) {
    const existing = await db
      .select({ id: continents.id })
      .from(continents)
      .where(eq(continents.code, c.code))
      .limit(1)

    let id: number
    if (existing.length) {
      id = existing[0].id
    } else {
      const [row] = await db.insert(continents).values({ code: c.code }).$returningId()
      id = row.id
    }
    idMap.set(c.code, id)

    const translations: LocaleRow[] = [
      { locale: 'ar', name: c.ar, slug: c.slug_ar },
      { locale: 'en', name: c.en, slug: c.slug_en },
    ]
    for (const t of translations) {
      await db
        .insert(continentTranslations)
        .values({ continentId: id, locale: t.locale, name: t.name, slug: t.slug })
        .onDuplicateKeyUpdate({ set: { name: t.name, slug: t.slug } })
    }
  }
  return idMap
}

async function upsertCountries(continentIdMap: Map<string, number>) {
  const idMap = new Map<string, number>()
  for (const c of SEED_COUNTRIES) {
    const continentId = continentIdMap.get(c.continentCode)
    if (!continentId) throw new Error(`Unknown continent code: ${c.continentCode}`)

    const existing = await db
      .select({ id: countries.id })
      .from(countries)
      .where(eq(countries.iso2, c.iso2))
      .limit(1)

    let id: number
    if (existing.length) {
      id = existing[0].id
      await db
        .update(countries)
        .set({ continentId, iso3: c.iso3, currencyCode: c.currencyCode, latitude: c.lat, longitude: c.lng, indexStatus: 'indexed', completenessScore: 70 })
        .where(eq(countries.id, id))
    } else {
      const [row] = await db
        .insert(countries)
        .values({ continentId, iso2: c.iso2, iso3: c.iso3, currencyCode: c.currencyCode, latitude: c.lat, longitude: c.lng, indexStatus: 'indexed', completenessScore: 70 })
        .$returningId()
      id = row.id
    }
    idMap.set(c.iso2, id)

    const translations = [
      { locale: 'ar', name: c.ar.name, slug: c.ar.slug, description: c.ar.description, visaSummary: c.ar.visaSummary, bestTimeSummary: c.ar.bestTimeSummary },
      { locale: 'en', name: c.en.name, slug: c.en.slug, description: c.en.description, visaSummary: c.en.visaSummary, bestTimeSummary: c.en.bestTimeSummary },
      { locale: 'fr', name: c.fr.name, slug: c.fr.slug, description: c.fr.description, visaSummary: null, bestTimeSummary: null },
      { locale: 'tr', name: c.tr.name, slug: c.tr.slug, description: c.tr.description, visaSummary: null, bestTimeSummary: null },
      { locale: 'es', name: c.es.name, slug: c.es.slug, description: c.es.description, visaSummary: null, bestTimeSummary: null },
    ]
    for (const t of translations) {
      await db
        .insert(countryTranslations)
        .values({ countryId: id, locale: t.locale, name: t.name, slug: t.slug, description: t.description, visaSummary: t.visaSummary, bestTimeSummary: t.bestTimeSummary })
        .onDuplicateKeyUpdate({ set: { name: t.name, slug: t.slug, description: t.description, visaSummary: t.visaSummary, bestTimeSummary: t.bestTimeSummary } })
    }
  }
  return idMap
}

async function upsertCities(countryIdMap: Map<string, number>) {
  const idMap = new Map<string, number>() // keyed by en slug
  for (const c of SEED_CITIES) {
    const countryId = countryIdMap.get(c.countryIso2)
    if (!countryId) throw new Error(`Unknown country iso2: ${c.countryIso2}`)

    // find by en slug in translations
    const existing = await db
      .select({ cityId: cityTranslations.cityId })
      .from(cityTranslations)
      .where(and(eq(cityTranslations.locale, 'en'), eq(cityTranslations.slug, c.en.slug)))
      .limit(1)

    let id: number
    if (existing.length) {
      id = existing[0].cityId
      await db
        .update(cities)
        .set({ latitude: c.lat, longitude: c.lng, indexStatus: 'indexed', completenessScore: 60 })
        .where(eq(cities.id, id))
    } else {
      const [row] = await db
        .insert(cities)
        .values({ countryId, latitude: c.lat, longitude: c.lng, indexStatus: 'indexed', completenessScore: 60 })
        .$returningId()
      id = row.id
    }
    idMap.set(c.en.slug, id)

    const translations = [
      { locale: 'ar', ...c.ar },
      { locale: 'en', ...c.en },
      { locale: 'fr', ...c.fr },
      { locale: 'tr', ...c.tr },
      { locale: 'es', ...c.es },
    ]
    for (const t of translations) {
      await db
        .insert(cityTranslations)
        .values({ cityId: id, locale: t.locale, name: t.name, slug: t.slug, description: t.description })
        .onDuplicateKeyUpdate({ set: { name: t.name, slug: t.slug, description: t.description } })
    }
  }
  return idMap
}

async function upsertPois(cityIdMap: Map<string, number>) {
  for (const p of SEED_POIS) {
    const cityId = cityIdMap.get(p.citySlugEn)
    if (!cityId) {
      console.warn(`Skipping POI — unknown city slug: ${p.citySlugEn}`)
      continue
    }

    const existing = await db
      .select({ poiId: poiTranslations.poiId })
      .from(poiTranslations)
      .where(and(eq(poiTranslations.locale, 'en'), eq(poiTranslations.slug, p.en.slug)))
      .limit(1)

    let id: number
    if (existing.length) {
      id = existing[0].poiId
      await db
        .update(pois)
        .set({ latitude: p.lat, longitude: p.lng, priceRange: p.priceRange, openingHours: p.openingHours, indexStatus: 'indexed', completenessScore: 80 })
        .where(eq(pois.id, id))
    } else {
      const [row] = await db
        .insert(pois)
        .values({ cityId, latitude: p.lat, longitude: p.lng, priceRange: p.priceRange, openingHours: p.openingHours, indexStatus: 'indexed', completenessScore: 80 })
        .$returningId()
      id = row.id
    }

    for (const [locale, t] of [['ar', p.ar], ['en', p.en]] as const) {
      await db
        .insert(poiTranslations)
        .values({ poiId: id, locale, name: t.name, slug: t.slug, description: t.description, tips: t.tips })
        .onDuplicateKeyUpdate({ set: { name: t.name, description: t.description, tips: t.tips } })
    }
  }
}

async function main() {
  console.log('Seeding Tier 1 places…')

  console.log('  Continents…')
  const continentIdMap = await upsertContinents()
  console.log(`  ✓ ${continentIdMap.size} continents`)

  console.log('  Countries…')
  const countryIdMap = await upsertCountries(continentIdMap)
  console.log(`  ✓ ${countryIdMap.size} countries`)

  console.log('  Cities…')
  const cityIdMap = await upsertCities(countryIdMap)
  console.log(`  ✓ ${cityIdMap.size} cities`)

  console.log('  POIs…')
  await upsertPois(cityIdMap)
  console.log(`  ✓ ${SEED_POIS.length} POIs`)

  console.log('\n✅ Tier 1 seed complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
