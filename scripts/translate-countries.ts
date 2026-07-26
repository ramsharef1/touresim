/**
 * Backfill country_translations for ar/fr/es/tr.
 * Name  = mledoze localized common name
 * Slug  = English slug (convention: slugs stay Latin across locales)
 * Text  = description/visa_summary/best_time_summary translated from EN via Claude Haiku
 *
 * Usage: npx tsx scripts/translate-countries.ts [limitIso2CSV]
 */
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import mysql from 'mysql2/promise'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

const TARGETS = [
  { locale: 'ar', mledoze: 'ara', label: 'Arabic' },
  { locale: 'fr', mledoze: 'fra', label: 'French' },
  { locale: 'es', mledoze: 'spa', label: 'Spanish' },
  { locale: 'tr', mledoze: 'tur', label: 'Turkish' },
] as const

const CONCURRENCY = 6

async function main() {
  const onlyArg = process.argv[2]?.toUpperCase().split(',').filter(Boolean)
  const mledoze = JSON.parse(fs.readFileSync('/tmp/mledoze.json', 'utf8')) as {
    cca2: string
    translations: Record<string, { common: string }>
    name: { common: string }
  }[]
  const nameByIso: Record<string, Record<string, string>> = {}
  for (const c of mledoze) {
    nameByIso[c.cca2] = {}
    for (const tgt of TARGETS) {
      nameByIso[c.cca2][tgt.locale] = c.translations[tgt.mledoze]?.common ?? c.name.common
    }
  }

  const pool = mysql.createPool({ uri: process.env.DATABASE_URL, charset: 'utf8mb4' })
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const [rows] = await pool.query<any[]>(
    `SELECT ct.country_id, co.iso2, ct.name, ct.slug, ct.description, ct.visa_summary, ct.best_time_summary
     FROM country_translations ct JOIN countries co ON co.id = ct.country_id
     WHERE ct.locale = 'en'` + (onlyArg?.length ? ` AND co.iso2 IN (${onlyArg.map(() => '?').join(',')})` : ''),
    onlyArg ?? [],
  )

  console.log(`Translating ${rows.length} countries × ${TARGETS.length} locales...`)
  let done = 0
  let failed = 0

  const work = [...rows]
  async function worker() {
    while (work.length) {
      const c = work.shift()!
      try {
        const prompt = `Translate the following English tourism copy for the country "${c.name}" into Arabic, French, Spanish, and Turkish. Keep the same warm, informative travel-guide tone. Preserve meaning; do not add or remove facts. Return ONLY valid JSON (no markdown) with this exact shape:
{"ar":{"description":"","visa":"","best":""},"fr":{...},"es":{...},"tr":{...}}

description: ${c.description ?? ''}
visa: ${c.visa_summary ?? ''}
best_time: ${c.best_time_summary ?? ''}`

        const msg = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        })
        const text = msg.content.find((b) => b.type === 'text')?.text ?? '{}'
        const json = JSON.parse(text.replace(/^```json?/i, '').replace(/```$/, '').trim())

        for (const tgt of TARGETS) {
          const t = json[tgt.locale]
          if (!t) continue
          const name = nameByIso[c.iso2]?.[tgt.locale] ?? c.name
          const best = t.best ?? t.best_time ?? t.bestTime ?? t.best_time_summary ?? null
          const visa = t.visa ?? t.visa_summary ?? null
          const desc = t.description ?? t.desc ?? null
          await pool.query(
            `INSERT INTO country_translations (country_id, locale, name, slug, description, visa_summary, best_time_summary)
             VALUES (?,?,?,?,?,?,?)
             ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug), description=VALUES(description), visa_summary=VALUES(visa_summary), best_time_summary=VALUES(best_time_summary)`,
            [c.country_id, tgt.locale, name, c.slug, desc, visa, best],
          )
        }
        done++
        if (done % 10 === 0) console.log(`  ${done}/${rows.length} done`)
      } catch (e) {
        failed++
        console.error(`  FAIL ${c.iso2}: ${e instanceof Error ? e.message : e}`)
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  console.log(`Done. ${done} translated, ${failed} failed.`)
  await pool.end()
}

main()
