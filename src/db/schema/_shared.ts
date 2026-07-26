import { int, mysqlEnum, timestamp } from 'drizzle-orm/mysql-core'

// ---- Enum vocabularies (kept as const tuples so they're reusable in app code) ----

/** Publishing/indexing state. Drives canonical + noindex + sitemap inclusion. */
export const indexStatusValues = ['draft', 'noindex', 'indexed'] as const

/** Place levels in the spine. */
export const placeLevelValues = ['continent', 'country', 'region', 'city'] as const

/** Independent taxonomy dimensions — each value generates a hub page. */
export const tagDimensionValues = ['type', 'theme', 'activity', 'season', 'intent'] as const

/** Evergreen intent clusters (repeat per place). */
export const intentTypeValues = [
  'things-to-do',
  'where-to-stay',
  'best-time-to-visit',
  'getting-around',
  'itineraries',
  'food',
  'budget',
  'visa',
  'safety',
  'weather',
] as const

/** Polymorphic entity references (media, guide relations, sponsorships). */
export const entityTypeValues = ['continent', 'country', 'region', 'city', 'poi'] as const

export const priceRangeValues = ['free', 'budget', 'moderate', 'expensive', 'luxury'] as const

export const userRoleValues = ['admin', 'editor'] as const

// utf8mb4 safe index length for varchar keys.
export const SLUG_LEN = 191
export const NAME_LEN = 191
export const LOCALE_LEN = 5

// ---- Reusable column groups ----

/** SEO/indexing columns: every indexable page type carries these. */
export const seoColumns = () => ({
  indexStatus: mysqlEnum('index_status', indexStatusValues).default('draft').notNull(),
  completenessScore: int('completeness_score').default(0).notNull(),
})

export const timestamps = () => ({
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})
