import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core'
import { LOCALE_LEN, entityTypeValues, timestamps } from './_shared'

// =====================================================================
// MEDIA — original/licensed images. Unique photos are a core
// unique-data signal for the quality gate.
// =====================================================================

export const media = mysqlTable('media', {
  id: int('id').autoincrement().primaryKey(),
  url: varchar('url', { length: 512 }).notNull(),
  width: int('width'),
  height: int('height'),
  credit: varchar('credit', { length: 255 }),
  license: varchar('license', { length: 128 }),
  source: varchar('source', { length: 255 }),
  ...timestamps(),
})

export const mediaTranslations = mysqlTable(
  'media_translations',
  {
    id: int('id').autoincrement().primaryKey(),
    mediaId: int('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    locale: varchar('locale', { length: LOCALE_LEN }).notNull(),
    alt: varchar('alt', { length: 255 }),
  },
  (t) => [uniqueIndex('media_tr_unq').on(t.mediaId, t.locale)],
)

/** Polymorphic gallery: attach media to any entity, ordered. */
export const entityMedia = mysqlTable(
  'entity_media',
  {
    id: int('id').autoincrement().primaryKey(),
    mediaId: int('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    entityType: mysqlEnum('entity_type', entityTypeValues).notNull(),
    entityId: int('entity_id').notNull(),
    position: int('position').default(0).notNull(),
  },
  (t) => [index('entity_media_idx').on(t.entityType, t.entityId)],
)
