import 'server-only'
import { promises as fs } from 'fs'
import path from 'path'
import zlib from 'zlib'
import { db } from '@/db/index'
import {
  countries,
  countryTranslations,
  cities,
  cityTranslations,
  countryHolidays,
  heritageSites,
  countryHighlights,
  currencies,
  tourismStats,
  cityGazetteer,
  timezoneNames,
  cityAttractions,
  media,
  entityMedia,
} from '@/db/schema'
import { and, eq, sql } from 'drizzle-orm'

function normalizeName(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// ─────────────────────────────────────────────────────────────────────────
// Snapshot storage — raw fetched/uploaded payloads kept on disk per source.
// ─────────────────────────────────────────────────────────────────────────

const SNAPSHOT_DIR = path.join(process.cwd(), 'storage', 'sources')

export async function saveSnapshot(slug: string, raw: string | Buffer) {
  await fs.mkdir(SNAPSHOT_DIR, { recursive: true })
  await fs.writeFile(path.join(SNAPSHOT_DIR, `${slug}.snapshot`), raw)
}

export async function readSnapshot(slug: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(SNAPSHOT_DIR, `${slug}.snapshot`), 'utf8')
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Importer registry — each key maps a raw payload to DB rows.
//   fetch(): how to pull the raw text from a source URL (override for SPARQL).
//   import(raw): parse + inject, returns the number of records written.
// Sources without an importer just store a snapshot on refresh.
// ─────────────────────────────────────────────────────────────────────────

export type Importer = {
  fetch: (sourceUrl: string) => Promise<string>
  import: (raw: string) => Promise<number>
}

async function iso2Map(): Promise<Map<string, number>> {
  const rows = await db.select({ id: countries.id, iso2: countries.iso2 }).from(countries)
  return new Map(rows.map((r) => [r.iso2.toUpperCase(), r.id]))
}
async function iso3Map(): Promise<Map<string, number>> {
  const rows = await db.select({ id: countries.id, iso3: countries.iso3 }).from(countries)
  return new Map(rows.filter((r) => r.iso3).map((r) => [r.iso3!.toUpperCase(), r.id]))
}

// Map normalized English country name → country id (for sources keyed by name).
const NAME_ALIASES: Record<string, string> = {
  'united states of america': 'united states',
  usa: 'united states',
  uk: 'united kingdom',
  'great britain': 'united kingdom',
  'czech republic': 'czechia',
  'south korea': 'korea',
  'republic of korea': 'korea',
  'united republic of tanzania': 'tanzania',
  'russian federation': 'russia',
  'viet nam': 'vietnam',
}
async function nameToId(): Promise<(name: string) => number | undefined> {
  const rows = await db
    .select({ id: countryTranslations.countryId, name: countryTranslations.name })
    .from(countryTranslations)
    .where(eq(countryTranslations.locale, 'en'))
  const map = new Map<string, number>()
  for (const r of rows) map.set(normalizeName(r.name), r.id)
  return (name: string) => {
    const n = normalizeName(name)
    return map.get(n) ?? map.get(NAME_ALIASES[n] ?? '')
  }
}

const plainFetch = async (url: string) => {
  const res = await fetch(url, { headers: { 'User-Agent': 'touresim-data/1.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.text()
}

// ── date-holidays → country_holidays (multilingual) ──────────────────────
const holidaysImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const data = JSON.parse(raw) as {
      holidays: Record<string, { days?: Record<string, { _name?: string; name?: Record<string, string>; type?: string }> }>
      names: Record<string, { name?: Record<string, string> }>
    }
    const map = await iso2Map()
    let count = 0
    for (const [iso2, cc] of map) {
      const entry = data.holidays[iso2]
      if (!entry?.days) continue
      await db.delete(countryHolidays).where(sql`country_id = ${cc}`)
      let pos = 0
      for (const [rule, info] of Object.entries(entry.days)) {
        const names = info.name ?? data.names[info._name ?? rule]?.name ?? {}
        const m = /^(\d{2})-(\d{2})$/.exec(rule)
        await db
          .insert(countryHolidays)
          .values({
            countryId: cc,
            rule,
            month: m ? Number(m[1]) : null,
            day: m ? Number(m[2]) : null,
            type: info.type ?? 'public',
            nameEn: names.en ?? names['en-us'] ?? null,
            nameAr: names.ar ?? null,
            nameFr: names.fr ?? null,
            nameTr: names.tr ?? null,
            nameEs: names.es ?? null,
            position: pos++,
          })
          .onDuplicateKeyUpdate({
            set: { nameEn: names.en ?? null, type: info.type ?? 'public' },
          })
        count++
      }
    }
    return count
  },
}

// ── Wikidata SPARQL → heritage_sites ─────────────────────────────────────
// A single combined query (label SERVICE + P297 join over ~1,200 sites) hits
// the WDQS 60s gateway timeout. Instead run three cheap queries and join in
// code: (1) site→label+country, (2) country→iso2, (3) site→coord.
async function wdqs(sourceUrl: string, query: string): Promise<{ value: string }[][]> {
  const res = await fetch(sourceUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/sparql-results+json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'touresim-data/1.0 (contact: admin@touresim)',
    },
    body: `query=${encodeURIComponent(query)}`,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} from Wikidata`)
  const json = (await res.json()) as { results: { bindings: Record<string, { value: string }>[] }; head: { vars: string[] } }
  const vars = json.head.vars
  return json.results.bindings.map((b) => vars.map((v) => b[v]))
}

const unescoImporter: Importer = {
  fetch: async (sourceUrl) => {
    const [sites, isos, coords] = await Promise.all([
      wdqs(sourceUrl, `SELECT ?site ?siteLabel ?country WHERE { ?site wdt:P1435 wd:Q9259 ; wdt:P17 ?country ; rdfs:label ?siteLabel . FILTER(LANG(?siteLabel)="en") }`),
      wdqs(sourceUrl, `SELECT ?country ?iso2 WHERE { ?country wdt:P297 ?iso2 }`),
      wdqs(sourceUrl, `SELECT ?site ?coord WHERE { ?site wdt:P1435 wd:Q9259 ; wdt:P625 ?coord }`),
    ])
    return JSON.stringify({ sites, isos, coords })
  },
  import: async (raw) => {
    const { sites, isos, coords } = JSON.parse(raw) as {
      sites: { value: string }[][] // [site, siteLabel, country]
      isos: { value: string }[][] // [country, iso2]
      coords: { value: string }[][] // [site, coord]
    }
    const countryIso = new Map(isos.map(([c, iso]) => [c.value, iso.value.toUpperCase()]))
    const siteCoord = new Map<string, string>()
    for (const [site, coord] of coords) if (!siteCoord.has(site.value)) siteCoord.set(site.value, coord.value)

    const map = await iso2Map()
    const cleared = new Set<number>()
    let count = 0
    for (const [site, label, country] of sites) {
      const iso2 = countryIso.get(country.value)
      const name = label.value
      if (!iso2 || !name || /^Q\d+$/.test(name)) continue
      const cc = map.get(iso2)
      if (!cc) continue
      if (!cleared.has(cc)) {
        await db.delete(heritageSites).where(sql`country_id = ${cc}`)
        cleared.add(cc)
      }
      let lat: string | null = null
      let lng: string | null = null
      const pt = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(siteCoord.get(site.value) ?? '')
      if (pt) {
        lng = pt[1]
        lat = pt[2]
      }
      await db
        .insert(heritageSites)
        .values({ countryId: cc, name: name.slice(0, 255), latitude: lat, longitude: lng, wikidataId: site.value.split('/').pop() ?? null })
        .onDuplicateKeyUpdate({ set: { latitude: lat, longitude: lng } })
      count++
    }
    return count
  },
}

// ── dr5hn countries.json → backfill country facts ────────────────────────
const countryFactsImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const data = JSON.parse(raw) as {
      iso2: string
      population?: number | string | null
      gdp?: number | string | null
      area_sq_km?: number | string | null
      area?: number | string | null
      currency_symbol?: string | null
    }[]
    const map = await iso2Map()
    let count = 0
    for (const c of data) {
      const cc = map.get((c.iso2 ?? '').toUpperCase())
      if (!cc) continue
      const num = (v: unknown) => {
        const n = Number(v)
        return Number.isFinite(n) && n > 0 ? Math.round(n) : null
      }
      await db
        .update(countries)
        .set({
          population: num(c.population),
          gdp: num(c.gdp),
          areaSqKm: num(c.area_sq_km ?? c.area),
          currencySymbol: c.currency_symbol ?? null,
        })
        .where(sql`id = ${cc}`)
      count++
    }
    return count
  },
}

// ── nisaliana73 attractions CSV → country_highlights ─────────────────────
function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (ch === '"') inQ = false
      else cur += ch
    } else if (ch === '"') inQ = true
    else if (ch === ',') {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out
}

const attractionsImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const map = await iso3Map()
    // CSV may have quoted fields containing newlines — parse record-aware.
    const records: string[][] = []
    let field = ''
    let row: string[] = []
    let inQ = false
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i]
      if (inQ) {
        if (ch === '"' && raw[i + 1] === '"') {
          field += '"'
          i++
        } else if (ch === '"') inQ = false
        else field += ch
      } else if (ch === '"') inQ = true
      else if (ch === ',') {
        row.push(field)
        field = ''
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && raw[i + 1] === '\n') i++
        row.push(field)
        if (row.some((c) => c.trim())) records.push(row)
        row = []
        field = ''
      } else field += ch
    }
    if (field || row.length) {
      row.push(field)
      if (row.some((c) => c.trim())) records.push(row)
    }
    const header = records.shift() ?? []
    const idx = (n: string) => header.findIndex((h) => h.trim().toLowerCase() === n)
    const iAttr = idx('tourist attraction')
    const iAlpha3 = idx('alpha-3')
    let count = 0
    for (const r of records) {
      const body = (r[iAttr] ?? '').trim()
      const a3 = (r[iAlpha3] ?? '').trim().toUpperCase()
      const cc = map.get(a3)
      if (!cc || !body) continue
      const title = (body.split(/[.!?]/)[0] || body).trim().slice(0, 200)
      await db
        .insert(countryHighlights)
        .values({ countryId: cc, title, body, source: 'nisaliana73' })
        .onDuplicateKeyUpdate({ set: { body, source: 'nisaliana73' } })
      count++
    }
    return count
  },
}

// ── GeoNames cities15000 → backfill city lat/lng + timezone ──────────────
// The source is a ZIP holding a single tab-separated file. Parse the local
// file header and inflate with the built-in zlib (no external dep needed).
function unzipSingleFile(buf: Buffer): string {
  if (buf.readUInt32LE(0) !== 0x04034b50) throw new Error('Not a ZIP file')
  const fnLen = buf.readUInt16LE(26)
  const exLen = buf.readUInt16LE(28)
  const compSize = buf.readUInt32LE(18)
  const dataStart = 30 + fnLen + exLen
  // compSize is 0 when a data descriptor is used → inflate to stream end.
  const comp = compSize > 0 ? buf.subarray(dataStart, dataStart + compSize) : buf.subarray(dataStart)
  return zlib.inflateRawSync(comp).toString('utf8')
}

// GeoNames columns (tab-separated, no header):
// 0 id 1 name 2 asciiname 3 altnames 4 lat 5 lng 6 fclass 7 fcode
// 8 countryCode 14 population 17 timezone
const geonamesImporter: Importer = {
  fetch: async (sourceUrl) => {
    const res = await fetch(sourceUrl, { headers: { 'User-Agent': 'touresim-data/1.0' } })
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${sourceUrl}`)
    const buf = Buffer.from(await res.arrayBuffer())
    return sourceUrl.endsWith('.zip') ? unzipSingleFile(buf) : buf.toString('utf8')
  },
  import: async (raw) => {
    // Cities that still lack coordinates or timezone, keyed by name+iso2.
    const rows = await db
      .select({
        id: cities.id,
        name: cityTranslations.name,
        iso2: countries.iso2,
        lat: cities.latitude,
        tz: cities.timezone,
      })
      .from(cities)
      .innerJoin(cityTranslations, eq(cityTranslations.cityId, cities.id))
      .innerJoin(countries, eq(countries.id, cities.countryId))
      .where(eq(cityTranslations.locale, 'en'))

    // GeoNames gives the city CENTROID, which is authoritative — prefer it over
    // whatever is stored (earlier coords came from the nearest airport, which can
    // be far from the city centre). So always overwrite coords on a GeoNames match;
    // fill timezone only where missing.
    type Need = { id: number; needsCoords: boolean; needsTz: boolean }
    const need = new Map<string, Need>()
    for (const r of rows) {
      need.set(`${normalizeName(r.name)}|${r.iso2.toUpperCase()}`, {
        id: r.id,
        needsCoords: true,
        needsTz: r.tz == null,
      })
    }
    if (!need.size) return 0

    // Scan GeoNames, keeping the highest-population match per city.
    const best = new Map<string, { lat: string; lng: string; tz: string; pop: number }>()
    for (const line of raw.split('\n')) {
      if (!line) continue
      const f = line.split('\t')
      const cc = (f[8] ?? '').toUpperCase()
      if (!cc) continue
      const pop = Number(f[14]) || 0
      for (const nm of [f[1], f[2]]) {
        if (!nm) continue
        const key = `${normalizeName(nm)}|${cc}`
        if (!need.has(key)) continue
        const prev = best.get(key)
        if (!prev || pop > prev.pop) best.set(key, { lat: f[4], lng: f[5], tz: f[17] ?? '', pop })
      }
    }

    let count = 0
    for (const [key, n] of need) {
      const m = best.get(key)
      if (!m) continue
      const set: Record<string, string | number> = {}
      if (n.needsCoords && m.lat && m.lng) {
        set.latitude = m.lat
        set.longitude = m.lng
      }
      if (n.needsTz && m.tz) set.timezone = m.tz
      if (m.pop > 0) set.population = m.pop
      if (!Object.keys(set).length) continue
      await db.update(cities).set(set).where(eq(cities.id, n.id))
      count++
    }
    return count
  },
}

// ── mledoze/countries → countries (capital, languages, demonym) ──────────
const mledozeImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const data = JSON.parse(raw) as {
      cca2: string
      capital?: string[]
      languages?: Record<string, string>
      demonyms?: { eng?: { m?: string } }
    }[]
    const map = await iso2Map()
    let count = 0
    for (const c of data) {
      const cc = map.get((c.cca2 ?? '').toUpperCase())
      if (!cc) continue
      const langs = c.languages ? Object.values(c.languages).join(', ') : null
      await db
        .update(countries)
        .set({
          capital: c.capital?.[0]?.slice(0, 191) ?? null,
          languages: langs?.slice(0, 255) ?? null,
          demonym: c.demonyms?.eng?.m?.slice(0, 128) ?? null,
        })
        .where(sql`id = ${cc}`)
      count++
    }
    return count
  },
}

// ── annexare/Countries → countries (native name, phone code) ─────────────
const annexareImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const data = JSON.parse(raw) as Record<string, { native?: string; phone?: number[] }>
    const map = await iso2Map()
    let count = 0
    for (const [iso2, c] of Object.entries(data)) {
      const cc = map.get(iso2.toUpperCase())
      if (!cc) continue
      await db
        .update(countries)
        .set({
          nativeName: c.native?.slice(0, 191) ?? null,
          phoneCode: c.phone?.[0] ? `+${c.phone[0]}`.slice(0, 8) : null,
        })
        .where(sql`id = ${cc}`)
      count++
    }
    return count
  },
}

// ── flowcommerce currencies → currencies table ───────────────────────────
const flowCurrenciesImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const data = JSON.parse(raw) as {
      iso_4217_3: string
      name: string
      number_decimals?: number
      symbols?: { primary?: string }
    }[]
    let count = 0
    for (const c of data) {
      if (!c.iso_4217_3) continue
      await db
        .insert(currencies)
        .values({
          code: c.iso_4217_3,
          name: c.name?.slice(0, 128) ?? null,
          symbol: c.symbols?.primary?.slice(0, 8) ?? null,
          decimals: c.number_decimals ?? null,
        })
        .onDuplicateKeyUpdate({ set: { name: c.name?.slice(0, 128) ?? null, decimals: c.number_decimals ?? null } })
      count++
    }
    return count
  },
}

// ── OpenBookPrices currencies → currencies table (fills gaps) ────────────
const obpCurrenciesImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const data = JSON.parse(raw) as { code: string; name: string; decimals?: number; number?: string }[]
    let count = 0
    for (const c of data) {
      if (!c.code) continue
      await db
        .insert(currencies)
        .values({ code: c.code, name: c.name?.slice(0, 128) ?? null, decimals: c.decimals ?? null, numCode: c.number ?? null })
        .onDuplicateKeyUpdate({ set: { numCode: c.number ?? null } })
      count++
    }
    return count
  },
}

// ── OWID tourism CSV → tourism_stats (region-level) ──────────────────────
const owidTourismImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const lines = raw.split('\n').slice(1)
    await db.delete(tourismStats).where(sql`1 = 1`)
    let count = 0
    const batch: { entity: string; year: number; arrivals: number | null }[] = []
    for (const line of lines) {
      if (!line.trim()) continue
      const [entity, year, arrivals] = line.split(',')
      if (!entity || !year) continue
      batch.push({ entity: entity.slice(0, 64), year: Number(year), arrivals: arrivals ? Number(arrivals) : null })
    }
    for (let i = 0; i < batch.length; i += 500) {
      const chunk = batch.slice(i, i + 500)
      if (chunk.length) await db.insert(tourismStats).values(chunk)
      count += chunk.length
    }
    return count
  },
}

// ── world-cities CSV → city_gazetteer (unpublished reference) ────────────
const worldCitiesImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const lines = raw.split('\n').slice(1)
    await db.delete(cityGazetteer).where(sql`source = 'world-cities'`)
    let count = 0
    let batch: { name: string; country: string; subcountry: string; geonameid: number | null; source: string }[] = []
    const flush = async () => {
      if (batch.length) await db.insert(cityGazetteer).values(batch)
      count += batch.length
      batch = []
    }
    for (const line of lines) {
      if (!line.trim()) continue
      const f = line.split(',')
      if (f.length < 4) continue
      batch.push({
        name: (f[0] ?? '').slice(0, 191),
        country: (f[1] ?? '').slice(0, 128),
        subcountry: (f[2] ?? '').slice(0, 128),
        geonameid: Number(f[3]) || null,
        source: 'world-cities',
      })
      if (batch.length >= 1000) await flush()
    }
    await flush()
    return count
  },
}

// ── dr5hn countries+cities.json → city_gazetteer (unpublished reference) ──
const dr5hnCitiesImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const data = JSON.parse(raw) as { name: string; cities?: string[] }[]
    await db.delete(cityGazetteer).where(sql`source = 'dr5hn'`)
    let count = 0
    let batch: { name: string; country: string; source: string }[] = []
    const flush = async () => {
      if (batch.length) await db.insert(cityGazetteer).values(batch)
      count += batch.length
      batch = []
    }
    for (const c of data) {
      for (const city of c.cities ?? []) {
        if (!city) continue
        batch.push({ name: String(city).slice(0, 191), country: c.name.slice(0, 128), source: 'dr5hn' })
        if (batch.length >= 1000) await flush()
      }
    }
    await flush()
    return count
  },
}

// ── timezone-boundary-builder names → timezone_names ─────────────────────
const timezoneNamesImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const names = JSON.parse(raw) as string[]
    await db.delete(timezoneNames).where(sql`1 = 1`)
    let count = 0
    let batch: { name: string }[] = []
    const flush = async () => {
      if (batch.length) await db.insert(timezoneNames).values(batch)
      count += batch.length
      batch = []
    }
    for (const n of names) {
      if (!n) continue
      batch.push({ name: n.slice(0, 64) })
      if (batch.length >= 500) await flush()
    }
    await flush()
    return count
  },
}

// ── Emergency numbers (bulk) → countries (police/ambulance/fire) ─────────
const emergencyImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const data = JSON.parse(raw) as {
      Country: { ISOCode: string }
      Ambulance?: { All?: string[] }
      Fire?: { All?: string[] }
      Police?: { All?: string[] }
      Dispatch?: { All?: string[] }
    }[]
    const map = await iso2Map()
    let count = 0
    const first = (a?: string[]) => (a && a.length ? a.filter(Boolean)[0]?.slice(0, 32) ?? null : null)
    for (const c of data) {
      const cc = map.get((c.Country?.ISOCode ?? '').toUpperCase())
      if (!cc) continue
      await db
        .update(countries)
        .set({
          emergencyPolice: first(c.Police?.All) ?? first(c.Dispatch?.All),
          emergencyAmbulance: first(c.Ambulance?.All) ?? first(c.Dispatch?.All),
          emergencyFire: first(c.Fire?.All) ?? first(c.Dispatch?.All),
        })
        .where(sql`id = ${cc}`)
      count++
    }
    return count
  },
}

// ── samayo driving-side → countries.driving_side ─────────────────────────
const drivingSideImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const data = JSON.parse(raw) as { country: string; side: string }[]
    const lookup = await nameToId()
    let count = 0
    for (const r of data) {
      const id = lookup(r.country)
      if (!id || !r.side) continue
      await db.update(countries).set({ drivingSide: r.side.slice(0, 8) }).where(sql`id = ${id}`)
      count++
    }
    return count
  },
}

// ── samayo national-dish → countries.national_dish ───────────────────────
const nationalDishImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const data = JSON.parse(raw) as { country: string; dish: string }[]
    const lookup = await nameToId()
    let count = 0
    for (const r of data) {
      const id = lookup(r.country)
      if (!id || !r.dish) continue
      const dish = r.dish.replace(/,\s*$/, '').trim().slice(0, 255)
      await db.update(countries).set({ nationalDish: dish }).where(sql`id = ${id}`)
      count++
    }
    return count
  },
}

// ── World Bank ST.INT.ARVL → countries (per-country tourist arrivals) ─────
const worldBankTourismImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const parsed = JSON.parse(raw) as [unknown, { countryiso3code: string; date: string; value: number | null }[]]
    const rows = Array.isArray(parsed) && parsed.length > 1 ? parsed[1] : []
    const map = await iso3Map()
    let count = 0
    for (const r of rows ?? []) {
      const id = map.get((r.countryiso3code ?? '').toUpperCase())
      if (!id || r.value == null) continue
      await db
        .update(countries)
        .set({ touristArrivals: Math.round(r.value), touristArrivalsYear: Number(r.date) || null })
        .where(sql`id = ${id}`)
      count++
    }
    return count
  },
}

// ── frankfurter FX (base EUR) → currencies.rate_eur ──────────────────────
const fxRatesImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const data = JSON.parse(raw) as { date: string; rates: Record<string, number> }
    let count = 0
    // base currency EUR = 1.0
    await db
      .update(currencies)
      .set({ rateEur: '1', rateDate: data.date })
      .where(sql`code = 'EUR'`)
    for (const [code, rate] of Object.entries(data.rates)) {
      await db
        .update(currencies)
        .set({ rateEur: String(rate), rateDate: data.date })
        .where(sql`code = ${code}`)
      count++
    }
    return count + 1
  },
}

// ── Wikivoyage travel-guide intros → countries.travel_guide ──────────────
// Batches up to 20 country names per MediaWiki API call (titles separated by |).
const wikivoyageImporter: Importer = {
  fetch: async () => {
    const rows = await db
      .select({ id: countryTranslations.countryId, name: countryTranslations.name })
      .from(countryTranslations)
      .where(eq(countryTranslations.locale, 'en'))
    const out: Record<string, string> = {}
    for (let i = 0; i < rows.length; i += 20) {
      const batch = rows.slice(i, i + 20)
      const titles = batch.map((r) => r.name).join('|')
      const url =
        'https://en.wikivoyage.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&redirects=1&format=json&titles=' +
        encodeURIComponent(titles)
      const res = await fetch(url, { headers: { 'User-Agent': 'touresim-data/1.0 (admin@touresim)' } })
      if (!res.ok) continue
      const json = (await res.json()) as { query?: { pages?: Record<string, { title: string; extract?: string }> } }
      for (const p of Object.values(json.query?.pages ?? {})) {
        if (p.extract && p.extract.length > 80) out[p.title] = p.extract
      }
    }
    return JSON.stringify(out)
  },
  import: async (raw) => {
    const data = JSON.parse(raw) as Record<string, string>
    const lookup = await nameToId()
    let count = 0
    for (const [title, extract] of Object.entries(data)) {
      const id = lookup(title)
      if (!id) continue
      const text = extract.replace(/\s+/g, ' ').trim().slice(0, 1500)
      await db.update(countries).set({ travelGuide: text }).where(sql`id = ${id}`)
      count++
    }
    return count
  },
}

// ── World Bank homicide rate → countries (open GPI alternative) ──────────
const safetyImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const parsed = JSON.parse(raw) as [unknown, { countryiso3code: string; date: string; value: number | null }[]]
    const rows = Array.isArray(parsed) && parsed.length > 1 ? parsed[1] : []
    const map = await iso3Map()
    let count = 0
    for (const r of rows ?? []) {
      const id = map.get((r.countryiso3code ?? '').toUpperCase())
      if (!id || r.value == null) continue
      await db
        .update(countries)
        .set({ homicideRate: r.value.toFixed(2), homicideYear: Number(r.date) || null })
        .where(sql`id = ${id}`)
      count++
    }
    return count
  },
}

// ── Big Mac Index (Economist) → countries (open Numbeo/cost alternative) ──
const bigMacImporter: Importer = {
  fetch: plainFetch,
  import: async (raw) => {
    const lines = raw.split('\n')
    const header = (lines.shift() ?? '').split(',')
    const iDate = header.indexOf('date')
    const iIso3 = header.indexOf('iso_a3')
    const iPrice = header.indexOf('dollar_price')
    // Keep only the most recent observation per country.
    const latest = new Map<string, { price: number; year: number }>()
    for (const line of lines) {
      if (!line.trim()) continue
      const f = line.split(',')
      const iso3 = (f[iIso3] ?? '').toUpperCase()
      const price = Number(f[iPrice])
      const year = Number((f[iDate] ?? '').slice(0, 4))
      if (!iso3 || !Number.isFinite(price) || !year) continue
      const prev = latest.get(iso3)
      if (!prev || year > prev.year) latest.set(iso3, { price, year })
    }
    const map = await iso3Map()
    let count = 0
    for (const [iso3, v] of latest) {
      const id = map.get(iso3)
      if (!id) continue
      await db.update(countries).set({ bigMacUsd: v.price.toFixed(2), bigMacYear: v.year }).where(sql`id = ${id}`)
      count++
    }
    return count
  },
}

// ── samayo country-json (name-keyed) → single country column ─────────────
function samayoCountryImporter(
  field: string,
  toSet: (val: unknown) => Record<string, unknown> | null,
): Importer {
  return {
    fetch: plainFetch,
    import: async (raw) => {
      const data = JSON.parse(raw) as Record<string, unknown>[]
      const lookup = await nameToId()
      let count = 0
      for (const r of data) {
        const id = lookup(String(r.country ?? ''))
        if (!id) continue
        const set = toSet(r[field])
        if (!set) continue
        await db.update(countries).set(set).where(sql`id = ${id}`)
        count++
      }
      return count
    },
  }
}

const religionImporter = samayoCountryImporter('religion', (v) =>
  v ? { religion: String(v).slice(0, 64) } : null,
)
const avgTempImporter = samayoCountryImporter('temperature', (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? { avgTempC: n.toFixed(1) } : null
})
const landlockedImporter = samayoCountryImporter('landlocked', (v) =>
  v === '1' || v === 1 || v === true
    ? { landlocked: 1 }
    : v === '0' || v === 0 || v === false
      ? { landlocked: 0 }
      : null,
)

// ── Wikidata city attractions (coordinate radius) → city_attractions ─────
// One SPARQL "around" query per city that has coordinates. Concurrency-limited.
const cityAttractionsImporter: Importer = {
  fetch: async (sourceUrl) => {
    const rows = await db
      .select({ id: cities.id, lat: cities.latitude, lng: cities.longitude })
      .from(cities)
      .where(sql`latitude IS NOT NULL AND index_status = 'indexed'`)

    const out: Record<number, { name: string; type: string; lat: string | null; lng: string | null; qid: string }[]> = {}
    let cursor = 0
    async function worker() {
      while (cursor < rows.length) {
        const c = rows[cursor++]
        // Broad set of tourist-relevant classes, ranked by fame (sitelink count)
        // so iconic sites surface first instead of obscure nearby points.
        const query = `SELECT ?item ?itemLabel ?typeLabel ?coord ?sitelinks WHERE {
  SERVICE wikibase:around { ?item wdt:P625 ?coord . bd:serviceParam wikibase:center "Point(${c.lng} ${c.lat})"^^geo:wktLiteral . bd:serviceParam wikibase:radius "10" . }
  VALUES ?type { wd:Q570116 wd:Q33506 wd:Q4989906 wd:Q16970 wd:Q23413 wd:Q839954 wd:Q22698 wd:Q2065736 wd:Q44613 }
  ?item wdt:P31 ?type .
  ?item wikibase:sitelinks ?sitelinks . FILTER(?sitelinks >= 6)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
} ORDER BY DESC(?sitelinks) LIMIT 15`
        try {
          const res = await fetch(sourceUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/sparql-results+json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'touresim-data/1.0 (admin@touresim)',
            },
            body: `query=${encodeURIComponent(query)}`,
          })
          if (!res.ok) continue
          const json = (await res.json()) as {
            results: { bindings: Record<string, { value: string }>[] }
          }
          const seen = new Set<string>()
          const items = []
          for (const b of json.results.bindings) {
            const name = b.itemLabel?.value
            if (!name || /^Q\d+$/.test(name) || seen.has(name)) continue
            seen.add(name)
            const pt = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(b.coord?.value ?? '')
            items.push({
              name: name.slice(0, 255),
              type: (b.typeLabel?.value ?? '').slice(0, 64),
              lng: pt ? pt[1] : null,
              lat: pt ? pt[2] : null,
              qid: b.item?.value?.split('/').pop() ?? '',
            })
          }
          if (items.length) out[c.id] = items
        } catch {
          /* skip city on error */
        }
      }
    }
    await Promise.all(Array.from({ length: 4 }, worker))
    return JSON.stringify(out)
  },
  import: async (raw) => {
    const data = JSON.parse(raw) as Record<string, { name: string; type: string; lat: string | null; lng: string | null; qid: string }[]>
    let count = 0
    for (const [cityId, items] of Object.entries(data)) {
      const id = Number(cityId)
      await db.delete(cityAttractions).where(sql`city_id = ${id}`)
      for (const it of items) {
        await db
          .insert(cityAttractions)
          .values({ cityId: id, name: it.name, type: it.type || null, latitude: it.lat, longitude: it.lng, wikidataId: it.qid || null })
          .onDuplicateKeyUpdate({ set: { type: it.type || null } })
        count++
      }
    }
    return count
  },
}

// ── Wikipedia/Commons → city hero images ─────────────────────────────────
// For each indexed city lacking a hero, pull the lead image from the English
// Wikipedia REST summary (a freely-licensed Wikimedia Commons file).
const cityImagesImporter: Importer = {
  fetch: async () => {
    const rows = await db
      .select({ id: cities.id, name: cityTranslations.name, country: countryTranslations.name })
      .from(cities)
      .innerJoin(cityTranslations, eq(cityTranslations.cityId, cities.id))
      .innerJoin(countries, eq(countries.id, cities.countryId))
      .innerJoin(
        countryTranslations,
        and(eq(countryTranslations.countryId, countries.id), eq(countryTranslations.locale, 'en')),
      )
      .where(sql`city_translations.locale = 'en' AND cities.index_status = 'indexed' AND cities.hero_media_id IS NULL`)

    type Img = { source: string; width?: number; height?: number }
    const summary = async (title: string): Promise<Img | null> => {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}?redirect=true`,
          { headers: { 'User-Agent': 'touresim-data/1.0 (admin@touresim)' } },
        )
        if (!res.ok) return null
        const j = (await res.json()) as { type?: string; originalimage?: Img; thumbnail?: Img }
        if (j.type === 'disambiguation') return null
        return j.originalimage ?? j.thumbnail ?? null
      } catch {
        return null
      }
    }

    const out: Record<number, { url: string; w: number | null; h: number | null }> = {}
    let cursor = 0
    async function worker() {
      while (cursor < rows.length) {
        const c = rows[cursor++]
        // Try "City, Country" first (disambiguates Split/Cartagena/etc.), then bare name.
        const img = (await summary(`${c.name}, ${c.country}`)) ?? (await summary(c.name))
        if (img?.source) out[c.id] = { url: img.source, w: img.width ?? null, h: img.height ?? null }
      }
    }
    await Promise.all(Array.from({ length: 4 }, worker))
    return JSON.stringify(out)
  },
  import: async (raw) => {
    const data = JSON.parse(raw) as Record<string, { url: string; w: number | null; h: number | null }>
    let count = 0
    for (const [cityId, img] of Object.entries(data)) {
      const id = Number(cityId)
      const [m] = await db
        .insert(media)
        .values({ url: img.url, width: img.w, height: img.h, credit: 'Wikimedia Commons', license: 'CC', source: 'wikipedia' })
        .$returningId()
      await db.insert(entityMedia).values({ mediaId: m.id, entityType: 'city', entityId: id, position: 0 })
      await db.update(cities).set({ heroMediaId: m.id }).where(eq(cities.id, id))
      count++
    }
    return count
  },
}

// ── Wikidata P18 by coordinates → city hero images (higher coverage) ─────
// Looks up the nearest human settlement to each city's exact coords and grabs
// its canonical image (P18) — bypasses the name-disambiguation problem that
// limits the Wikipedia-summary source. Special:FilePath?width= renders any
// source format (incl. .tiff/.svg) to a web JPEG/PNG thumbnail.
const cityImagesWikidataImporter: Importer = {
  fetch: async (sourceUrl) => {
    const rows = await db
      .select({ id: cities.id, lat: cities.latitude, lng: cities.longitude })
      .from(cities)
      .where(sql`latitude IS NOT NULL AND index_status = 'indexed' AND hero_media_id IS NULL`)

    const out: Record<number, string> = {}
    let cursor = 0
    async function worker() {
      while (cursor < rows.length) {
        const c = rows[cursor++]
        const query = `SELECT ?image WHERE {
  SERVICE wikibase:around { ?place wdt:P625 ?loc . bd:serviceParam wikibase:center "Point(${c.lng} ${c.lat})"^^geo:wktLiteral . bd:serviceParam wikibase:radius "8" . bd:serviceParam wikibase:distance ?dist . }
  ?place wdt:P31/wdt:P279* wd:Q486972 . ?place wdt:P18 ?image .
} ORDER BY ?dist LIMIT 1`
        try {
          const res = await fetch(sourceUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/sparql-results+json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'touresim-data/1.0 (admin@touresim)',
            },
            body: `query=${encodeURIComponent(query)}`,
          })
          if (!res.ok) continue
          const j = (await res.json()) as { results: { bindings: { image?: { value: string } }[] } }
          const raw = j.results.bindings[0]?.image?.value
          if (raw) out[c.id] = `${raw.replace(/^http:/, 'https:')}?width=1400`
        } catch {
          /* skip */
        }
      }
    }
    await Promise.all(Array.from({ length: 4 }, worker))
    return JSON.stringify(out)
  },
  import: async (raw) => {
    const data = JSON.parse(raw) as Record<string, string>
    let count = 0
    for (const [cityId, url] of Object.entries(data)) {
      const id = Number(cityId)
      const [m] = await db
        .insert(media)
        .values({ url, credit: 'Wikimedia Commons', license: 'CC', source: 'wikidata' })
        .$returningId()
      await db.insert(entityMedia).values({ mediaId: m.id, entityType: 'city', entityId: id, position: 0 })
      await db.update(cities).set({ heroMediaId: m.id }).where(eq(cities.id, id))
      count++
    }
    return count
  },
}

export const IMPORTERS: Record<string, Importer> = {
  holidays: holidaysImporter,
  unesco: unescoImporter,
  country_facts: countryFactsImporter,
  attractions: attractionsImporter,
  geonames_cities: geonamesImporter,
  mledoze: mledozeImporter,
  annexare: annexareImporter,
  currencies_flow: flowCurrenciesImporter,
  currencies_obp: obpCurrenciesImporter,
  tourism: owidTourismImporter,
  world_cities: worldCitiesImporter,
  dr5hn_cities: dr5hnCitiesImporter,
  timezone_names: timezoneNamesImporter,
  emergency: emergencyImporter,
  driving_side: drivingSideImporter,
  national_dish: nationalDishImporter,
  worldbank_tourism: worldBankTourismImporter,
  fx_rates: fxRatesImporter,
  wikivoyage: wikivoyageImporter,
  safety_homicide: safetyImporter,
  bigmac_cost: bigMacImporter,
  religion: religionImporter,
  avg_temp: avgTempImporter,
  landlocked: landlockedImporter,
  city_attractions: cityAttractionsImporter,
  city_images: cityImagesImporter,
  city_images_wikidata: cityImagesWikidataImporter,
}

// ─────────────────────────────────────────────────────────────────────────
// Public service: refresh (fetch) and ingest (upload) a source.
// ─────────────────────────────────────────────────────────────────────────

export async function refreshFromUrl(
  slug: string,
  sourceUrl: string,
  importerKey: string | null,
): Promise<{ ok: boolean; recordCount: number | null; message: string }> {
  try {
    const importer = importerKey ? IMPORTERS[importerKey] : null
    const raw = importer ? await importer.fetch(sourceUrl) : await plainFetch(sourceUrl)
    await saveSnapshot(slug, raw)
    const recordCount = importer ? await importer.import(raw) : null
    return {
      ok: true,
      recordCount,
      message: importer ? `Imported ${recordCount} records` : `Stored snapshot (${raw.length} bytes)`,
    }
  } catch (e) {
    return { ok: false, recordCount: null, message: e instanceof Error ? e.message : String(e) }
  }
}

export async function ingestUpload(
  slug: string,
  importerKey: string | null,
  raw: string,
): Promise<{ ok: boolean; recordCount: number | null; message: string }> {
  try {
    await saveSnapshot(slug, raw)
    const importer = importerKey ? IMPORTERS[importerKey] : null
    const recordCount = importer ? await importer.import(raw) : null
    return {
      ok: true,
      recordCount,
      message: importer ? `Imported ${recordCount} records from upload` : `Stored uploaded file (${raw.length} bytes)`,
    }
  } catch (e) {
    return { ok: false, recordCount: null, message: e instanceof Error ? e.message : String(e) }
  }
}
