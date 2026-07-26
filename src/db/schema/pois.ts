import {
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core'
import { cities } from './places'
import {
  LOCALE_LEN,
  NAME_LEN,
  SLUG_LEN,
  priceRangeValues,
  seoColumns,
  timestamps,
} from './_shared'

// =====================================================================
// POI: the leaf entity (attraction, beach, museum, viewpoint, ...).
// One record, surfaced across many tag hubs via poi_tags.
// =====================================================================

export const pois = mysqlTable(
  'pois',
  {
    id: int('id').autoincrement().primaryKey(),
    cityId: int('city_id')
      .notNull()
      .references(() => cities.id, { onDelete: 'cascade' }),
    latitude: decimal('latitude', { precision: 10, scale: 7 }),
    longitude: decimal('longitude', { precision: 10, scale: 7 }),
    priceRange: mysqlEnum('price_range', priceRangeValues),
    // Structured hours: { mon: "09:00-17:00", ... } — a unique-data signal.
    openingHours: json('opening_hours'),
    heroMediaId: int('hero_media_id'),
    ...seoColumns(),
    ...timestamps(),
  },
  (t) => [index('pois_city_idx').on(t.cityId)],
)

export const poiTranslations = mysqlTable(
  'poi_translations',
  {
    id: int('id').autoincrement().primaryKey(),
    poiId: int('poi_id')
      .notNull()
      .references(() => pois.id, { onDelete: 'cascade' }),
    locale: varchar('locale', { length: LOCALE_LEN }).notNull(),
    name: varchar('name', { length: NAME_LEN }).notNull(),
    slug: varchar('slug', { length: SLUG_LEN }).notNull(),
    description: text('description'),
    tips: text('tips'),
  },
  (t) => [
    uniqueIndex('poi_tr_unq').on(t.poiId, t.locale),
    uniqueIndex('poi_tr_slug_unq').on(t.locale, t.slug),
  ],
)
