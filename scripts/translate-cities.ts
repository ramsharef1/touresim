/**
 * Backfill city_translations for ar/fr/es/tr.
 * Name  = localized city name (from Claude — proper script, e.g. Paris→باريس)
 * Slug  = English slug (convention: slugs stay Latin across locales)
 * Text  = description translated from EN via Claude Haiku
 *
 * Usage: npx tsx scripts/translate-cities.ts [limitIdCSV]
 */
import * as dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

const TARGETS = ['ar', 'fr', 'es', 'tr'] as const
const CONCURRENCY = 6

async function main() {
  const onlyArg = process.argv[2]?.split(',').map(Number).filter(Boolean)
  const pool = mysql.createPool({ uri: process.env.DATABASE_URL, charset: 'utf8mb4' })
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const [rows] = await pool.query<any[]>(
    `SELECT ct.city_id, co.iso2, ct.name, ct.slug, ct.description
     FROM city_translations ct
     JOIN cities ci ON ci.id = ct.city_id
     JOIN countries co ON co.id = ci.country_id
     WHERE ct.locale = 'en'` + (onlyArg?.length ? ` AND ct.city_id IN (${onlyArg.join(',')})` : ''),
  )

  console.log(`Translating ${rows.length} cities × ${TARGETS.length} locales...`)
  let done = 0
  let failed = 0
  const work = [...rows]

  async function worker() {
    while (work.length) {
      const c = work.shift()!
      try {
        const prompt = `For the city "${c.name}" (a tourist destination), provide the city's name and this English description translated into Arabic, French, Spanish, and Turkish. Use the city's commonly-used native/localized name (e.g. Paris→باريس in Arabic). Keep the warm travel-guide tone. Return ONLY valid JSON (no markdown):
{"ar":{"name":"","description":""},"fr":{"name":"","description":""},"es":{"name":"","description":""},"tr":{"name":"","description":""}}

description: ${c.description ?? ''}`

        const msg = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }],
        })
        const text = msg.content.find((b) => b.type === 'text')?.text ?? '{}'
        const json = JSON.parse(text.replace(/^```json?/i, '').replace(/```$/, '').trim())

        for (const loc of TARGETS) {
          const t = json[loc]
          if (!t) continue
          await pool.query(
            `INSERT INTO city_translations (city_id, locale, name, slug, description)
             VALUES (?,?,?,?,?)
             ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug), description=VALUES(description)`,
            [c.city_id, loc, (t.name || c.name).slice(0, 191), c.slug, t.description ?? null],
          )
        }
        done++
        if (done % 25 === 0) console.log(`  ${done}/${rows.length} done`)
      } catch (e) {
        failed++
        console.error(`  FAIL city ${c.city_id} (${c.name}): ${e instanceof Error ? e.message : e}`)
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  console.log(`Done. ${done} translated, ${failed} failed.`)
  await pool.end()
}

main()
