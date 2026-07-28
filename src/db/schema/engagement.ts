import { boolean, int, mysqlEnum, mysqlTable, timestamp, varchar, text, index } from 'drizzle-orm/mysql-core'
import { NAME_LEN, placeLevelValues, timestamps } from './_shared'

// =====================================================================
// ENGAGEMENT — user wishlists and destination reviews.
// =====================================================================

/**
 * Wishlists: users bookmark countries/cities for later.
 * user_id is nullable for anonymous bookmarks via localStorage.
 * Will be populated when user auth is added.
 */
export const wishlists = mysqlTable(
  'wishlists',
  {
    id: int('id').autoincrement().primaryKey(),
    userId: int('user_id'), // nullable: future FK to users.id when auth added
    destinationSlug: varchar('destination_slug', { length: NAME_LEN }).notNull(),
    destinationType: mysqlEnum('destination_type', ['country', 'city']).notNull(),
    ...timestamps(),
  },
  (t) => [
    index('wishlists_user_type_idx').on(t.userId, t.destinationType),
    index('wishlists_slug_type_idx').on(t.destinationSlug, t.destinationType),
  ],
)

/**
 * Destination reviews: anonymous user reviews (1-5 stars) with optional text.
 * Moderated: is_approved flag controls visibility.
 */
export const destinationReviews = mysqlTable(
  'destination_reviews',
  {
    id: int('id').autoincrement().primaryKey(),
    destinationSlug: varchar('destination_slug', { length: NAME_LEN }).notNull(),
    destinationType: mysqlEnum('destination_type', ['country', 'city']).notNull(),
    rating: int('rating').notNull(), // 1-5 stars
    title: varchar('title', { length: 255 }).notNull(), // max 80 chars in form
    body: text('body'), // max 500 chars in form, null if no review text
    authorName: varchar('author_name', { length: NAME_LEN }).notNull(),
    authorEmail: varchar('author_email', { length: 255 }).notNull(),
    isApproved: boolean('is_approved').default(false).notNull(),
    ...timestamps(),
  },
  (t) => [
    index('destination_reviews_slug_type_idx').on(t.destinationSlug, t.destinationType),
    index('destination_reviews_approved_idx').on(t.isApproved),
    index('destination_reviews_created_idx').on(t.createdAt),
  ],
)
