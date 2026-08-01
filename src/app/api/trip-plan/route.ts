import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Simple in-memory daily rate limit (resets on restart / after 24h)
let requestCount = 0
let windowStart = Date.now()
const DAILY_LIMIT = 100

const VALID_STYLES = ['adventure', 'relax', 'culture', 'food', 'nightlife', 'mixed']
const VALID_BUDGETS = ['low', 'medium', 'high']

export async function POST(request: NextRequest) {
  try {
    if (Date.now() - windowStart > 24 * 60 * 60 * 1000) {
      requestCount = 0
      windowStart = Date.now()
    }
    if (requestCount >= DAILY_LIMIT) {
      return NextResponse.json(
        { success: false, error: 'Daily trip-planning limit reached. Try again tomorrow.' },
        { status: 429 },
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Trip planner is not configured yet.' },
        { status: 503 },
      )
    }

    const body = await request.json()
    const region = String(body.region || '').slice(0, 60)
    const duration = Math.min(Math.max(parseInt(body.duration) || 5, 1), 30)
    const budget = VALID_BUDGETS.includes(body.budget) ? body.budget : 'medium'
    const style = VALID_STYLES.includes(body.style) ? body.style : 'mixed'
    const month = String(body.month || '').slice(0, 20)

    if (!region) {
      return NextResponse.json(
        { success: false, error: 'Please choose a region or country.' },
        { status: 400 },
      )
    }

    requestCount++

    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content:
            `Plan a ${duration}-day trip to ${region} in ${month || 'any month'} ` +
            `with a ${budget} budget, focused on ${style} travel. ` +
            `Respond ONLY with valid JSON, no markdown fences, in this shape: ` +
            `{"title": string, "summary": string, "days": [{"day": number, "city": string, ` +
            `"activities": [string, string, string], "tip": string}]}`,
        },
      ],
    })

    const text = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { text: string }).text)
      .join('')

    let itinerary
    try {
      itinerary = JSON.parse(text.replace(/^```(json)?/m, '').replace(/```$/m, '').trim())
    } catch {
      return NextResponse.json(
        { success: false, error: 'Could not generate a plan. Please try again.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true, itinerary })
  } catch (error) {
    console.error('[Trip Plan API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate trip plan.' },
      { status: 500 },
    )
  }
}
