import {
  int,
  mysqlTable,
  varchar,
  text,
  timestamp,
  mysqlEnum,
  index,
} from 'drizzle-orm/mysql-core'

// =====================================================================
// ADMIN — Settings, API keys, configuration
// =====================================================================

export const apiKeys = mysqlTable(
  'api_keys',
  {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(), // 'booking', 'getyourguide', 'openexchangerates', etc
    key: text('key').notNull(), // Encrypted in production
    secretKey: text('secret_key'), // Optional secondary key
    status: mysqlEnum('status', ['active', 'inactive', 'expired']).default('active'),
    provider: varchar('provider', { length: 100 }), // 'Booking.com', 'GetYourGuide', etc
    notes: text('notes'),
    lastUsed: timestamp('last_used'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    index('api_keys_name_idx').on(t.name),
    index('api_keys_status_idx').on(t.status),
  ],
)

export const settings = mysqlTable(
  'settings',
  {
    id: int('id').autoincrement().primaryKey(),
    key: varchar('key', { length: 100 }).unique().notNull(), // 'cron_secret', 'site_name', etc
    value: text('value'),
    description: text('description'),
    type: mysqlEnum('type', ['string', 'number', 'boolean', 'json']).default('string'),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [index('settings_key_idx').on(t.key)],
)
