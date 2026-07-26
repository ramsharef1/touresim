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
import { pois } from './pois'
import {
  LOCALE_LEN,
  NAME_LEN,
  SLUG_LEN,
  seoColumns,
  tagDimensionValues,
  timestamps,
} from './_shared'

// =====================================================================
// FACETED TAXONOMY: one tags table, scoped by `dimension`.
// Each (dimension, value) is a hub page; poi_tags is the many-to-many.
// =====================================================================

export const tags = mysqlTable(
  'tags',
  {
    id: int('id').autoincrement().primaryKey(),
    dimension: mysqlEnum('dimension', tagDimensionValues).notNull(),
    value: varchar('value', { length: 64 }).notNull(),
    // Tag hubs are indexable pages too.
    ...seoColumns(),
    ...timestamps(),
  },
  (t) => [uniqueIndex('tags_dim_value_unq').on(t.dimension, t.value)],
)

export const tagTranslations = mysqlTable(
  'tag_translations',
  {
    id: int('id').autoincrement().primaryKey(),
    tagId: int('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    locale: varchar('locale', { length: LOCALE_LEN }).notNull(),
    label: varchar('label', { length: NAME_LEN }).notNull(),
    slug: varchar('slug', { length: SLUG_LEN }).notNull(),
    hubIntro: text('hub_intro'),
  },
  (t) => [
    uniqueIndex('tag_tr_unq').on(t.tagId, t.locale),
    uniqueIndex('tag_tr_slug_unq').on(t.locale, t.slug),
  ],
)

export const poiTags = mysqlTable(
  'poi_tags',
  {
    poiId: int('poi_id')
      .notNull()
      .references(() => pois.id, { onDelete: 'cascade' }),
    tagId: int('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.poiId, t.tagId] }),
    index('poi_tags_tag_idx').on(t.tagId),
  ],
)
