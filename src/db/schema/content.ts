import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core'
import { cities } from './places'
import { pois } from './pois'
import { users } from './users'
import {
  LOCALE_LEN,
  NAME_LEN,
  SLUG_LEN,
  entityTypeValues,
  intentTypeValues,
  placeLevelValues,
  seoColumns,
  timestamps,
} from './_shared'

// =====================================================================
// INTENT PAGES — the evergreen cluster engine (things-to-do, etc.)
// Attaches to any place level via (place_level, place_id).
// =====================================================================

export const intentPages = mysqlTable(
  'intent_pages',
  {
    id: int('id').autoincrement().primaryKey(),
    placeLevel: mysqlEnum('place_level', placeLevelValues).notNull(),
    placeId: int('place_id').notNull(),
    intentType: mysqlEnum('intent_type', intentTypeValues).notNull(),
    ...seoColumns(),
    ...timestamps(),
  },
  (t) => [
    uniqueIndex('intent_unq').on(t.placeLevel, t.placeId, t.intentType),
    index('intent_place_idx').on(t.placeLevel, t.placeId),
  ],
)

export const intentPageTranslations = mysqlTable(
  'intent_page_translations',
  {
    id: int('id').autoincrement().primaryKey(),
    intentPageId: int('intent_page_id')
      .notNull()
      .references(() => intentPages.id, { onDelete: 'cascade' }),
    locale: varchar('locale', { length: LOCALE_LEN }).notNull(),
    title: varchar('title', { length: NAME_LEN }).notNull(),
    slug: varchar('slug', { length: SLUG_LEN }).notNull(),
    body: text('body'),
  },
  (t) => [
    uniqueIndex('intent_tr_unq').on(t.intentPageId, t.locale),
    uniqueIndex('intent_tr_slug_unq').on(t.locale, t.slug),
  ],
)

/** Ordered POIs surfaced on an intent page (e.g. "top things to do"). */
export const intentPagePois = mysqlTable(
  'intent_page_pois',
  {
    intentPageId: int('intent_page_id')
      .notNull()
      .references(() => intentPages.id, { onDelete: 'cascade' }),
    poiId: int('poi_id')
      .notNull()
      .references(() => pois.id, { onDelete: 'cascade' }),
    position: int('position').default(0).notNull(),
  },
  (t) => [primaryKey({ columns: [t.intentPageId, t.poiId] })],
)

// =====================================================================
// GUIDES — hand-written editorial (E-E-A-T layer).
// =====================================================================

export const guides = mysqlTable('guides', {
  id: int('id').autoincrement().primaryKey(),
  authorId: int('author_id').references(() => users.id, { onDelete: 'set null' }),
  ...seoColumns(),
  ...timestamps(),
})

export const guideTranslations = mysqlTable(
  'guide_translations',
  {
    id: int('id').autoincrement().primaryKey(),
    guideId: int('guide_id')
      .notNull()
      .references(() => guides.id, { onDelete: 'cascade' }),
    locale: varchar('locale', { length: LOCALE_LEN }).notNull(),
    title: varchar('title', { length: NAME_LEN }).notNull(),
    slug: varchar('slug', { length: SLUG_LEN }).notNull(),
    excerpt: text('excerpt'),
    body: text('body'),
  },
  (t) => [
    uniqueIndex('guide_tr_unq').on(t.guideId, t.locale),
    uniqueIndex('guide_tr_slug_unq').on(t.locale, t.slug),
  ],
)

/** Polymorphic links from a guide to any place/POI it covers. */
export const guideRelations = mysqlTable(
  'guide_relations',
  {
    id: int('id').autoincrement().primaryKey(),
    guideId: int('guide_id')
      .notNull()
      .references(() => guides.id, { onDelete: 'cascade' }),
    entityType: mysqlEnum('entity_type', entityTypeValues).notNull(),
    entityId: int('entity_id').notNull(),
  },
  (t) => [index('guide_rel_entity_idx').on(t.entityType, t.entityId)],
)

// =====================================================================
// ITINERARIES — N-day plans as ordered sequences of POIs.
// =====================================================================

export const itineraries = mysqlTable(
  'itineraries',
  {
    id: int('id').autoincrement().primaryKey(),
    cityId: int('city_id')
      .notNull()
      .references(() => cities.id, { onDelete: 'cascade' }),
    durationDays: int('duration_days').notNull(),
    ...seoColumns(),
    ...timestamps(),
  },
  (t) => [index('itineraries_city_idx').on(t.cityId)],
)

export const itineraryTranslations = mysqlTable(
  'itinerary_translations',
  {
    id: int('id').autoincrement().primaryKey(),
    itineraryId: int('itinerary_id')
      .notNull()
      .references(() => itineraries.id, { onDelete: 'cascade' }),
    locale: varchar('locale', { length: LOCALE_LEN }).notNull(),
    title: varchar('title', { length: NAME_LEN }).notNull(),
    slug: varchar('slug', { length: SLUG_LEN }).notNull(),
    body: text('body'),
  },
  (t) => [
    uniqueIndex('itinerary_tr_unq').on(t.itineraryId, t.locale),
    uniqueIndex('itinerary_tr_slug_unq').on(t.locale, t.slug),
  ],
)

export const itineraryDays = mysqlTable(
  'itinerary_days',
  {
    id: int('id').autoincrement().primaryKey(),
    itineraryId: int('itinerary_id')
      .notNull()
      .references(() => itineraries.id, { onDelete: 'cascade' }),
    dayNumber: int('day_number').notNull(),
  },
  (t) => [uniqueIndex('itinerary_day_unq').on(t.itineraryId, t.dayNumber)],
)

export const itineraryDayPois = mysqlTable(
  'itinerary_day_pois',
  {
    itineraryDayId: int('itinerary_day_id')
      .notNull()
      .references(() => itineraryDays.id, { onDelete: 'cascade' }),
    poiId: int('poi_id')
      .notNull()
      .references(() => pois.id, { onDelete: 'cascade' }),
    position: int('position').default(0).notNull(),
  },
  (t) => [primaryKey({ columns: [t.itineraryDayId, t.poiId] })],
)

// =====================================================================
// BLOG POSTS — Editorial content for SEO and engagement
// =====================================================================

export const blogPosts = mysqlTable(
  'blog_posts',
  {
    id: int('id').autoincrement().primaryKey(),
    slug: varchar('slug', { length: SLUG_LEN }).unique().notNull(),
    title: varchar('title', { length: NAME_LEN }).notNull(),
    excerpt: text('excerpt'),
    body: text('body').notNull(),
    status: mysqlEnum('status', ['draft', 'published', 'archived']).default('draft'),
    category: varchar('category', { length: 50 }), // 'travel-tips', 'guide', 'visa', 'budget'
    featuredImageUrl: varchar('featured_image_url', { length: 500 }),
    authorName: varchar('author_name', { length: 100 }),
    ...seoColumns(),
    readTimeMinutes: int('read_time_minutes'),
    viewCount: int('view_count').default(0),
    publishedAt: varchar('published_at', { length: 20 }),
    ...timestamps(),
  },
  (t) => [
    index('blog_status_idx').on(t.status),
    index('blog_category_idx').on(t.category),
    index('blog_published_idx').on(t.publishedAt),
  ],
)

export const blogComments = mysqlTable(
  'blog_comments',
  {
    id: int('id').autoincrement().primaryKey(),
    postId: int('post_id')
      .notNull()
      .references(() => blogPosts.id, { onDelete: 'cascade' }),
    authorName: varchar('author_name', { length: 100 }).notNull(),
    authorEmail: varchar('author_email', { length: 100 }).notNull(),
    body: text('body').notNull(),
    isApproved: mysqlEnum('is_approved', ['0', '1']).default('0'),
    ...timestamps(),
  },
  (t) => [
    index('blog_comments_post_idx').on(t.postId),
    index('blog_comments_approved_idx').on(t.isApproved),
  ],
)

// =====================================================================
// RESTAURANTS — Dining guides and reviews
// =====================================================================

export const restaurants = mysqlTable(
  'restaurants',
  {
    id: int('id').autoincrement().primaryKey(),
    slug: varchar('slug', { length: SLUG_LEN }).notNull(),
    cityId: int('city_id')
      .notNull()
      .references(() => cities.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: NAME_LEN }).notNull(),
    description: text('description'),
    cuisine: varchar('cuisine', { length: 100 }), // 'Italian', 'Japanese', etc
    priceRange: varchar('price_range', { length: 10 }), // '$', '$$', '$$$'
    ratingAvg: int('rating_avg'), // 0-5 (stored as 0-50)
    reviewCount: int('review_count').default(0),
    address: varchar('address', { length: 255 }),
    website: varchar('website', { length: 500 }),
    imageUrl: varchar('image_url', { length: 500 }),
    latitude: varchar('latitude', { length: 20 }), // Decimal string
    longitude: varchar('longitude', { length: 20 }),
    reservationUrl: varchar('reservation_url', { length: 500 }), // TripAdvisor, etc
    isVerified: mysqlEnum('is_verified', ['0', '1']).default('0'),
    ...seoColumns(),
    ...timestamps(),
  },
  (t) => [
    index('restaurants_city_idx').on(t.cityId),
    index('restaurants_cuisine_idx').on(t.cuisine),
    index('restaurants_rating_idx').on(t.ratingAvg),
  ],
)

export const restaurantReviews = mysqlTable(
  'restaurant_reviews',
  {
    id: int('id').autoincrement().primaryKey(),
    restaurantId: int('restaurant_id')
      .notNull()
      .references(() => restaurants.id, { onDelete: 'cascade' }),
    authorName: varchar('author_name', { length: 100 }).notNull(),
    authorEmail: varchar('author_email', { length: 100 }),
    rating: int('rating').notNull(), // 1-5
    title: varchar('title', { length: NAME_LEN }),
    body: text('body'),
    isApproved: mysqlEnum('is_approved', ['0', '1']).default('0'),
    ...timestamps(),
  },
  (t) => [
    index('restaurant_reviews_restaurant_idx').on(t.restaurantId),
    index('restaurant_reviews_approved_idx').on(t.isApproved),
  ],
)
