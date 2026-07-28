import {
  int,
  mysqlTable,
  varchar,
  text,
  decimal,
  timestamp,
  mysqlEnum,
  index,
  tinyint,
} from 'drizzle-orm/mysql-core'

// =====================================================================
// DEALS — Travel deals aggregation from Booking, GetYourGuide, Skyscanner
// =====================================================================

export const dealTypes = ['flight', 'hotel', 'tour', 'activity', 'experience'] as const

export const dealPartners = [
  'booking.com',
  'getyourguide',
  'skyscanner',
  'viator',
  'airbnb',
  'klook',
  'expedia',
] as const

export const deals = mysqlTable(
  'deals',
  {
    id: int('id').autoincrement().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    type: mysqlEnum('type', dealTypes).notNull(),
    partner: mysqlEnum('partner', dealPartners).notNull(),
    destinationSlug: varchar('destination_slug', { length: 191 }), // Link to cities/countries (optional)
    originSlug: varchar('origin_slug', { length: 191 }), // For flights (optional)
    originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
    dealPrice: decimal('deal_price', { precision: 10, scale: 2 }).notNull(),
    discount: tinyint('discount'), // Percentage off (0-99)
    affiliateUrl: varchar('affiliate_url', { length: 500 }).notNull(),
    imageUrl: varchar('image_url', { length: 500 }),
    externalId: varchar('external_id', { length: 100 }), // Partner's deal ID
    expiresAt: timestamp('expires_at').notNull(),
    clickCount: int('click_count').default(0),
    bookingCount: int('booking_count').default(0),
    source: varchar('source', { length: 100 }), // 'booking_api', 'getyourguide_api', etc
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    index('deals_type_expires_idx').on(t.type, t.expiresAt),
    index('deals_destination_idx').on(t.destinationSlug),
    index('deals_partner_idx').on(t.partner),
    index('deals_created_idx').on(t.createdAt),
  ],
)

// Track deal performance for affiliate analytics
export const dealClicks = mysqlTable(
  'deal_clicks',
  {
    id: int('id').autoincrement().primaryKey(),
    dealId: int('deal_id').references(() => deals.id),
    ipHash: varchar('ip_hash', { length: 64 }), // Hashed IP for privacy
    referrer: varchar('referrer', { length: 500 }),
    userAgent: varchar('user_agent', { length: 500 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('deal_clicks_deal_idx').on(t.dealId),
    index('deal_clicks_created_idx').on(t.createdAt),
  ],
)
