import {
  bigint,
  date,
  decimal,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  smallint,
  text,
  tinyint,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core'
import { LOCALE_LEN, NAME_LEN, SLUG_LEN, seoColumns, timestamps } from './_shared'

export const visaRequirementValues = [
  'visa_free',
  'visa_on_arrival',
  'evisa',
  'visa_required',
  'not_allowed',
] as const

// =====================================================================
// PLACE SPINE: continents > countries > regions > cities
// Non-localized facts live on the base table; all human-readable text
// lives in a per-locale `*_translations` table (locale column).
// =====================================================================

export const continents = mysqlTable(
  'continents',
  {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 8 }).notNull(),
    ...timestamps(),
  },
  (t) => [uniqueIndex('continents_code_unq').on(t.code)],
)

export const continentTranslations = mysqlTable(
  'continent_translations',
  {
    id: int('id').autoincrement().primaryKey(),
    continentId: int('continent_id')
      .notNull()
      .references(() => continents.id, { onDelete: 'cascade' }),
    locale: varchar('locale', { length: LOCALE_LEN }).notNull(),
    name: varchar('name', { length: NAME_LEN }).notNull(),
    slug: varchar('slug', { length: SLUG_LEN }).notNull(),
    description: text('description'),
  },
  (t) => [
    uniqueIndex('continent_tr_unq').on(t.continentId, t.locale),
    uniqueIndex('continent_tr_slug_unq').on(t.locale, t.slug),
  ],
)

export const countries = mysqlTable(
  'countries',
  {
    id: int('id').autoincrement().primaryKey(),
    continentId: int('continent_id')
      .notNull()
      .references(() => continents.id),
    iso2: varchar('iso2', { length: 2 }).notNull(),
    iso3: varchar('iso3', { length: 3 }),
    currencyCode: varchar('currency_code', { length: 3 }),
    currencySymbol: varchar('currency_symbol', { length: 8 }),
    phoneCode: varchar('phone_code', { length: 8 }),
    // Logical FKs (kept plain to avoid circular table refs with cities/media).
    capitalCityId: int('capital_city_id'),
    heroMediaId: int('hero_media_id'),
    latitude: decimal('latitude', { precision: 10, scale: 7 }),
    longitude: decimal('longitude', { precision: 10, scale: 7 }),
    population: bigint('population', { mode: 'number' }),
    gdp: bigint('gdp', { mode: 'number' }),
    areaSqKm: int('area_sq_km'),
    capital: varchar('capital', { length: 191 }),
    languages: varchar('languages', { length: 255 }),
    demonym: varchar('demonym', { length: 128 }),
    nativeName: varchar('native_name', { length: 191 }),
    drivingSide: varchar('driving_side', { length: 8 }),
    nationalDish: varchar('national_dish', { length: 255 }),
    emergencyPolice: varchar('emergency_police', { length: 32 }),
    emergencyAmbulance: varchar('emergency_ambulance', { length: 32 }),
    emergencyFire: varchar('emergency_fire', { length: 32 }),
    touristArrivals: bigint('tourist_arrivals', { mode: 'number' }),
    touristArrivalsYear: int('tourist_arrivals_year'),
    travelGuide: text('travel_guide'),
    homicideRate: decimal('homicide_rate', { precision: 6, scale: 2 }),
    homicideYear: int('homicide_year'),
    bigMacUsd: decimal('big_mac_usd', { precision: 6, scale: 2 }),
    bigMacYear: int('big_mac_year'),
    religion: varchar('religion', { length: 64 }),
    avgTempC: decimal('avg_temp_c', { precision: 4, scale: 1 }),
    landlocked: tinyint('landlocked'),
    coastlineKm: int('coastline_km'),
    climateMonthly: text('climate_monthly'),
    ...seoColumns(),
    ...timestamps(),
  },
  (t) => [
    uniqueIndex('countries_iso2_unq').on(t.iso2),
    index('countries_continent_idx').on(t.continentId),
  ],
)

export const countryTranslations = mysqlTable(
  'country_translations',
  {
    id: int('id').autoincrement().primaryKey(),
    countryId: int('country_id')
      .notNull()
      .references(() => countries.id, { onDelete: 'cascade' }),
    locale: varchar('locale', { length: LOCALE_LEN }).notNull(),
    name: varchar('name', { length: NAME_LEN }).notNull(),
    slug: varchar('slug', { length: SLUG_LEN }).notNull(),
    description: text('description'),
    visaSummary: text('visa_summary'),
    bestTimeSummary: text('best_time_summary'),
  },
  (t) => [
    uniqueIndex('country_tr_unq').on(t.countryId, t.locale),
    uniqueIndex('country_tr_slug_unq').on(t.locale, t.slug),
  ],
)

export const regions = mysqlTable(
  'regions',
  {
    id: int('id').autoincrement().primaryKey(),
    countryId: int('country_id')
      .notNull()
      .references(() => countries.id, { onDelete: 'cascade' }),
    ...seoColumns(),
    ...timestamps(),
  },
  (t) => [index('regions_country_idx').on(t.countryId)],
)

export const regionTranslations = mysqlTable(
  'region_translations',
  {
    id: int('id').autoincrement().primaryKey(),
    regionId: int('region_id')
      .notNull()
      .references(() => regions.id, { onDelete: 'cascade' }),
    locale: varchar('locale', { length: LOCALE_LEN }).notNull(),
    name: varchar('name', { length: NAME_LEN }).notNull(),
    slug: varchar('slug', { length: SLUG_LEN }).notNull(),
    description: text('description'),
  },
  (t) => [
    uniqueIndex('region_tr_unq').on(t.regionId, t.locale),
    uniqueIndex('region_tr_slug_unq').on(t.locale, t.slug),
  ],
)

export const cities = mysqlTable(
  'cities',
  {
    id: int('id').autoincrement().primaryKey(),
    countryId: int('country_id')
      .notNull()
      .references(() => countries.id, { onDelete: 'cascade' }),
    regionId: int('region_id').references(() => regions.id, { onDelete: 'set null' }),
    latitude: decimal('latitude', { precision: 10, scale: 7 }),
    longitude: decimal('longitude', { precision: 10, scale: 7 }),
    iataCode: varchar('iata_code', { length: 3 }),
    timezone: varchar('timezone', { length: 64 }),
    population: int('population'),
    heroMediaId: int('hero_media_id'),
    ...seoColumns(),
    ...timestamps(),
  },
  (t) => [
    index('cities_country_idx').on(t.countryId),
    index('cities_region_idx').on(t.regionId),
  ],
)

export const cityTranslations = mysqlTable(
  'city_translations',
  {
    id: int('id').autoincrement().primaryKey(),
    cityId: int('city_id')
      .notNull()
      .references(() => cities.id, { onDelete: 'cascade' }),
    locale: varchar('locale', { length: LOCALE_LEN }).notNull(),
    name: varchar('name', { length: NAME_LEN }).notNull(),
    slug: varchar('slug', { length: SLUG_LEN }).notNull(),
    description: text('description'),
  },
  (t) => [
    uniqueIndex('city_tr_unq').on(t.cityId, t.locale),
    uniqueIndex('city_tr_slug_unq').on(t.locale, t.slug),
  ],
)

// ---------------------------------------------------------------------------
// VISA REQUIREMENTS
// One row per (passport_iso2, destination_country_id) pair.
// ---------------------------------------------------------------------------
export const visaRequirements = mysqlTable(
  'visa_requirements',
  {
    id: int('id').autoincrement().primaryKey(),
    passportIso2: varchar('passport_iso2', { length: 2 }).notNull(),
    destinationCountryId: int('destination_country_id')
      .notNull()
      .references(() => countries.id, { onDelete: 'cascade' }),
    requirement: mysqlEnum('requirement', visaRequirementValues).notNull(),
    maxStayDays: smallint('max_stay_days'),
    notes: text('notes'),
    lastVerifiedAt: date('last_verified_at'),
    officialSourceUrl: varchar('official_source_url', { length: 512 }),
    ...timestamps(),
  },
  (t) => [
    uniqueIndex('visa_req_unq').on(t.passportIso2, t.destinationCountryId),
    index('visa_req_passport_idx').on(t.passportIso2),
    index('visa_req_destination_idx').on(t.destinationCountryId),
  ],
)
