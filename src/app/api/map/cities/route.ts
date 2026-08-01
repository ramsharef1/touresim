import { NextResponse } from 'next/server'
import { db } from '@/db'
import { cities, cityTranslations, countries, countryTranslations } from '@/db/schema'
import { and, eq, isNotNull } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

let cache: { data: unknown; expiresAt: number } | null = null

export async function GET() {
  try {
    const now = Date.now()
    if (cache && cache.expiresAt > now) {
      return NextResponse.json(cache.data)
    }

    const rows = await db
      .select({
        id: cities.id,
        lat: cities.latitude,
        lng: cities.longitude,
        name: cityTranslations.name,
        slug: cityTranslations.slug,
        countryName: countryTranslations.name,
        countrySlug: countryTranslations.slug,
      })
      .from(cities)
      .innerJoin(
        cityTranslations,
        and(eq(cityTranslations.cityId, cities.id), eq(cityTranslations.locale, 'en')),
      )
      .innerJoin(countries, eq(countries.id, cities.countryId))
      .innerJoin(
        countryTranslations,
        and(eq(countryTranslations.countryId, countries.id), eq(countryTranslations.locale, 'en')),
      )
      .where(and(isNotNull(cities.latitude), isNotNull(cities.longitude)))

    const data = {
      success: true,
      count: rows.length,
      cities: rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        country: r.countryName,
        countrySlug: r.countrySlug,
        lat: Number(r.lat),
        lng: Number(r.lng),
      })),
    }

    cache = { data, expiresAt: now + 60 * 60 * 1000 }
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Map API] Error:', error)
    return NextResponse.json({ success: false, cities: [], count: 0 }, { status: 500 })
  }
}
