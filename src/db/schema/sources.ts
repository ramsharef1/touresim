import {
  int,
  tinyint,
  varchar,
  text,
  decimal,
  timestamp,
  mysqlEnum,
  mysqlTable,
  uniqueIndex,
  index,
} from 'drizzle-orm/mysql-core'
import { countries, cities } from './places'

export const dataSourceStatusValues = ['applied', 'open', 'blocked'] as const

/** Catalog of external datasets used to enrich the DB. Editable from admin. */
export const dataSources = mysqlTable(
  'data_sources',
  {
    id: int('id').autoincrement().primaryKey(),
    slug: varchar('slug', { length: 64 }).notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    sourceUrl: varchar('source_url', { length: 1024 }).notNull(),
    contents: varchar('contents', { length: 512 }),
    format: varchar('format', { length: 64 }),
    status: mysqlEnum('status', dataSourceStatusValues).default('open').notNull(),
    note: varchar('note', { length: 512 }),
    importerKey: varchar('importer_key', { length: 64 }),
    recordCount: int('record_count'),
    lastRefreshedAt: timestamp('last_refreshed_at'),
    lastRefreshStatus: varchar('last_refresh_status', { length: 512 }),
    position: int('position').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex('data_sources_slug_unq').on(t.slug)],
)

/** Public/bank holidays per country (multilingual), imported from date-holidays. */
export const countryHolidays = mysqlTable(
  'country_holidays',
  {
    id: int('id').autoincrement().primaryKey(),
    countryId: int('country_id')
      .notNull()
      .references(() => countries.id, { onDelete: 'cascade' }),
    rule: varchar('rule', { length: 255 }).notNull(),
    month: tinyint('month'),
    day: tinyint('day'),
    type: varchar('type', { length: 32 }),
    nameEn: varchar('name_en', { length: 191 }),
    nameAr: varchar('name_ar', { length: 191 }),
    nameFr: varchar('name_fr', { length: 191 }),
    nameTr: varchar('name_tr', { length: 191 }),
    nameEs: varchar('name_es', { length: 191 }),
    position: int('position').default(0).notNull(),
  },
  (t) => [
    uniqueIndex('holiday_unq').on(t.countryId, t.rule),
    index('holiday_country_idx').on(t.countryId),
  ],
)

/** UNESCO World Heritage Sites, imported from Wikidata SPARQL. */
export const heritageSites = mysqlTable(
  'heritage_sites',
  {
    id: int('id').autoincrement().primaryKey(),
    countryId: int('country_id')
      .notNull()
      .references(() => countries.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    latitude: decimal('latitude', { precision: 10, scale: 7 }),
    longitude: decimal('longitude', { precision: 10, scale: 7 }),
    wikidataId: varchar('wikidata_id', { length: 32 }),
  },
  (t) => [
    uniqueIndex('heritage_unq').on(t.countryId, t.name),
    index('heritage_country_idx').on(t.countryId),
  ],
)

/** Top attractions / highlights per country. */
export const countryHighlights = mysqlTable(
  'country_highlights',
  {
    id: int('id').autoincrement().primaryKey(),
    countryId: int('country_id')
      .notNull()
      .references(() => countries.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    body: text('body'),
    source: varchar('source', { length: 128 }),
  },
  (t) => [
    uniqueIndex('highlight_unq').on(t.countryId, t.title),
    index('highlight_country_idx').on(t.countryId),
  ],
)

/** ISO 4217 currencies — from flowcommerce + OpenBookPrices. */
export const currencies = mysqlTable('currencies', {
  code: varchar('code', { length: 3 }).primaryKey(),
  name: varchar('name', { length: 128 }),
  symbol: varchar('symbol', { length: 8 }),
  decimals: tinyint('decimals'),
  numCode: varchar('num_code', { length: 3 }),
  rateEur: decimal('rate_eur', { precision: 18, scale: 6 }),
  rateDate: varchar('rate_date', { length: 10 }),
})

/** International tourist arrivals by world region — from OWID/UNWTO. */
export const tourismStats = mysqlTable(
  'tourism_stats',
  {
    id: int('id').autoincrement().primaryKey(),
    entity: varchar('entity', { length: 64 }).notNull(),
    year: int('year').notNull(),
    arrivals: int('arrivals'),
  },
  (t) => [uniqueIndex('tourism_unq').on(t.entity, t.year)],
)

/** Unpublished gazetteer of city names (world-cities + dr5hn). Reference only —
 *  NOT linked to the published `cities` table, so it creates no indexed pages. */
export const cityGazetteer = mysqlTable(
  'city_gazetteer',
  {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 191 }).notNull(),
    country: varchar('country', { length: 128 }),
    subcountry: varchar('subcountry', { length: 128 }),
    geonameid: int('geonameid'),
    source: varchar('source', { length: 32 }),
  },
  (t) => [index('gaz_name_idx').on(t.name), index('gaz_country_idx').on(t.country)],
)

/** IANA timezone names — from timezone-boundary-builder. */
export const timezoneNames = mysqlTable('timezone_names', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 64 }).notNull(),
})

/** Tourist attractions per city — from Wikidata (coordinate radius search).
 *  Lightweight reference shown on city pages; NOT the curated `pois` system. */
export const cityAttractions = mysqlTable(
  'city_attractions',
  {
    id: int('id').autoincrement().primaryKey(),
    cityId: int('city_id')
      .notNull()
      .references(() => cities.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    type: varchar('type', { length: 64 }),
    latitude: decimal('latitude', { precision: 10, scale: 7 }),
    longitude: decimal('longitude', { precision: 10, scale: 7 }),
    wikidataId: varchar('wikidata_id', { length: 32 }),
  },
  (t) => [
    uniqueIndex('attr_unq').on(t.cityId, t.name),
    index('attr_city_idx').on(t.cityId),
  ],
)
