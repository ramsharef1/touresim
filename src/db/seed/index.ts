import { and, eq } from 'drizzle-orm'
import { db } from '../index'
import { tags, tagTranslations } from '../schema'
import { SEED_TAGS, slugify } from './taxonomy-data'

// Idempotent: safe to re-run. Inserts missing tags, upserts AR/EN labels.
async function seedTaxonomy() {
  let created = 0
  for (const tag of SEED_TAGS) {
    const existing = await db
      .select({ id: tags.id })
      .from(tags)
      .where(and(eq(tags.dimension, tag.dimension), eq(tags.value, tag.value)))
      .limit(1)

    let tagId: number
    if (existing.length > 0) {
      tagId = existing[0].id
    } else {
      const [row] = await db
        .insert(tags)
        .values({ dimension: tag.dimension, value: tag.value })
        .$returningId()
      tagId = row.id
      created++
    }

    for (const [locale, label] of [
      ['en', tag.en],
      ['ar', tag.ar],
    ] as const) {
      const slug = locale === 'en' ? tag.value : slugify(label)
      await db
        .insert(tagTranslations)
        .values({ tagId, locale, label, slug })
        .onDuplicateKeyUpdate({ set: { label, slug } })
    }
  }
  return { total: SEED_TAGS.length, created }
}

async function main() {
  console.log('Seeding taxonomy…')
  const { total, created } = await seedTaxonomy()
  console.log(`✓ Taxonomy seeded: ${total} tags (${created} new), AR + EN labels.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
