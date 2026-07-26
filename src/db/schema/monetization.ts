import {
  boolean,
  date,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core'
import { cities } from './places'
import { pois } from './pois'
import { placeLevelValues, timestamps } from './_shared'

// =====================================================================
// MONETIZATION — affiliate slots + sponsored placements.
// =====================================================================

/** Affiliate deep links attached to a POI and/or city (Booking, GetYourGuide…). */
export const affiliateLinks = mysqlTable(
  'affiliate_links',
  {
    id: int('id').autoincrement().primaryKey(),
    poiId: int('poi_id').references(() => pois.id, { onDelete: 'cascade' }),
    cityId: int('city_id').references(() => cities.id, { onDelete: 'cascade' }),
    provider: varchar('provider', { length: 64 }).notNull(),
    productId: varchar('product_id', { length: 128 }),
    deepLink: varchar('deep_link', { length: 1024 }).notNull(),
    label: varchar('label', { length: 191 }),
    position: int('position').default(0).notNull(),
    ...timestamps(),
  },
  (t) => [
    index('affiliate_poi_idx').on(t.poiId),
    index('affiliate_city_idx').on(t.cityId),
  ],
)

/** Paid B2B placements keyed to a place (featured hotel/tour slots). */
export const sponsoredPlacements = mysqlTable(
  'sponsored_placements',
  {
    id: int('id').autoincrement().primaryKey(),
    placeLevel: mysqlEnum('place_level', placeLevelValues).notNull(),
    placeId: int('place_id').notNull(),
    advertiser: varchar('advertiser', { length: 191 }).notNull(),
    slotType: varchar('slot_type', { length: 64 }).notNull(),
    creativeUrl: varchar('creative_url', { length: 512 }),
    targetUrl: varchar('target_url', { length: 1024 }),
    startDate: date('start_date'),
    endDate: date('end_date'),
    active: boolean('active').default(true).notNull(),
    ...timestamps(),
  },
  (t) => [index('sponsored_place_idx').on(t.placeLevel, t.placeId)],
)
