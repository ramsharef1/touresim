/**
 * Pre-generate city intent subpages for all cities × 6 intents × 5 languages.
 * Strategy: generate the English body once (Claude), then translate that body +
 * title into ar/fr/es/tr in a single call. Idempotent + resumable (skips any
 * (city, intent, locale) already present).
 *
 * Usage: npx tsx scripts/generate-city-intents.ts [limitCityIdCSV]
 */
import * as dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

const LOCALES = ['en', 'ar', 'fr', 'es', 'tr'] as const
const CONCURRENCY = 7

const INTENTS: { key: string; topic: string; enTitle: (c: string) => string; slug: (c: string) => string }[] = [
  { key: 'things-to-do', topic: 'top attractions, experiences, and activities', enTitle: (c) => `Things to do in ${c}`, slug: (c) => `things-to-do-in-${c}` },
  { key: 'where-to-stay', topic: 'best neighborhoods to stay in, accommodation options by budget', enTitle: (c) => `Where to stay in ${c}`, slug: (c) => `where-to-stay-in-${c}` },
  { key: 'food', topic: 'local cuisine, must-try dishes, best markets and restaurants', enTitle: (c) => `Food & drink in ${c}`, slug: (c) => `food-in-${c}` },
  { key: 'weather', topic: 'climate, best time to visit, seasonal breakdown', enTitle: (c) => `${c} weather & best time to visit`, slug: (c) => `${c}-weather` },
  { key: 'budget', topic: 'daily budget ranges, costs for accommodation, food, transport and activities', enTitle: (c) => `${c} travel budget guide`, slug: (c) => `${c}-travel-budget` },
  { key: 'safety', topic: 'safety for tourists, common scams, areas to avoid, emergency info', enTitle: (c) => `Is ${c} safe? Travel safety guide`, slug: (c) => `is-${c}-safe` },
]

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function enPrompt(city: string, country: string, topic: string): string {
  return `You are a knowledgeable travel writer for a site called Touresim. Write a travel guide section about ${topic} for ${city}, ${country}.
- 2–3 paragraphs of genuinely useful, specific info (real place names, approximate prices, practical tips)
- Friendly, informative, not promotional
- Format as HTML using ONLY <p> and <h3> tags. Each paragraph in <p>. Optional <h3> subheadings.
- 150–300 words. No title, no markdown, no code fences.
Start directly with a <p> or <h3> tag.`
}

async function main() {
  const onlyArg = process.argv[2]?.split(',').map(Number).filter(Boolean)
  const pool = mysql.createPool({ uri: process.env.DATABASE_URL, charset: 'utf8mb4', connectionLimit: 12 })
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Cities (English name + country)
  const [cities] = await pool.query<any[]>(
    `SELECT ct.city_id, ct.name AS city, cot.name AS country
     FROM city_translations ct
     JOIN cities ci ON ci.id = ct.city_id
     JOIN country_translations cot ON cot.country_id = ci.country_id AND cot.locale='en'
     WHERE ct.locale='en' AND ci.index_status='indexed'` + (onlyArg?.length ? ` AND ct.city_id IN (${onlyArg.join(',')})` : ''),
  )

  // Existing coverage: set of "placeId:intent:locale"
  const [existing] = await pool.query<any[]>(
    `SELECT ip.place_id, ip.intent_type, ipt.locale
     FROM intent_pages ip JOIN intent_page_translations ipt ON ipt.intent_page_id=ip.id
     WHERE ip.place_level='city'`,
  )
  const have = new Set(existing.map((r) => `${r.place_id}:${r.intent_type}:${r.locale}`))

  // Build work list: one task per (city, intent) that is missing ≥1 locale
  const tasks: { cityId: number; city: string; country: string; intent: typeof INTENTS[number] }[] = []
  for (const c of cities) {
    for (const intent of INTENTS) {
      const missing = LOCALES.some((l) => !have.has(`${c.city_id}:${intent.key}:${l}`))
      if (missing) tasks.push({ cityId: c.city_id, city: c.city, country: c.country, intent })
    }
  }
  console.log(`Cities: ${cities.length} | tasks (city×intent needing work): ${tasks.length}`)

  let done = 0, failed = 0
  const work = [...tasks]

  async function upsertPage(cityId: number, intentKey: string): Promise<number> {
    const [res]: any = await pool.query(
      `INSERT INTO intent_pages (place_level, place_id, intent_type, index_status, completeness_score)
       VALUES ('city', ?, ?, 'indexed', 70)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), index_status='indexed'`,
      [cityId, intentKey],
    )
    return res.insertId
  }
  async function saveTr(pageId: number, locale: string, title: string, slug: string, body: string) {
    await pool.query(
      `INSERT INTO intent_page_translations (intent_page_id, locale, title, slug, body)
       VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE title=VALUES(title), body=VALUES(body)`,
      [pageId, locale, title.slice(0, 191), slug.slice(0, 191), body],
    )
  }

  async function worker() {
    while (work.length) {
      const t = work.shift()!
      const { cityId, city, country, intent } = t
      try {
        const slug = intent.slug(slugify(city))
        const pageId = await upsertPage(cityId, intent.key)

        // English body — generate if missing
        let enBody: string | null = null
        if (!have.has(`${cityId}:${intent.key}:en`)) {
          const msg = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            messages: [{ role: 'user', content: enPrompt(city, country, intent.topic) }],
          })
          const b = msg.content.find((x) => x.type === 'text')?.text?.trim() ?? ''
          enBody = b.replace(/^```html?/i, '').replace(/```$/, '').trim()
          if (enBody) await saveTr(pageId, 'en', intent.enTitle(city), slug, enBody)
        } else {
          const [[row]]: any = await pool.query(
            `SELECT body FROM intent_page_translations WHERE intent_page_id=? AND locale='en' LIMIT 1`,
            [pageId],
          )
          enBody = row?.body ?? null
        }
        if (!enBody) { failed++; continue }

        // Translate to the missing non-English locales in one call
        const need = (['ar', 'fr', 'es', 'tr'] as const).filter((l) => !have.has(`${cityId}:${intent.key}:${l}`))
        if (need.length) {
          const prompt = `Translate this English travel-guide title and HTML body into ${need.join(', ')}. Keep the same <p>/<h3> HTML tags. Natural, fluent travel-writing tone. Return ONLY JSON: {${need.map((l) => `"${l}":{"title":"","body":""}`).join(',')}}
TITLE: ${intent.enTitle(city)}
BODY: ${enBody}`
          const msg = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 5000,
            messages: [{ role: 'user', content: prompt }],
          })
          const text = msg.content.find((x) => x.type === 'text')?.text ?? '{}'
          let json: Record<string, { title?: string; body?: string }> = {}
          try {
            json = JSON.parse(text.replace(/^```json?/i, '').replace(/```$/, '').trim())
          } catch {
            // Truncated/invalid JSON — fall back to one call per language.
            for (const l of need) {
              try {
                const m2 = await client.messages.create({
                  model: 'claude-haiku-4-5-20251001',
                  max_tokens: 1500,
                  messages: [{ role: 'user', content: `Translate this travel-guide title and HTML body into ${l}. Keep <p>/<h3> tags. Return ONLY JSON {"title":"","body":""}\nTITLE: ${intent.enTitle(city)}\nBODY: ${enBody}` }],
                })
                const t2 = m2.content.find((x) => x.type === 'text')?.text ?? '{}'
                json[l] = JSON.parse(t2.replace(/^```json?/i, '').replace(/```$/, '').trim())
              } catch { /* skip this locale */ }
            }
          }
          for (const l of need) {
            const tr = json[l]
            if (tr?.body) await saveTr(pageId, l, tr.title || intent.enTitle(city), slug, tr.body)
          }
        }
        done++
        if (done % 50 === 0) console.log(`  ${done}/${tasks.length} (${failed} failed)`)
      } catch (e) {
        failed++
        if (failed % 20 === 0) console.error(`  FAIL ${city}/${intent.key}: ${e instanceof Error ? e.message : e}`)
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  console.log(`Done. ${done} city×intent processed, ${failed} failed.`)
  await pool.end()
}

main()
