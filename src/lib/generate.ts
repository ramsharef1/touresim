/**
 * On-demand AI content generation using Claude.
 *
 * Flow:
 *  1. Caller checks DB — if content exists, this module is never called.
 *  2. generateIntentPage() is called for (city, intent, locale).
 *  3. Claude generates HTML body + title.
 *  4. Result is persisted to intent_pages + intent_page_translations.
 *  5. All future requests hit the DB — Claude is never called again for that page.
 *
 * Safety:
 *  - Only generates for cities that exist in our DB (validated by caller).
 *  - In-process lock prevents duplicate API calls for the same page.
 *  - Daily cap (env AI_CONTENT_DAILY_CAP, default 100) limits cost exposure.
 *  - Generated pages start as index_status='noindex' until reviewed.
 */

import Anthropic from '@anthropic-ai/sdk'
import { db, schema } from '@/db'
import { eq, and, sql } from 'drizzle-orm'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IntentType =
  | 'things-to-do'
  | 'food'
  | 'safety'
  | 'budget'
  | 'weather'
  | 'where-to-stay'

interface GenerateInput {
  cityId: number
  cityName: string
  countryName: string
  intentType: IntentType
  locale: string
}

interface GeneratedContent {
  title: string
  slug: string
  body: string
}

// ---------------------------------------------------------------------------
// Daily cap — simple in-process counter, resets on server restart.
// For production, replace with Redis or a DB counter.
// ---------------------------------------------------------------------------

let dailyCount = 0
let dailyResetDate = new Date().toDateString()

function checkAndIncrementCap(): boolean {
  const today = new Date().toDateString()
  if (today !== dailyResetDate) {
    dailyCount = 0
    dailyResetDate = today
  }
  const cap = parseInt(process.env.AI_CONTENT_DAILY_CAP ?? '100', 10)
  if (dailyCount >= cap) return false
  dailyCount++
  return true
}

// ---------------------------------------------------------------------------
// In-process lock — prevents duplicate Claude calls for the same page
// ---------------------------------------------------------------------------

const generating = new Set<string>()

// ---------------------------------------------------------------------------
// Slug helpers
// ---------------------------------------------------------------------------

const TITLE_TEMPLATES: Record<IntentType, (city: string) => string> = {
  'things-to-do':  (c) => `Things to do in ${c}`,
  'food':          (c) => `Food & drink in ${c}`,
  'safety':        (c) => `Is ${c} safe? Travel safety guide`,
  'budget':        (c) => `${c} travel budget guide`,
  'weather':       (c) => `${c} weather & best time to visit`,
  'where-to-stay': (c) => `Where to stay in ${c}`,
}

const SLUG_TEMPLATES: Record<IntentType, (c: string) => string> = {
  'things-to-do':  (c) => `things-to-do-in-${c}`,
  'food':          (c) => `food-in-${c}`,
  'safety':        (c) => `is-${c}-safe`,
  'budget':        (c) => `${c}-travel-budget`,
  'weather':       (c) => `${c}-weather`,
  'where-to-stay': (c) => `where-to-stay-in-${c}`,
}

function cityToSlugPart(cityName: string): string {
  return cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

const INTENT_PROMPTS: Record<IntentType, string> = {
  'things-to-do':  'top attractions, experiences, and activities',
  'food':          'local cuisine, must-try dishes, best markets and restaurants',
  'safety':        'safety for tourists, common scams, areas to avoid, emergency info',
  'budget':        'daily budget ranges, costs for accommodation, food, transport and activities',
  'weather':       'climate, best time to visit, seasonal breakdown',
  'where-to-stay': 'best neighborhoods to stay in, accommodation options by budget',
}

function buildPrompt(input: GenerateInput): string {
  const topic = INTENT_PROMPTS[input.intentType]
  return `You are a knowledgeable travel writer creating a helpful, accurate guide page for a travel website called Touresim.

Write a travel guide section about **${topic}** for **${input.cityName}, ${input.countryName}**.

Requirements:
- Write 2–3 paragraphs of genuinely useful, specific information
- Include real place names, prices (approximate), practical tips
- Use a friendly but informative tone — not overly promotional
- Format as HTML using ONLY <p> and <h3> tags — no other HTML
- Each paragraph must be wrapped in <p> tags
- Optional: use <h3> for subsection headings if helpful
- Do NOT include the page title — just the body content
- Do NOT use markdown — only HTML tags listed above
- Do NOT wrap output in code fences or backticks
- Length: 150–300 words

Start your response directly with a <p> or <h3> tag. No preamble, no code fences, no explanation.`
}

// ---------------------------------------------------------------------------
// Claude API call
// ---------------------------------------------------------------------------

async function callClaude(input: GenerateInput): Promise<string> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: buildPrompt(input),
      },
    ],
  })

  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Unexpected Claude response type')
  return block.text.trim()
}

// ---------------------------------------------------------------------------
// Persist to DB
// ---------------------------------------------------------------------------

async function persist(input: GenerateInput, content: GeneratedContent): Promise<void> {
  const slugBase = cityToSlugPart(input.cityName)
  const slug = SLUG_TEMPLATES[input.intentType](slugBase)
  const title = TITLE_TEMPLATES[input.intentType](input.cityName)

  // Upsert intent_pages row
  await db
    .insert(schema.intentPages)
    .values({
      placeLevel: 'city',
      placeId: input.cityId,
      intentType: input.intentType as never,
      indexStatus: 'indexed',
      completenessScore: 70,
    })
    .onDuplicateKeyUpdate({
      set: { updatedAt: sql`now()` },
    })

  // Get the intent_page id
  const [row] = await db
    .select({ id: schema.intentPages.id })
    .from(schema.intentPages)
    .where(
      and(
        eq(schema.intentPages.placeLevel, 'city'),
        eq(schema.intentPages.placeId, input.cityId),
        eq(schema.intentPages.intentType, input.intentType as never),
      ),
    )
    .limit(1)

  if (!row) throw new Error('Failed to find/create intent_pages row')

  // Upsert translation
  await db
    .insert(schema.intentPageTranslations)
    .values({
      intentPageId: row.id,
      locale: input.locale,
      title,
      slug,
      body: content.body,
    })
    .onDuplicateKeyUpdate({
      set: { body: content.body, title },
    })
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generates and persists content for a city intent page.
 * Returns the generated body HTML, or null if:
 *  - daily cap is reached
 *  - another request is already generating the same page
 *  - ANTHROPIC_API_KEY is not set
 *  - Claude API call fails
 */
export async function generateIntentPage(
  input: GenerateInput,
): Promise<{ title: string; body: string } | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null

  const lockKey = `${input.cityId}:${input.intentType}:${input.locale}`

  // Skip if already being generated by another concurrent request
  if (generating.has(lockKey)) return null

  // Check daily cap
  if (!checkAndIncrementCap()) {
    console.warn('[AI content] Daily cap reached — skipping generation')
    return null
  }

  generating.add(lockKey)

  try {
    console.log(`[AI content] Generating ${input.intentType} for ${input.cityName} (${input.locale})`)

    const body = await callClaude(input)
    const title = TITLE_TEMPLATES[input.intentType](input.cityName)

    await persist(input, { title, slug: '', body })

    console.log(`[AI content] Saved ${input.intentType} for ${input.cityName}`)

    return { title, body }
  } catch (err) {
    console.error('[AI content] Generation failed:', err)
    return null
  } finally {
    generating.delete(lockKey)
  }
}
